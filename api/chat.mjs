/* ============================================================
   ATENAS ERP - Chat con IA (Vercel Function)
   ------------------------------------------------------------
   Conecta el chatbot con Groq (API gratuita, function calling).
   Las herramientas consultan tus datos reales de Supabase.

   Variables de entorno en Vercel:
     GROQ_API_KEY  → consíguela gratis en https://console.groq.com (API Keys)
     GROQ_MODEL    → (opcional) modelo, default llama-3.3-70b-versatile
     SUPABASE_URL  → (opcional) si no se pone, usa la del frontend
     SUPABASE_KEY  → (opcional) key de Supabase (anon o service role)

   Para "alimentar" la IA con información repetitiva:
   1) Edita INSTRUCCIONES_SISTEMA abajo, o
   2) Crea la tabla chat_conocimiento en Supabase:
      CREATE TABLE chat_conocimiento (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        palabras_clave text NOT NULL,
        informacion text NOT NULL,
        created_at timestamptz DEFAULT now()
      );
      Y agrega filas con tus datos, ej:
        palabras_clave: "domicilio, envío, transportadora"
        informacion:    "Los envíos salen por Servientrega y cuestan $10.000 dentro de Bogotá."
      La IA usa esas filas como contexto cuando el mensaje coincide con las palabras clave.
   ============================================================ */

const GROQ_KEY   = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL   || 'llama-3.3-70b-versatile';
const SB_URL = process.env.SUPABASE_URL || 'https://mvgzofhgtlqyjtylhkhl.supabase.co';
const SB_KEY = process.env.SUPABASE_KEY || 'sb_publishable_OzxgAMu9ENo_3ASV0xjvag_Cms2VpYr';

/* ------------------------------------------------------------
   INSTRUCCIONES DEL NEGOCIO (system prompt) — edítalas libremente
   ------------------------------------------------------------ */
const INSTRUCCIONES_SISTEMA = `Eres el asistente virtual de "Atenas Style Shop", una tienda colombiana de belleza y ropa que usa un ERP llamado Atenas Accounts.

REGLAS DE RESPUESTA:
- Siempre respondes en español, breve y claro.
- Los montos van en pesos colombianos con $ y puntos: $1.234.500.
- NUNCA inventes datos. Antes de responder sobre inventario, stock, pedidos, ventas, compras, gastos o análisis, usa la herramienta correspondiente para consultar datos reales.
- Si una herramienta no encuentra algo, dilo honestamente.
- Cuando el usuario envíe una lista con cantidades (ej: "3 mascarillas puntos negros, 5 colágeno de labios"), usa revisar_pedido e informa claramente: qué hay disponible (con unidades), qué falta y CUÁNTAS unidades faltan de cada uno, y qué no se encontró en el inventario. Al final dile que puede tocar el botón "Simular factura" del chat para generar el PDF solo con los productos disponibles.

ANÁLISIS QUE SABES RESPONDER (con consultar_datos):
- "¿Qué productos me dejan mayor rentabilidad?" → tipo 'rentabilidad': responde con el ranking por margen (%) y por utilidad real vendida.
- "¿Qué meses del año he vendido más?" → tipo 'ventas_por_anio': ordena los meses por total vendido y destaca el mejor.
- "¿Cuáles son los productos que más he vendido?" → tipo 'top_productos_total' (histórico) o 'top_productos' (de un mes puntual).
- "Recomiéndame productos para vender más este mes" → tipo 'recomendaciones' y cruza: alta rotación (90 días) + buen margen + stock disponible; también avisa cuáles best-sellers están sin stock y conviene reponer.`;

const tools = [
  {
    type: 'function',
    function: {
      name: 'buscar_producto',
      description: 'Busca productos en el inventario por nombre o referencia y devuelve stock, precio y costo.',
      parameters: {
        type: 'object',
        properties: {
          nombre: { type: 'string', description: 'Nombre o referencia del producto (ej: "ampolla vitacilina", "ATS-003")' }
        },
        required: ['nombre']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'revisar_pedido',
      description: 'Revisa un pedido contra el stock actual: qué hay disponible, qué falta y cuánto vale el pedido.',
      parameters: {
        type: 'object',
        properties: {
          pedido: { type: 'string', description: 'Texto del pedido, ej: "2 vestido Leto, 1 jean Lis"' }
        },
        required: ['pedido']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'consultar_datos',
      description: 'Consulta datos del negocio para análisis: ventas del mes, ventas por año (mes a mes), últimos 6 meses, top productos del mes, top productos histórico, rentabilidad por producto, recomendaciones para vender más, productos sin stock, inventario, gastos, compras o utilidad.',
      parameters: {
        type: 'object',
        properties: {
          tipo: {
            type: 'string',
            enum: ['ventas_mes', 'ventas_6_meses', 'ventas_por_anio', 'top_productos', 'top_productos_total', 'rentabilidad', 'recomendaciones', 'productos_sin_stock', 'inventario', 'gastos_mes', 'compras_mes', 'utilidad']
          },
          mes: { type: 'number', description: 'Mes (1-12). Por defecto el mes actual.' },
          anio: { type: 'number', description: 'Año, ej: 2026. Por defecto el año actual.' }
        },
        required: ['tipo']
      }
    }
  }
];

/* ============================================================
   Utilidades
   ============================================================ */
function normalizar(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function _canon(t) {
  t = t.toLowerCase();
  if (t.endsWith('es') && t.length > 4) return t.slice(0, -2);
  if (t.endsWith('s') && t.length > 3) return t.slice(0, -1);
  return t;
}
const _STOP_BUSQ = new Set(['de','la','el','los','las','del','un','una','unos','unas','que','hay','en','para','con','y','me','te']);

function buscarCandidatos(nombre, productos) {
  const n = normalizar(nombre).replace(/[?.!]+$/, '');
  if (!n) return [];
  const ref = productos.filter(p => normalizar(p.referencia) === n);
  if (ref.length) return ref;
  const exact = productos.filter(p => normalizar(p.nombre) === n);
  if (exact.length) return exact;
  const cont = productos.filter(p => normalizar(p.nombre).includes(n) || n.includes(normalizar(p.nombre)));
  if (cont.length) return cont;
  const qt = n.split(/\s+/).map(_canon).filter(t => t.length > 2 && !_STOP_BUSQ.has(t));
  if (!qt.length) return [];
  const scored = productos
    .map(p => ({ p, inter: qt.filter(t => normalizar(p.nombre).split(/\s+/).map(_canon).includes(t)).length }))
    .filter(x => x.inter > 0)
    .sort((a, b) => b.inter - a.inter);
  if (!scored.length) return [];
  const top = scored.filter(x => x.inter === scored[0].inter);
  return top.map(x => x.p);
}

function parsearPedido(texto) {
  let t = texto.replace(/^(revisar|revisa|revisame|verifica|chequea|mira|valida)\s+(el\s+|mi\s+|este\s+)?(pedido|lista|listado)?\s*:?\s*/i, '');
  t = t.replace(/^pedido\s*:?\s*/i, '');
  const partes = t.split(/,|;|\n|\by\b/i);
  const items = [];
  for (const parte of partes) {
    const p = parte.trim().replace(/\s+/g, ' ').replace(/\.$/, '');
    if (!p) continue;
    const m = p.match(/^(\d+(?:[.,]\d+)?)[\s\-]+(.+)$/);
    const cantidad = m && m[1] ? Math.max(1, Math.round(parseFloat(m[1].replace(',', '.')))) : 1;
    const nombre = m ? m[2].trim() : p;
    if (nombre.length > 1 && !/^(revisar|revisa|pedido|hola|buenas|ayuda)$/i.test(nombre)) items.push({ cantidad, nombre });
  }
  return items;
}

/* ============================================================
   Acceso a Supabase (REST directo, sin dependencias)
   ============================================================ */
const _cache = {};

async function sbGet(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  });
  if (!r.ok) throw new Error('Supabase ' + r.status + ' en ' + path);
  return r.json();
}
async function getProductos() {
  if (!_cache.productos) _cache.productos = await sbGet('productos?select=*');
  return _cache.productos;
}
async function getVentas() {
  if (!_cache.ventas) _cache.ventas = await sbGet('ventas?select=*&order=created_at.desc&limit=2000');
  return _cache.ventas;
}
async function getVentaItems() {
  if (!_cache.venta_items) _cache.venta_items = await sbGet('venta_items?select=producto_nombre,cantidad,precio_unitario,venta_id&limit=8000');
  return _cache.venta_items;
}
async function getGastos() {
  if (!_cache.gastos) _cache.gastos = await sbGet('gastos?select=valor,mes,anio,tipo&limit=3000');
  return _cache.gastos;
}
async function getCompras() {
  if (!_cache.compras) _cache.compras = await sbGet('compras?select=total,mes,anio,es_abono&limit=3000');
  return _cache.compras;
}

const fmtCOP = n => '$' + Math.round(n || 0).toLocaleString('es-CO');

/* ============================================================
   Herramientas (las ejecuta el modelo)
   ============================================================ */
async function toolBuscarProducto({ nombre }) {
  const productos = await getProductos();
  const cands = buscarCandidatos(nombre, productos);
  if (!cands.length) return { encontrados: [], mensaje: 'No se encontró nada con ese nombre en el inventario.' };
  return {
    encontrados: cands.slice(0, 10).map(p => ({
      nombre: p.nombre, referencia: p.referencia,
      stock: p.stock, precio: p.precio, costo: p.costo
    }))
  };
}

async function toolRevisarPedido({ pedido }) {
  const productos = await getProductos();
  const items = parsearPedido(pedido);
  const faltan = [], disponibles = [], noEncontrados = [];
  let total = 0;
  for (const it of items) {
    const cands = buscarCandidatos(it.nombre, productos);
    const p = cands.length === 1 ? cands[0] : null;
    if (!p) { noEncontrados.push({ nombre: it.nombre, cantidad: it.cantidad }); continue; }
    const datos = { nombre: p.nombre, referencia: p.referencia, pedido: it.cantidad, stock: p.stock, precio: p.precio };
    if (p.stock < it.cantidad) faltan.push(datos);
    else disponibles.push(datos);
    total += p.precio * it.cantidad;
  }
  return { items, faltan, disponibles, noEncontrados, total, total_format: fmtCOP(total) };
}

async function toolConsultarDatos({ tipo, mes, anio }) {
  const now = new Date();
  mes = mes || now.getMonth() + 1;
  anio = anio || now.getFullYear();

  switch (tipo) {
    case 'ventas_mes': {
      const ventas = (await getVentas()).filter(v => v.mes === mes && v.anio === anio);
      const sum = arr => arr.reduce((s, v) => s + (v.total || 0), 0);
      return {
        mes, anio,
        total: sum(ventas),
        total_format: fmtCOP(sum(ventas)),
        cantidad_ventas: ventas.length,
        efectivo: fmtCOP(sum(ventas.filter(v => v.tipo === 'contado' && v.metodo_pago === 'efectivo'))),
        transferencias: fmtCOP(sum(ventas.filter(v => v.tipo === 'contado' && v.metodo_pago !== 'efectivo'))),
        credito: fmtCOP(sum(ventas.filter(v => v.tipo === 'credito'))),
        contra_entrega: fmtCOP(sum(ventas.filter(v => v.tipo === 'contraentrega')))
      };
    }
    case 'ventas_6_meses': {
      const ventas = await getVentas();
      const porMes = {};
      for (const v of ventas) {
        const clave = `${v.anio}-${String(v.mes).padStart(2, '0')}`;
        porMes[clave] = (porMes[clave] || 0) + (v.total || 0);
      }
      const lista = Object.entries(porMes).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6)
        .map(([m, t]) => ({ mes: m, total: t, total_format: fmtCOP(t) }));
      return lista;
    }
    case 'top_productos': {
      const ventas = (await getVentas()).filter(v => v.mes === mes && v.anio === anio);
      const ids = new Set(ventas.map(v => v.id));
      const agg = {};
      for (const it of await getVentaItems()) {
        if (!ids.has(it.venta_id)) continue;
        const nom = it.producto_nombre || 'Sin nombre';
        agg[nom] = agg[nom] || { cantidad: 0, total: 0 };
        agg[nom].cantidad += it.cantidad || 1;
        agg[nom].total += (it.precio_unitario || 0) * (it.cantidad || 1);
      }
      const top = Object.entries(agg)
        .map(([nombre, d]) => ({ nombre, ...d, total_format: fmtCOP(d.total) }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      return { mes, anio, top };
    }
    case 'ventas_por_anio': {
      const ventas = (await getVentas()).filter(v => v.anio === anio);
      const porMes = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, total: 0, cantidad: 0 }));
      for (const v of ventas) {
        const idx = (v.mes || 1) - 1;
        if (idx < 0 || idx > 11) continue;
        porMes[idx].total += v.total || 0;
        porMes[idx].cantidad++;
      }
      const mejor = [...porMes].sort((a, b) => b.total - a.total)[0];
      return {
        anio,
        meses_ordenados_por_venta: porMes
          .sort((a, b) => b.total - a.total)
          .map(m => ({ mes: m.mes, total_format: fmtCOP(m.total), cantidad_ventas: m.cantidad })),
        mejor_mes: mejor.mes,
        mejor_mes_total: fmtCOP(mejor.total)
      };
    }
    case 'top_productos_total': {
      const agg = {};
      for (const it of await getVentaItems()) {
        const nom = it.producto_nombre || 'Sin nombre';
        agg[nom] = agg[nom] || { cantidad: 0, total: 0 };
        agg[nom].cantidad += it.cantidad || 1;
        agg[nom].total += (it.precio_unitario || 0) * (it.cantidad || 1);
      }
      const top = Object.entries(agg)
        .map(([nombre, d]) => ({ nombre, ...d, total_format: fmtCOP(d.total) }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
      return { periodo: 'todo el historial', top };
    }
    case 'rentabilidad': {
      const productos = await getProductos();
      const conCosto = productos.filter(p => p.precio > 0 && p.costo > 0);
      const porMargen = conCosto
        .map(p => ({
          nombre: p.nombre, referencia: p.referencia, stock: p.stock || 0,
          costo: p.costo, precio: p.precio,
          ganancia_unidad: p.precio - p.costo,
          ganancia_unidad_format: fmtCOP(p.precio - p.costo),
          margen_pct: Math.round(((p.precio - p.costo) / p.costo) * 100)
        }))
        .sort((a, b) => b.margen_pct - a.margen_pct)
        .slice(0, 10);
      const prodPorNombre = {};
      for (const p of conCosto) prodPorNombre[normalizar(p.nombre)] = p;
      const utilVendida = {};
      for (const it of await getVentaItems()) {
        const p = prodPorNombre[normalizar(it.producto_nombre || '')];
        if (!p) continue;
        const u = utilVendida[p.nombre] || { utilidad: 0, unidades: 0 };
        u.utilidad += (p.precio - p.costo) * (it.cantidad || 1);
        u.unidades += it.cantidad || 1;
        utilVendida[p.nombre] = u;
      }
      const porUtilidadVendida = Object.entries(utilVendida)
        .map(([nombre, d]) => ({ nombre, unidades_vendidas: d.unidades, utilidad: d.utilidad, utilidad_format: fmtCOP(d.utilidad) }))
        .sort((a, b) => b.utilidad - a.utilidad)
        .slice(0, 10);
      return {
        top_por_margen: porMargen,
        top_por_utilidad_real_vendida: porUtilidadVendida
      };
    }
    case 'recomendaciones': {
      const productos = await getProductos();
      const ventas = await getVentas();
      const limite = Date.now() - 90 * 24 * 3600 * 1000;
      const idsRecientes = new Set(
        ventas.filter(v => { const t = new Date(v.created_at).getTime(); return t >= limite; }).map(v => v.id)
      );
      const vendidos = {};
      for (const it of await getVentaItems()) {
        if (!idsRecientes.has(it.venta_id)) continue;
        const nom = it.producto_nombre || '';
        vendidos[nom] = (vendidos[nom] || 0) + (it.cantidad || 1);
      }
      const prodPorNombre = {};
      for (const p of productos) prodPorNombre[normalizar(p.nombre)] = p;
      const candidatos = [];
      for (const [nom, uni] of Object.entries(vendidos)) {
        const p = prodPorNombre[normalizar(nom)];
        if (!p) continue;
        candidatos.push({
          nombre: p.nombre,
          stock_actual: p.stock || 0,
          precio: p.precio,
          margen_pct: p.costo > 0 ? Math.round(((p.precio - p.costo) / p.costo) * 100) : 0,
          unidades_vendidas_90_dias: uni
        });
      }
      candidatos.sort((a, b) => b.unidades_vendidas_90_dias - a.unidades_vendidas_90_dias);
      return {
        mas_vendidos_ultimos_90_dias: candidatos.slice(0, 8),
        bestsellers_sin_stock_a_reponer: candidatos.filter(c => c.stock_actual <= 0).slice(0, 5),
        nota: 'Recomienda combinando alta rotación + buen margen + stock disponible. Si un best-seller está sin stock, sugiere reponerlo.'
      };
    }
    case 'productos_sin_stock': {
      const sinStock = (await getProductos()).filter(p => !p.stock || p.stock <= 0).map(p => ({ nombre: p.nombre, referencia: p.referencia, precio: p.precio }));
      return { cantidad: sinStock.length, productos: sinStock };
    }
    case 'inventario': {
      const productos = await getProductos();
      const valor = productos.reduce((s, p) => s + (p.stock || 0) * (p.costo || 0), 0);
      const conCosto = productos.filter(p => p.costo > 0);
      const margen = conCosto.length
        ? Math.round(conCosto.reduce((s, p) => s + ((p.precio - p.costo) / p.costo) * 100, 0) / conCosto.length)
        : 0;
      return {
        valor_inventario: fmtCOP(valor),
        referencias: productos.length,
        sin_stock: productos.filter(p => !p.stock || p.stock <= 0).length,
        margen_promedio: margen + '%'
      };
    }
    case 'gastos_mes': {
      const gastos = (await getGastos()).filter(g => g.mes === mes && g.anio === anio);
      const total = gastos.reduce((s, g) => s + (g.valor || 0), 0);
      return { mes, anio, total: fmtCOP(total), cantidad: gastos.length };
    }
    case 'compras_mes': {
      const compras = (await getCompras()).filter(c => c.mes === mes && c.anio === anio && !c.es_abono);
      const total = compras.reduce((s, c) => s + (c.total || 0), 0);
      return { mes, anio, total: fmtCOP(total), cantidad: compras.length };
    }
    case 'utilidad': {
      const ventas = (await getVentas()).filter(v => v.mes === mes && v.anio === anio).reduce((s, v) => s + (v.total || 0), 0);
      const compras = (await getCompras()).filter(c => c.mes === mes && c.anio === anio && !c.es_abono).reduce((s, c) => s + (c.total || 0), 0);
      const gastos = (await getGastos()).filter(g => g.mes === mes && g.anio === anio).reduce((s, g) => s + (g.valor || 0), 0);
      const utilidad = ventas - compras - gastos;
      return {
        mes, anio,
        ventas: fmtCOP(ventas),
        compras: fmtCOP(compras),
        gastos: fmtCOP(gastos),
        utilidad: fmtCOP(utilidad)
      };
    }
    default:
      return { error: 'Tipo no válido. Usa uno de: ventas_mes, ventas_6_meses, ventas_por_anio, top_productos, top_productos_total, rentabilidad, recomendaciones, productos_sin_stock, inventario, gastos_mes, compras_mes, utilidad.' };
  }
}

async function ejecutarHerramienta(nombre, args) {
  switch (nombre) {
    case 'buscar_producto': return await toolBuscarProducto(args);
    case 'revisar_pedido': return await toolRevisarPedido(args);
    case 'consultar_datos': return await toolConsultarDatos(args);
    default: return { error: 'Herramienta desconocida: ' + nombre };
  }
}

/* ============================================================
   Groq (OpenAI-compatible)
   ============================================================ */
async function groq(messages) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({ model: GROQ_MODEL, messages, tools, tool_choice: 'auto', temperature: 0.3 })
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error('Groq ' + r.status + ': ' + t.slice(0, 200));
  }
  const j = await r.json();
  return j.choices[0].message;
}

/* ============================================================
   Contexto propio (tabla chat_conocimiento) + meta de ventas
   ============================================================ */
async function construirContexto(message) {
  let conocimiento = '';
  let meta = '';
  try {
    const rows = await sbGet('chat_conocimiento?select=palabras_clave,informacion&limit=200');
    const msgNorm = normalizar(message);
    const sel = (rows || []).filter(r => {
      const keys = String(r.palabras_clave || '').split(',').map(normalizar).filter(Boolean);
      return keys.some(k => msgNorm.includes(k));
    });
    if (sel.length) conocimiento = sel.map(r => '• ' + r.informacion).join('\n');
  } catch (e) { /* tabla aún no creada */ }
  try {
    const c = await sbGet('configuracion?select=meta_ventas_mes&id=eq.1');
    if (c && c[0] && c[0].meta_ventas_mes) meta = `La meta de ventas del mes actual es ${c[0].meta_ventas_mes} pesos colombianos.`;
  } catch (e) { /* sin config */ }

  let s = INSTRUCCIONES_SISTEMA;
  if (meta) s += '\n\n' + meta;
  if (conocimiento) s += '\n\nCONOCIMIENTO PROPIO DE LA TIENDA (úsalo como dato real):\n' + conocimiento;
  return s;
}

/* ============================================================
   Handler
   ============================================================ */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Solo se permite POST' });
    return;
  }
  if (!GROQ_KEY) {
    res.status(501).json({ error: 'GROQ_API_KEY no está configurada. Agrégala en Vercel > Project > Settings > Environment Variables.' });
    return;
  }

  const body = req.body || {};
  const message = String(body.message || '').trim();
  const historial = Array.isArray(body.historial) ? body.historial : [];

  if (!message) {
    res.status(400).json({ error: 'Mensaje vacío' });
    return;
  }

  try {
    const system = await construirContexto(message);

    const msgs = [{ role: 'system', content: system }];
    for (const h of historial.slice(-8)) {
      msgs.push({ role: h.role === 'bot' ? 'assistant' : 'user', content: String(h.content || '').slice(0, 4000) });
    }
    msgs.push({ role: 'user', content: message });

    let msg = await groq(msgs);
    let vueltas = 0;
    while (msg.tool_calls && vueltas < 5) {
      msgs.push(msg);
      for (const tc of msg.tool_calls) {
        let resultado;
        try {
          const args = JSON.parse(tc.function.arguments || '{}');
          resultado = await ejecutarHerramienta(tc.function.name, args);
        } catch (e) {
          resultado = { error: e.message };
        }
        msgs.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(resultado) });
      }
      msg = await groq(msgs);
      vueltas++;
    }

    res.status(200).json({ respuesta: msg.content || 'Sin respuesta.' });
  } catch (e) {
    res.status(500).json({ error: 'Error interno: ' + e.message });
  }
}
