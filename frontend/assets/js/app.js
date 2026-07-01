
  /* ──----───────────────────────────────────────────── 
  ATENAS ERP - app.js
   Navegación, Inventario (vistas/modal) y Caja (paneles)
   ============================================================ */

/* ── NAVEGACIÓN ───────────────────────────────────────────── */
function showView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  // Quita 'active' de TODOS los nav-item (sidebar, menú móvil, bottom nav)
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(n=>n.classList.remove('active'));

  const view = document.getElementById('view-' + name);
  if(view) view.classList.add('active');

  // Activa el item correspondiente en todos los lugares donde exista
  document.querySelectorAll(`[data-view="${name}"]`).forEach(el=>el.classList.add('active'));

  window.scrollTo({top:0, behavior:'smooth'});

  // Ocultar botón Resumen en Caja
  const fabResumen = document.querySelector('.fab-resumen');
  if(fabResumen) fabResumen.style.display = name === 'caja' ? 'none' : 'flex';
  if(name === 'envios') cargarEnvios();
}


/** Abre/cierra el menú hamburguesa móvil */
function toggleMobileMenu(){
  document.getElementById('mobile-menu').classList.toggle('open');
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ── INVENTARIO: Toggle vista Referencia / Agrupado ─────────── */
function invView(which, el){
  document.querySelectorAll('#view-inventario .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('inv-ref').style.display = which === 'ref' ? 'block' : 'none';
  document.getElementById('inv-grp').style.display = which === 'grp' ? 'block' : 'none';

  if(which === 'sin-stock'){
    document.getElementById('inv-ref').style.display = 'block';
    const rows = document.querySelectorAll('#inv-tbody tr');
    rows.forEach(row => {
      const badge = row.querySelector('.badge');
      row.style.display = badge && badge.classList.contains('badge-rojo') ? '' : 'none';
    });
    // Mobile
    const cards = document.querySelectorAll('#inv-mobile-cards > div');
    cards.forEach(card => {
      const badge = card.querySelector('.badge');
      card.style.display = badge && badge.classList.contains('badge-rojo') ? '' : 'none';
    });
  } else {
    // Mostrar todos si cambia de vista
    document.querySelectorAll('#inv-tbody tr').forEach(r => r.style.display = '');
    document.querySelectorAll('#inv-mobile-cards > div').forEach(c => c.style.display = '');
  }
}

/* ── INVENTARIO: Acordeón en vista agrupada ─────────────────── */
function toggleGrupo(header){
  header.classList.toggle('collapsed');
  header.nextElementSibling.classList.toggle('collapsed');
}


/* ── CAJA: Expandir/colapsar paneles (Efectivo, Nequi, Banco) ─ */
function toggleCaja(which){
  const panels = ['efectivo','nequi','banco'];
  panels.forEach(p=>{
    const el = document.getElementById('panel-' + p);
    if(!el) return;
    if(p === which){
      el.classList.toggle('open');
    } else {
      el.classList.remove('open');
    }
  });
}

/** Recalcula subtotal de una denominación y el total general de efectivo */
function recalcDenom(input, valor, contexto){
  const cantidad = parseInt(input.value) || 0;
  const subtotal = cantidad * valor;
  input.closest('.denom-info').querySelector('.denom-sub').textContent = formatCOP(subtotal);

  if(contexto === 'si'){
    // Modal de saldo inicial
    let total = 0;
    document.querySelectorAll('#modal-saldo-inicial .denom-card').forEach(card=>{
      const sub = card.querySelector('.denom-sub');
      total += parseInt(sub.textContent.replace(/[^\d]/g,'')) || 0;
    });
    document.getElementById('si-total-efectivo').textContent = formatCOP(total);
  } else {
    // Panel de Caja normal
    let total = 0;
    document.querySelectorAll('#panel-efectivo .denom-card').forEach(card=>{
      const sub = card.querySelector('.denom-sub');
      total += parseInt(sub.textContent.replace(/[^\d]/g,'')) || 0;
    });
    document.getElementById('total-efectivo').textContent = formatCOP(total);
    recalcCuadreCaja();
    guardarDenominacionesCaja();
  }
}

function stepDenom(input, valor, delta, contexto){
  let val = (parseInt(input.value) || 0) + delta;
  if(val < 0) val = 0;
  input.value = val;
  recalcDenom(input, valor, contexto);
}

/** Transferencia interna Nequi <-> Bancolombia (demo visual) */
let _transfOrigen = '';
let _transfDestino = '';

function abrirTransferencia(origen, destino){
  _transfOrigen = origen;
  _transfDestino = destino;
  document.getElementById('t-desc').textContent = `Enviar dinero de ${origen} hacia ${destino}.`;
  document.getElementById('t-monto').value = '';
  document.getElementById('modal-transf').classList.add('open');
}

function cerrarModalTransf(){
  document.getElementById('modal-transf').classList.remove('open');
}

async function confirmarTransferencia(){
  const monto = rawNum(document.getElementById('t-monto'));
  if(monto <= 0){
    showToast('⚠️ Ingresa un monto válido', 'error');
    return;
  }

  const origen = _transfOrigen.toLowerCase();
  const destino = _transfDestino.toLowerCase();

  await actualizarSaldoCaja(origen, -monto, `Transferencia a ${_transfDestino}`);
  await actualizarSaldoCaja(destino, monto, `Transferencia desde ${_transfOrigen}`);

  showToast(`✅ ${formatCOP(monto)} transferidos de ${_transfOrigen} a ${_transfDestino}`);
  cerrarModalTransf();
}
function toggleResumen(){
  document.getElementById('resumen-panel').classList.toggle('open');
}

/** Guardar nuevo saldo de banco (demo visual) */
function guardarSaldoBanco(banco){
  showToast(`✅ Saldo de ${banco} actualizado`, 'success');
}

/* ── CAJA: Modal Contra Entrega ──────────────────────────────── */
function abrirModalContra(){
  document.getElementById('modal-contra').classList.add('open');
}
function cerrarModalContra(){
  document.getElementById('modal-contra').classList.remove('open');
}
function guardarContra(){
  const cliente = document.getElementById('c-cliente');
  const ciudad  = document.getElementById('c-ciudad');
  const monto   = rawNum(document.getElementById('c-monto'));

  if(!cliente.value.trim()){
    showToast('⚠️ Falta el nombre del cliente', 'error');
    cliente.focus();
    return;
  }
  if(!ciudad.value.trim()){
    showToast('⚠️ Falta la ciudad', 'error');
    ciudad.focus();
    return;
  }
  if(monto <= 0){
    showToast('⚠️ Falta el monto', 'error');
    document.getElementById('c-monto').focus();
    return;
  }

  showToast(`✅ Contra entrega de ${cliente.value.trim()} agregada (En Preparación)`);
  cerrarModalContra();

  cliente.value = '';
  ciudad.value = '';
  document.getElementById('c-monto').value = '';
}

/* ── Cerrar modales al hacer click fuera ─────────────────────── */
document.addEventListener('click', (e)=>{
  document.querySelectorAll('.modal-overlay.open').forEach(overlay=>{
    if(e.target === overlay) overlay.classList.remove('open');
  });
});

/* ============================================================
   VENTAS (multi-producto)
   ============================================================ */

const CATALOGO_DEMO = [
  { ref:'ATS-001', nombre:'Ampolla Anticaída', precio:28000, stock:8, icon:'💧' },
  { ref:'ATS-002', nombre:'Ampolla Embrión de Pato', precio:30000, stock:3, icon:'💧' },
  { ref:'ATS-003', nombre:'Camisa Básica Talla M', precio:45000, stock:0, icon:'👕' },
  { ref:'ATS-004', nombre:'Crema Hidratante Facial', precio:45000, stock:12, icon:'🧴' },
];

let _ventaItems = []; // [{ref, nombre, precio, stock, cantidad, icon}]
let _itemSeq = 0;
let _ventaEditando = null; // referencia a .venta-grupo que se está editando

function abrirModalVenta(){
  document.getElementById('modal-venta').classList.add('open');
  resetFormVenta();
}
function cerrarModalVenta(){
  document.getElementById('modal-venta').classList.remove('open');
}

function resetFormVenta(){
  _ventaEditando = null; // ← nueva línea
  document.getElementById('v-cliente').value = '';
  document.getElementById('v-fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('v-tipo').value = 'contado';
  document.getElementById('v-metodo').value = 'efectivo';
  document.getElementById('v-tiene-descuento').checked = false;
  document.getElementById('v-descuento-fields').style.display = 'none';
  document.getElementById('v-descuento').value = '';
  document.getElementById('v-descuento-tipo').value = 'monto';
  _ventaItems = [];
  _itemSeq = 0;
  agregarItemVenta();
  cambioTipoVenta();
}
/** Abre el modal precargado con los datos de una venta existente */
function editarVenta(btn){
  const grupo = btn.closest('.venta-grupo');
  const id = grupo.dataset.id;
  const v = VENTAS.find(x => x.id === id);
  if(!v) return;

  _ventaEditando = id;
  document.getElementById('modal-venta').classList.add('open');
  document.getElementById('v-cliente').value = v.cliente_nombre || '';
  document.getElementById('v-fecha').value = v.fecha || new Date().toISOString().split('T')[0];
  document.getElementById('v-tipo').value = v.tipo;
  if(v.metodo_pago) document.getElementById('v-metodo').value = v.metodo_pago;
  if(v.banco) document.getElementById('v-banco').value = v.banco;
  document.getElementById('v-tiene-descuento').checked = v.descuento > 0;
  document.getElementById('v-descuento-fields').style.display = v.descuento > 0 ? 'grid' : 'none';
  document.getElementById('v-descuento').value = v.descuento > 0 ? v.descuento.toLocaleString('es-CO') : '';

  // Cargar items
  const items = v.venta_items || [];
  _ventaItems = [];
  _itemSeq = 0;
  items.forEach(it => {
    const id2 = 'item-' + (++_itemSeq);
    const prod = PRODUCTOS.find(p => p.id === it.producto_id);
    _ventaItems.push({
      id: id2,
      ref: it.producto_id,
      nombre: it.producto_nombre,
      precio: it.precio_unitario,
      stock: prod ? prod.stock + it.cantidad : 9999,
      cantidad: it.cantidad,
      icon: it.producto_icono || '📦',
      foto_url: it.foto_url || (prod ? prod.foto_url : null)
    });
  });
  renderItemsVenta();
  cambioTipoVenta();
}

/** Agrega una fila nueva de producto al formulario */
function agregarItemVenta(){
  const id = 'item-' + (++_itemSeq);
  _ventaItems.push({ id, ref:'', nombre:'', precio:0, stock:0, cantidad:1, icon:'📦' });
  renderItemsVenta();
}

/** Quita una fila de producto */
function eliminarItemVenta(id){
  _ventaItems = _ventaItems.filter(it => it.id !== id);
  if(_ventaItems.length === 0) agregarItemVenta();
  else renderItemsVenta();
}

/** Dibuja todas las filas de productos del formulario */
function renderItemsVenta(){
  const cont = document.getElementById('v-items-list');
  cont.innerHTML = _ventaItems.map(it => `
    <div data-id="${it.id}" style="background:var(--gris-10);border-radius:10px;padding:10px;margin-bottom:8px;">
      <div class="autocomplete-wrap" style="margin-bottom:6px;">
        <input class="form-input" placeholder="Buscar producto..." value="${it.nombre}"
               oninput="buscarProductoItem('${it.id}', this.value)" autocomplete="off">
        <div class="autocomplete-list" id="ac-${it.id}"></div>
        ${it.ref ? `<span class="form-hint">${it.foto_url ? `<img src="${it.foto_url}" style="width:20px;height:20px;border-radius:4px;object-fit:cover;vertical-align:middle;">` : it.icon} ${it.nombre} — Stock: ${it.stock}</span>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:6px;align-items:end;">
        <div><div class="form-label">Cant.</div><input class="form-input" type="number" min="1" value="${it.cantidad}" oninput="cambiarCantidadItem('${it.id}', this.value)"></div>
        <div><div class="form-label">Precio</div><input class="form-input" type="text" value="${it.precio ? it.precio.toLocaleString('es-CO') : ''}" oninput="cambiarPrecioItem('${it.id}', this.value)"></div>
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.precio * it.cantidad)}" style="background:#fff;color:var(--gris-60);"></div>
        <button type="button" class="multi-item-remove" onclick="eliminarItemVenta('${it.id}')">✕</button>
      </div>
    </div>
  `).join('');
  calcTotalGeneral();
}

/** Autocompletado por item */
function buscarProductoItem(id, query){
  const list = document.getElementById('ac-' + id);
  if(!query.trim()){ list.classList.remove('open'); list.innerHTML=''; return; }

  const q = query.toLowerCase();
  const resultados = PRODUCTOS.filter(p =>
    p.nombre.toLowerCase().includes(q) || p.referencia.toLowerCase().includes(q)
  );

  if(!resultados.length){
    list.innerHTML = '<div class="autocomplete-item" style="color:var(--gris-60);">Sin resultados</div>';
    list.classList.add('open');
    return;
  }

  list.innerHTML = resultados.map(p => `
    <div class="autocomplete-item" onclick="seleccionarProductoItem('${id}','${p.id}')" style="display:flex;align-items:center;gap:8px;">
      ${p.foto_url
        ? `<img src="${p.foto_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0;">`
        : `<span style="flex-shrink:0;">${p.icono || '📦'}</span>`}
      <span>${p.nombre} <span class="ac-ref">${p.referencia}</span> <span class="ac-stock">Stock: ${p.stock}</span></span>
    </div>
  `).join('');
  list.classList.add('open');
}

function seleccionarProductoItem(id, productoId){
  const p = PRODUCTOS.find(x => x.id === productoId);
  if(!p) return;
  const item = _ventaItems.find(it => it.id === id);
  item.ref = p.id;
  item.nombre = p.nombre;
  item.precio = p.precio;
  item.stock = p.stock;
  item.icon = p.icono || '📦';
  item.foto_url = p.foto_url || null;
  renderItemsVenta();
}

/** Cambia cantidad de un item y recalcula */
function cambiarCantidadItem(id, valor){
  const item = _ventaItems.find(it => it.id === id);
  let cantidad = parseInt(valor) || 1;
  if(cantidad < 1) return;
  if(item.ref && cantidad > item.stock){
    showToast(`⚠️ Solo hay ${item.stock} disponibles de "${item.nombre}"`, 'error');
    return;
  }
  item.cantidad = cantidad;
  const row = document.querySelector(`#v-items-list [data-id="${id}"]`);
  row.querySelector('input[readonly]').value = formatCOP(item.precio * item.cantidad);
  calcTotalGeneral();
}
function cambiarPrecioItem(id, valor){
  const item = _ventaItems.find(it => it.id === id);
  item.precio = rawNum({value: valor});
  const row = document.querySelector(`#v-items-list [data-id="${id}"]`);
  row.querySelector('input[readonly]').value = formatCOP(item.precio * item.cantidad);
  calcTotalGeneral();
}

/** Suma el total de todos los items */
/** Suma el total de todos los items y aplica el descuento */
function calcTotalGeneral(){
  const subtotal = _ventaItems.reduce((acc,it) => acc + (it.precio * it.cantidad), 0);
 const tieneDescuento = document.getElementById('v-tiene-descuento').checked;
  const descuentoInput = rawNum(document.getElementById('v-descuento'));
  const tipoDescuento = document.getElementById('v-descuento-tipo').value;

  let descuento = 0;
  if(tieneDescuento && descuentoInput > 0){
    descuento = tipoDescuento === 'porcentaje'
      ? subtotal * (descuentoInput / 100)
      : descuentoInput;
  }
  if(descuento > subtotal) descuento = subtotal;

  const total = subtotal - descuento;

  document.getElementById('v-subtotal').textContent = formatCOP(subtotal);
  document.getElementById('v-total-general').textContent = formatCOP(total);

  const descRow = document.getElementById('v-descuento-row');
  if(descuento > 0){
    descRow.style.display = 'flex';
    document.getElementById('v-descuento-valor').textContent = '-' + formatCOP(descuento);
  } else {
    descRow.style.display = 'none';
  }
}

/** Tipo de venta: muestra/oculta método de pago */
function cambioTipoVenta(){
  const tipo = document.getElementById('v-tipo').value;
  const metodoWrap = document.getElementById('v-metodo-wrap');
  const banner = document.getElementById('v-banner-contra');

  if(tipo === 'contraentrega'){
    metodoWrap.style.display = 'none';
    document.getElementById('v-banco-wrap').style.display = 'none';
    banner.classList.add('show');
  } else if(tipo === 'credito'){
    metodoWrap.style.display = 'none';
    document.getElementById('v-banco-wrap').style.display = 'none';
    banner.classList.remove('show');
  } else {
    metodoWrap.style.display = 'flex';
    banner.classList.remove('show');
    cambioMetodoPago();
  }
}

function cambioMetodoPago(){
  const metodo = document.getElementById('v-metodo').value;
  document.getElementById('v-banco-wrap').style.display = metodo === 'transferencia' ? 'flex' : 'none';
}


/* ── Tabla de ventas: expandir detalle ──────────────────────── */
function toggleVentaDetalle(header){
  header.classList.toggle('collapsed');
  header.nextElementSibling.classList.toggle('collapsed');
}

/* ── Filtro mes/año (demo) ───────────────────────────────────── */
function filtrarVentas(){
  const mes = document.getElementById('f-mes').value;
  const anio = document.getElementById('f-anio').value;
  showToast(`🔍 Filtrando: ${mes ? 'mes ' + mes : 'todos los meses'} / ${anio}`, 'info');
}

/* ── Cerrar autocompletes al hacer click fuera ──────────────── */
document.addEventListener('click', (e)=>{
  document.querySelectorAll('.autocomplete-list.open').forEach(list=>{
    if(!list.parentElement.contains(e.target)){
      list.classList.remove('open');
    }
  });
});

function toggleDescuento(){
  const checked = document.getElementById('v-tiene-descuento').checked;
  const fields = document.getElementById('v-descuento-fields');
  fields.style.display = checked ? 'grid' : 'none';
  if(!checked){
    document.getElementById('v-descuento').value = '';
    document.getElementById('v-descuento-tipo').value = 'monto';
  }
  calcTotalGeneral();
}

/* ============================================================
   COMPRAS (multi-producto, agrupado por proveedor)
   ============================================================ */

let _compraItems = [];
let _compraItemSeq = 0;
let _compraEditando = null;

function abrirModalCompra(){
  document.getElementById('modal-compra').classList.add('open');
  resetFormCompra();
}
function cerrarModalCompra(){
  document.getElementById('modal-compra').classList.remove('open');
}

function resetFormCompra(){
  _compraEditando = null; // ← nueva línea
  document.getElementById('co-proveedor').value = '';
  document.getElementById('co-tipo').value = 'contado';
  document.getElementById('co-fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('co-tiene-descuento').checked = false;
  document.getElementById('co-descuento-fields').style.display = 'none';
  document.getElementById('co-descuento').value = '';
  document.getElementById('co-descuento-tipo').value = 'monto';
  _compraItems = [];
  _compraItemSeq = 0;
  agregarItemCompra();
  cambioTipoCompra();
}
/** Abre el modal precargado con los datos de una compra existente */
function editarCompra(btn){
  const grupo = btn.closest('.venta-grupo');
  const id = grupo.dataset.id;
  const c = COMPRAS.find(x => x.id === id);
  if(!c) return;

  _compraEditando = id;
  document.getElementById('modal-compra').classList.add('open');
  document.getElementById('co-proveedor').value = c.proveedor_nombre || '';
  document.getElementById('co-tipo').value = c.tipo;
  document.getElementById('co-fecha').value = c.fecha || new Date().toISOString().split('T')[0];
  document.getElementById('co-tiene-descuento').checked = c.descuento > 0;
  document.getElementById('co-descuento-fields').style.display = c.descuento > 0 ? 'grid' : 'none';
  document.getElementById('co-descuento').value = c.descuento > 0 ? c.descuento.toLocaleString('es-CO') : '';

  const items = c.compra_items || [];
  _compraItems = [];
  _compraItemSeq = 0;
  items.forEach(it => {
    const id2 = 'co-item-' + (++_compraItemSeq);
    const prod = PRODUCTOS.find(p => p.id === it.producto_id);
    _compraItems.push({
      id: id2,
      ref: it.producto_id,
      nombre: it.producto_nombre,
      costo: it.costo_unitario,
      costoEditado: true,
      cantidad: it.cantidad,
      icon: it.producto_icono || '📦',
      foto_url: it.foto_url || (prod ? prod.foto_url : null)
    });
  });
  renderItemsCompra();
}



/** Agrega una fila nueva de producto */
function agregarItemCompra(){
  const id = 'co-item-' + (++_compraItemSeq);
  _compraItems.push({ id, ref:'', nombre:'', costo:0, costoEditado:false, cantidad:1, icon:'📦' });
  renderItemsCompra();
}

function eliminarItemCompra(id){
  _compraItems = _compraItems.filter(it => it.id !== id);
  if(_compraItems.length === 0) agregarItemCompra();
  else renderItemsCompra();
}

/** Dibuja todas las filas de productos del formulario de compra */
function renderItemsCompra(){
  const cont = document.getElementById('co-items-list');
  cont.innerHTML = _compraItems.map(it => `
    <div data-id="${it.id}" style="background:var(--gris-10);border-radius:10px;padding:10px;margin-bottom:8px;">
      <div class="autocomplete-wrap" style="margin-bottom:6px;">
        <input class="form-input" placeholder="Buscar producto..." value="${it.nombre}"
               oninput="buscarProductoCompra('${it.id}', this.value)" autocomplete="off">
        <div class="autocomplete-list" id="co-ac-${it.id}"></div>
        ${it.ref ? `<span class="form-hint">${it.foto_url ? `<img src="${it.foto_url}" style="width:20px;height:20px;border-radius:4px;object-fit:cover;vertical-align:middle;">` : it.icon} ${it.nombre}</span>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:6px;align-items:end;">
        <div><div class="form-label">Cant.</div><input class="form-input" type="number" min="1" value="${it.cantidad}" oninput="cambiarCantidadCompra('${it.id}', this.value)"></div>
        <div><div class="form-label">Costo</div><input class="form-input" type="text" value="${it.costo ? it.costo.toLocaleString('es-CO') : ''}" placeholder="0" oninput="cambiarCostoCompra('${it.id}', this.value)"></div>
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.costo * it.cantidad)}" style="background:#fff;color:var(--gris-60);"></div>
        <button type="button" class="multi-item-remove" onclick="eliminarItemCompra('${it.id}')">✕</button>
      </div>
    </div>
  `).join('');
  calcTotalCompra();
}

/** Autocompletado por item de compra */
function buscarProductoCompra(id, query){
  const list = document.getElementById('co-ac-' + id);
  if(!query.trim()){ list.classList.remove('open'); list.innerHTML=''; return; }

  const q = query.toLowerCase();
  const resultados = PRODUCTOS.filter(p =>
    p.nombre.toLowerCase().includes(q) || p.referencia.toLowerCase().includes(q)
  );

  if(!resultados.length){
    list.innerHTML = '<div class="autocomplete-item" style="color:var(--gris-60);">Sin resultados</div>';
    list.classList.add('open');
    return;
  }

  list.innerHTML = resultados.map(p => `
    <div class="autocomplete-item" onclick="seleccionarProductoCompra('${id}','${p.id}')" style="display:flex;align-items:center;gap:8px;">
      ${p.foto_url
        ? `<img src="${p.foto_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0;">`
        : `<span style="flex-shrink:0;">${p.icono || '📦'}</span>`}
      <span>${p.nombre} <span class="ac-ref">${p.referencia}</span></span>
    </div>
  `).join('');
  list.classList.add('open');
}

function seleccionarProductoCompra(id, productoId){
  const p = PRODUCTOS.find(x => x.id === productoId);
  if(!p) return;
  const item = _compraItems.find(it => it.id === id);
  item.ref = p.id;
  item.nombre = p.nombre;
  item.icon = p.icono || '📦';
  item.foto_url = p.foto_url || null;
  item.costo = p.costo;
  item.costoEditado = false;
  renderItemsCompra();
}

/** Cambia cantidad y recalcula */
function cambiarCantidadCompra(id, valor){
  const item = _compraItems.find(it => it.id === id);
  item.cantidad = Math.max(1, parseInt(valor) || 1);
  const row = document.querySelector(`#co-items-list [data-id="${id}"]`);
  row.querySelectorAll('input[readonly]')[0].value = formatCOP(item.costo * item.cantidad);
  calcTotalCompra();
}

/** Permite editar el costo manualmente */
function cambiarCostoCompra(id, valor){
  const item = _compraItems.find(it => it.id === id);
  item.costo = rawNum({value: valor});
  item.costoEditado = true;
  const row = document.querySelector(`#co-items-list [data-id="${id}"]`);
  row.querySelectorAll('input[readonly]')[0].value = formatCOP(item.costo * item.cantidad);
  calcTotalCompra();
}

/** Total general con descuento opcional */
function calcTotalCompra(){
  const subtotal = _compraItems.reduce((acc,it) => acc + (it.costo * it.cantidad), 0);
  const tieneDescuento = document.getElementById('co-tiene-descuento').checked;
  const descuentoInput = rawNum(document.getElementById('co-descuento'));
  const tipoDescuento = document.getElementById('co-descuento-tipo').value;

  let descuento = 0;
  if(tieneDescuento && descuentoInput > 0){
    descuento = tipoDescuento === 'porcentaje'
      ? subtotal * (descuentoInput / 100)
      : descuentoInput;
  }
  if(descuento > subtotal) descuento = subtotal;

  const total = subtotal - descuento;

  document.getElementById('co-subtotal').textContent = formatCOP(subtotal);
  document.getElementById('co-total-general').textContent = formatCOP(total);

  const descRow = document.getElementById('co-descuento-row');
  if(descuento > 0){
    descRow.style.display = 'flex';
    document.getElementById('co-descuento-valor').textContent = '-' + formatCOP(descuento);
  } else {
    descRow.style.display = 'none';
  }
}

function toggleDescuentoCompra(){
  const checked = document.getElementById('co-tiene-descuento').checked;
  const fields = document.getElementById('co-descuento-fields');
  fields.style.display = checked ? 'grid' : 'none';
  if(!checked){
    document.getElementById('co-descuento').value = '';
    document.getElementById('co-descuento-tipo').value = 'monto';
  }
  calcTotalCompra();
}

/** Validación + guardado: suma al stock */


/* ── Filtro mes/año (demo) ───────────────────────────────────── */
function filtrarCompras(){
  const mes = document.getElementById('c-mes').value;
  const anio = document.getElementById('c-anio').value;
  showToast(`🔍 Filtrando compras: ${mes ? 'mes ' + mes : 'todos los meses'} / ${anio}`, 'info');
}

/* ============================================================
   GASTOS
   ============================================================ */

const TIPOS_GASTO = {
  empaque:   { label:'📦 Empaque',          clase:'gasto-empaque' },
  descuento: { label:'🏷️ Descuento',        clase:'gasto-descuento' },
  ajustes:   { label:'⚙️ Ajustes',          clase:'gasto-ajustes' },
  envios:    { label:'🚚 Envíos/Domicilios', clase:'gasto-envios' },
  nomina:    { label:'💵 Nómina/Sueldo',    clase:'gasto-nomina' },
  otros:     { label:'🔹 Otros',            clase:'gasto-otros' },
};


let _gastoEditando = null; // referencia a la fila <tr> que se está editando
let _pendienteEditando = null;


/** Abre el modal con los datos de la fila para editar */
function editarGasto(btn){
  const row = btn.closest('tr');
  _gastoEditando = row;

  const concepto = row.children[0].textContent.trim();
  const valor = row.children[2].textContent.trim();
  const tipoTexto = row.children[1].querySelector('.gasto-tipo-badge').className;

  // Detectar tipo según la clase del badge
  let tipo = 'otros';
  for(const key in TIPOS_GASTO){
    if(tipoTexto.includes(TIPOS_GASTO[key].clase)) tipo = key;
  }

  document.getElementById('g-concepto').value = concepto;
  document.getElementById('g-valor').value = valor.replace(/[^\d]/g,'').toLocaleString ? rawNum({value:valor}).toLocaleString('es-CO') : valor.replace(/[^\d]/g,'');
  document.getElementById('g-tipo').value = tipo;

  document.getElementById('modal-gasto').classList.add('open');
}


function filtrarGastos(){
  const mes = parseInt(document.getElementById('g-mes').value) || null;
  const anio = parseInt(document.getElementById('g-anio').value) || new Date().getFullYear();
  cargarGastos(mes, anio);
}
/* ============================================================
   PENDIENTES (Caja)
   ============================================================ */

const FUENTES_PENDIENTE = {
  efectivo:    { label:'💵 Efectivo' },
  nequi:       { label:'nequi' },
  bancolombia: { label:'Bancolombia' },
};

let _pendSeq = 2; // ya hay pend-1 y pend-2 en el demo

function abrirModalPendiente(){
  _pendienteEditando = null;
  document.getElementById('modal-pendiente').classList.add('open');
  document.getElementById('pe-descripcion').value = '';
  document.getElementById('pe-monto').value = '';
  document.getElementById('pe-fuente').value = 'efectivo';
  document.querySelector('#modal-pendiente .btn-primary').textContent = '➕ Agregar';
  document.getElementById('pe-ya-descontado').checked = false;
}
function cerrarModalPendiente(){
  document.getElementById('modal-pendiente').classList.remove('open');
}


/** Marca/desmarca un pendiente como pagado (toggle) */
function marcarPagado(id){
  const row = document.getElementById(id);
  const checkbox = row.querySelector('.pendiente-check');
  if(checkbox.checked){
    row.classList.add('pagado');
  } else {
    row.classList.remove('pagado');
  }
  recalcPendientesTotal();
  showToast(checkbox.checked ? '✅ Marcado como pagado' : '↩️ Marcado como pendiente nuevamente', checkbox.checked ? 'success' : 'info');
}

function eliminarPendiente(id){
  confirmarAccion('¿Eliminar este pendiente?', async () => {
    // Buscar directamente en Supabase para asegurar datos frescos
    const { data: p } = await sb.from('pendientes').select('*').eq('id', id).single();
    
    if(p){
      const saldoRestante = p.monto - (p.monto_abonado || 0);
      const fuente = (p.fuente || 'efectivo').toLowerCase();
      
      if(saldoRestante > 0){
        const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
        const nuevoValor = (cajaActual[fuente] || 0) + saldoRestante;
        await sb.from('caja_saldo').update({ [fuente]: nuevoValor }).eq('id', 1);
      }
      // Borrar todos los movimientos relacionados
      await sb.from('movimientos_caja').delete().ilike('descripcion', `%${p.descripcion}%`);
    }

    await sb.from('pendientes').delete().eq('id', id);
    showToast('🗑️ Pendiente eliminado', 'info');
    await cargarPendientes();
    await cargarCaja();
  });
}

/** Suma solo los pendientes NO pagados */
function recalcPendientesTotal(){
  let total = 0;
  document.querySelectorAll('#pendientes-lista .pendiente-row').forEach(row=>{
    if(!row.classList.contains('pagado')){
      const monto = parseInt(row.querySelector('.pendiente-monto').textContent.replace(/[^\d]/g,'')) || 0;
      total += monto;
    }
  });
  document.getElementById('pend-total').textContent = '-' + formatCOP(total);
}

/* ============================================================
   CONTRA ENTREGAS: editar / eliminar
   ============================================================ */

const ESTADOS_CONTRA = {
  preparacion: { label:'📋 Preparación', clase:'badge-gris' },
  enviado:     { label:'📤 Enviado',     clase:'badge-amarillo' },
  entregado:   { label:'✅ Entregado',   clase:'badge-verde' },
  liquidado:   { label:'💰 Liquidado',   clase:'badge-rojo' },
};

let _contraEditando = null;

/** Abre el modal precargado con los datos de la fila */
function editarContra(id){
  const row = document.getElementById(id);
  _contraEditando = row;

  const cliente = row.children[0].textContent.trim();
  const ciudad = row.children[1].textContent.trim();
  const monto = row.children[2].textContent.trim();
  const transp = row.children[3].textContent.trim();
  const badge = row.children[4].querySelector('.badge');

  // Detectar estado actual según clase del badge
  let estadoActual = 'preparacion';
  for(const key in ESTADOS_CONTRA){
    if(badge.classList.contains(ESTADOS_CONTRA[key].clase)) estadoActual = key;
  }

  document.getElementById('ce-cliente').value = cliente;
  document.getElementById('ce-ciudad').value = ciudad;
  document.getElementById('ce-monto').value = monto.replace(/[^\d]/g,'').toLocaleString ? rawNum({value:monto}).toLocaleString('es-CO') : '';
  document.getElementById('ce-transp').value = transp === '—' ? '' : transp;
  document.getElementById('ce-estado').value = estadoActual;

  document.getElementById('modal-contra-edit').classList.add('open');
}

function cerrarModalContraEdit(){
  document.getElementById('modal-contra-edit').classList.remove('open');
  _contraEditando = null;
}



/** Elimina la fila */
function eliminarContra(id){
  confirmarAccion('¿Eliminar esta contra entrega? Esta acción no se puede deshacer.', () => {
    document.getElementById(id).remove();
    recalcTransitoBanner();
    showToast('🗑️ Contra entrega eliminada', 'info');
  });
}

/** Recalcula el banner "En preparación + tránsito" sumando filas no liquidadas */
function recalcTransitoBanner(){
  let total = 0;
  document.querySelectorAll('#view-caja table.desktop-table tbody tr').forEach(row=>{
    const badge = row.querySelector('.badge');
    if(!badge) return;
    if(!badge.classList.contains('badge-rojo')){ // badge-rojo = liquidado
      const monto = parseInt(row.children[2].textContent.replace(/[^\d]/g,'')) || 0;
      total += monto;
    }
  });
  const banner = document.querySelector('.transit-banner:not(.pendientes-banner) span:last-child');
  if(banner) banner.textContent = formatCOP(total);
}
/* ============================================================
   CONTACTOS: Clientes y Proveedores
   ============================================================ */

let _clienteSeq = 3;
let _clienteEditando = null;

let _proveedorSeq = 2;
let _proveedorEditando = null;

/* ── CLIENTES ─────────────────────────────────────────────── */

function abrirModalCliente(){
  _clienteEditando = null;
  document.getElementById('cli-modal-title').textContent = '👤 Nuevo Cliente';
  document.getElementById('cli-nombre').value = '';
  document.getElementById('cli-apellido').value = '';
  document.getElementById('cli-ciudad').value = '';
  document.getElementById('cli-direccion').value = '';
  document.getElementById('cli-numero').value = '';
  document.getElementById('modal-cliente').classList.add('open');
}
function cerrarModalCliente(){
  document.getElementById('modal-cliente').classList.remove('open');
}

function editarCliente(id){
  const c = CLIENTES_DEMO.find(x => x.id === id);
  if(!c) return;
  _clienteEditando = id;
  document.getElementById('cli-modal-title').textContent = '✏️ Editar Cliente';
  document.getElementById('cli-nombre').value = c.nombre;
  document.getElementById('cli-apellido').value = c.apellido;
  document.getElementById('cli-ciudad').value = c.ciudad;
  document.getElementById('cli-direccion').value = c.direccion;
  document.getElementById('cli-numero').value = c.numero;
  document.getElementById('modal-cliente').classList.add('open');
}

function eliminarCliente(id){
  confirmarAccion('¿Eliminar este cliente? Esta acción no se puede deshacer.', () => {
    const idx = CLIENTES_DEMO.findIndex(x => x.id === id);
    if(idx >= 0) CLIENTES_DEMO.splice(idx,1);
    document.getElementById(id).remove();
    showToast('🗑️ Cliente eliminado', 'info');
  });
}


function guardarCliente(){
  const nombre = document.getElementById('cli-nombre').value.trim();
  const apellido = document.getElementById('cli-apellido').value.trim();
  const ciudad = document.getElementById('cli-ciudad').value.trim();
  const direccion = document.getElementById('cli-direccion').value.trim();
  const numero = document.getElementById('cli-numero').value.trim();

  if(!nombre){
    showToast('⚠️ Falta el nombre', 'error');
    return;
  }

  if(_clienteEditando){
    const c = CLIENTES_DEMO.find(x => x.id === _clienteEditando);
    Object.assign(c, {nombre, apellido, ciudad, direccion, numero});
    document.getElementById(_clienteEditando).outerHTML = renderClienteRow(c);
    showToast(`✅ Cliente "${nombre} ${apellido}" actualizado`);
  } else {
    const id = 'cli-' + (++_clienteSeq);
    const c = {id, nombre, apellido, ciudad, direccion, numero};
    CLIENTES_DEMO.push(c);
    document.getElementById('clientes-lista').insertAdjacentHTML('beforeend', renderClienteRow(c));
    showToast(`✅ Cliente "${nombre} ${apellido}" agregado`);
  }

  cerrarModalCliente();
}

/* ── PROVEEDORES ──────────────────────────────────────────── */

function abrirModalProveedor(){
  _proveedorEditando = null;
  document.getElementById('prov-modal-title').textContent = '🏭 Nuevo Proveedor';
  document.getElementById('prov-nombre').value = '';
  document.getElementById('prov-ciudad').value = '';
  document.getElementById('prov-numero').value = '';
  document.getElementById('modal-proveedor').classList.add('open');
}
function cerrarModalProveedor(){
  document.getElementById('modal-proveedor').classList.remove('open');
}

function editarProveedor(id){
  const p = PROVEEDORES_DEMO.find(x => x.id === id);
  if(!p) return;
  _proveedorEditando = id;
  document.getElementById('prov-modal-title').textContent = '✏️ Editar Proveedor';
  document.getElementById('prov-nombre').value = p.nombre;
  document.getElementById('prov-ciudad').value = p.ciudad;
  document.getElementById('prov-numero').value = p.numero || '';
  document.getElementById('modal-proveedor').classList.add('open');
}

function eliminarProveedor(id){
  confirmarAccion('¿Eliminar este proveedor? Esta acción no se puede deshacer.', () => {
    const idx = PROVEEDORES_DEMO.findIndex(x => x.id === id);
    if(idx >= 0) PROVEEDORES_DEMO.splice(idx,1);
    document.getElementById(id).remove();
    showToast('🗑️ Proveedor eliminado', 'info');
  });
}


function guardarProveedor(){
  const nombre = document.getElementById('prov-nombre').value.trim();
  const ciudad = document.getElementById('prov-ciudad').value.trim();
  const numero = document.getElementById('prov-numero').value.trim();

  if(!nombre){
    showToast('⚠️ Falta el nombre de la empresa', 'error');
    return;
  }

  if(_proveedorEditando){
    const p = PROVEEDORES_DEMO.find(x => x.id === _proveedorEditando);
    Object.assign(p, {nombre, ciudad, numero});
    document.getElementById(_proveedorEditando).outerHTML = renderProveedorRow(p);
    showToast(`✅ Proveedor "${nombre}" actualizado`);
  } else {
    const id = 'prov-' + (++_proveedorSeq);
    const p = {id, nombre, ciudad, numero};
    PROVEEDORES_DEMO.push(p);
    document.getElementById('proveedores-lista').insertAdjacentHTML('beforeend', renderProveedorRow(p));
    showToast(`✅ Proveedor "${nombre}" agregado`);
  }

  cerrarModalProveedor();
}
/* ============================================================
   AUTOCOMPLETADO CLIENTE EN VENTAS
   ============================================================ */

function buscarClienteVenta(query){
  const list = document.getElementById('v-cliente-ac');
  const hint = document.getElementById('v-cliente-hint');
  hint.textContent = '';
  hint.style.color = '';

  if(!query.trim()){
    list.classList.remove('open');
    list.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
 const resultados = CLIENTES.filter(c =>
    (`${c.nombre} ${c.apellido && c.apellido !== 'null' ? c.apellido : ''}`).toLowerCase().includes(q)
  );

  let html = '';

  resultados.forEach(c => {
    html += `
      <div class="autocomplete-item" onclick="seleccionarClienteVenta('${c.nombre}${c.apellido && c.apellido !== 'null' ? ' ' + c.apellido : ''}')">
        👤 ${c.nombre}${c.apellido && c.apellido !== 'null' ? ' ' + c.apellido : ''} <span class="ac-stock">${c.ciudad}</span>
      </div>
    `;
  });

  // Opción siempre disponible: cliente esporádico
  html += `
    <div class="autocomplete-item" style="color:var(--gris-60);" onclick="seleccionarClienteVenta('Sin definir')">
      🕓 Sin definir / Cliente esporádico
    </div>
  `;

  if(!resultados.length){
    html = `<div class="autocomplete-item" style="color:var(--rojo);">
      ⚠️ Cliente no existe — <strong>regístralo en Contactos</strong>
    </div>` + html;
  }

  list.innerHTML = html;
  list.classList.add('open');

  // Validar al escribir: si no coincide exacto con ninguno y no es "Sin definir"
  const coincideExacto = CLIENTES.some(c => `${c.nombre} ${c.apellido || ''}`.toLowerCase() === q);
  if(!coincideExacto && q !== 'sin definir'){
    hint.textContent = '⚠️ Cliente no existe — puedes registrarlo en Contactos o usar "Sin definir"';
    hint.style.color = 'var(--rojo)';
  }
}

function seleccionarClienteVenta(nombre){
  document.getElementById('v-cliente').value = nombre;
  document.getElementById('v-cliente-ac').classList.remove('open');

  const hint = document.getElementById('v-cliente-hint');
  if(nombre === 'Sin definir'){
    hint.textContent = '🕓 Cliente esporádico (no se guarda en Contactos)';
    hint.style.color = 'var(--gris-60)';
  } else {
    hint.textContent = '✅ Cliente registrado';
    hint.style.color = 'var(--verde)';
  }
}
/* ============================================================
   AUTOCOMPLETADO PROVEEDOR EN COMPRAS
   ============================================================ */

function buscarProveedorCompra(query){
  const list = document.getElementById('co-proveedor-ac');
  const hint = document.getElementById('co-proveedor-hint');
  hint.textContent = '';
  hint.style.color = '';

  if(!query.trim()){
    list.classList.remove('open');
    list.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
  const resultados = PROVEEDORES.filter(p =>
    p.nombre.toLowerCase().includes(q)
  );

  let html = '';
  resultados.forEach(p => {
    html += `
      <div class="autocomplete-item" onclick="seleccionarProveedorCompra('${p.nombre}')">
        🏭 ${p.nombre} <span class="ac-stock">${p.ciudad || ''}</span>
      </div>
    `;
  });

  if(!resultados.length){
    html = `<div class="autocomplete-item" style="color:var(--rojo);">
      ⚠️ Proveedor no existe — <strong>regístralo en Contactos</strong>
    </div>`;
  }

  list.innerHTML = html;
  list.classList.add('open');

  const coincideExacto = PROVEEDORES.some(p => p.nombre.toLowerCase() === q);
  if(!coincideExacto){
    hint.textContent = '⚠️ Proveedor no existe — regístralo en Contactos';
    hint.style.color = 'var(--rojo)';
  }
}

function seleccionarProveedorCompra(nombre){
  document.getElementById('co-proveedor').value = nombre;
  document.getElementById('co-proveedor-ac').classList.remove('open');
  document.getElementById('co-proveedor-hint').textContent = '✅ Proveedor registrado';
  document.getElementById('co-proveedor-hint').style.color = 'var(--verde)';
}

/* ============================================================
   COTIZACIONES
   ============================================================ */

const MESES_NOMBRE = ['', 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

let _cotizItems = [];
let _cotizItemSeq = 0;
let _cotizEditando = null;

function abrirModalCotizacion(){
  document.getElementById('modal-cotizacion').classList.add('open');
  resetFormCotiz();
}
function cerrarModalCotizacion(){
  document.getElementById('modal-cotizacion').classList.remove('open');
}

function resetFormCotiz(){
  _cotizEditando = null;
  document.getElementById('cot-modal-title').textContent = '📋 Nueva Cotización';
  document.getElementById('cot-proveedor').value = '';
  document.getElementById('cot-proveedor-hint').textContent = '';
  document.getElementById('cot-mes-objetivo').value = String(new Date().getMonth()+1);
  document.getElementById('cot-anio-objetivo').value = String(new Date().getFullYear());
  _cotizItems = [];
  _cotizItemSeq = 0;
  agregarItemCotiz();
}

/* ── Autocompletado proveedor (cotización) ──────────────────── */
function buscarProveedorCotiz(query){
  const list = document.getElementById('cot-proveedor-ac');
  const hint = document.getElementById('cot-proveedor-hint');
  hint.textContent = '';

  if(!query.trim()){ list.classList.remove('open'); list.innerHTML=''; return; }

  const q = query.toLowerCase();
  const resultados = PROVEEDORES.filter(p => p.nombre.toLowerCase().includes(q));

  if(!resultados.length){
    list.innerHTML = `<div class="autocomplete-item" style="color:var(--rojo);">⚠️ Proveedor no existe — regístralo en Contactos</div>`;
  } else {
    list.innerHTML = resultados.map(p => `
      <div class="autocomplete-item" onclick="seleccionarProveedorCotiz('${p.nombre}')">
        🏭 ${p.nombre} <span class="ac-stock">${p.ciudad || ''}</span>
      </div>
    `).join('');
  }
  list.classList.add('open');

  const coincide = PROVEEDORES.some(p => p.nombre.toLowerCase() === q);
  if(!coincide){
    hint.textContent = '⚠️ Proveedor no existe — regístralo en Contactos';
    hint.style.color = 'var(--rojo)';
  }
}

function buscarClienteSim(query){
  const list = document.getElementById('sim-cliente-ac');
  if(!list) return;
  if(!query.trim()){ list.classList.remove('open'); list.innerHTML=''; return; }

  const q = query.toLowerCase();
  const resultados = CLIENTES.filter(c =>
    (`${c.nombre} ${c.apellido || ''}`).toLowerCase().includes(q)
  );

  let html = resultados.map(c => `
    <div class="autocomplete-item" onclick="seleccionarClienteSim('${c.nombre} ${c.apellido || ''}')">
      👤 ${c.nombre} ${c.apellido || ''} <span class="ac-stock">${c.ciudad || ''}</span>
    </div>
  `).join('');

  html += `<div class="autocomplete-item" style="color:var(--gris-60);" onclick="seleccionarClienteSim('Sin definir')">
    🕓 Sin definir / Cliente esporádico
  </div>`;

  list.innerHTML = html;
  list.classList.add('open');
}

function seleccionarClienteSim(nombre){
  document.getElementById('sim-cliente').value = nombre;
  const list = document.getElementById('sim-cliente-ac');
  if(list) list.classList.remove('open');
}
function seleccionarProveedorCotiz(nombre){
  document.getElementById('cot-proveedor').value = nombre;
  document.getElementById('cot-proveedor-ac').classList.remove('open');
  document.getElementById('cot-proveedor-hint').textContent = '✅ Proveedor registrado';
  document.getElementById('cot-proveedor-hint').style.color = 'var(--verde)';
}

/* ── Items de cotización (igual patrón que compras) ─────────── */
function agregarItemCotiz(){
  const id = 'cot-item-' + (++_cotizItemSeq);
  _cotizItems.push({ id, ref:'', nombre:'', costo:0, cantidad:1, icon:'📦' });
  renderItemsCotiz();
}
function eliminarItemCotiz(id){
  _cotizItems = _cotizItems.filter(it => it.id !== id);
  if(_cotizItems.length === 0) agregarItemCotiz();
  else renderItemsCotiz();
}
function renderItemsCotiz(){
  const cont = document.getElementById('cot-items-list');
  cont.innerHTML = _cotizItems.map(it => `
    <div data-id="${it.id}" style="background:var(--gris-10);border-radius:10px;padding:10px;margin-bottom:8px;">
      <div class="autocomplete-wrap" style="margin-bottom:6px;">
        <label class="form-label" style="margin-bottom:3px;">Producto</label>
        <input class="form-input" placeholder="Buscar nombre o ref..." value="${it.nombre}"
               oninput="buscarProductoCotiz('${it.id}', this.value)" autocomplete="off">
        <div class="autocomplete-list" id="cot-ac-${it.id}"></div>
        ${it.ref ? `<span class="form-hint" style="display:flex;align-items:center;gap:6px;margin-top:3px;">
          ${it.foto_url ? `<img src="${it.foto_url}" style="width:20px;height:20px;border-radius:4px;object-fit:cover;">` : it.icon}
          ${it.nombre}
        </span>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:6px;align-items:end;">
        <div><div class="form-label">Cant.</div><input class="form-input" type="number" min="1" value="${it.cantidad}" oninput="cambiarCantidadCotiz('${it.id}', this.value)"></div>
        <div><div class="form-label">Costo</div><input class="form-input" type="text" value="${it.costo ? it.costo.toLocaleString('es-CO') : ''}" placeholder="0" oninput="cambiarCostoCotiz('${it.id}', this.value)"></div>
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.costo * it.cantidad)}" style="background:#fff;color:var(--gris-60);"></div>
        <button type="button" class="multi-item-remove" onclick="eliminarItemCotiz('${it.id}')">✕</button>
      </div>
    </div>
  `).join('');
  calcTotalCotiz();
}
function buscarProductoCotiz(id, query){
  const list = document.getElementById('cot-ac-' + id);
  if(!query.trim()){ list.classList.remove('open'); list.innerHTML=''; return; }
  const q = query.toLowerCase();
  const resultados = PRODUCTOS.filter(p => 
    p.nombre.toLowerCase().includes(q) || p.referencia.toLowerCase().includes(q)
  );
  if(!resultados.length){
    list.innerHTML = '<div class="autocomplete-item" style="color:var(--gris-60);">Sin resultados</div>';
  } else {
    list.innerHTML = resultados.map(p => `
    <div class="autocomplete-item" onclick="seleccionarProductoCotiz('${id}','${p.id}')" style="display:flex;align-items:center;gap:8px;">
      ${p.foto_url
        ? `<img src="${p.foto_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0;">`
        : `<span style="flex-shrink:0;">${p.icono || '📦'}</span>`}
      <span>${p.nombre} <span class="ac-ref">${p.referencia}</span></span>
    </div>
  `).join('');
  }
  list.classList.add('open');
}
function seleccionarProductoCotiz(id, productoId){
  const p = PRODUCTOS.find(x => x.id === productoId);
  if(!p) return;
  const item = _cotizItems.find(it => it.id === id);
  item.ref = p.id;
  item.nombre = p.nombre;
  item.icon = p.icono || '📦';
  item.foto_url = p.foto_url || null;
  item.costo = p.costo;
  renderItemsCotiz();
}
function cambiarCantidadCotiz(id, valor){
  const item = _cotizItems.find(it => it.id === id);
  item.cantidad = Math.max(1, parseInt(valor) || 1);
 const row = document.querySelector(`#cot-items-list [data-id="${id}"]`);
  row.querySelectorAll('input[readonly]')[0].value = formatCOP(item.costo * item.cantidad);
  calcTotalCotiz();
}
function cambiarCostoCotiz(id, valor){
  const item = _cotizItems.find(it => it.id === id);
  item.costo = rawNum({value: valor});
  const row = document.querySelector(`#cot-items-list [data-id="${id}"]`);
  row.querySelectorAll('input[readonly]')[0].value = formatCOP(item.costo * item.cantidad);
  calcTotalCotiz();
}
function calcTotalCotiz(){
  const total = _cotizItems.reduce((acc,it) => acc + (it.costo * it.cantidad), 0);
  document.getElementById('cot-total-general').textContent = formatCOP(total);
}

/* ── Editar / Eliminar tarjetas de cotización ───────────────── */
function editarCotizacion(btn){
  const grupo = btn.closest('.venta-grupo');
  _cotizEditando = grupo;

  const proveedor = grupo.dataset.proveedor;
  const mes = grupo.dataset.mes;
  const anio = grupo.dataset.anio;
  const itemsData = JSON.parse(grupo.querySelector('.venta-detalle-data').dataset.items);

  document.getElementById('modal-cotizacion').classList.add('open');
  document.getElementById('cot-modal-title').textContent = '✏️ Editar Cotización';
  document.getElementById('cot-proveedor').value = proveedor;
  document.getElementById('cot-proveedor-hint').textContent = '✅ Proveedor registrado';
  document.getElementById('cot-proveedor-hint').style.color = 'var(--verde)';
  document.getElementById('cot-mes-objetivo').value = mes;
  document.getElementById('cot-anio-objetivo').value = anio;

  _cotizItems = [];
  _cotizItemSeq = 0;
  itemsData.forEach(it=>{
    const id = 'cot-item-' + (++_cotizItemSeq);
    _cotizItems.push({ id, ref: it.ref, nombre: it.nombre, costo: it.costo, cantidad: it.cantidad, icon: it.icon });
  });
  renderItemsCotiz();
}

function eliminarCotizacion(btn){
  confirmarAccion('¿Eliminar esta cotización? Esta acción no se puede deshacer.', () => {
    btn.closest('.venta-grupo').remove();
    showToast('🗑️ Cotización eliminada', 'info');
  });
}

/** Checkbox: marcar/desmarcar como comprado */
function toggleCotizComprado(checkbox){
  const row = checkbox.closest('.cotiz-row');
  row.classList.toggle('comprado', checkbox.checked);
  showToast(checkbox.checked ? '✅ Marcado como comprado' : '↩️ Marcado como pendiente', checkbox.checked ? 'success' : 'info');
}

/* ── Guardar (crear o actualizar) ────────────────────────────── */
function guardarCotizacion(){
  const proveedor = document.getElementById('cot-proveedor');
  const mes = document.getElementById('cot-mes-objetivo').value;
  const anio = document.getElementById('cot-anio-objetivo').value;

  if(!proveedor.value.trim()){
    showToast('⚠️ Falta el proveedor', 'error');
    proveedor.focus();
    return;
  }

  const itemsValidos = _cotizItems.filter(it => it.ref);
  if(!itemsValidos.length){
    showToast('⚠️ Agrega al menos un producto', 'error');
    return;
  }
  for(const it of itemsValidos){
    if(it.costo <= 0){
      showToast(`⚠️ Falta el costo de "${it.nombre}"`, 'error');
      return;
    }
  }

  const total = itemsValidos.reduce((acc,it) => acc + (it.costo * it.cantidad), 0);
  const itemsJson = JSON.stringify(itemsValidos.map(it => ({ref:it.ref, nombre:it.nombre, costo:it.costo, cantidad:it.cantidad, icon:it.icon})));

  const detalleHtml = itemsValidos.map(it => `
    <div class="venta-item-row">
      <div class="venta-item-thumb">${it.icon}</div>
      <div class="venta-item-info">${it.nombre} x${it.cantidad}</div>
      <div class="venta-item-total">${formatCOP(it.costo * it.cantidad)}</div>
    </div>
  `).join('');

  const etiqueta = itemsValidos.length > 1 ? `🟣 ${itemsValidos.length} productos` : '🔹 1 producto';
  const mesLabel = `📅 ${MESES_NOMBRE[parseInt(mes)]} ${anio}`;

  const html = `
    <div class="venta-grupo cotiz-row" data-proveedor="${proveedor.value.trim()}" data-mes="${mes}" data-anio="${anio}">
      <div class="venta-grupo-head multi" onclick="toggleVentaDetalle(this)">
        <div class="venta-cliente">
          <span class="venta-badge-items">${etiqueta}</span>
          <div class="venta-cliente-nombre">${proveedor.value.trim()}</div>
        </div>
        <div class="venta-grupo-meta">
          <span class="cotiz-mes-badge">${mesLabel}</span>
          <span class="venta-grupo-total">${formatCOP(total)}</span>
          <input type="checkbox" class="cotiz-check" title="Marcar como comprado" onchange="toggleCotizComprado(this)">
          <button class="btn-icon" onclick="editarCotizacion(this)">✏️</button>
          <button class="btn-icon" onclick="eliminarCotizacion(this)">🗑️</button>
          <span class="venta-chev">▼</span>
        </div>
      </div>
      <div class="venta-detalle collapsed">${detalleHtml}</div>
      <div class="venta-detalle-data" style="display:none;" data-items='${itemsJson}'></div>
    </div>
  `;

  if(_cotizEditando){
    _cotizEditando.outerHTML = html;
    showToast(`✅ Cotización de ${proveedor.value.trim()} actualizada`);
  } else {
    document.getElementById('cotizaciones-lista').insertAdjacentHTML('beforeend', html);
    showToast(`✅ Cotización de ${proveedor.value.trim()} guardada — ${formatCOP(total)}`);
  }

  cerrarModalCotizacion();
}

/* ── Filtro mes/año ───────────────────────────────────────────── */
function filtrarCotizaciones(){
  const mes = document.getElementById('cot-mes').value;
  const anio = document.getElementById('cot-anio').value;

  document.querySelectorAll('#cotizaciones-lista .cotiz-row').forEach(row=>{
    const rMes = row.dataset.mes;
    const rAnio = row.dataset.anio;
    const matchMes = !mes || rMes === mes;
    const matchAnio = !anio || rAnio === anio;
    row.style.display = (matchMes && matchAnio) ? '' : 'none';
  });
}

/* ============================================================
   DASHBOARD: Meta de Ventas
   ============================================================ */

let _ventasActuales = 1420000; // demo: vendría del total real de Ventas
let _metaVentas = 2000000;

function abrirModalMeta(){
  document.getElementById('meta-input').value = _metaVentas.toLocaleString('es-CO');
  document.getElementById('modal-meta').classList.add('open');
}
function cerrarModalMeta(){
  document.getElementById('modal-meta').classList.remove('open');
}

async function guardarMeta(){
  const nuevaMeta = rawNum(document.getElementById('meta-input'));
  if(nuevaMeta <= 0){
    showToast('⚠️ Ingresa una meta válida', 'error');
    return;
  }
  _metaVentas = nuevaMeta;

  await sb.from('configuracion').update({ meta_ventas_mes: nuevaMeta }).eq('id', 1);

  actualizarBarraMeta();
  showToast(`✅ Meta actualizada: ${formatCOP(_metaVentas)}`);
  cerrarModalMeta();
}
/** Recalcula la barra de progreso y el mensaje según % alcanzado */
function actualizarBarraMeta(){
  const pct = Math.min((_ventasActuales / _metaVentas) * 100, 999);
  const fill = document.getElementById('meta-fill');
  const pctLabel = document.getElementById('meta-pct');
  const msg = document.getElementById('meta-msg');

  fill.className = 'meta-progress-fill';
  msg.className = 'meta-msg';

  const pctDisplay = Math.min(pct, 100);
  fill.style.width = '0%';
  pctLabel.textContent = Math.round(pct) + '%';
  requestAnimationFrame(()=>{
    setTimeout(()=>{ fill.style.width = pctDisplay + '%'; }, 100);
  });

 if(pct < 40){
    fill.classList.add('lejos');
    msg.classList.add('lejos');
    msg.textContent = 'Estamos un poco lejos... sigamos! 💸';
  } else if(pct < 80){
    msg.classList.add('medio');
    msg.textContent = '¡Vamos a mitad de camino! 💪';
  } else if(pct < 100){
    msg.classList.add('medio');
    msg.textContent = '¡Ya casi llegamos a la meta! 🔥';
  } else if(pct >= 100 && pct < 101){
    fill.classList.add('alcanzada');
    msg.classList.add('alcanzada');
    msg.textContent = '¡Meta alcanzada! 🎉';
    lanzarConfeti();
  } else {
    fill.classList.add('superada');
    msg.classList.add('superada');
    msg.textContent = `¡Meta superada! 🚀 (+${Math.round(pct-100)}%)`;
    lanzarConfeti();
  }

  document.getElementById('meta-actual').textContent = formatCOP(_ventasActuales);
  document.getElementById('meta-objetivo').textContent = `Meta: ${formatCOP(_metaVentas)}`;
}
/** Lanza confeti animado sobre la barra de meta */
function lanzarConfeti(){
  const container = document.getElementById('confetti-container');
  const emojis = ['🎉','🎊','✨','🌟','💖','🥳'];
  container.innerHTML = '';
  for(let i = 0; i < 20; i++){
    const span = document.createElement('span');
    span.className = 'confetti';
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    span.style.left = Math.random()*100 + '%';
    span.style.animationDelay = (Math.random()*0.5) + 's';
    span.style.fontSize = (14 + Math.random()*14) + 'px';
    container.appendChild(span);
  }
  setTimeout(()=>{ container.innerHTML = ''; }, 2000);
}

/** Resalta la barra del mes seleccionado en el gráfico */
function resaltarMesGrafico(){
  const mesSeleccionado = document.getElementById('dash-mes-general').value;

  document.querySelectorAll('.bar-chart-col').forEach(col=>{
    const bar = col.querySelector('.bar-chart-bar');
    if(mesSeleccionado === ''){
      bar.classList.toggle('actual', col.dataset.mes === '5');
    } else {
      bar.classList.toggle('actual', col.dataset.mes === mesSeleccionado);
    }
  });

  // TODO (backend): cuando haya datos reales, aquí se recalculan
  // KPIs, top productos, top clientes, top días según mesSeleccionado
}

/* ============================================================
   CIERRE DE MES (visual, lógica real va con backend)
   ============================================================ */

async function abrirModalCerrarMes(){
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  const [ventasRes, comprasRes, gastosRes] = await Promise.all([
    sb.from('ventas').select('total').eq('mes', mes).eq('anio', anio),
    sb.from('compras').select('total, tipo, es_abono').eq('mes', mes).eq('anio', anio),
    sb.from('gastos').select('valor').eq('mes', mes).eq('anio', anio)
  ]);

  const totalVentas = (ventasRes.data || []).reduce((acc, v) => acc + v.total, 0);
  const totalCompras = (comprasRes.data || []).filter(c => c.tipo === 'contado' || c.es_abono).reduce((acc, c) => acc + c.total, 0);
  const totalGastos = (gastosRes.data || []).reduce((acc, g) => acc + g.valor, 0);
  const utilidad = totalVentas - totalCompras - totalGastos;

  document.getElementById('cerrar-mes-titulo').textContent = `🔒 Cerrar Mes — ${MESES_NOMBRE[mes]} ${anio}`;
  document.getElementById('cerrar-mes-ventas').textContent = formatCOP(totalVentas);
  document.getElementById('cerrar-mes-compras').textContent = formatCOP(totalCompras);
  document.getElementById('cerrar-mes-gastos').textContent = formatCOP(totalGastos);
  document.getElementById('cerrar-mes-utilidad').textContent = formatCOP(utilidad);
  document.getElementById('cerrar-mes-utilidad').style.color = utilidad >= 0 ? 'var(--verde)' : 'var(--rojo)';

  document.getElementById('modal-cerrar-mes').classList.add('open');
}
function cerrarModalCerrarMes(){
  document.getElementById('modal-cerrar-mes').classList.remove('open');
}

/* ============================================================
   SALDO INICIAL (configuración única)
   ============================================================ */

function abrirModalSaldoInicial(){
  document.getElementById('modal-saldo-inicial').classList.add('open');
}

function guardarSaldoInicial(){
  const efectivo = parseInt(document.getElementById('si-total-efectivo').textContent.replace(/[^\d]/g,'')) || 0;
  const nequi = rawNum(document.getElementById('si-nequi'));
  const bancolombia = rawNum(document.getElementById('si-bancolombia'));

  showToast(`✅ Saldos iniciales guardados: Efectivo ${formatCOP(efectivo)}, Nequi ${formatCOP(nequi)}, Bancolombia ${formatCOP(bancolombia)}`, 'success');
  document.getElementById('modal-saldo-inicial').classList.remove('open');
}

// Para probar el modal manualmente en demo, puedes llamar abrirModalSaldoInicial() desde la consola.
// Cuando haya backend, se mostrará automáticamente solo la primera vez.

/* ============================================================
   CUADRE DE CAJA: calcula diferencia entre contado y esperado
   ============================================================ */

let _efectivoEsperado = 0;// demo: vendría de saldo_inicial + ventas - gastos - compras (efectivo)

function recalcCuadreCaja(){
  const totalContado = parseInt(document.getElementById('total-efectivo').textContent.replace(/[^\d]/g,'')) || 0;
  const diferencia = totalContado - _efectivoEsperado;

  const alert = document.querySelector('.cuadre-alert');
  const icon = alert.querySelector('.cuadre-icon');
  const title = alert.querySelector('.cuadre-title');
  const sub = alert.querySelector('.cuadre-sub');

  alert.classList.remove('sobra','falta');
  sub.textContent = '';

  if(Math.abs(diferencia) === 0){
    icon.textContent = '✅';
    title.textContent = '¡CAJA CUADRADA!';
  } else if(diferencia > 0){
    alert.classList.add('sobra');
    icon.textContent = '⚠️';
    title.textContent = `Sobran ${formatCOP(diferencia)}`;
  } else {
    alert.classList.add('falta');
    icon.textContent = '❌';
    title.textContent = `Faltan ${formatCOP(Math.abs(diferencia))}`;
  }
}
/* ============================================================
   INVENTARIO - CONEXIÓN SUPABASE
   ============================================================ */

let PRODUCTOS = []; // cache local de productos cargados desde Supabase

/** Carga todos los productos desde Supabase y los guarda en PRODUCTOS */
async function cargarProductos(){
  const { data, error } = await sb.from('productos').select('*').eq('origen', 'propio').order('referencia');
  if(error){
    showToast('❌ Error cargando productos: ' + error.message, 'error');
    return;
  }
  PRODUCTOS = data;
  renderInventario();
}

/** Genera la siguiente referencia disponible (ATS-001, ATS-002...) */
function siguienteReferencia(){
  if(PRODUCTOS.length === 0) return 'ATS-001';
  const nums = PRODUCTOS.map(p => parseInt(p.referencia.replace('ATS-','')) || 0);
  const max = Math.max(...nums);
  return 'ATS-' + String(max + 1).padStart(3, '0');
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos(); // primero siempre
  const { data: config } = await sb.from('configuracion').select('*').eq('id', 1).single();
  if(config && config.meta_ventas_mes) _metaVentas = config.meta_ventas_mes;
  await cargarClientes();
  await cargarProveedores();
  await cargarSimulaciones();
  await cargarCotizaciones();
  await cargarVentas();
  await cargarCompras();
  await cargarGastos();
  await cargarPendientes();
  await cargarCaja();
  await cargarContraEntregas();
   await cargarDashboard();
   actualizarBotonCerrarMes();
   await cargarContraEntregas();
   await cargarEnvios();
   // Mostrar fecha actual en dashboard
  const hoy = new Date();
  const diasSemana = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const fechaEl = document.getElementById('dash-fecha-hoy');
  if(fechaEl) fechaEl.textContent = `${diasSemana[hoy.getDay()]} ${hoy.getDate()} de ${MESES_NOMBRE[hoy.getMonth()+1]} ${hoy.getFullYear()}`;
});
/** Calcula el % de margen de un producto */
function calcularMargenPct(costo, precio){
  if(costo <= 0) return 0;
  return ((precio - costo) / costo * 100);
}

function claseMargen(pct){
  if(pct < 20) return 'pct-baja';
  if(pct < 40) return 'pct-media';
  return 'pct-alta';
}

function claseStock(stock){
  if(stock === 0) return 'badge-rojo';
  if(stock <= 3) return 'badge-amarillo';
  return 'badge-verde';
}

/** Dibuja la vista "Por Referencia" (tabla + cards móvil) y "Agrupado" */
function renderInventario(){
  // KPIs
  let valorInventario = 0, margenSum = 0, sinStock = 0;
  PRODUCTOS.forEach(p=>{
    valorInventario += p.costo * p.stock;
    margenSum += calcularMargenPct(p.costo, p.precio);
    if(p.stock === 0) sinStock++;
  });
  const margenProm = PRODUCTOS.length ? (margenSum / PRODUCTOS.length) : 0;

  document.getElementById('kpi-valor-inventario').textContent = formatCOP(valorInventario);
  document.getElementById('kpi-margen-promedio').textContent = margenProm.toFixed(1) + '%';
  document.getElementById('kpi-referencias').textContent = PRODUCTOS.length;
  document.getElementById('kpi-sin-stock').textContent = sinStock;

  // VISTA POR REFERENCIA - tabla desktop
  const tbody = document.getElementById('inv-tbody');
  const mobileCont = document.getElementById('inv-mobile-cards');

  if(PRODUCTOS.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gris-60);padding:30px;">Aún no has agregado productos. Click en "＋ Nuevo Producto" para empezar.</td></tr>`;
    mobileCont.innerHTML = `<div style="text-align:center;color:var(--gris-60);padding:30px;font-size:13px;">Aún no has agregado productos.</div>`;
  } else {
    tbody.innerHTML = PRODUCTOS.map(p=>{
      const pct = calcularMargenPct(p.costo, p.precio);
      const thumb = p.foto_url
        ? `<img src="${p.foto_url}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;">`
        : `<div class="prod-thumb">${p.icono || '📦'}</div>`;
      return `
        <tr>
          <td>
            <div class="prod-cell">
              ${thumb}
              <div><div class="prod-name">${p.nombre}</div><span class="prod-ref">${p.referencia}</span></div>
            </div>
          </td>
        <td style="text-align:center;"><span class="badge ${claseStock(p.stock)}" style="font-size:13px;font-weight:900;padding:4px 12px;">${p.stock}</span></td>
          <td style="text-align:right;">${formatCOP(p.costo)}</td>
          <td style="text-align:right;font-weight:700;">${formatCOP(p.precio)}</td>
          <td style="text-align:center;" class="${claseMargen(pct)}">${pct.toFixed(1)}%</td>
          <td style="text-align:center;"><button class="btn-icon" onclick="editarProducto('${p.id}')" title="Editar">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
</button>
<button class="btn-icon" onclick="eliminarProducto('${p.id}')" title="Eliminar" style="color:var(--rojo);">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
</button>
        </tr>
      `;
    }).join('');

    mobileCont.innerHTML = PRODUCTOS.map(p=>{
      const pct = calcularMargenPct(p.costo, p.precio);
      const thumb = p.foto_url
        ? `<img src="${p.foto_url}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;">`
        : `<div style="width:52px;height:52px;border-radius:10px;background:var(--gris-10);display:flex;align-items:center;justify-content:center;font-size:22px;border:1px solid var(--gris-20);">${p.icono || '📦'}</div>`;
      return `
        <div style="padding:10px 12px;border-bottom:1px solid var(--gris-20);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            ${thumb}
            <div style="flex:1;text-align:center;">
              <div style="font-weight:800;font-size:13px;">${p.nombre}</div>
              <span style="font-size:9px;font-family:monospace;background:var(--gris-20);padding:1px 5px;border-radius:4px;">${p.referencia}</span>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">
              <button class="btn-icon" onclick="editarProducto('${p.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon" onclick="eliminarProducto('${p.id}')" style="color:var(--rojo);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:52px 1fr 1fr 1fr;gap:4px;text-align:center;font-size:10px;">
            <div>
              <div style="color:var(--gris-60);">Stock</div>
              <div><span class="badge ${claseStock(p.stock)}" style="font-size:10px;padding:1px 6px;">${p.stock}</span></div>
            </div>
            <div>
              <div style="color:var(--gris-60);">Costo</div>
              <div style="font-weight:800;font-size:12px;">${formatCOP(p.costo)}</div>
            </div>
            <div>
              <div style="color:var(--gris-60);">Precio</div>
              <div style="font-weight:800;font-size:12px;">${formatCOP(p.precio)}</div>
            </div>
            <div>
              <div style="color:var(--gris-60);">Margen</div>
              <div style="font-weight:800;font-size:12px;" class="${claseMargen(pct)}">${pct.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // VISTA AGRUPADA - por primera palabra del nombre
  const grpCont = document.getElementById('inv-grp-cont');
  if(PRODUCTOS.length === 0){
    grpCont.innerHTML = `<div class="section-box" style="padding:30px;text-align:center;color:var(--gris-60);">Aún no has agregado productos.</div>`;
  } else {
    const grupos = {};
    PRODUCTOS.forEach(p=>{
      const key = p.nombre.split(' ')[0];
      if(!grupos[key]) grupos[key] = [];
      grupos[key].push(p);
    });

    grpCont.innerHTML = Object.entries(grupos).map(([key, productos])=>{
      const icono = productos[0].icono || '📦';
      return `
        <div class="section-box">
          <div class="grp-header" onclick="toggleGrupo(this)">
            <div class="grp-title">${icono} ${key} — ${productos.length} producto${productos.length>1?'s':''}</div>
            <span class="grp-chev">▼</span>
          </div>
          <div class="grp-body">
            <table>
              <tbody>
                ${productos.map(p=>`
                  <tr>
                    <td><strong>${p.nombre}</strong> <span class="prod-ref">${p.referencia}</span></td>
                    <td style="text-align:center;">Stock: ${p.stock}</td>
                    <td style="text-align:right;">${formatCOP(p.precio)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  }
}

/* ============================================================
   MODAL PRODUCTO: crear / editar
   ============================================================ */

let _productoEditando = null; // id del producto si se está editando, null si es nuevo
let _fotoFile = null; // archivo de foto seleccionado (pendiente de subir)

function abrirModalProducto(){
  _productoEditando = null;
  _fotoFile = null;
  document.getElementById('modal-prod-title').textContent = '➕ Nuevo Producto';
  document.getElementById('p-referencia').value = siguienteReferencia();
  document.getElementById('p-nombre').value = '';
  document.getElementById('p-costo').value = '';
  document.getElementById('p-precio').value = '';
  document.getElementById('p-stock').value = '0';
  document.getElementById('margen-box').style.display = 'none';
  resetFotoArea();
  document.getElementById('modal-prod').classList.add('open');
}

function cerrarModalProducto(){
  document.getElementById('modal-prod').classList.remove('open');
}

function resetFotoArea(){
  document.getElementById('foto-area').innerHTML = `
    <label class="photo-drop" for="foto-input">📷 Click para subir foto</label>
    <input type="file" id="foto-input" accept="image/*" style="display:none;" onchange="previewFoto(event)">
  `;
}

/** Preview de foto: guarda el archivo para subir luego, y muestra preview */
function previewFoto(event){
  const file = event.target.files[0];
  if(!file) return;
  _fotoFile = file;

  const reader = new FileReader();
  reader.onload = function(ev){
    const area = document.getElementById('foto-area');
    area.innerHTML = `
      <img src="${ev.target.result}" class="photo-preview">
      <div style="text-align:center;font-size:11px;color:var(--gris-60);margin-bottom:6px;">${file.name}</div>
      <button type="button" class="btn btn-secondary" style="width:100%;font-size:11px;" onclick="document.getElementById('foto-input').click()">Cambiar foto</button>
      <input type="file" id="foto-input" accept="image/*" style="display:none;" onchange="previewFoto(event)">
    `;
  };
  reader.readAsDataURL(file);
}

/** Calcula margen en vivo (sin cambios respecto a antes) */
function calcMargen(){
  const costo  = rawNum(document.getElementById('p-costo'));
  const precio = rawNum(document.getElementById('p-precio'));
  const box = document.getElementById('margen-box');

  if(costo <= 0 || precio <= 0){
    box.style.display = 'none';
    return;
  }

  const ganancia = precio - costo;
  const pct = (ganancia / costo * 100);

  box.style.display = 'block';
  const pctEl = document.getElementById('m-pct');
  pctEl.textContent = pct.toFixed(1) + '%';
  pctEl.style.color = pct < 20 ? 'var(--rojo)' : pct < 40 ? 'var(--amarillo)' : 'var(--verde)';
  document.getElementById('m-gan').textContent = formatCOP(ganancia);
}

/** Abre el modal precargado con los datos de un producto existente */
function editarProducto(id){
  const p = PRODUCTOS.find(x => x.id === id);
  if(!p) return;

  _productoEditando = id;
  _fotoFile = null;
  document.getElementById('modal-prod-title').textContent = '✏️ Editar Producto';
  document.getElementById('p-referencia').value = p.referencia;
  document.getElementById('p-nombre').value = p.nombre;
  document.getElementById('p-costo').value = p.costo.toLocaleString('es-CO');
  document.getElementById('p-precio').value = p.precio.toLocaleString('es-CO');
  document.getElementById('p-stock').value = p.stock;
  calcMargen();

  if(p.foto_url){
    document.getElementById('foto-area').innerHTML = `
      <img src="${p.foto_url}" class="photo-preview">
      <button type="button" class="btn btn-secondary" style="width:100%;font-size:11px;" onclick="document.getElementById('foto-input').click()">Cambiar foto</button>
      <input type="file" id="foto-input" accept="image/*" style="display:none;" onchange="previewFoto(event)">
    `;
  } else {
    resetFotoArea();
  }

  document.getElementById('modal-prod').classList.add('open');
}

/** Sube la foto seleccionada al bucket "productos" y devuelve la URL pública */
async function subirFoto(referencia){
  if(!_fotoFile) return null;

  const ext = _fotoFile.name.split('.').pop();
  const fileName = `${referencia}-${Date.now()}.${ext}`;

  const { data, error } = await sb.storage.from('productos').upload(fileName, _fotoFile, { upsert: true });
  if(error){
    showToast('⚠️ Error subiendo foto: ' + error.message, 'error');
    return null;
  }

  const { data: urlData } = sb.storage.from('productos').getPublicUrl(fileName);
  return urlData.publicUrl;
}

/** Guardar producto (crear o actualizar) */
async function guardarProducto(){
  const referencia = document.getElementById('p-referencia').value;
  const nombre = document.getElementById('p-nombre').value.trim();
  const costo = rawNum(document.getElementById('p-costo'));
  const precio = rawNum(document.getElementById('p-precio'));
  const stock = parseInt(document.getElementById('p-stock').value) || 0;

  if(!nombre){
    showToast('⚠️ Falta el nombre del producto', 'error');
    document.getElementById('p-nombre').focus();
    return;
  }
  if(costo <= 0){
    showToast('⚠️ Falta el costo del producto', 'error');
    document.getElementById('p-costo').focus();
    return;
  }
  if(precio <= 0){
    showToast('⚠️ Falta el precio de venta', 'error');
    document.getElementById('p-precio').focus();
    return;
  }

  let fotoUrl = null;
  if(_fotoFile){
    fotoUrl = await subirFoto(referencia);
  }

  const payload = { referencia, nombre, costo, precio, stock };
  if(fotoUrl) payload.foto_url = fotoUrl;

  if(_productoEditando){
    const { error } = await sb.from('productos').update(payload).eq('id', _productoEditando);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Producto "${nombre}" actualizado`);
  } else {
    const { error } = await sb.from('productos').insert(payload);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Producto "${nombre}" agregado correctamente`);
  }

  cerrarModalProducto();
  await cargarProductos();
}

/** Eliminar producto */
function eliminarProducto(id){
  confirmarAccion('¿Eliminar este producto? Esta acción no se puede deshacer.', async () => {
    const { error } = await sb.from('productos').delete().eq('id', id);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

    showToast('🗑️ Producto eliminado', 'info');
    await cargarProductos();
  });
}

function buscarInventario(query){
  const q = query.toLowerCase();
  document.querySelectorAll('#inv-tbody tr').forEach(row=>{
    const texto = row.textContent.toLowerCase();
    row.style.display = texto.includes(q) ? '' : 'none';
  });
  document.querySelectorAll('#inv-mobile-cards > div').forEach(card=>{
    const texto = card.textContent.toLowerCase();
    card.style.display = texto.includes(q) ? '' : 'none';
  });
}

/* ============================================================
   MODAL DE CONFIRMACIÓN GENÉRICO (reemplaza confirm() nativo)
   ============================================================ */

/**
 * Muestra un modal de confirmación bonito.
 * Uso: confirmarAccion('¿Eliminar este producto?', () => { ...código si confirma... });
 */
function confirmarAccion(mensaje, onConfirm, titulo){
  document.getElementById('confirm-title').textContent = titulo || '⚠️ Confirmar acción';
  document.getElementById('confirm-msg').textContent = mensaje;
  document.getElementById('modal-confirm').classList.add('open');

  const btnOk = document.getElementById('confirm-ok');
  const btnCancel = document.getElementById('confirm-cancel');

  // Limpiar listeners previos clonando los botones
  const newOk = btnOk.cloneNode(true);
  const newCancel = btnCancel.cloneNode(true);
  btnOk.replaceWith(newOk);
  btnCancel.replaceWith(newCancel);

  newOk.addEventListener('click', ()=>{
    document.getElementById('modal-confirm').classList.remove('open');
    onConfirm();
  });
  newCancel.addEventListener('click', ()=>{
    document.getElementById('modal-confirm').classList.remove('open');
  });
}
/* ============================================================
   CONTACTOS - CONEXIÓN SUPABASE
   ============================================================ */

let CLIENTES = [];
let PROVEEDORES = [];

async function cargarClientes(){
  const { data, error } = await sb.from('clientes').select('*').order('nombre');
  if(error){ showToast('❌ Error cargando clientes', 'error'); return; }
  CLIENTES = data;
  renderClientes();
}

async function cargarProveedores(){
  const { data, error } = await sb.from('proveedores').select('*').order('nombre');
  if(error){ showToast('❌ Error cargando proveedores', 'error'); return; }
  PROVEEDORES = data;
  renderProveedores();
}

function renderClientes(){
  const lista = document.getElementById('clientes-lista');
  if(CLIENTES.length === 0){
    lista.innerHTML = `<div style="padding:20px;text-align:center;color:var(--gris-60);font-size:13px;">Aún no has agregado clientes.</div>`;
    return;
  }
  lista.innerHTML = CLIENTES.map(c => `
    <div class="contacto-row" id="cli-${c.id}">
      <div class="contacto-info">
        <strong>${c.nombre}${c.apellido && c.apellido !== 'null' ? ' ' + c.apellido : ''}</strong>
        <span class="contacto-sub">${c.ciudad || '—'} · ${c.direccion || '—'} · 📞 ${c.numero || '—'}</span>
      </div>
      <div class="contacto-actions">
       <button class="btn-icon" onclick="editarCliente('${c.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="btn-icon" onclick="eliminarCliente('${c.id}')" style="color:var(--rojo);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
      </div>
    </div>
  `).join('');
}

function renderProveedores(){
  const lista = document.getElementById('proveedores-lista');
  if(PROVEEDORES.length === 0){
    lista.innerHTML = `<div style="padding:20px;text-align:center;color:var(--gris-60);font-size:13px;">Aún no has agregado proveedores.</div>`;
    return;
  }
  lista.innerHTML = PROVEEDORES.map(p => `
    <div class="contacto-row" id="prov-${p.id}">
      <div class="contacto-info">
        <strong>${p.nombre}</strong>
        <span class="contacto-sub">${p.ciudad || '—'}${p.numero ? ' · 📞 ' + p.numero : ''}</span>
      </div>
      <div class="contacto-actions">
        <button class="btn-icon" onclick="editarProveedor('${p.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="btn-icon" onclick="eliminarProveedor('${p.id}')" style="color:var(--rojo);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
      </div>
    </div>
  `).join('');
}

/* ── CLIENTES: CRUD ─────────────────────────────────────────── */

function abrirModalCliente(){
  _clienteEditando = null;
  document.getElementById('cli-modal-title').textContent = '👤 Nuevo Cliente';
  document.getElementById('cli-nombre').value = '';
  document.getElementById('cli-apellido').value = '';
  document.getElementById('cli-ciudad').value = '';
  document.getElementById('cli-direccion').value = '';
  document.getElementById('cli-numero').value = '';
  document.getElementById('modal-cliente').classList.add('open');
}
function cerrarModalCliente(){
  document.getElementById('modal-cliente').classList.remove('open');
}

function editarCliente(id){
  const c = CLIENTES.find(x => x.id === id);
  if(!c) return;
  _clienteEditando = id;
  document.getElementById('cli-modal-title').textContent = '✏️ Editar Cliente';
  document.getElementById('cli-nombre').value = c.nombre;
  document.getElementById('cli-apellido').value = c.apellido || '';
  document.getElementById('cli-ciudad').value = c.ciudad || '';
  document.getElementById('cli-direccion').value = c.direccion || '';
  document.getElementById('cli-numero').value = c.numero || '';
  document.getElementById('modal-cliente').classList.add('open');
}

function eliminarCliente(id){
  confirmarAccion('¿Eliminar este cliente? Esta acción no se puede deshacer.', async () => {
    const { error } = await sb.from('clientes').delete().eq('id', id);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast('🗑️ Cliente eliminado', 'info');
    await cargarClientes();
  });
}

async function guardarCliente(){
  const nombre = document.getElementById('cli-nombre').value.trim();
  const apellido = document.getElementById('cli-apellido').value.trim();
  const ciudad = document.getElementById('cli-ciudad').value.trim();
  const direccion = document.getElementById('cli-direccion').value.trim();
  const numero = document.getElementById('cli-numero').value.trim();

  if(!nombre){
    showToast('⚠️ Falta el nombre', 'error');
    return;
  }

  const payload = { nombre, apellido, ciudad, direccion, numero };

  if(_clienteEditando){
    const { error } = await sb.from('clientes').update(payload).eq('id', _clienteEditando);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Cliente "${nombre} ${apellido}" actualizado`);
  } else {
    const { error } = await sb.from('clientes').insert(payload);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Cliente "${nombre} ${apellido}" agregado`);
  }

  cerrarModalCliente();
  await cargarClientes();
}

/* ── PROVEEDORES: CRUD ──────────────────────────────────────── */

function abrirModalProveedor(){
  _proveedorEditando = null;
  document.getElementById('prov-modal-title').textContent = '🏭 Nuevo Proveedor';
  document.getElementById('prov-nombre').value = '';
  document.getElementById('prov-ciudad').value = '';
  document.getElementById('prov-numero').value = '';
  document.getElementById('modal-proveedor').classList.add('open');
}
function cerrarModalProveedor(){
  document.getElementById('modal-proveedor').classList.remove('open');
}

function editarProveedor(id){
  const p = PROVEEDORES.find(x => x.id === id);
  if(!p) return;
  _proveedorEditando = id;
  document.getElementById('prov-modal-title').textContent = '✏️ Editar Proveedor';
  document.getElementById('prov-nombre').value = p.nombre;
  document.getElementById('prov-ciudad').value = p.ciudad || '';
  document.getElementById('prov-numero').value = p.numero || '';
  document.getElementById('modal-proveedor').classList.add('open');
}

function eliminarProveedor(id){
  confirmarAccion('¿Eliminar este proveedor? Esta acción no se puede deshacer.', async () => {
    const { error } = await sb.from('proveedores').delete().eq('id', id);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast('🗑️ Proveedor eliminado', 'info');
    await cargarProveedores();
  });
}

async function guardarProveedor(){
  const nombre = document.getElementById('prov-nombre').value.trim();
  const ciudad = document.getElementById('prov-ciudad').value.trim();
  const numero = document.getElementById('prov-numero').value.trim();

  if(!nombre){
    showToast('⚠️ Falta el nombre de la empresa', 'error');
    return;
  }

  const payload = { nombre, ciudad, numero };

  if(_proveedorEditando){
    const { error } = await sb.from('proveedores').update(payload).eq('id', _proveedorEditando);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Proveedor "${nombre}" actualizado`);
  } else {
    const { error } = await sb.from('proveedores').insert(payload);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Proveedor "${nombre}" agregado`);
  }

  cerrarModalProveedor();
  await cargarProveedores();
}

/* ============================================================
   COTIZACIONES - CONEXIÓN SUPABASE
   ============================================================ */

let COTIZACIONES = [];

async function cargarCotizaciones(){
  const { data, error } = await sb
    .from('cotizaciones')
    .select('*, cotizacion_items(*)')
    .order('created_at', { ascending: false });

  if(error){ showToast('❌ Error cargando cotizaciones', 'error'); return; }
  COTIZACIONES = data;
  renderCotizaciones();
}

function renderCotizaciones(){
  const lista = document.getElementById('cotizaciones-lista');

  if(COTIZACIONES.length === 0){
    lista.innerHTML = `<div style="padding:30px;text-align:center;color:var(--gris-60);font-size:13px;">Aún no has agregado cotizaciones.</div>`;
    return;
  }

  lista.innerHTML = COTIZACIONES.map(cot=>{
    const items = cot.cotizacion_items || [];
    const etiqueta = items.length > 1 ? `${items.length} productos` : items.length === 1 ? items[0].producto_nombre : '0 productos';
    const mesLabel = `📅 ${MESES_NOMBRE[cot.mes_objetivo]} ${cot.anio_objetivo}`;
    const itemsJson = JSON.stringify(items.map(it=>({
      ref: it.producto_id || '',
      nombre: it.producto_nombre,
      costo: it.costo_unitario,
      cantidad: it.cantidad,
      icon: it.producto_icono || '📦'
    })));

    const detalleHtml = items.map(it=>{
  const prod = PRODUCTOS.find(p => p.id === it.producto_id);
  const thumb = prod && prod.foto_url
    ? `<img src="${prod.foto_url}" style="width:30px;height:30px;border-radius:7px;object-fit:cover;">`
    : `${it.producto_icono || '📦'}`;
  return `
    <div class="venta-item-row">
      <div class="venta-item-thumb">${thumb}</div>
      <div class="venta-item-info">${it.producto_nombre} x${it.cantidad}</div>
      <div class="venta-item-total">${formatCOP(it.costo_unitario * it.cantidad)}</div>
    </div>
  `;
}).join('');

    return `
      <div class="venta-grupo cotiz-row ${cot.comprado ? 'comprado' : ''}"
           data-id="${cot.id}"
           data-proveedor="${cot.proveedor_nombre || ''}"
           data-mes="${cot.mes_objetivo}"
           data-anio="${cot.anio_objetivo}">
        <div class="venta-grupo-head" style="background:#fff;" onclick="toggleVentaDetalle(this)">
          <div class="venta-cliente">
            <span style="background:var(--gris-20);color:var(--gris-80);font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${etiqueta}</span>
            <div class="venta-cliente-nombre">${cot.proveedor_nombre || '—'}</div>
          </div>
          <div class="venta-grupo-meta">
            <span class="cotiz-mes-badge">${mesLabel}</span>
            <span class="venta-grupo-total">${formatCOP(cot.total)}</span>
            <input type="checkbox" class="cotiz-check" title="Marcar como comprado"
                   ${cot.comprado ? 'checked' : ''}
                   onchange="toggleCotizComprado(this, '${cot.id}')">
            <button class="btn-icon" onclick="editarCotizacion(this)" title="Editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon" onclick="eliminarCotizacion('${cot.id}')" title="Eliminar" style="color:var(--rojo);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
            <span class="venta-chev">▼</span>
          </div>
        </div>
        <div class="venta-detalle collapsed">${detalleHtml}</div>
        <div class="venta-detalle-data" style="display:none;" data-items='${itemsJson}'></div>
      </div>
    `;
  }).join('');
}

/** Guardar cotización (crear o actualizar) */
async function guardarCotizacion(){
  const proveedor = document.getElementById('cot-proveedor');
  const mes = parseInt(document.getElementById('cot-mes-objetivo').value);
  const anio = parseInt(document.getElementById('cot-anio-objetivo').value);

  if(!proveedor.value.trim()){
    showToast('⚠️ Falta el proveedor', 'error');
    proveedor.focus();
    return;
  }

  const itemsValidos = _cotizItems.filter(it => it.nombre.trim());
  if(!itemsValidos.length){
    showToast('⚠️ Agrega al menos un producto', 'error');
    return;
  }
  for(const it of itemsValidos){
    if(it.costo <= 0){
      showToast(`⚠️ Falta el costo de "${it.nombre}"`, 'error');
      return;
    }
  }

  const total = itemsValidos.reduce((acc,it) => acc + (it.costo * it.cantidad), 0);

  // Buscar proveedor_id si existe
  const provObj = PROVEEDORES.find(p => p.nombre === proveedor.value.trim());

  const payload = {
    proveedor_id: provObj ? provObj.id : null,
    proveedor_nombre: proveedor.value.trim(),
    total,
    mes_objetivo: mes,
    anio_objetivo: anio,
    comprado: false
  };

  if(_cotizEditando){
    // Editar: actualizar cabecera y re-insertar items
    const cotId = _cotizEditando.dataset.id;

    const { error: errUpd } = await sb.from('cotizaciones').update(payload).eq('id', cotId);
    if(errUpd){ showToast('❌ Error: ' + errUpd.message, 'error'); return; }

    // Borrar items viejos y re-insertar
    await sb.from('cotizacion_items').delete().eq('cotizacion_id', cotId);
    const items = itemsValidos.map(it=>({
      cotizacion_id: cotId,
      producto_id: it.ref || null,
      producto_nombre: it.nombre,
      producto_icono: it.icon || '📦',
      costo_unitario: it.costo,
      cantidad: it.cantidad,
      subtotal: it.costo * it.cantidad
    }));
    await sb.from('cotizacion_items').insert(items);
    showToast(`✅ Cotización de ${proveedor.value.trim()} actualizada`);

  } else {
    // Nueva cotización
    const { data: newCot, error: errIns } = await sb.from('cotizaciones').insert(payload).select().single();
    if(errIns){ showToast('❌ Error: ' + errIns.message, 'error'); return; }

    const items = itemsValidos.map(it=>({
      cotizacion_id: newCot.id,
      producto_id: it.ref || null,
      producto_nombre: it.nombre,
      producto_icono: it.icon || '📦',
      costo_unitario: it.costo,
      cantidad: it.cantidad,
      subtotal: it.costo * it.cantidad
    }));
    await sb.from('cotizacion_items').insert(items);
    showToast(`✅ Cotización de ${proveedor.value.trim()} guardada — ${formatCOP(total)}`);
  }

  cerrarModalCotizacion();
  await cargarCotizaciones();
}

/** Eliminar cotización */
function eliminarCotizacion(id){
  confirmarAccion('¿Eliminar esta cotización? Esta acción no se puede deshacer.', async () => {
    await sb.from('cotizacion_items').delete().eq('cotizacion_id', id);
    const { error } = await sb.from('cotizaciones').delete().eq('id', id);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast('🗑️ Cotización eliminada', 'info');
    await cargarCotizaciones();
  });
}

/** Toggle comprado */
async function toggleCotizComprado(checkbox, id){
  const comprado = checkbox.checked;
  const row = checkbox.closest('.cotiz-row');
  row.classList.toggle('comprado', comprado);

  await sb.from('cotizaciones').update({ comprado }).eq('id', id);
  showToast(comprado ? '✅ Marcado como comprado' : '↩️ Marcado como pendiente', comprado ? 'success' : 'info');
}

/* ============================================================
   VENTAS - CONEXIÓN SUPABASE
   ============================================================ */

let VENTAS = [];

async function cargarVentas(mes, anio){
  const hoy = new Date();
  const a = anio || hoy.getFullYear();

  let query = sb.from('ventas').select('*, venta_items(*)').order('created_at', { ascending: false });

  if(mes === null || mes === undefined){
    query = query.eq('anio', a);
  } else {
    query = query.eq('mes', mes).eq('anio', a);
  }

  const { data, error } = await query;
  if(error){ showToast('❌ Error cargando ventas', 'error'); return; }
  VENTAS = data;
  renderVentas();
  actualizarKpisVentas();
}

function actualizarKpisVentas(){
  const total = VENTAS.reduce((acc, v) => acc + v.total, 0);
  const efectivo = VENTAS.filter(v => v.metodo_pago === 'efectivo').reduce((acc, v) => acc + v.total, 0);
  const transferencia = VENTAS.filter(v => v.metodo_pago === 'transferencia').reduce((acc, v) => acc + v.total, 0);
  const contraentrega = VENTAS.filter(v => v.tipo === 'contraentrega' && v.estado_contraentrega !== 'liquidado').reduce((acc, v) => acc + v.total, 0);
  const liquidadas = VENTAS.filter(v => v.tipo === 'contraentrega' && v.estado_contraentrega === 'liquidado').reduce((acc, v) => acc + v.total, 0);

  document.getElementById('kpi-ventas-total').textContent = formatCOP(total);
  document.getElementById('kpi-ventas-count').textContent = VENTAS.length + ' ventas registradas';
  document.getElementById('kpi-ventas-efectivo').textContent = formatCOP(efectivo);
 document.getElementById('kpi-ventas-transferencia').textContent = formatCOP(transferencia + liquidadas);
  document.getElementById('kpi-ventas-contra').textContent = formatCOP(contraentrega);
}

function renderVentas(){
  const lista = document.getElementById('ventas-lista');

  if(VENTAS.length === 0){
    lista.innerHTML = `<div style="padding:30px;text-align:center;color:var(--gris-60);font-size:13px;">Aún no hay ventas este mes.</div>`;
    return;
  }

  lista.innerHTML = VENTAS.map(v=>{
    const items = v.venta_items || [];
    const esMulti = items.length > 1;
   const metodoBadge = v.tipo === 'contraentrega' && v.estado_contraentrega !== 'liquidado'
      ? `<span class="badge badge-amarillo">📋 Contra Entrega</span>`
      : v.tipo === 'contraentrega' && v.estado_contraentrega === 'liquidado'
        ? v.banco === 'Nequi'
          ? `<span class="badge fuente-nequi">Nequi</span>`
          : `<span class="badge fuente-banco">Bancolombia</span>`
      : v.tipo === 'credito' && v.saldo_credito > 0
        ? `<span class="badge badge-rojo"> A Crédito</span>`
        : v.tipo === 'credito' && v.saldo_credito === 0
          ? v.metodo_pago === 'efectivo'
            ? `<span class="badge fuente-efectivo">Efectivo</span>`
            : `<span class="badge fuente-${v.banco === 'Nequi' ? 'nequi' : 'banco'}">${v.banco || 'Transferencia'}</span>`
          : v.metodo_pago === 'efectivo'
            ? `<span class="badge fuente-efectivo">Efectivo</span>`
            : `<span class="badge fuente-${v.banco === 'Nequi' ? 'nequi' : 'banco'}">${v.banco || 'Transferencia'}</span>`;

   const thumb = esMulti
      ? `<span class="venta-badge-items">${items.length} productos</span>`
      : items[0]
        ? (() => {
            let fotoSrc = items[0].foto_url;
            if(!fotoSrc){
              const prod = PRODUCTOS.find(p => p.id === items[0].producto_id);
              if(prod) fotoSrc = prod.foto_url;
            }
            return fotoSrc
              ? `<img src="${fotoSrc}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;">`
              : `<div class="prod-thumb">${items[0].producto_icono || '📦'}</div>`;
          })()
        : `<div class="prod-thumb">📦</div>`;

    const nombreVenta = esMulti
      ? `PEDIDO — ${v.cliente_nombre || 'Sin definir'}`
      : items[0]
        ? `${items[0].producto_nombre} x${items[0].cantidad} — ${v.cliente_nombre || 'Sin definir'}`
        : v.cliente_nombre || 'Sin definir';

    const detalleHtml = items.map(it=>{
      let fotoSrc = it.foto_url;
      if(!fotoSrc){
        const prod = PRODUCTOS.find(p => p.id === it.producto_id);
        if(prod) fotoSrc = prod.foto_url;
      }
      const thumb = fotoSrc
        ? `<img src="${fotoSrc}" style="width:30px;height:30px;border-radius:7px;object-fit:cover;">`
        : `${it.producto_icono || '📦'}`;
      return `
        <div class="venta-item-row">
          <div class="venta-item-thumb">${thumb}</div>
          <div class="venta-item-info">${it.producto_nombre} x${it.cantidad}</div>
          <div class="venta-item-total">${formatCOP(it.precio_unitario * it.cantidad)}</div>
        </div>
      `;
    }).join('');
   const bgVenta = v.tipo === 'credito' ? '#ffebe9' 
      : v.tipo === 'contraentrega' && v.estado_contraentrega === 'liquidado' ? '#e9fef2'
      : v.tipo === 'contraentrega' ? '#fffbef' 
      : '#e9fef2';
   const badgeMultiVenta = v.tipo === 'credito'
      ? `<span style="background:#F1948A;color:#7B241C;font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} productos</span>`
      : v.tipo === 'contraentrega' && v.estado_contraentrega === 'liquidado'
        ? `<span style="background:#82E0AA;color:#1D6A3A;font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} productos</span>`
        : v.tipo === 'contraentrega'
          ? `<span style="background:#F9E79F;color:#7D6608;font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} productos</span>`
          : `<span style="background:#82E0AA;color:#1D6A3A;font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} productos</span>`;

    if(esMulti){
      return `
        <div class="venta-grupo" data-id="${v.id}">
          <div class="venta-grupo-head" style="background:${bgVenta};" onclick="toggleVentaDetalle(this)">
            <div class="venta-cliente">
              ${badgeMultiVenta}
              <div class="venta-cliente-nombre">${nombreVenta}</div>
            </div>
            <div class="venta-grupo-meta">
              ${metodoBadge}
              <span style="font-size:11px;color:var(--gris-60);">${new Date(v.fecha+'T00:00:00').toLocaleDateString('es-CO')}</span>
              <span class="venta-grupo-total">${formatCOP(v.total)}</span>
              <span class="venta-chev">▼</span>
              <button class="btn-icon" onclick="generarRecibo('${v.id}')" title="Factura">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </button>
              <button class="btn-icon" onclick="editarVenta(this)" title="Editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              ${v.tipo === 'credito' && v.saldo_credito > 0 ? `
              <button class="btn-icon" onclick="abrirModalAbonoVenta('${v.id}', ${v.saldo_credito})" title="Abonar" style="color:var(--verde);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </button>` : ''}
              <button class="btn-icon" onclick="eliminarVenta('${v.id}')" title="Eliminar" style="color:var(--rojo);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </div>
          <div class="venta-detalle collapsed">${detalleHtml}</div>
        </div>
      `;
    } else {
      return `
        <div class="venta-grupo" data-id="${v.id}">
          <div class="venta-grupo-head" style="cursor:default;background:${bgVenta};">
            <div class="venta-cliente">
              ${thumb}
              <div class="venta-cliente-nombre">${nombreVenta}</div>
            </div>
            <div class="venta-grupo-meta">
              ${metodoBadge}
              <span style="font-size:11px;color:var(--gris-60);">${new Date(v.fecha+'T00:00:00').toLocaleDateString('es-CO')}</span>
              <span class="venta-grupo-total">${formatCOP(v.total)}</span>
              <button class="btn-icon" onclick="generarRecibo('${v.id}')" title="Factura">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </button>
              <button class="btn-icon" onclick="editarVenta(this)" title="Editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              ${v.tipo === 'credito' && v.saldo_credito > 0 ? `
              <button class="btn-icon" onclick="abrirModalAbonoVenta('${v.id}', ${v.saldo_credito})" title="Abonar" style="color:var(--verde);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </button>` : ''}
              <button class="btn-icon" onclick="eliminarVenta('${v.id}')" title="Eliminar" style="color:var(--rojo);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');
}

/** Guardar venta en Supabase */
async function guardarVenta(){
  const clienteEl = document.getElementById('v-cliente');
  const tipo = document.getElementById('v-tipo').value;
  const metodo = document.getElementById('v-metodo').value;
  const banco = document.getElementById('v-banco').value;

  if(!clienteEl.value.trim()){
    showToast('⚠️ Falta el nombre del cliente', 'error');
    clienteEl.focus();
    return;
  }

  const itemsValidos = _ventaItems.filter(it => it.ref);
  if(!itemsValidos.length){
    showToast('⚠️ Agrega al menos un producto', 'error');
    return;
  }

  for(const it of itemsValidos){
    if(!_ventaEditando && it.cantidad > it.stock){
      showToast(`⚠️ Stock insuficiente de "${it.nombre}" (disponible: ${it.stock})`, 'error');
      return;
    }
  }

  const subtotal = itemsValidos.reduce((acc,it) => acc + (it.precio * it.cantidad), 0);
  const tieneDescuento = document.getElementById('v-tiene-descuento').checked;
  const descuentoInput = rawNum(document.getElementById('v-descuento'));
  const tipoDescuento = document.getElementById('v-descuento-tipo').value;
  let descuento = (tieneDescuento && descuentoInput > 0)
    ? (tipoDescuento === 'porcentaje' ? subtotal * (descuentoInput/100) : descuentoInput)
    : 0;
  if(descuento > subtotal) descuento = subtotal;
  const total = subtotal - descuento;

  const hoy = new Date();
  const clienteObj = CLIENTES.find(c => `${c.nombre} ${c.apellido || ''}`.trim() === clienteEl.value.trim());

  const ventaPayload = {
    cliente_id: clienteObj ? clienteObj.id : null,
    cliente_nombre: clienteEl.value.trim(),
    tipo,
    metodo_pago: (tipo === 'contraentrega' || tipo === 'credito') ? null : metodo,
    banco: (tipo === 'contado' && metodo === 'transferencia') ? banco : null,
    subtotal,
    descuento,
    total,
    saldo_credito: tipo === 'credito' ? total : 0,
   fecha: document.getElementById('v-fecha').value || hoy.toISOString().split('T')[0],
    mes: new Date(document.getElementById('v-fecha').value).getMonth() + 1,
    anio: new Date(document.getElementById('v-fecha').value).getFullYear(),
    estado_contraentrega: tipo === 'contraentrega' ? 'preparacion' : null,
  };

  if(_ventaEditando){
    const { error: errUpd } = await sb.from('ventas').update(ventaPayload).eq('id', _ventaEditando);
    if(errUpd){ showToast('❌ Error: ' + errUpd.message, 'error'); return; }

    await sb.from('venta_items').delete().eq('venta_id', _ventaEditando);
    const items = itemsValidos.map(it=>({
      venta_id: _ventaEditando,
      producto_id: it.ref,
      producto_nombre: it.nombre,
      producto_icono: it.icon || '📦',
      foto_url: it.foto_url || null,
      precio_unitario: it.precio,
      cantidad: it.cantidad,
      subtotal: it.precio * it.cantidad
    }));
    await sb.from('venta_items').insert(items);
    showToast(`✅ Venta actualizada: ${formatCOP(total)}`);

  } else {
    const { data: newVenta, error: errVenta } = await sb.from('ventas').insert(ventaPayload).select().single();
    if(errVenta){ showToast('❌ Error: ' + errVenta.message, 'error'); return; }

    const items = itemsValidos.map(it=>({
      venta_id: newVenta.id,
      producto_id: it.ref,
      producto_nombre: it.nombre,
      producto_icono: it.icon || '📦',
      foto_url: it.foto_url || null,
      precio_unitario: it.precio,
      cantidad: it.cantidad,
      subtotal: it.precio * it.cantidad
    }));
    await sb.from('venta_items').insert(items);

    for(const it of itemsValidos){
      const prod = PRODUCTOS.find(p => p.id === it.ref);
      if(prod){
        const nuevoStock = prod.stock - it.cantidad;
        await sb.from('productos').update({ stock: nuevoStock }).eq('id', it.ref);
        prod.stock = nuevoStock;
      }
    }

    // Actualizar caja automáticamente
    if(tipo === 'contado'){
      if(metodo === 'efectivo'){
        await actualizarSaldoCaja('efectivo', total, `Venta — ${clienteEl.value.trim()}`);
      } else if(metodo === 'transferencia'){
        await actualizarSaldoCaja(banco === 'Nequi' ? 'nequi' : 'bancolombia', total, `Venta — ${clienteEl.value.trim()}`);
      }
    }

    const etiqueta = itemsValidos.length > 1 ? `${itemsValidos.length} productos` : itemsValidos[0].nombre;
    showToast(`✅ Venta registrada: ${formatCOP(total)} — ${clienteEl.value.trim()} (${etiqueta})`);

    // Si es a crédito, agregar automáticamente a pendientes
    if(tipo === 'credito'){
      await sb.from('pendientes').insert({
        descripcion: `Venta crédito — ${clienteEl.value.trim()} (${etiqueta})`,
        monto: total,
        monto_abonado: 0,
        fuente: 'efectivo',
        pagado: false,
        fecha: hoy.toISOString().split('T')[0],
        venta_id: newVenta.id
      });
      await cargarPendientes();
    }
  }

  cerrarModalVenta();
  await cargarVentas();
  await cargarProductos();
}

function eliminarVenta(id){
  confirmarAccion('¿Eliminar esta venta?', async () => {
    const { data: v } = await sb.from('ventas').select('*, venta_items(*)').eq('id', id).single();
    
    // 1. Revertir saldo de caja
    if(v){
      let cuenta = null;
      if(v.tipo === 'contado'){
        cuenta = v.metodo_pago === 'efectivo' ? 'efectivo'
          : v.banco === 'Nequi' ? 'nequi' : 'bancolombia';
      } else if(v.tipo === 'contraentrega' && v.estado_contraentrega === 'liquidado'){
        cuenta = v.banco === 'Nequi' ? 'nequi' : 'bancolombia';
      }

      if(cuenta){
        const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
        const nuevoValor = (cajaActual[cuenta] || 0) - v.total;
        await sb.from('caja_saldo').update({ [cuenta]: nuevoValor }).eq('id', 1);
        await sb.from('movimientos_caja').delete()
          .or(`descripcion.eq.Venta — ${v.cliente_nombre},descripcion.eq.Contra entrega — ${v.cliente_nombre}`);
      }
    }

    // 2. Revertir stock
    for(const it of (v?.venta_items || [])){
      if(it.producto_id){
        const { data: prod } = await sb.from('productos').select('stock').eq('id', it.producto_id).single();
        if(prod){
          await sb.from('productos').update({ stock: prod.stock + it.cantidad }).eq('id', it.producto_id);
        }
      }
    }

    // 3. Borrar todo
    await sb.from('venta_items').delete().eq('venta_id', id);
    await sb.from('pendientes').delete().eq('venta_id', id);
    await sb.from('ventas').delete().eq('id', id);
    
    showToast('🗑️ Venta eliminada', 'info');
    await cargarVentas();
    await cargarProductos();
    await cargarCaja();
  });
}
function eliminarCompra(id){
  confirmarAccion('¿Eliminar esta compra?', async () => {
    const { data: c } = await sb.from('compras').select('*').eq('id', id).single();

   // Revertir abonos a caja si era crédito con abonos
    if(c && c.tipo === 'credito'){
      const { data: abonos } = await sb.from('abonos_compras').select('*').eq('compra_id', id);
      for(const ab of (abonos || [])){
        await actualizarSaldoCaja(ab.fuente, ab.monto, `Reverso abono — ${c.proveedor_nombre}`);
      }
    }

    if(c && c.tipo === 'contado'){
      const fuente = (c.fuente || 'efectivo').toLowerCase();
      const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
      const nuevoValor = (cajaActual[fuente] || 0) + c.total;
      await sb.from('caja_saldo').update({ [fuente]: nuevoValor }).eq('id', 1);
      await sb.from('movimientos_caja').delete().eq('descripcion', `Compra — ${c.proveedor_nombre}`);
    }

    // Revertir stock
    const { data: items } = await sb.from('compra_items').select('*').eq('compra_id', id);
    for(const it of (items || [])){
      if(it.producto_id){
        const { data: prod } = await sb.from('productos').select('stock').eq('id', it.producto_id).single();
        if(prod){
          await sb.from('productos').update({ stock: prod.stock - it.cantidad }).eq('id', it.producto_id);
        }
      }
    }

    // Borrar abonos del historial
    await sb.from('abonos_compras').delete().eq('compra_id', id);
    // Borrar registros es_abono que afectan utilidad
    await sb.from('compras').delete().eq('es_abono', true).eq('compra_origen_id', id);
    // Borrar items y compra principal
    await sb.from('compra_items').delete().eq('compra_id', id);
    await sb.from('compras').delete().eq('id', id);
    showToast('🗑️ Compra eliminada', 'info');
    await cargarCompras();
    await cargarProductos();
    await cargarCaja();
  });
}

function eliminarGasto(id){
  confirmarAccion('¿Eliminar este gasto?', async () => {
    const g = GASTOS.find(x => x.id === id);

    if(g){
      const fuente = (g.fuente || 'efectivo').toLowerCase();
      const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
      const nuevoValor = (cajaActual[fuente] || 0) + g.valor;
      await sb.from('caja_saldo').update({ [fuente]: nuevoValor }).eq('id', 1);
      await sb.from('movimientos_caja').delete().eq('descripcion', `Gasto — ${g.concepto}`);
    }

    await sb.from('gastos').delete().eq('id', id);
    showToast('🗑️ Gasto eliminado', 'info');
    await cargarGastos();
    await cargarCaja();
  });
}

/** Filtro mes/año */
function filtrarVentas(){
  const mes = parseInt(document.getElementById('f-mes').value) || null;
  const anio = parseInt(document.getElementById('f-anio').value) || new Date().getFullYear();
  cargarVentas(mes, anio);
}

/* ============================================================
   COMPRAS - CONEXIÓN SUPABASE
   ============================================================ */

let COMPRAS = [];

async function cargarCompras(mes, anio){
  const hoy = new Date();
  const a = anio || hoy.getFullYear();

  let query = sb.from('compras').select('*, compra_items(*)')
    .or('es_abono.is.null,es_abono.eq.false')
    .order('created_at', { ascending: false });

  if(mes === null || mes === undefined){
    query = query.eq('anio', a);
  } else {
    query = query.eq('mes', mes).eq('anio', a);
  }

  const { data, error } = await query;
  if(error){ showToast('❌ Error cargando compras', 'error'); return; }
  COMPRAS = data;
  renderCompras();
  actualizarKpisCompras();
}

function actualizarKpisCompras(){
  const total = COMPRAS.reduce((acc, c) => acc + c.total, 0);
  const contado = COMPRAS.filter(c => c.tipo === 'contado').reduce((acc, c) => acc + c.total, 0);
  const credito = COMPRAS.filter(c => c.tipo === 'credito').reduce((acc, c) => acc + c.total, 0);
  const unidades = COMPRAS.reduce((acc, c) => acc + (c.compra_items || []).reduce((a, it) => a + it.cantidad, 0), 0);

  document.getElementById('kpi-compras-total').textContent = formatCOP(total);
  document.getElementById('kpi-compras-count').textContent = COMPRAS.length + ' órdenes registradas';
  document.getElementById('kpi-compras-contado').textContent = formatCOP(contado);
  document.getElementById('kpi-compras-credito').textContent = formatCOP(credito);
  document.getElementById('kpi-compras-unidades').textContent = unidades;
}

function renderCompras(){
  const lista = document.getElementById('compras-lista');

  if(COMPRAS.length === 0){
    lista.innerHTML = `<div style="padding:30px;text-align:center;color:var(--gris-60);font-size:13px;">Aún no hay compras este mes.</div>`;
    return;
  }

  lista.innerHTML = COMPRAS.map(c=>{
    const items = c.compra_items || [];
    const esMulti = items.length > 1;
   const tipoBadge = c.tipo === 'credito' && c.saldo_credito > 0
      ? `<span class="badge badge-rojo">💳 A Crédito</span>`
      : c.fuente === 'nequi'
        ? `<span class="badge fuente-nequi">Nequi</span>`
        : c.fuente === 'bancolombia'
          ? `<span class="badge fuente-banco">Bancolombia</span>`
          : `<span class="badge fuente-efectivo">Efectivo</span>`;

    const bgCompra = c.tipo === 'credito' && c.saldo_credito > 0 ? '#feefee' : '#e9fef2';
    const badgeMultiCompra = c.tipo === 'credito' && c.saldo_credito > 0
      ? `<span style="background:#F1948A;color:#7B241C;font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} productos</span>`
      : `<span style="background:#82E0AA;color:#1D6A3A;font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} productos</span>`;

    const thumb = esMulti
      ? `<span class="venta-badge-items">${items.length} productos</span>`
      : items[0]
        ? (() => {
            let fotoSrc = items[0].foto_url;
            if(!fotoSrc){
              const prod = PRODUCTOS.find(p => p.id === items[0].producto_id);
              if(prod) fotoSrc = prod.foto_url;
            }
            return fotoSrc
              ? `<img src="${fotoSrc}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;">`
              : `<div class="prod-thumb">${items[0].producto_icono || '📦'}</div>`;
          })()
        : `<div class="prod-thumb">📦</div>`;

    const nombreCompra = esMulti
      ? `ORDEN — ${c.proveedor_nombre || '—'}`
      : items[0]
        ? `${items[0].producto_nombre} x${items[0].cantidad} — ${c.proveedor_nombre || '—'}`
        : c.proveedor_nombre || '—';

    const detalleHtml = items.map(it=>{
      let fotoSrc = it.foto_url;
      if(!fotoSrc){
        const prod = PRODUCTOS.find(p => p.id === it.producto_id);
        if(prod) fotoSrc = prod.foto_url;
      }
      const thumb = fotoSrc
        ? `<img src="${fotoSrc}" style="width:30px;height:30px;border-radius:7px;object-fit:cover;">`
        : `${it.producto_icono || '📦'}`;
      return `
        <div class="venta-item-row">
          <div class="venta-item-thumb">${thumb}</div>
          <div class="venta-item-info">${it.producto_nombre} x${it.cantidad}</div>
          <div class="venta-item-total">${formatCOP(it.costo_unitario * it.cantidad)}</div>
        </div>
      `;
    }).join('');

    if(esMulti){
      return `
        <div class="venta-grupo" data-id="${c.id}">
          <div class="venta-grupo-head" style="background:${bgCompra};" onclick="toggleVentaDetalle(this)">
            <div class="venta-cliente">
              ${esMulti ? badgeMultiCompra : thumb}
              <div class="venta-cliente-nombre">${nombreCompra}</div>
            </div>
            <div class="venta-grupo-meta">
              ${tipoBadge}
              <span style="font-size:11px;color:var(--gris-60);">${new Date(c.fecha+'T00:00:00').toLocaleDateString('es-CO')}</span>
              <span class="venta-grupo-total">${formatCOP(c.tipo === 'credito' && c.saldo_credito > 0 ? c.saldo_credito : c.total)}</span>
              <span class="venta-chev">▼</span>
              <button class="btn-icon" onclick="editarCompra(this)" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
             ${c.tipo === 'credito' && c.saldo_credito > 0 ? `<button class="btn-icon" onclick="abrirModalAbonoCompra('${c.id}', ${c.saldo_credito})" style="color:var(--verde);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></button>` : ''}
              ${c.tipo === 'credito' ? `<button class="btn-icon" onclick="verAbonosCompra('${c.id}')" title="Historial abonos" style="color:var(--gris-60);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></button>` : ''}
              <button class="btn-icon" onclick="eliminarCompra('${c.id}')" style="color:var(--rojo);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
            </div>
          </div>
          <div class="venta-detalle collapsed">${detalleHtml}</div>
        </div>
      `;
    } else {
      return `
        <div class="venta-grupo" data-id="${c.id}">
          <div class="venta-grupo-head" style="cursor:default;background:${bgCompra};">
            <div class="venta-cliente">
              ${thumb}
              <div class="venta-cliente-nombre">${nombreCompra}</div>
            </div>
            <div class="venta-grupo-meta">
              ${tipoBadge}
              <span style="font-size:11px;color:var(--gris-60);">${new Date(c.fecha+'T00:00:00').toLocaleDateString('es-CO')}</span>
             <span class="venta-grupo-total">${formatCOP(c.tipo === 'credito' && c.saldo_credito > 0 ? c.saldo_credito : c.total)}</span>
              <button class="btn-icon" onclick="editarCompra(this)" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
             ${c.tipo === 'credito' && c.saldo_credito > 0 ? `<button class="btn-icon" onclick="abrirModalAbonoCompra('${c.id}', ${c.saldo_credito})" style="color:var(--verde);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></button>` : ''}
              ${c.tipo === 'credito' ? `<button class="btn-icon" onclick="verAbonosCompra('${c.id}')" title="Historial abonos" style="color:var(--gris-60);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></button>` : ''}
            
              <button class="btn-icon" onclick="eliminarCompra('${c.id}')" style="color:var(--rojo);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');
}

/** Guardar compra en Supabase */
async function guardarCompra(){
  const proveedor = document.getElementById('co-proveedor');
  const tipo = document.getElementById('co-tipo').value;

  if(!proveedor.value.trim()){
    showToast('⚠️ Falta el nombre del proveedor', 'error');
    proveedor.focus();
    return;
  }

  const itemsValidos = _compraItems.filter(it => it.nombre.trim());
  if(!itemsValidos.length){
    showToast('⚠️ Agrega al menos un producto', 'error');
    return;
  }
  for(const it of itemsValidos){
    if(it.costo <= 0){
      showToast(`⚠️ Falta el costo de "${it.nombre}"`, 'error');
      return;
    }
  }

  const subtotal = itemsValidos.reduce((acc,it) => acc + (it.costo * it.cantidad), 0);
  const tieneDescuento = document.getElementById('co-tiene-descuento').checked;
  const descuentoInput = rawNum(document.getElementById('co-descuento'));
  const tipoDescuento = document.getElementById('co-descuento-tipo').value;
  let descuento = (tieneDescuento && descuentoInput > 0)
    ? (tipoDescuento === 'porcentaje' ? subtotal * (descuentoInput/100) : descuentoInput)
    : 0;
  if(descuento > subtotal) descuento = subtotal;
  const total = subtotal - descuento;

  const hoy = new Date();
  const provObj = PROVEEDORES.find(p => p.nombre === proveedor.value.trim());

  const compraPayload = {
    proveedor_id: provObj ? provObj.id : null,
    proveedor_nombre: proveedor.value.trim(),
    tipo,
    subtotal,
    descuento,
    total,
    saldo_credito: tipo === 'credito' ? total : 0,
    fecha: document.getElementById('co-fecha').value || hoy.toISOString().split('T')[0],
    mes: new Date(document.getElementById('co-fecha').value).getMonth() + 1,
    anio: new Date(document.getElementById('co-fecha').value).getFullYear()
  };

  if(_compraEditando){
    const { error: errUpd } = await sb.from('compras').update(compraPayload).eq('id', _compraEditando);
    if(errUpd){ showToast('❌ Error: ' + errUpd.message, 'error'); return; }

    await sb.from('compra_items').delete().eq('compra_id', _compraEditando);
    const items = itemsValidos.map(it=>({
      compra_id: _compraEditando,
      producto_id: it.ref || null,
      producto_nombre: it.nombre,
      producto_icono: it.icon || '📦',
      foto_url: it.foto_url || null,
      costo_unitario: it.costo,
      cantidad: it.cantidad,
      subtotal: it.costo * it.cantidad
    }));
    await sb.from('compra_items').insert(items);
    showToast(`✅ Compra actualizada: ${formatCOP(total)}`);

  } else {
    const { data: newCompra, error: errCompra } = await sb.from('compras').insert(compraPayload).select().single();
    if(errCompra){ showToast('❌ Error: ' + errCompra.message, 'error'); return; }

    const items = itemsValidos.map(it=>({
      compra_id: newCompra.id,
      producto_id: it.ref || null,
      producto_nombre: it.nombre,
      producto_icono: it.icon || '📦',
      foto_url: it.foto_url || null,
      costo_unitario: it.costo,
      cantidad: it.cantidad,
      subtotal: it.costo * it.cantidad
    }));
    await sb.from('compra_items').insert(items);

    // Sumar al stock solo en compras nuevas
    for(const it of itemsValidos){
      if(it.ref){
        const prod = PRODUCTOS.find(p => p.id === it.ref);
        if(prod){
          const nuevoStock = prod.stock + it.cantidad;
          await sb.from('productos').update({ stock: nuevoStock }).eq('id', it.ref);
          prod.stock = nuevoStock;
        }
      }
    }

    const etiqueta = itemsValidos.length > 1 ? `${itemsValidos.length} productos` : itemsValidos[0].nombre;
    showToast(`✅ Compra registrada: ${formatCOP(total)} — ${proveedor.value.trim()} (${etiqueta})`);

 if(tipo === 'contado'){
      const fuente = document.getElementById('co-fuente-select').value;
      await sb.from('compras').update({ fuente }).eq('id', newCompra.id);
      await actualizarSaldoCaja(fuente, -total, `Compra — ${proveedor.value.trim()}`);
    }
  }

  cerrarModalCompra();
  await cargarCompras();
  await cargarProductos();
}



/** Filtro mes/año */
function filtrarCompras(){
  const mes = parseInt(document.getElementById('c-mes').value) || null;
  const anio = parseInt(document.getElementById('c-anio').value) || new Date().getFullYear();
  cargarCompras(mes, anio);
}

/* ============================================================
   GASTOS - CONEXIÓN SUPABASE
   ============================================================ */

let GASTOS = [];

async function cargarGastos(mes, anio){
  const hoy = new Date();
  const a = anio || hoy.getFullYear();

  let query = sb.from('gastos').select('*').order('created_at', { ascending: false });

  if(mes === null || mes === undefined){
    query = query.eq('anio', a);
  } else {
    query = query.eq('mes', mes).eq('anio', a);
  }

  const { data, error } = await query;
  if(error){ showToast('❌ Error cargando gastos', 'error'); return; }
  GASTOS = data;
  renderGastos();
  actualizarKpisGastos();
  actualizarGraficoGastos();
}

function actualizarKpisGastos(){
  const total = GASTOS.reduce((acc, g) => acc + g.valor, 0);

  // Mayor categoría
  const porTipo = {};
  GASTOS.forEach(g => {
    porTipo[g.tipo] = (porTipo[g.tipo] || 0) + g.valor;
  });
  const mayorTipo = Object.entries(porTipo).sort((a,b) => b[1]-a[1])[0];
  const menorGasto = GASTOS.length ? Math.min(...GASTOS.map(g => g.valor)) : 0;
  const promDiario = total > 0 ? Math.round(total / 30) : 0;

  document.getElementById('kpi-gastos-total').textContent = formatCOP(total);
  document.getElementById('kpi-gastos-count').textContent = GASTOS.length + ' movimientos';
  document.getElementById('kpi-gastos-mayor-cat').textContent = mayorTipo ? TIPOS_GASTO[mayorTipo[0]]?.label.split(' ').slice(1).join(' ') : '—';
  document.getElementById('kpi-gastos-mayor-val').textContent = mayorTipo ? formatCOP(mayorTipo[1]) : '$0';
  document.getElementById('kpi-gastos-promedio').textContent = formatCOP(promDiario);
  document.getElementById('kpi-gastos-bajo').textContent = menorGasto ? formatCOP(menorGasto) : '$0';
}

function actualizarGraficoGastos(){
  const porTipo = {};
  GASTOS.forEach(g => {
    porTipo[g.tipo] = (porTipo[g.tipo] || 0) + g.valor;
  });

  const total = Object.values(porTipo).reduce((a,b) => a+b, 0) || 1;
  const colores = {
    envios:    'var(--banco-dark)',
    empaque:   'var(--celeste-dark)',
    otros:     'var(--gris-40)',
    descuento: 'var(--fucsia)',
    ajustes:   'var(--amarillo)',
    nomina:    '#c2185b'
  };

  const labelMap = {
    envios:    'Envíos/<br>Domicilios',
    empaque:   'Empaque',
    descuento: 'Descuento',
    ajustes:   'Ajustes',
    nomina:    'Nómina/<br>Sueldo',
    otros:     'Otros'
  };

  const grafico = document.getElementById('grafico-gastos-tipo');
  if(!grafico) return;

  const orden = ['nomina','envios','empaque','descuento','ajustes','otros'];
  grafico.innerHTML = orden.map(tipo => {
    const valor = porTipo[tipo] || 0;
    const pct = Math.round((valor / total) * 100);
    return `
      <div class="chart-bar-row">
        <div class="chart-bar-label">${labelMap[tipo] || tipo}</div>
        <div class="chart-bar-track" style="margin-right:0;">
          <div class="chart-bar-fill" style="width:${pct}%;background:${colores[tipo]};"></div>
        </div>
        <div style="width:70px;text-align:right;font-size:12px;font-weight:800;color:var(--gris-80);flex-shrink:0;">${formatCOP(valor)}</div>
      </div>
    `;
  }).join('');
}

function renderGastos(){
  const tbody = document.getElementById('gastos-tbody');
  if(!tbody) return;

  if(GASTOS.length === 0){
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gris-60);padding:30px;">Aún no hay gastos este mes.</td></tr>`;
    return;
  }

  tbody.innerHTML = GASTOS.map(g => {
    const info = TIPOS_GASTO[g.tipo] || { label: g.tipo, clase: 'gasto-otros' };
    const fecha = new Date(g.fecha + 'T00:00:00').toLocaleDateString('es-CO');
    return `
      <tr data-id="${g.id}">
        <td><strong>${g.concepto}</strong></td>
        <td><span class="gasto-tipo-badge ${info.clase}">${info.label}</span></td>
        <td style="text-align:right;font-weight:700;">${formatCOP(g.valor)}</td>
        <td>${fecha}</td>
        <td style="text-align:center;">
            <button class="btn-icon" onclick="editarGasto('${g.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="btn-icon" onclick="eliminarGasto('${g.id}')" style="color:var(--rojo);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
          </td>
        </td>
      </tr>
    `;
  }).join('');
}

function abrirModalGasto(){
  _gastoEditando = null;
  document.getElementById('g-concepto').value = '';
  document.getElementById('g-valor').value = '';
  document.getElementById('g-tipo').value = 'empaque';
  document.getElementById('g-fuente').value = 'efectivo';
  document.getElementById('g-fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal-gasto').classList.add('open');
}
function cerrarModalGasto(){
  document.getElementById('modal-gasto').classList.remove('open');
  _gastoEditando = null;
}

function editarGasto(id){
  const g = GASTOS.find(x => x.id === id);
  if(!g) return;
  _gastoEditando = id;
  document.getElementById('g-concepto').value = g.concepto;
  document.getElementById('g-valor').value = g.valor.toLocaleString('es-CO');
  document.getElementById('g-tipo').value = g.tipo;
  document.getElementById('g-fecha').value = g.fecha || new Date().toISOString().split('T')[0];
  document.getElementById('modal-gasto').classList.add('open');
}


async function guardarGasto(){
  const concepto = document.getElementById('g-concepto').value.trim();
  const valor = rawNum(document.getElementById('g-valor'));
  const tipo = document.getElementById('g-tipo').value;

  if(!concepto){
    showToast('⚠️ Falta el concepto del gasto', 'error');
    return;
  }
  if(valor <= 0){
    showToast('⚠️ Falta el valor del gasto', 'error');
    return;
  }

  const hoy = new Date();
  const fuente = document.getElementById('g-fuente').value;
  const payload = {
    concepto, tipo, valor, fuente,
    fecha: document.getElementById('g-fecha').value || hoy.toISOString().split('T')[0],
    mes: new Date(document.getElementById('g-fecha').value).getMonth() + 1,
    anio: new Date(document.getElementById('g-fecha').value).getFullYear()
  };

 if(_gastoEditando){
    const { error } = await sb.from('gastos').update(payload).eq('id', _gastoEditando);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
    showToast(`✅ Gasto "${concepto}" actualizado`);
  } else {
    const { error } = await sb.from('gastos').insert(payload);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }
   await actualizarSaldoCaja(fuente, -valor, `Gasto — ${concepto}`);
    showToast(`✅ Gasto "${concepto}" agregado — ${formatCOP(valor)}`);
  }

  cerrarModalGasto();
  await cargarGastos();
}

function filtrarGastos(){
  const mes = parseInt(document.getElementById('g-mes').value) || null;
  const anio = parseInt(document.getElementById('g-anio').value) || new Date().getFullYear();
  cargarGastos(mes, anio);
}

let _abonoVentaId = null;
let _abonoVentaSaldo = 0;

function abrirModalAbonoVenta(id, saldo){
  _abonoVentaId = id;
  _abonoVentaSaldo = saldo;
  document.getElementById('abono-venta-saldo').textContent = formatCOP(saldo);
  document.getElementById('abono-venta-monto').value = '';
  document.getElementById('abono-venta-fuente').value = 'efectivo';
  document.getElementById('modal-abono-venta').classList.add('open');
}

function cerrarModalAbonoVenta(){
  document.getElementById('modal-abono-venta').classList.remove('open');
}

async function confirmarAbonoVenta(){
  const monto = rawNum(document.getElementById('abono-venta-monto'));
  const fuente = document.getElementById('abono-venta-fuente').value;

  if(monto <= 0){
    showToast('⚠️ Ingresa un monto válido', 'error');
    return;
  }
  if(monto > _abonoVentaSaldo){
    showToast(`⚠️ El abono no puede ser mayor al saldo (${formatCOP(_abonoVentaSaldo)})`, 'error');
    return;
  }

  const nuevoSaldo = _abonoVentaSaldo - monto;

  const { error } = await sb.from('ventas')
    .update({ saldo_credito: nuevoSaldo })
    .eq('id', _abonoVentaId);

  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

 // Sumar a caja según fuente
  await actualizarSaldoCaja(fuente, monto, `Abono venta — ${formatCOP(monto)}`);

  if(nuevoSaldo === 0){
    // Eliminar de pendientes porque ya está pagado
    await sb.from('pendientes').delete().eq('venta_id', _abonoVentaId);
    showToast(`✅ Venta pagada completamente`, 'success');
  } else {
    // Actualizar abono en pendiente
    await sb.from('pendientes')
      .update({ monto_abonado: pendiente.monto - nuevoSaldo })
      .eq('venta_id', _abonoVentaId);
    showToast(`✅ Abono de ${formatCOP(monto)} — Saldo restante: ${formatCOP(nuevoSaldo)}`, 'success');
  }
if(nuevoSaldo === 0){
    const fuente = document.getElementById('abono-venta-fuente').value;
    const metodo = fuente === 'efectivo' ? 'efectivo' : 'transferencia';
    const banco = fuente === 'nequi' ? 'Nequi' : fuente === 'bancolombia' ? 'Bancolombia' : null;
    await sb.from('ventas').update({ 
      tipo: 'contado', 
      metodo_pago: metodo,
      banco: banco
    }).eq('id', _abonoVentaId);
  }
  cerrarModalAbonoVenta();
  await cargarVentas();
  await cargarPendientes();
}

/* ============================================================
   ABONOS DE COMPRAS A CRÉDITO
   ============================================================ */

let _abonoCompraId = null;
let _abonoCompraSaldo = 0;

function abrirModalAbonoCompra(id, saldo){
  _abonoCompraId = id;
  _abonoCompraSaldo = saldo;
  document.getElementById('abono-compra-saldo').textContent = formatCOP(saldo);
  document.getElementById('abono-compra-monto').value = '';
  document.getElementById('abono-compra-fuente').value = 'efectivo';
  document.getElementById('modal-abono-compra').classList.add('open');
}

function cerrarModalAbonoCompra(){
  document.getElementById('modal-abono-compra').classList.remove('open');
}

async function confirmarAbonoCompra(){
  const monto = rawNum(document.getElementById('abono-compra-monto'));
  const fuente = document.getElementById('abono-compra-fuente').value;

  if(monto <= 0){ showToast('⚠️ Ingresa un monto válido', 'error'); return; }
  if(monto > _abonoCompraSaldo){
    showToast(`⚠️ El abono no puede ser mayor al saldo (${formatCOP(_abonoCompraSaldo)})`, 'error');
    return;
  }

  const nuevoSaldo = _abonoCompraSaldo - monto;

  // Guardar abono en historial
  await sb.from('abonos_compras').insert({
    compra_id: _abonoCompraId,
    monto, fuente,
    fecha: new Date().toISOString().split('T')[0]
  });

 // Actualizar saldo en compra
  const updatePayload = { saldo_credito: nuevoSaldo, fuente };
  if(nuevoSaldo === 0) updatePayload.tipo = 'contado';
  const { error } = await sb.from('compras')
    .update(updatePayload)
    .eq('id', _abonoCompraId);
  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

 // Restar de caja
  await actualizarSaldoCaja(fuente, -monto, `Abono compra — ${formatCOP(monto)}`);

  // Registrar como compra de contado en el mes actual para que reste de utilidad
  const hoy = new Date();
  await sb.from('compras').insert({
    proveedor_id: COMPRAS.find(x=>x.id===_abonoCompraId)?.proveedor_id || null,
    proveedor_nombre: COMPRAS.find(x=>x.id===_abonoCompraId)?.proveedor_nombre || '',
    tipo: 'contado',
    fuente,
    subtotal: monto,
    descuento: 0,
    total: monto,
    saldo_credito: 0,
    fecha: hoy.toISOString().split('T')[0],
    mes: hoy.getMonth() + 1,
    anio: hoy.getFullYear(),
    es_abono: true,
    compra_origen_id: _abonoCompraId
  });

  if(nuevoSaldo === 0){
    showToast(`✅ Compra pagada completamente`, 'success');
  } else {
    showToast(`✅ Abono de ${formatCOP(monto)} — Saldo restante: ${formatCOP(nuevoSaldo)}`, 'success');
  }

  cerrarModalAbonoCompra();
  await cargarCompras();
}

/* ============================================================
   RECIBO / FACTURA PDF
   ============================================================ */

 async function generarRecibo(ventaId){
  const v = VENTAS.find(x => x.id === ventaId);
  if(!v) return;

  const items = v.venta_items || [];
  const fecha = new Date(v.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
    year:'numeric', month:'long', day:'numeric'
  });

  const clienteObj = CLIENTES.find(c =>
    `${c.nombre} ${c.apellido || ''}`.trim() === v.cliente_nombre
  );
  const clienteTel = clienteObj?.numero ? `${clienteObj.numero}` : '';

  const metodoPago = v.tipo === 'contraentrega'
    ? 'Contra Entrega'
    : v.tipo === 'credito'
      ? 'A Crédito'
      : v.metodo_pago === 'efectivo'
        ? 'Efectivo'
        : `Transferencia ${v.banco || ''}`;

  const fechaArchivo = new Date(v.fecha + 'T00:00:00').toLocaleDateString('es-CO', {day:'2-digit', month:'2-digit', year:'2-digit'});
  const nombreArchivo = `Factura_${(v.cliente_nombre || 'Cliente').replace(/\s+/g,'_')}_${fechaArchivo.replace(/\//g,'-')}`;

  const pdfBlob = await construirFacturaPDF({
    titulo: 'Comprobante de Venta',
    fecha, cliente: v.cliente_nombre || 'Sin definir', telefono: clienteTel,
    metodoPago, items: items.map(it => ({
      nombre: it.producto_nombre, cantidad: it.cantidad,
      precio: it.precio_unitario, subtotal: it.precio_unitario * it.cantidad
    })),
    descuento: v.descuento || 0, total: v.total
  });

  mostrarFacturaPDF(pdfBlob, nombreArchivo);
}

/** Construye el PDF de factura directamente con jsPDF (rápido, sin canvas) */
async function construirFacturaPDF({titulo, fecha, cliente, telefono, metodoPago, items, descuento, total}){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({orientation:'portrait', unit:'mm', format:'a4'});
  const pageW = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let y = 24;

  y += 4;

 pdf.setTextColor(225, 15, 130);
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(22);
  pdf.text('ATENAS STYLE SHOP', pageW/2, y, {align:'center'}); y += 9;

  pdf.setTextColor(143, 138, 160);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10);
  pdf.text('Cartagena, Colombia', pageW/2, y, {align:'center'}); y += 5;
  pdf.text('318 434 6975  |  @atenas.style_ctg', pageW/2, y, {align:'center'}); y += 12;

  pdf.setDrawColor(237, 234, 242); pdf.setLineWidth(0.4); pdf.setLineDashPattern([1.5,1.5], 0);
  pdf.line(margin, y, pageW-margin, y); y += 10;

  pdf.setFillColor(245, 244, 248);
  pdf.rect(margin, y-6, pageW-margin*2, 9, 'F');
  pdf.setTextColor(143, 138, 160); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10);
  pdf.text(titulo.toUpperCase(), pageW/2, y, {align:'center'}); y += 14;

  pdf.setFontSize(11);
  const filaInfo = (label, val) => {
    pdf.setTextColor(143,138,160); pdf.setFont('helvetica','normal');
    pdf.text(label, margin, y);
    pdf.setTextColor(26,23,48); pdf.setFont('helvetica','bold');
    pdf.text(String(val), pageW-margin, y, {align:'right'});
    y += 7;
  };
  filaInfo('Fecha:', fecha);
  filaInfo('Cliente:', cliente);
  if(telefono) filaInfo('Teléfono:', telefono);
  if(metodoPago) filaInfo('Método de pago:', metodoPago);
  y += 5;

  pdf.setLineDashPattern([1.5,1.5], 0);
  pdf.line(margin, y, pageW-margin, y); y += 10;

  // Tabla de items
  pdf.setFillColor(245, 244, 248);
  pdf.rect(margin, y-6, pageW-margin*2, 9, 'F');
  pdf.setTextColor(143,138,160); pdf.setFont('helvetica','bold'); pdf.setFontSize(9);
  pdf.text('PRODUCTO', margin+3, y);
  pdf.text('CANT.', pageW-margin-52, y, {align:'center'});
  pdf.text('PRECIO', pageW-margin-32, y, {align:'center'});
  pdf.text('TOTAL', pageW-margin-2, y, {align:'right'});
  y += 11;

  pdf.setTextColor(26,23,48); pdf.setFont('helvetica','normal'); pdf.setFontSize(11);
  const pageH = pdf.internal.pageSize.getHeight();
  items.forEach(it => {
    if(y > pageH - 40){
      pdf.addPage();
      y = 20;
    }
    const nombreLines = pdf.splitTextToSize(it.nombre, 78);
    pdf.text(nombreLines, margin+3, y);
    pdf.text(String(it.cantidad), pageW-margin-52, y, {align:'center'});
    pdf.text(formatCOP(it.precio), pageW-margin-32, y, {align:'center'});
    pdf.setFont('helvetica','bold');
    pdf.text(formatCOP(it.subtotal), pageW-margin-2, y, {align:'right'});
    pdf.setFont('helvetica','normal');
    y += (nombreLines.length * 5.5) + 5;
    pdf.setDrawColor(240,240,240); pdf.setLineDashPattern([], 0);
    pdf.line(margin, y-4, pageW-margin, y-4);
  });

  if(descuento > 0){
    y += 2;
    pdf.setTextColor(233,30,140); pdf.setFont('helvetica','bold'); pdf.setFontSize(11);
    pdf.text('Descuento:', pageW-margin-48, y);
    pdf.text('-' + formatCOP(descuento), pageW-margin-2, y, {align:'right'});
    y += 9;
  }

  y += 4;
pdf.setFillColor(253, 240, 248);
  pdf.rect(margin, y-7, pageW-margin*2, 10, 'F');
  pdf.setTextColor(233,30,140); pdf.setFont('helvetica','bold'); pdf.setFontSize(17);
  const totalStr = formatCOP(total);
  const totalW = pdf.getTextWidth(totalStr);
  const totalFontSize = totalW > 35 ? 13 : 17;
  pdf.setFontSize(totalFontSize);
  pdf.text('TOTAL:', margin+3, y);
  pdf.text(totalStr, pageW-margin-2, y, {align:'right'});
  y += 14;

  pdf.setDrawColor(237,234,242); pdf.setLineDashPattern([1.5,1.5], 0);
  pdf.line(margin, y, pageW-margin, y); y += 12;

  if(metodoPago){
    pdf.setFillColor(255,224,242);
    pdf.setFont('helvetica','bold'); pdf.setFontSize(10);
    const badgeW = pdf.getTextWidth(metodoPago) + 14;
    pdf.roundedRect(pageW/2 - badgeW/2, y-6, badgeW, 9, 5, 5, 'F');
    pdf.setTextColor(233,30,140);
    pdf.text(metodoPago, pageW/2, y, {align:'center'}); y += 16;
  } else {
    y += 4;
  }

  pdf.setTextColor(143,138,160); pdf.setFont('helvetica','normal'); pdf.setFontSize(11);
  pdf.text('¡Gracias por tu compra!', pageW/2, y, {align:'center'}); y += 7;
  pdf.setTextColor(233,30,140); pdf.setFont('helvetica','bold');
  pdf.text('@atenas.style_ctg', pageW/2, y, {align:'center'});

  return pdf.output('blob');
}

/** Muestra el PDF en el modal y prepara descarga/compartir */
async function mostrarFacturaPDF(pdfBlob, nombreArchivo){
  const modal = document.getElementById('modal-factura-preview');
  const iframe = document.getElementById('factura-iframe');
  window._facturaPdfBlob = pdfBlob;
  window._facturaNombre = nombreArchivo;
  const isMobile = window.innerWidth <= 768;

  if(isMobile){
    iframe.style.display = 'none';

    // Limpiar visor anterior
    let visor = document.getElementById('factura-img-visor');
    if(!visor){
      visor = document.createElement('div');
      visor.id = 'factura-img-visor';
      visor.style.cssText = 'overflow-y:auto;background:#525659;padding:8px;';
      iframe.parentNode.insertBefore(visor, iframe);
    }
    visor.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;font-size:13px;">⏳ Cargando vista previa...</div>';
    visor.style.display = 'block';
    modal.classList.add('open');

    // Cargar pdf.js y renderizar todas las páginas
    const url = URL.createObjectURL(pdfBlob);
    const pdfjsLib = window.pdfjsLib;
    if(!pdfjsLib){ 
      visor.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;">❌ Error cargando visor</div>';
      return; 
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdfDoc = await pdfjsLib.getDocument(url).promise;
    visor.innerHTML = '';

    for(let i = 1; i <= pdfDoc.numPages; i++){
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({scale: 2});
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.cssText = 'width:100%;display:block;margin-bottom:4px;';
      await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
      visor.appendChild(canvas);
    }

  } else {
    const visor = document.getElementById('factura-img-visor');
    if(visor) visor.style.display = 'none';
    iframe.style.display = 'block';
    iframe.src = URL.createObjectURL(pdfBlob) + '#toolbar=0';
    modal.classList.add('open');
  }
}

function descargarFacturaArchivo(){
  if(!window._facturaPdfBlob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(window._facturaPdfBlob);
  a.download = (window._facturaNombre || 'factura') + '.pdf';
  a.click();
}



/* ============================================================
   CAJA - CONEXIÓN SUPABASE
   ============================================================ */

let CAJA = null; // saldo actual cargado desde Supabase

async function cargarCaja(){
  const { data, error } = await sb.from('caja_saldo').select('*').eq('id', 1).single();
  if(error){ showToast('❌ Error cargando caja', 'error'); return; }
  CAJA = data;
  renderCaja();
  verificarSaldoInicial();
}

function verificarSaldoInicial(){
  const fab = document.getElementById('fab-saldo-inicial');
  if(!fab) return;
  fab.style.display = 'none';
}

async function actualizarSaldoCaja(fuente, monto, descripcion){
  if(!CAJA) return;

  const campo = fuente === 'efectivo' ? 'efectivo'
    : fuente === 'nequi' ? 'nequi'
    : 'bancolombia';

  const nuevoValor = (CAJA[campo] || 0) + monto;

  const { error } = await sb.from('caja_saldo')
    .update({ [campo]: nuevoValor, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if(error){ showToast('❌ Error actualizando caja: ' + error.message, 'error'); return; }
  CAJA[campo] = nuevoValor;

  if(descripcion){
    await sb.from('movimientos_caja').insert({
      tipo: monto > 0 ? 'entrada' : 'salida',
      descripcion,
      monto: Math.abs(monto),
      cuenta: campo,
      fecha: new Date().toISOString().split('T')[0]
    });
  }

  await renderCaja();
}

async function renderCaja(){
  if(!CAJA) return;

  const efectivo = CAJA.efectivo || 0;
  const nequi = CAJA.nequi || 0;
  const bancolombia = CAJA.bancolombia || 0;
// Sumar pendientes pendientes por cobrar
  const totalPendientes = PENDIENTES.reduce((acc, p) => acc + (p.monto - (p.monto_abonado || 0)), 0);
  
  // Sumar contra entregas en tránsito
  const { data: contras } = await sb.from('ventas')
    .select('total')
    .eq('tipo', 'contraentrega')
    .neq('estado_contraentrega', 'liquidado');
  const totalContras = (contras || []).reduce((acc, v) => acc + v.total, 0);

 const total = efectivo + nequi + bancolombia;

  // KPIs principales
  const elEfectivo = document.getElementById('kpi-efectivo-valor');
  const elNequi = document.getElementById('kpi-nequi-valor');
  const elBanco = document.getElementById('kpi-banco-valor');
  const elTotal = document.getElementById('kpi-total-valor');

  if(elEfectivo) elEfectivo.textContent = formatCOP(efectivo);
  if(elNequi) elNequi.textContent = formatCOP(nequi);
  if(elBanco) elBanco.textContent = formatCOP(bancolombia);
  if(elTotal) elTotal.textContent = formatCOP(total);
  // Actualizar resumen flotante
  const rEfectivo = document.getElementById('r-efectivo');
  const rNequi = document.getElementById('r-nequi');
  const rBanco = document.getElementById('r-banco');
  const rTransito = document.getElementById('r-transito');
  const rPendientes = document.getElementById('r-pendientes');
  const rNeto = document.getElementById('r-neto');

  if(rEfectivo) rEfectivo.textContent = formatCOP(efectivo);
  if(rNequi) rNequi.textContent = formatCOP(nequi);
  if(rBanco) rBanco.textContent = formatCOP(bancolombia);

  // Contra entregas activas (no liquidadas)
  const totalPendientesRes = PENDIENTES.reduce((acc, p) => acc + (p.monto - (p.monto_abonado || 0)), 0);
  if(rPendientes) rPendientes.textContent = totalPendientesRes > 0 ? '-' + formatCOP(totalPendientesRes) : '$0';
  if(rTransito) rTransito.textContent = formatCOP(totalContras);
 if(rNeto) rNeto.textContent = formatCOP(efectivo + nequi + bancolombia);
  const elNequiDetalle = document.getElementById('nequi-saldo-actual');
  const elBancoDetalle = document.getElementById('banco-saldo-actual');
  if(elNequiDetalle) elNequiDetalle.textContent = formatCOP(nequi);
  if(elBancoDetalle) elBancoDetalle.textContent = formatCOP(bancolombia);

  // Historial últimos 5 movimientos
  const movNequi = await cargarMovimientosCuenta('nequi');
  const movBanco = await cargarMovimientosCuenta('bancolombia');

  const histNequi = document.getElementById('nequi-historial');
  const histBanco = document.getElementById('banco-historial');

  if(histNequi) histNequi.innerHTML = movNequi.length ? movNequi.map(m => `
    <div class="bank-row">
      <span style="font-size:12px;">${m.descripcion}</span>
      <span style="font-size:12px;font-weight:700;color:${m.tipo === 'entrada' ? 'var(--verde)' : 'var(--rojo)'};">
        ${m.tipo === 'entrada' ? '+' : '-'}${formatCOP(m.monto)}
      </span>
    </div>
  `).join('') : '<div style="font-size:12px;color:var(--gris-60);padding:8px 0;">Sin movimientos aún</div>';

  if(histBanco) histBanco.innerHTML = movBanco.length ? movBanco.map(m => `
    <div class="bank-row">
      <span style="font-size:12px;">${m.descripcion}</span>
      <span style="font-size:12px;font-weight:700;color:${m.tipo === 'entrada' ? 'var(--verde)' : 'var(--rojo)'};">
        ${m.tipo === 'entrada' ? '+' : '-'}${formatCOP(m.monto)}
      </span>
    </div>
  `).join('') : '<div style="font-size:12px;color:var(--gris-60);padding:8px 0;">Sin movimientos aún</div>';

  // Denominaciones de efectivo en el panel
 const denoms = [100000,50000,20000,10000,5000,2000,1000,500,200,100];
  let totalContado = 0;
  denoms.forEach(d => {
    const campo = d >= 1000 ? `billete_${d}` : `moneda_${d}`;
    const input = document.querySelector(`#panel-efectivo input[data-denom="${d}"]`);
    if(input){
      const cantidad = CAJA[campo] || 0;
      input.value = cantidad;
      const subtotal = cantidad * d;
      totalContado += subtotal;
      const sub = input.closest('.denom-info')?.querySelector('.denom-sub');
      if(sub) sub.textContent = formatCOP(subtotal);
    }
  });
  document.getElementById('total-efectivo').textContent = formatCOP(totalContado);

  // Actualizar esperado para cuadre
  _efectivoEsperado = efectivo;
  recalcCuadreCaja();
  // CUADRE GLOBAL
  await actualizarCuadreGlobal();
}

/* ── SALDO INICIAL ─────────────────────────────────────────── */

async function guardarSaldoInicial(){
 // Calcular efectivo sumando denominaciones directamente
  const denomsSI = [100000,50000,20000,10000,5000,2000,1000,500,200,100];
  let efectivo = 0;
  denomsSI.forEach(d => {
    const input = document.querySelector(`#modal-saldo-inicial input[data-denom="${d}"]`);
    const cantidad = parseInt(input?.value) || 0;
    efectivo += cantidad * d;
  });
  const nequi = rawNum(document.getElementById('si-nequi'));
  const bancolombia = rawNum(document.getElementById('si-bancolombia'));

  // Leer denominaciones del modal
  const denoms = {
    billete_100000: parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="100000"]')?.value) || 0,
    billete_50000:  parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="50000"]')?.value) || 0,
    billete_20000:  parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="20000"]')?.value) || 0,
    billete_10000:  parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="10000"]')?.value) || 0,
    billete_5000:   parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="5000"]')?.value) || 0,
    billete_2000:   parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="2000"]')?.value) || 0,
    billete_1000:   parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="1000"]')?.value) || 0,
    moneda_500:     parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="500"]')?.value) || 0,
    moneda_200:     parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="200"]')?.value) || 0,
    moneda_100:     parseInt(document.querySelector('#modal-saldo-inicial input[data-denom="100"]')?.value) || 0,
  };

  const payload = {
    efectivo,
    nequi,
    bancolombia,
    configurado: true,
    updated_at: new Date().toISOString(),
    ...denoms
  };

  const { error } = await sb.from('caja_saldo').update(payload).eq('id', 1);
  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

  CAJA = { ...CAJA, ...payload };
  showToast(`✅ Saldo inicial configurado — Efectivo: ${formatCOP(efectivo)}, Nequi: ${formatCOP(nequi)}, Bancolombia: ${formatCOP(bancolombia)}`, 'success');
  document.getElementById('modal-saldo-inicial').classList.remove('open');
  document.getElementById('fab-saldo-inicial').style.display = 'none';
  renderCaja();
}

/* ── Fuente de pago para compras de contado ─────────────────── */
let _comprasPendientePago = null;

function abrirModalFuenteCompra(id, total, etiqueta, proveedor){
  _comprasPendientePago = { id, total, etiqueta, proveedor };
  document.getElementById('fuente-compra-desc').textContent = `Compra a ${proveedor} — ${formatCOP(total)}`;
  document.getElementById('fuente-compra-cuenta').value = 'efectivo';
  document.getElementById('modal-fuente-compra').classList.add('open');
}

async function confirmarFuenteCompra(){
  if(!_comprasPendientePago) return;
  const fuente = document.getElementById('fuente-compra-cuenta').value;
  // Guardar fuente en la compra
  console.log('fuente:', fuente, 'id:', _comprasPendientePago.id);
  console.log('fuente:', fuente, 'id:', _comprasPendientePago.id);
  if(_comprasPendientePago.id){
    await sb.from('compras').update({ fuente: fuente.toLowerCase() }).eq('id', _comprasPendientePago.id);
  }
  await actualizarSaldoCaja(fuente, -_comprasPendientePago.total, `Compra — ${_comprasPendientePago.proveedor}`);
  showToast(`✅ Compra registrada — ${formatCOP(_comprasPendientePago.total)} descontados de ${fuente}`);
  document.getElementById('modal-fuente-compra').classList.remove('open');
  _comprasPendientePago = null;
   await cargarCompras();
  await cargarProductos();
  await cargarCaja();
}
/* ============================================================
   CONTRA ENTREGAS - CONEXIÓN SUPABASE
   ============================================================ */

async function cargarContraEntregas(){
  const { data, error } = await sb
    .from('ventas')
    .select('*, venta_items(*)')
    .eq('tipo', 'contraentrega')
    .neq('estado_contraentrega', 'liquidado')
    .order('created_at', { ascending: false });

  if(error){ showToast('❌ Error cargando contra entregas', 'error'); return; }
  renderContraEntregas(data);
}

function renderContraEntregas(ventas){
  const tbody = document.getElementById('contra-tbody');
  if(!tbody) return;

  if(!ventas || ventas.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gris-60);padding:20px;">No hay contra entregas registradas.</td></tr>`;
    const el = document.getElementById('transit-total');
    if(el) el.textContent = formatCOP(0);
    return;
  }

  tbody.innerHTML = ventas.map(v => {
    const items = v.venta_items || [];
    const productos = items.map(it => `${it.producto_nombre} x${it.cantidad}`).join(', ');
    const estado = v.estado_contraentrega || 'preparacion';
    const info = ESTADOS_CONTRA[estado];

    return `
      <tr id="contra-${v.id}">
        <td><strong>${v.cliente_nombre || '—'}</strong></td>
        <td>${v.ciudad_envio || '—'}</td>
        <td style="text-align:right;font-weight:700;">${formatCOP(v.total)}</td>
        <td>${v.transportadora || '—'}</td>
        <td><span class="badge ${info.clase}">${info.label}</span></td>
        <td style="text-align:center;">
          <button class="btn-icon" onclick="abrirEditarContra('${v.id}')" title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" onclick="eliminarContraSupabase('${v.id}')" title="Eliminar" style="color:var(--rojo);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </td>
      </tr>
    `;
 }).join('');

  // Actualizar total en tránsito
  const total = (ventas || []).reduce((acc, v) => acc + v.total, 0);
  const el = document.getElementById('transit-total');
  if(el) el.textContent = formatCOP(total);

  // Cards móvil
  let mobileCont = document.getElementById('contra-mobile-cards');
  if(!mobileCont) return;

  mobileCont.innerHTML = ventas.map(v => {
    const estado = v.estado_contraentrega || 'preparacion';
    const info = ESTADOS_CONTRA[estado];
    return `
      <div style="padding:10px 12px;border-bottom:1px solid var(--gris-20);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <strong style="font-size:13px;">${v.cliente_nombre || '—'}</strong>
          <span class="badge ${info.clase}">${info.label}</span>
        </div>
        <div style="font-size:11px;color:var(--gris-60);margin-bottom:4px;">${v.ciudad_envio || '—'} · ${v.transportadora || '—'}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:13px;color:var(--fucsia);">${formatCOP(v.total)}</span>
          <div style="display:flex;gap:6px;">
            <button class="btn-icon" onclick="abrirEditarContra('${v.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon" onclick="eliminarContraSupabase('${v.id}')" style="color:var(--rojo);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function abrirEditarContra(id){
  const v = VENTAS.find(x => x.id === id) || { id };
  document.getElementById('ce-estado') && (document.getElementById('ce-estado').value = v.estado_contraentrega || 'preparacion');
  document.getElementById('ce-transp') && (document.getElementById('ce-transp').value = v.transportadora || '');
  document.getElementById('ce-cliente') && (document.getElementById('ce-cliente').value = v.cliente_nombre || '');
  document.getElementById('ce-ciudad') && (document.getElementById('ce-ciudad').value = v.ciudad_envio || '');
  document.getElementById('ce-monto') && (document.getElementById('ce-monto').value = v.total ? v.total.toLocaleString('es-CO') : '');
  _contraEditando = id;
  document.getElementById('modal-contra-edit').classList.add('open');
}

async function guardarContraEdit(){
  if(!_contraEditando) return;

  const estado = document.getElementById('ce-estado').value;
  const transp = document.getElementById('ce-transp').value;
  const ciudad = document.getElementById('ce-ciudad').value;

  const cuenta = document.getElementById('ce-cuenta')?.value || 'bancolombia';
  const payload = {
    estado_contraentrega: estado,
    transportadora: transp,
    ciudad_envio: ciudad,
    banco: estado === 'liquidado' ? (cuenta === 'nequi' ? 'Nequi' : 'Bancolombia') : null
  };

  // Si pasa a Liquidado, sumar a Nequi por defecto
const { error } = await sb.from('ventas').update(payload).eq('id', _contraEditando);
  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

  if(estado === 'liquidado'){
    const cuenta = document.getElementById('ce-cuenta').value;
    const venta = VENTAS.find(x => x.id === _contraEditando);
    if(venta) await actualizarSaldoCaja(cuenta, venta.total, `Contra entrega — ${venta.cliente_nombre}`);
    showToast(`✅ Contra entrega liquidada — sumado a ${cuenta}`, 'success');
    // Eliminar de envíos
    _enviosData = _enviosData.filter(x => x.id !== _contraEditando);
    renderEnviosLista();
    actualizarKpisEnvios();
  } else {
    showToast(`✅ Contra entrega actualizada`);
  }
  cerrarModalContraEdit();
  await cargarContraEntregas();
  await cargarVentas();
}

function eliminarContraSupabase(id){
  confirmarAccion('¿Eliminar esta contra entrega?', async () => {
    await sb.from('venta_items').delete().eq('venta_id', id);
    await sb.from('ventas').delete().eq('id', id);
    showToast('🗑️ Contra entrega eliminada', 'info');
    await cargarContraEntregas();
  });
}
function cambioEstadoContra(){
  const estado = document.getElementById('ce-estado').value;
  const wrap = document.getElementById('ce-cuenta-wrap');
  if(wrap) wrap.style.display = estado === 'liquidado' ? 'block' : 'none';
}

async function guardarDenominacionesCaja(){
  if(!CAJA) return;
  const denoms = {};
  let totalCalculado = 0;
  const inputs = document.querySelectorAll('#panel-efectivo input[data-denom]');
  inputs.forEach(input => {
    const d = parseInt(input.dataset.denom);
    const cantidad = parseInt(input.value) || 0;
    const campo = d >= 1000 ? `billete_${d}` : `moneda_${d}`;
    denoms[campo] = cantidad;
    totalCalculado += cantidad * d;
  });
  denoms.efectivo = totalCalculado;
  await sb.from('caja_saldo').update(denoms).eq('id', 1);
  Object.assign(CAJA, denoms);
  CAJA.efectivo = totalCalculado;
  const elEfectivo = document.getElementById('kpi-efectivo-valor');
  if(elEfectivo) elEfectivo.textContent = formatCOP(totalCalculado);
  _efectivoEsperado = totalCalculado;
  recalcCuadreCaja();
  await actualizarCuadreGlobal();
}

/* ============================================================
   PENDIENTES - CONEXIÓN SUPABASE
   ============================================================ */

let PENDIENTES = [];

async function cargarPendientes(){
  const { data, error } = await sb
    .from('pendientes')
    .select('*')
    .eq('pagado', false)
    .order('created_at', { ascending: false });

  if(error){ showToast('❌ Error cargando pendientes', 'error'); return; }
  PENDIENTES = data;
  renderPendientes();
}

function renderPendientes(){
  const lista = document.getElementById('pendientes-lista');
  if(!lista) return;

  if(PENDIENTES.length === 0){
    lista.innerHTML = `<div style="padding:20px;text-align:center;color:var(--gris-60);font-size:13px;">No hay pendientes registrados.</div>`;
    recalcPendientesTotal();
    return;
  }

  lista.innerHTML = PENDIENTES.map(p => {
    const fecha = new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-CO');
    const fuenteLabel = p.fuente === 'efectivo' ? '💵 Efectivo' : p.fuente === 'nequi' ? 'nequi' : 'Bancolombia';
    return `
      <div class="pendiente-row" id="pend-${p.id}" data-monto="${p.monto}">
        <div class="pendiente-info">
          <strong>${p.descripcion}</strong>
          <span class="pendiente-tipo">${fuenteLabel} · ${fecha}</span>
          ${p.monto_abonado > 0 ? `<span style="font-size:11px;color:var(--verde);">Abonado: ${formatCOP(p.monto_abonado)} — Resta: ${formatCOP(p.monto - p.monto_abonado)}</span>` : ''}
        </div>
        <div class="pendiente-actions">
          <span class="pendiente-monto">-${formatCOP(p.monto - (p.monto_abonado || 0))}</span>
          <button class="btn-icon" title="Editar" onclick="editarPendiente('${p.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button class="btn-icon" title="Abonar" onclick="abrirModalAbonoPendiente('${p.id}', ${p.monto - (p.monto_abonado || 0)})" style="color:var(--verde);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </button>
      <button class="btn-icon" title="Eliminar" onclick="eliminarPendiente('${p.id}')" style="color:var(--rojo);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
        </div>
      </div>
    `;
  }).join('');

  recalcPendientesTotal();
}

async function guardarPendiente(){
  const desc = document.getElementById('pe-descripcion').value.trim();
  const monto = rawNum(document.getElementById('pe-monto'));
  const fuente = document.getElementById('pe-fuente').value;

  if(!desc){
    showToast('⚠️ Falta la descripción', 'error');
    return;
  }
  if(monto <= 0){
    showToast('⚠️ Falta el monto', 'error');
    return;
  }

  // Editar pendiente existente
  if(_pendienteEditando){
    const pViejo = PENDIENTES.find(x => x.id === _pendienteEditando);
    const montoViejo = pViejo.monto || 0;
    const fuenteVieja = (pViejo.fuente || 'efectivo').toLowerCase();
    const fuenteNueva = fuente.toLowerCase();

    // Revertir el monto viejo
    const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
    const valorRevertido = (cajaActual[fuenteVieja] || 0) + montoViejo;
    await sb.from('caja_saldo').update({ [fuenteVieja]: valorRevertido }).eq('id', 1);
    CAJA[fuenteVieja] = valorRevertido;

    // Aplicar el monto nuevo
    const valorNuevo = (CAJA[fuenteNueva] || 0) - monto;
    await sb.from('caja_saldo').update({ [fuenteNueva]: valorNuevo }).eq('id', 1);
    CAJA[fuenteNueva] = valorNuevo;

    // Borrar movimiento viejo y crear nuevo con monto correcto
    await sb.from('movimientos_caja').delete().eq('descripcion', `Pendiente — ${pViejo.descripcion}`);
    await sb.from('movimientos_caja').insert({
      tipo: 'salida',
      descripcion: `Pendiente — ${desc}`,
      monto: monto,
      cuenta: fuenteNueva,
      fecha: new Date().toISOString().split('T')[0]
    });

    const { error } = await sb.from('pendientes')
      .update({ descripcion: desc, monto, fuente: fuenteNueva })
      .eq('id', _pendienteEditando);
    if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

    showToast(`✅ Pendiente actualizado`);
    _pendienteEditando = null;
    cerrarModalPendiente();
    await cargarPendientes();
    await cargarCaja();
    return;
  }

  // Nuevo pendiente
  const hoy = new Date();
  const payload = {
    descripcion: desc,
    monto,
    monto_abonado: 0,
    fuente,
    pagado: false,
    fecha: hoy.toISOString().split('T')[0]
  };

  const { error } = await sb.from('pendientes').insert(payload);
  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

  // Solo restar si NO está ya descontado
  const yaDescontado = document.getElementById('pe-ya-descontado').checked;
  if(!yaDescontado){
    await actualizarSaldoCaja(fuente, -monto, `Pendiente — ${desc}`);
  }
  showToast(`✅ Pendiente "${desc}" agregado — ${formatCOP(monto)}`);
  cerrarModalPendiente();
  await cargarPendientes();
}



/* ── Abono parcial a pendiente ──────────────────────────────── */
let _abonoPendienteId = null;
let _abonoPendienteSaldo = 0;

function abrirModalAbonoPendiente(id, saldo){
  _abonoPendienteId = id;
  _abonoPendienteSaldo = saldo;
  document.getElementById('abono-pend-saldo').textContent = formatCOP(saldo);
  document.getElementById('abono-pend-monto').value = '';
 console.log('eliminando id:', id, 'pendientes:', PENDIENTES.map(x=>x.id));
    const p = PENDIENTES.find(x => x.id === id);
  document.getElementById('abono-pend-fuente').value = p?.fuente || 'efectivo';
  document.getElementById('modal-abono-pendiente').classList.add('open');
}

function cerrarModalAbonoPendiente(){
  document.getElementById('modal-abono-pendiente').classList.remove('open');
}

async function confirmarAbonoPendiente(){
  const monto = rawNum(document.getElementById('abono-pend-monto'));
  const fuente = document.getElementById('abono-pend-fuente').value;

  if(monto <= 0){
    showToast('⚠️ Ingresa un monto válido', 'error');
    return;
  }
  if(monto > _abonoPendienteSaldo){
    showToast(`⚠️ El abono no puede ser mayor al saldo (${formatCOP(_abonoPendienteSaldo)})`, 'error');
    return;
  }

  const pendiente = PENDIENTES.find(p => p.id === _abonoPendienteId);
  if(!pendiente) return;

  const nuevoAbonado = (pendiente.monto_abonado || 0) + monto;
  const pagado = nuevoAbonado >= pendiente.monto;

  const { error } = await sb.from('pendientes')
    .update({ monto_abonado: nuevoAbonado, pagado })
    .eq('id', _abonoPendienteId);

  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

 // Sumar a caja — el cliente está pagando
  await actualizarSaldoCaja(fuente, monto, `Abono pendiente — ${pendiente.descripcion}`);

  if(pagado){
    await sb.from('pendientes').delete().eq('id', _abonoPendienteId);
    showToast(`✅ Pendiente pagado completamente y eliminado`, 'success');
  } else {
    showToast(`✅ Abono de ${formatCOP(monto)} registrado — Resta: ${formatCOP(pendiente.monto - nuevoAbonado)}`, 'success');
  }

  cerrarModalAbonoPendiente();
  await cargarPendientes();
}
async function ajustarSaldoBanco(banco){
  const inputId = banco === 'nequi' ? 'nequi-nuevo' : 'banco-nuevo';
  const nuevoSaldo = rawNum(document.getElementById(inputId));

  if(nuevoSaldo < 0){
    showToast('⚠️ Ingresa un saldo válido', 'error');
    return;
  }

  const { error } = await sb.from('caja_saldo')
    .update({ [banco]: nuevoSaldo, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

  CAJA[banco] = nuevoSaldo;
  document.getElementById(inputId).value = '';
  showToast(`✅ Saldo de ${banco} actualizado: ${formatCOP(nuevoSaldo)}`, 'success');
  await renderCaja();
}

async function cargarMovimientosCuenta(cuenta){
  const { data, error } = await sb
    .from('movimientos_caja')
    .select('*')
    .eq('cuenta', cuenta)
    .order('created_at', { ascending: false })
    .limit(5);

  if(error) return [];
  return data || [];
}
/* ============================================================
   DASHBOARD - CONEXIÓN SUPABASE
   ============================================================ */

async function cargarDashboard(mes, anio){
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();
  const m = mes || mesActual;
  const a = anio || anioActual;

  // Generar opciones del selector dinámicamente
  const selector = document.getElementById('dash-mes-general');
  if(selector){
    selector.innerHTML = `<option value="">📅 Mes actual (${MESES_NOMBRE[mesActual]})</option>`;
    for(let i = 1; i <= mesActual; i++){
      selector.innerHTML += `<option value="${i}" ${mes === i ? 'selected' : ''}>${MESES_NOMBRE[i]}</option>`;
    }
  }

  // Si es un mes pasado, buscar en cierres_mensuales
  const hoyActual = new Date();
  const esMesActual = m === hoyActual.getMonth() + 1 && a === hoyActual.getFullYear();

  if(!esMesActual){
    const { data: cierre } = await sb.from('cierres_mensuales')
      .select('*').eq('mes', m).eq('anio', a).single();

    if(cierre){
      document.getElementById('dash-utilidad').textContent = formatCOP(cierre.utilidad);
      document.getElementById('dash-margen').textContent = cierre.ventas_total > 0
        ? (cierre.utilidad / cierre.ventas_total * 100).toFixed(1) + '%' : '0%';
      document.getElementById('dash-ventas-total').textContent = formatCOP(cierre.ventas_total);
      document.getElementById('dash-compras-gastos').textContent = formatCOP(cierre.compras_total + cierre.gastos_total);

     // Top productos — del cierre o de tablas reales
      if(cierre.top_productos){
        const medallas = ['🥇','🥈','🥉'];
        const contProd = document.getElementById('dash-top-productos');
        if(contProd) contProd.innerHTML = cierre.top_productos.map((p,i) => `
          <div class="top3-card">
            <div class="top3-medal">${medallas[i]}</div>
            <div class="top3-icon">📦</div>
            <div class="top3-name">${p.nombre}</div>
            <div class="top3-units">${p.cantidad}</div>
            <div class="top3-units-label">Unidades</div>
          </div>
        `).join('');
      } else {
        await cargarTopProductos(m, a);
      }

      // Top clientes — del cierre o de tablas reales
      if(cierre.top_clientes){
        const medallas = ['🥇','🥈','🥉'];
        const contCli = document.getElementById('dash-top-clientes');
        if(contCli) contCli.innerHTML = cierre.top_clientes.map((c,i) => `
          <div class="cliente-medalla-card">
            <div class="cliente-medalla">${medallas[i]}</div>
            <div class="cliente-avatar">${c.nombre.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
            <div class="cliente-medalla-info">
              <div class="cliente-medalla-name">${c.nombre}</div>
            </div>
            <div class="cliente-medalla-value">${formatCOP(c.total)}</div>
          </div>
        `).join('');
      } else {
        const { data: ventasMes } = await sb.from('ventas')
          .select('total, cliente_nombre, cliente_id').eq('mes', m).eq('anio', a);
        cargarTopClientes(ventasMes || []);
        cargarTopDias(ventasMes || []);
      }

      _ventasActuales = cierre.ventas_total;
      _metaVentas = cierre.meta_ventas || _metaVentas;
      actualizarBarraMeta();
      await cargarGrafico6Meses(a);
      return;
    } else {
      // No hay cierre para ese mes — mostrar datos históricos si existen
      document.getElementById('dash-utilidad').textContent = '$0';
      document.getElementById('dash-margen').textContent = '0%';
      document.getElementById('dash-ventas-total').textContent = '$0';
      document.getElementById('dash-compras-gastos').textContent = '$0';
      await cargarGrafico6Meses(a);
      return;
    }
  }

  // Cargar ventas, compras y gastos del mes
  const [ventasRes, comprasRes, gastosRes] = await Promise.all([
    sb.from('ventas').select('total, fecha, cliente_nombre, cliente_id').eq('mes', m).eq('anio', a),
   sb.from('compras').select('total, tipo, es_abono').eq('mes', m).eq('anio', a),
    sb.from('gastos').select('valor').eq('mes', m).eq('anio', a)
  ]);

  const ventas = ventasRes.data || [];
  const compras = comprasRes.data || [];
  const gastos = gastosRes.data || [];

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
const totalCompras = compras.filter(c => c.tipo === 'contado' || c.es_abono).reduce((acc, c) => acc + c.total, 0);
  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);
  const utilidad = totalVentas - totalCompras - totalGastos;
  const margen = totalVentas > 0 ? (utilidad / totalVentas * 100) : 0;

  // KPIs
  document.getElementById('dash-utilidad').textContent = formatCOP(utilidad);
  document.getElementById('dash-margen').textContent = margen.toFixed(1) + '%';
  document.getElementById('dash-ventas-total').textContent = formatCOP(totalVentas);
  document.getElementById('dash-compras-gastos').textContent = formatCOP(totalCompras + totalGastos);

  // Meta de ventas
  _ventasActuales = totalVentas;
  actualizarBarraMeta();

  // Top 3 productos
  await cargarTopProductos(m, a);

  // Top 3 clientes
  cargarTopClientes(ventas);

  // Top 3 días
  cargarTopDias(ventas);

  // Gráfico 6 meses
  await cargarGrafico6Meses(a);
}

async function cargarTopProductos(mes, anio){
  // Primero obtener IDs de ventas del mes
  const { data: ventasMes } = await sb
    .from('ventas').select('id')
    .eq('mes', mes).eq('anio', anio);

  const cont = document.getElementById('dash-top-productos');
  if(!cont) return;

  if(!ventasMes?.length){
    cont.innerHTML = `<div style="text-align:center;color:var(--gris-60);padding:20px;font-size:13px;">Sin ventas este mes</div>`;
    return;
  }

  const { data } = await sb
    .from('venta_items').select('producto_id, producto_nombre, producto_icono, cantidad')
    .in('venta_id', ventasMes.map(v => v.id));

  const agrupado = {};
  (data || []).forEach(it => {
    const key = it.producto_id || it.producto_nombre;
    if(!agrupado[key]) agrupado[key] = { nombre: it.producto_nombre, icono: it.producto_icono || '📦', cantidad: 0, producto_id: it.producto_id };
    agrupado[key].cantidad += it.cantidad;
  });

  const top3 = Object.values(agrupado).sort((a,b) => b.cantidad - a.cantidad).slice(0,3);
  const medallas = ['🥇','🥈','🥉'];

  if(top3.length === 0){
    cont.innerHTML = `<div style="text-align:center;color:var(--gris-60);padding:20px;font-size:13px;">Sin ventas este mes</div>`;
    return;
  }

  cont.innerHTML = top3.map((p, i) => {
    const prod = PRODUCTOS.find(x => x.id === p.producto_id);
    const ref = prod?.referencia || '';
    return `
      <div class="top3-card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">
        <div style="position:relative;">
          ${prod?.foto_url
            ? `<img src="${prod.foto_url}" style="width:100%;height:120px;object-fit:cover;display:block;">`
            : `<div style="width:100%;height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;background:var(--gris-10);">${p.icono}</div>`
          }
        </div>
        <div style="padding:8px 10px;text-align:center;">
          <div class="top3-medal" style="margin-bottom:4px;">${medallas[i]}</div>
          <div class="top3-name" style="font-size:11px;margin-bottom:3px;">${p.nombre}</div>
          ${ref ? `<span class="top3-ref" style="font-size:9px;">${ref}</span>` : ''}
          <div class="top3-units" style="margin-top:4px;font-size:18px;">${p.cantidad}</div>
          <div class="top3-units-label" style="font-size:9px;">Unidades</div>
        </div>
      </div>
    `;
  }).join('');
}

function cargarTopClientes(ventas){
  const cont = document.getElementById('dash-top-clientes');
  if(!cont) return;

  // Agrupar por cliente
  const agrupado = {};
  ventas.forEach(v => {
    const key = v.cliente_nombre || 'Sin definir';
    if(!agrupado[key]) agrupado[key] = { nombre: key, total: 0 };
    agrupado[key].total += v.total;
  });

  const top3 = Object.values(agrupado).sort((a,b) => b.total - a.total).slice(0,3);
  const medallas = ['🥇','🥈','🥉'];

  if(top3.length === 0){
    cont.innerHTML = `<div style="text-align:center;color:var(--gris-60);padding:20px;font-size:13px;">Sin ventas este mes</div>`;
    return;
  }

  cont.innerHTML = top3.map((c, i) => {
    const clienteObj = CLIENTES.find(x => `${x.nombre} ${x.apellido || ''}`.trim() === c.nombre);
    const ciudad = clienteObj?.ciudad || '—';
    const iniciales = c.nombre.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    return `
      <div class="cliente-medalla-card">
        <div class="cliente-medalla">${medallas[i]}</div>
        <div class="cliente-avatar">${iniciales}</div>
        <div class="cliente-medalla-info">
          <div class="cliente-medalla-name">${c.nombre}</div>
          <div class="cliente-medalla-sub">${ciudad}</div>
        </div>
        <div class="cliente-medalla-value">${formatCOP(c.total)}</div>
      </div>
    `;
  }).join('');
}

function cargarTopDias(ventas){
  const cont = document.getElementById('dash-top-dias');
  if(!cont) return;

  const agrupado = {};
  ventas.forEach(v => {
    const key = v.fecha;
    if(!agrupado[key]) agrupado[key] = { fecha: key, total: 0, count: 0 };
    agrupado[key].total += v.total;
    agrupado[key].count++;
  });

  const top3 = Object.values(agrupado).sort((a,b) => b.total - a.total).slice(0,3);
  const medallas = ['🥇','🥈','🥉'];
  const diasSemana = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const mesesNombre = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  if(top3.length === 0){
    cont.innerHTML = `<div style="text-align:center;color:var(--gris-60);padding:20px;font-size:13px;">Sin ventas este mes</div>`;
    return;
  }

  cont.innerHTML = top3.map((d, i) => {
    const fecha = new Date(d.fecha + 'T00:00:00');
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = String(fecha.getDate()).padStart(2,'0');
    const mes = mesesNombre[fecha.getMonth() + 1];
    return `
      <div class="cliente-medalla-card">
        <div class="cliente-medalla">${medallas[i]}</div>
        <div class="calendario-icon">
          <div class="calendario-mes">${mes}</div>
          <div class="calendario-dia">${dia}</div>
        </div>
        <div class="cliente-medalla-info">
          <div class="cliente-medalla-name">${diaSemana} ${dia}/${fecha.getMonth()+1}/${fecha.getFullYear()}</div>
          <div class="cliente-medalla-sub">${d.count} venta${d.count > 1 ? 's' : ''} registrada${d.count > 1 ? 's' : ''}</div>
        </div>
        <div class="cliente-medalla-value">${formatCOP(d.total)}</div>
      </div>
    `;
  }).join('');
}

async function cargarGrafico6Meses(anio){
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const meses = [];
  for(let i = 5; i >= 0; i--){
    let m = mesActual - i;
    let a = anio;
    if(m <= 0){ m += 12; a--; }
    meses.push({ mes: m, anio: a });
  }

  const resultados = await Promise.all(
    meses.map(({ mes, anio: a }) =>
      sb.from('ventas').select('total').eq('mes', mes).eq('anio', a)
    )
  );

  const totales = resultados.map(r => (r.data || []).reduce((acc, v) => acc + v.total, 0));
  const maxVal = Math.max(...totales, 1);

  const cont = document.getElementById('dash-grafico-meses');
  if(!cont) return;

  cont.innerHTML = meses.map(({ mes }, i) => {
    const pct = Math.round((totales[i] / maxVal) * 100);
    const esActual = i === 5;
    const label = MESES_NOMBRE[mes].slice(0,3);
   const valor = formatCOP(totales[i]);
    return `
      <div class="bar-chart-col" data-mes="${mes}">
        <div class="bar-chart-bar ${esActual ? 'actual' : ''}" style="height:${Math.max(pct,2)}%;">
          <span class="bar-chart-value">${valor}</span>
        </div>
        <div class="bar-chart-label">${label}</div>
      </div>
    `;
  }).join('');
}
function cambiarMesDashboard(valor){
  const hoy = new Date();
  const mes = valor ? parseInt(valor) : null;
  cargarDashboard(mes, hoy.getFullYear());
}
/* ============================================================
   CIERRE DE MES - CONEXIÓN SUPABASE
   ============================================================ */

async function confirmarCierreMes(){
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  const [ventasRes, comprasRes, gastosRes, venta_itemsRes] = await Promise.all([
    sb.from('ventas').select('total, cliente_nombre, venta_items(producto_id, producto_nombre, cantidad)').eq('mes', mes).eq('anio', anio),
    sb.from('compras').select('total, tipo, es_abono').eq('mes', mes).eq('anio', anio),
    sb.from('gastos').select('valor, tipo').eq('mes', mes).eq('anio', anio),
    sb.from('venta_items').select('producto_id, producto_nombre, cantidad')
  ]);

  const ventas = ventasRes.data || [];
  const compras = comprasRes.data || [];
  const gastos = gastosRes.data || [];

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
 const totalCompras = compras.filter(c => c.tipo === 'contado' || c.es_abono).reduce((acc, c) => acc + c.total, 0);
  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0);
  const utilidad = totalVentas - totalCompras - totalGastos;

  // Top productos
  const prodAgrupado = {};
  ventas.forEach(v => {
    (v.venta_items || []).forEach(it => {
      const key = it.producto_id || it.producto_nombre;
      if(!prodAgrupado[key]) prodAgrupado[key] = { nombre: it.producto_nombre, cantidad: 0 };
      prodAgrupado[key].cantidad += it.cantidad;
    });
  });
  const topProductos = Object.values(prodAgrupado).sort((a,b) => b.cantidad - a.cantidad).slice(0,3);

  // Top clientes
  const cliAgrupado = {};
  ventas.forEach(v => {
    const key = v.cliente_nombre || 'Sin definir';
    if(!cliAgrupado[key]) cliAgrupado[key] = { nombre: key, total: 0 };
    cliAgrupado[key].total += v.total;
  });
  const topClientes = Object.values(cliAgrupado).sort((a,b) => b.total - a.total).slice(0,3);

  // Gastos por tipo
  const gastosPorTipo = {};
  gastos.forEach(g => {
    gastosPorTipo[g.tipo] = (gastosPorTipo[g.tipo] || 0) + g.valor;
  });

  const payload = {
    mes,
    anio,
    ventas_total: totalVentas,
    compras_total: totalCompras,
    gastos_total: totalGastos,
    utilidad,
    efectivo_final: CAJA?.efectivo || 0,
    nequi_final: CAJA?.nequi || 0,
    bancolombia_final: CAJA?.bancolombia || 0,
    meta_ventas: _metaVentas,
    top_productos: topProductos,
    top_clientes: topClientes,
    gastos_por_tipo: gastosPorTipo
  };

  const { data: existente } = await sb.from('cierres_mensuales')
    .select('id').eq('mes', mes).eq('anio', anio).maybeSingle();

  if(existente){
    await sb.from('cierres_mensuales').update(payload).eq('id', existente.id);
  } else {
    await sb.from('cierres_mensuales').insert(payload);
  }

  // Sumar utilidad a caja
  if(utilidad > 0){
    await actualizarSaldoCaja('efectivo', utilidad, `Utilidad mes ${MESES_NOMBRE[mes]} ${anio}`);
  }

  showToast(`✅ Mes de ${MESES_NOMBRE[mes]} cerrado — Utilidad: ${formatCOP(utilidad)}`, 'success');
  cerrarModalCerrarMes();

  // Quitar banner de notificación
  const banner = document.getElementById('banner-cierre-pendiente');
  if(banner) banner.remove();

  // Bloquear botón hasta el siguiente mes
  const btn = document.getElementById('btn-cerrar-mes');
  const hint = document.getElementById('cerrar-mes-hint');
  const siguienteMes = mes + 1;
  const nombreSiguiente = MESES_NOMBRE[siguienteMes > 12 ? 1 : siguienteMes];
  if(btn){
    btn.disabled = true;
    btn.style.opacity = '.5';
  }
  if(hint) hint.textContent = `✅ Cerrado — disponible en ${nombreSiguiente}`;

  await cargarDashboard();
}

function editarPendiente(id){
  const p = PENDIENTES.find(x => x.id === id);
  if(!p) return;

  document.getElementById('pe-descripcion').value = p.descripcion;
  document.getElementById('pe-monto').value = p.monto.toLocaleString('es-CO');
  document.getElementById('pe-fuente').value = p.fuente || 'efectivo';
  _pendienteEditando = id;
  document.getElementById('modal-pendiente').classList.add('open');
  document.querySelector('#modal-pendiente .btn-primary').textContent = '💾 Guardar Cambios';
}

async function actualizarBotonCerrarMes(){
  const hoy = new Date();
const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const diaActual = hoy.getDate();
  const mes = MESES_NOMBRE[hoy.getMonth() + 1];
  const btn = document.getElementById('btn-cerrar-mes');
  const hint = document.getElementById('cerrar-mes-hint');

  if(diaActual === ultimoDia){
    btn.disabled = false;
    btn.style.opacity = '1';
    if(hint) hint.textContent = `¡Hoy es el último día de ${mes}!`;
  } else {
    btn.disabled = true;
    btn.style.opacity = '.5';
   if(hint) hint.textContent = `Disponible el ${ultimoDia} de ${MESES_NOMBRE[hoy.getMonth() + 1]}`;
  }
  // Verificar si el mes anterior no fue cerrado
  const mesAnterior = hoy.getMonth(); // getMonth() da el mes anterior en base 0
  const anioAnterior = mesAnterior === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear();
  const mesAnteriorNum = mesAnterior === 0 ? 12 : mesAnterior;

 // Solo verificar desde julio 2026 en adelante (junio es el primer mes real)
  const primerMesReal = 6// junio 2026
  const primerAnioReal = 2026;

  const esDespuesDelPrimerMes = (anioAnterior > primerAnioReal) || 
    (anioAnterior === primerAnioReal && mesAnteriorNum > primerMesReal);

  if(diaActual > 1 && esDespuesDelPrimerMes){
    const { data: cierre } = await sb.from('cierres_mensuales')
      .select('id')
      .eq('mes', mesAnteriorNum)
      .eq('anio', anioAnterior)
      .maybeSingle();

    if(!cierre){
      // Mostrar banner persistente que no se cierra
      let banner = document.getElementById('banner-cierre-pendiente');
      if(!banner){
        banner = document.createElement('div');
        banner.id = 'banner-cierre-pendiente';
        banner.style.cssText = `
          position:fixed;top:0;left:0;right:0;z-index:999;
          background:var(--rojo);color:#fff;
          padding:12px 20px;text-align:center;
          font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;
          display:flex;align-items:center;justify-content:center;gap:12px;
        `;
        banner.innerHTML = `
          <span>⚠️ No cerraste el mes de ${MESES_NOMBRE[mesAnteriorNum]} ${anioAnterior} — ve a Caja para cerrarlo</span>
          <button onclick="showView('caja')" style="background:#fff;color:var(--rojo);border:none;border-radius:20px;padding:4px 14px;font-weight:800;font-size:12px;cursor:pointer;font-family:'Nunito',sans-serif;">
            Ir a Caja
          </button>
        `;
        document.body.prepend(banner);
      }
    }
  }
}
/* ============================================================
   ENVÍOS - SEGUIMIENTO
   ============================================================ */

let _enviosData = [];
let _envioSeleccionado = null;

const CIUDADES_COORDS = {
  'cartagena':     {lat:10.3910, lng:-75.4794, color:'#E91E8C'},
  'barranquilla':  {lat:10.9639, lng:-74.7964, color:'#27AE60'},
  'santa marta':   {lat:11.2408, lng:-74.1990, color:'#16A085'},
  'valledupar':    {lat:10.4631, lng:-73.2532, color:'#1ABC9C'},
  'bucaramanga':   {lat:7.1193,  lng:-73.1227, color:'#E74C3C'},
  'medellín':      {lat:6.2442,  lng:-75.5812, color:'#8B5CF6'},
  'medellin':      {lat:6.2442,  lng:-75.5812, color:'#8B5CF6'},
  'manizales':     {lat:5.0703,  lng:-75.5138, color:'#D35400'},
  'pereira':       {lat:4.8133,  lng:-75.6961, color:'#2980B9'},
  'bogotá':        {lat:4.7110,  lng:-74.0721, color:'#3498DB'},
  'bogota':        {lat:4.7110,  lng:-74.0721, color:'#3498DB'},
  'villavicencio': {lat:4.1420,  lng:-73.6266, color:'#229954'},
  'cali':          {lat:3.4516,  lng:-76.5320, color:'#F39C12'},
  'pasto':         {lat:1.2136,  lng:-77.2811, color:'#8E44AD'},
  'montecristo':   {lat:8.8167,  lng:-74.9667, color:'#E91E8C'},
  'magangué':      {lat:9.2416,  lng:-74.7541, color:'#27AE60'},
  'magangue':      {lat:9.2416,  lng:-74.7541, color:'#27AE60'},
  'montería':      {lat:8.7575,  lng:-75.8878, color:'#E74C3C'},
  'monteria':      {lat:8.7575,  lng:-75.8878, color:'#E74C3C'},
  'sincelejo':     {lat:9.3047,  lng:-75.3978, color:'#8B5CF6'},
  'riohacha':      {lat:11.5449, lng:-72.9072, color:'#F39C12'},
  'cúcuta':        {lat:7.8939,  lng:-72.5078, color:'#2980B9'},
  'cucuta':        {lat:7.8939,  lng:-72.5078, color:'#2980B9'},
  'ibagué':        {lat:4.4389,  lng:-75.2322, color:'#D35400'},
  'ibague':        {lat:4.4389,  lng:-75.2322, color:'#D35400'},
  'armenia':       {lat:4.5339,  lng:-75.6811, color:'#1ABC9C'},
  'neiva':         {lat:2.9273,  lng:-75.2819, color:'#8E44AD'},
  'popayán':       {lat:2.4419,  lng:-76.6063, color:'#229954'},
  'popayan':       {lat:2.4419,  lng:-76.6063, color:'#229954'},
  'tunja':         {lat:5.5353,  lng:-73.3678, color:'#E91E8C'},
  'santa rosa':    {lat:6.6333,  lng:-75.4667, color:'#27AE60'},
  'turbo':         {lat:8.0992,  lng:-76.7233, color:'#E74C3C'},
  'apartadó':      {lat:7.8797,  lng:-76.6278, color:'#8B5CF6'},
  'apartado':      {lat:7.8797,  lng:-76.6278, color:'#8B5CF6'},
  'montecristo':   {lat:8.8167,  lng:-74.9667, color:'#E91E8C'},

};
function ciudadCoords(nombre){
  if(!nombre) return null;
  return CIUDADES_COORDS[nombre.toLowerCase().trim()] || null;
}

async function cargarEnvios(){
  const { data, error } = await sb
    .from('ventas')
    .select('*, venta_items(*)')
    .eq('tipo', 'contraentrega')
    .neq('estado_contraentrega', 'liquidado')
    .order('created_at', {ascending: false});

  if(error){ showToast('❌ Error cargando envíos', 'error'); return; }
  _enviosData = data || [];
  renderEnviosLista();
  actualizarKpisEnvios();
  if(_enviosData.length > 0) seleccionarEnvio(_enviosData[0].id);
}

function actualizarKpisEnvios(){
  const prep    = _enviosData.filter(v => v.estado_contraentrega === 'preparacion');
  const camino  = _enviosData.filter(v => v.estado_contraentrega === 'enviado');
  const entregado = _enviosData.filter(v => v.estado_contraentrega === 'entregado');
  const totalTransito = _enviosData.reduce((a,v)=>a+v.total,0);
  const totalEntregado = entregado.reduce((a,v)=>a+v.total,0);

  document.getElementById('env-kpi-transito').textContent = formatCOP(totalTransito);
  document.getElementById('env-kpi-transito-count').textContent = _enviosData.length + ' pedidos';
  document.getElementById('env-kpi-entregados').textContent = formatCOP(totalEntregado);
  document.getElementById('env-kpi-prep').textContent = prep.length;
  document.getElementById('env-kpi-camino').textContent = camino.length;
}

function renderEnviosLista(){
  const lista = document.getElementById('envios-lista');
  if(!lista) return;

  if(!_enviosData.length){
    lista.innerHTML = `<div style="padding:30px;text-align:center;color:var(--gris-60);font-size:13px;">No hay envíos activos. Los pedidos contra entrega aparecerán aquí.</div>`;
    return;
  }

  const estadoInfo = {
    preparacion: {emoji:'📦', clase:'est-prep',      label:'Preparación', bg:'var(--amarillo-light)'},
    enviado:     {emoji:'🚚', clase:'est-camino',    label:'En camino',   bg:'var(--celeste-light)'},
    entregado:   {emoji:'✅', clase:'est-entregado', label:'Entregado',   bg:'var(--verde-light)'},
    devuelto:    {emoji:'↩️', clase:'est-devuelto',  label:'Devuelto',    bg:'var(--rojo-light)'},
  };

  lista.innerHTML = _enviosData.map(v => {
    const estado = v.estado_contraentrega || 'preparacion';
    const info = estadoInfo[estado] || estadoInfo.preparacion;
    const transp = v.transportadora || '—';
    const ciudad = v.ciudad_envio || '—';
    const esSelec = v.id === _envioSeleccionado;

    return `
      <div class="envio-item ${esSelec ? 'env-selected' : ''}" id="envio-row-${v.id}" onclick="seleccionarEnvio('${v.id}')">
        <div class="envio-avatar" style="background:${info.bg};">${info.emoji}</div>
        <div class="envio-info">
          <div class="envio-cliente-nombre">${v.cliente_nombre || '—'}</div>
          <div class="envio-detalle-sub">${ciudad} · <strong style="font-size:10px;background:var(--gris-20);padding:1px 6px;border-radius:4px;">${transp}</strong></div>
          <div class="env-estado-btns">
            <button class="env-btn-estado ${estado==='preparacion'?'est-prep':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','preparacion')">📦 Prep.</button>
            <button class="env-btn-estado ${estado==='enviado'?'est-camino':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','enviado')">🚚 Camino</button>
            <button class="env-btn-estado ${estado==='entregado'?'est-entregado':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','entregado')">✅ Entregado</button>
            <button class="env-btn-estado ${estado==='devuelto'?'est-devuelto':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','devuelto')">↩ Dev.</button>
          </div>
        </div>
        <div class="envio-monto">${formatCOP(v.total)}</div>
      </div>
    `;
  }).join('');
}

function seleccionarEnvio(id){
  _envioSeleccionado = id;
  // Resaltar fila
  document.querySelectorAll('.envio-item').forEach(el => el.classList.remove('env-selected'));
  const row = document.getElementById('envio-row-' + id);
  if(row) row.classList.add('env-selected');

  // Actualizar mapa
  const v = _enviosData.find(x => x.id === id);
  if(v) actualizarMapaEnvio(v);
}

let _leafletMap = null;
let _leafletMarkers = [];
let _leafletLine = null;

function inicializarMapaLeaflet(){
  if(_leafletMap) return;
  _leafletMap = L.map('env-mapa-leaflet', {
    center: [5.5, -74.5],
    zoom: 5,
    zoomControl: true,
    scrollWheelZoom: false
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(_leafletMap);
}

function actualizarMapaEnvio(v){
  const info = document.getElementById('env-mapa-info');
  if(!info) return;

  inicializarMapaLeaflet();

  _leafletMarkers.forEach(m => _leafletMap.removeLayer(m));
  _leafletMarkers = [];
  if(_leafletLine){ _leafletMap.removeLayer(_leafletLine); _leafletLine = null; }

  const estado = v.estado_contraentrega || 'preparacion';
  const estadoLabel = {preparacion:'📦 En Preparación', enviado:'🚚 En camino', entregado:'✅ Entregado', devuelto:'↩️ Devuelto'};
  const estadoEmoji = {preparacion:'📦', enviado:'🚚', entregado:'✅', devuelto:'↩️'};

  const ciudad = (v.ciudad_envio || '').toLowerCase().trim().split('-')[0].trim().split(',')[0].trim();
  const coords = CIUDADES_COORDS[ciudad];
  const origen = CIUDADES_COORDS['cartagena'];

  const iconOrigen = L.divIcon({
    html:`<div style="background:#E91E8C;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
    iconSize:[14,14], iconAnchor:[7,7], className:''
  });
  const markerOrigen = L.marker([origen.lat, origen.lng], {icon:iconOrigen})
    .addTo(_leafletMap).bindPopup('📦 Origen: Cartagena');
  _leafletMarkers.push(markerOrigen);

  if(!coords){
    _leafletMap.setView([origen.lat, origen.lng], 6);
    setTimeout(()=>_leafletMap.invalidateSize(), 100);
    info.innerHTML = `<span style="color:var(--gris-60);">${v.ciudad_envio || 'Ciudad no registrada'} — sin coordenadas</span>`;
    return;
  }

  const iconDestino = L.divIcon({
    html:`<div style="background:${coords.color};width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
    iconSize:[14,14], iconAnchor:[7,7], className:''
  });
  const markerDestino = L.marker([coords.lat, coords.lng], {icon:iconDestino})
    .addTo(_leafletMap).bindPopup(`${estadoEmoji[estado]} Destino: ${v.ciudad_envio}`);
  _leafletMarkers.push(markerDestino);

  const lineColor = estado === 'entregado' ? '#27AE60' : estado === 'devuelto' ? '#E74C3C' : coords.color;
  _leafletLine = L.polyline(
    [[origen.lat, origen.lng],[coords.lat, coords.lng]],
    {color:lineColor, weight:3, opacity:0.8, dashArray: estado === 'preparacion' ? '6,8' : null}
  ).addTo(_leafletMap);

  let camionLat, camionLng;
  if(estado === 'preparacion'){
    camionLat = origen.lat; camionLng = origen.lng;
  } else if(estado === 'enviado'){
    camionLat = (origen.lat + coords.lat) / 2;
    camionLng = (origen.lng + coords.lng) / 2;
  } else {
    camionLat = coords.lat; camionLng = coords.lng;
  }

  const iconCamion = L.divIcon({
    html:`<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="background:#fff;border-radius:8px;padding:2px 6px;font-size:10px;font-weight:800;color:#E91E8C;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.2);">Pedido · ${v.cliente_nombre}</div>
      <div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));">🚚</div>
    </div>`,
    iconSize:[80,50], iconAnchor:[40,50], className:''
  });
 const popupCamion = `
    <div style="font-family:'Poppins',sans-serif;font-size:12px;min-width:160px;">
      <div style="font-weight:800;color:#E91E8C;margin-bottom:4px;">Pedido de ${v.cliente_nombre}</div>
      <div style="color:#666;">📍 ${v.ciudad_envio}</div>
      <div style="color:#666;">🚛 ${v.transportadora || 'Sin transportadora'}</div>
      <div style="font-weight:800;color:#1D6A3A;margin-top:4px;">${formatCOP(v.total)}</div>
    </div>
  `;
  const markerCamion = L.marker([camionLat, camionLng], {icon:iconCamion})
    .addTo(_leafletMap).bindPopup(popupCamion).openPopup();
  _leafletMarkers.push(markerCamion);

  _leafletMap.fitBounds([[origen.lat, origen.lng],[coords.lat, coords.lng]], {padding:[40,40]});
  setTimeout(()=>_leafletMap.invalidateSize(), 100);
info.innerHTML = '';
}

async function cambiarEstadoEnvio(ev, id, nuevoEstado){
  ev.stopPropagation();

  const { error } = await sb.from('ventas')
    .update({ estado_contraentrega: nuevoEstado })
    .eq('id', id);

  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

  const v = _enviosData.find(x => x.id === id);
  if(v) v.estado_contraentrega = nuevoEstado;

  const labels = {preparacion:'preparación', enviado:'en camino', entregado:'entregado ✅', devuelto:'devuelto ↩'};
  showToast(`✅ ${v?.cliente_nombre || 'Envío'} → ${labels[nuevoEstado]}`, 'success');

  renderEnviosLista();
  actualizarKpisEnvios();
  if(_envioSeleccionado === id && v) actualizarMapaEnvio(v);
  await cargarContraEntregas();
}
async function actualizarCuadreGlobal(){
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  const { data: config } = await sb.from('configuracion').select('saldo_inicial_global').eq('id',1).single();
  const saldonInicial = config?.saldo_inicial_global || 0;

  const [ventasRes, comprasRes, gastosRes] = await Promise.all([
    sb.from('ventas').select('total').eq('mes', mes).eq('anio', anio),
    sb.from('compras').select('total, tipo, es_abono').eq('mes', mes).eq('anio', anio),
    sb.from('gastos').select('valor').eq('mes', mes).eq('anio', anio)
  ]);

  const totalVentas = (ventasRes.data||[]).reduce((a,v)=>a+v.total,0);
 const totalCompras = (comprasRes.data||[]).filter(c=>c.tipo==='contado' || c.es_abono).reduce((a,c)=>a+c.total,0);
  const totalGastos = (gastosRes.data||[]).reduce((a,g)=>a+g.valor,0);
  const utilidad = totalVentas - totalCompras - totalGastos;

  const totalPendientes = PENDIENTES.reduce((a,p)=>a+(p.monto-(p.monto_abonado||0)),0);

  const { data: contras } = await sb.from('ventas').select('total')
    .eq('tipo','contraentrega').neq('estado_contraentrega','liquidado');
  const totalContras = (contras||[]).reduce((a,v)=>a+v.total,0);

  const deberiasTener = saldonInicial + utilidad - totalPendientes - totalContras;
  const tienesAhora = (CAJA?.efectivo||0) + (CAJA?.nequi||0) + (CAJA?.bancolombia||0);
  const diferencia = tienesAhora - deberiasTener;

  const el = document.querySelector('.cuadre-alert');
  const icon = el?.querySelector('.cuadre-icon');
  const title = el?.querySelector('.cuadre-title');
  const sub = el?.querySelector('.cuadre-sub');
  if(!el) return;

  el.classList.remove('sobra','falta');

if(Math.abs(diferencia) === 0){
    icon.textContent = '✅';
    title.textContent = '¡CAJA CUADRADA!';
    sub.textContent = '';
  } else if(diferencia > 0){
    el.classList.add('sobra');
    icon.textContent = '⚠️';
    title.textContent = `Sobran ${formatCOP(diferencia)}`;
    sub.textContent = '';
  } else {
    el.classList.add('falta');
    icon.textContent = '❌';
    title.textContent = `Faltan ${formatCOP(Math.abs(diferencia))}`;
    sub.textContent = '';
  }
}

function cambioTipoCompra(){
  const tipo = document.getElementById('co-tipo').value;
  document.getElementById('co-fuente-wrap').style.display = tipo === 'contado' ? 'flex' : 'none';
  document.getElementById('co-credito-banner').style.display = tipo === 'credito' ? 'block' : 'none';
}
/* ============================================================
   COTIZACIONES - TABS
   ============================================================ */
function cotizTab(tab, el){
  document.querySelectorAll('#view-cotizaciones .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('cotiz-tab-proveedores').style.display = tab === 'proveedores' ? 'block' : 'none';
  document.getElementById('cotiz-tab-clientes').style.display = tab === 'clientes' ? 'block' : 'none';
  if(tab === 'clientes') cargarSimulaciones();
}

/* ============================================================
   SIMULADOR DE FACTURA
   ============================================================ */
let _simItems = [];
let _simSeq = 0;

function abrirModalSimulador(){
  _simItems = [];
  _simSeq = 0;
  document.getElementById('sim-cliente').value = '';
  agregarItemSim();
  document.getElementById('modal-simulador').classList.add('open');
}

function cerrarModalSimulador(){
  document.getElementById('modal-simulador').classList.remove('open');
}

function agregarItemSim(){
  const id = 'sim-item-' + (++_simSeq);
  _simItems.push({ id, ref:'', nombre:'', precio:0, stock:0, cantidad:1, icon:'📦', foto_url:null });
  renderItemsSim();
}

function eliminarItemSim(id){
  _simItems = _simItems.filter(it => it.id !== id);
  if(_simItems.length === 0) agregarItemSim();
  else renderItemsSim();
}

function renderItemsSim(){
  const cont = document.getElementById('sim-items-list');
  cont.innerHTML = _simItems.map(it => `
    <div data-id="${it.id}" style="background:var(--gris-10);border-radius:10px;padding:10px;margin-bottom:8px;">
      <div class="autocomplete-wrap" style="margin-bottom:6px;">
        <input class="form-input" placeholder="Buscar producto..." value="${it.nombre}"
               oninput="buscarProductoSim('${it.id}', this.value)" autocomplete="off">
        <div class="autocomplete-list" id="sim-ac-${it.id}"></div>
        ${it.ref ? `<span class="form-hint">${it.foto_url ? `<img src="${it.foto_url}" style="width:20px;height:20px;border-radius:4px;object-fit:cover;vertical-align:middle;">` : it.icon} ${it.nombre} — Stock: <strong style="color:${it.stock > 0 ? 'var(--verde)' : 'var(--rojo)'};">${it.stock}</strong></span>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:6px;align-items:end;">
        <div><div class="form-label">Cant.</div><input class="form-input" type="number" min="1" value="${it.cantidad}" oninput="cambiarCantidadSim('${it.id}', this.value)"></div>
        <div><div class="form-label">Precio</div><input class="form-input" type="text" value="${it.precio ? it.precio.toLocaleString('es-CO') : ''}" oninput="cambiarPrecioSim('${it.id}', this.value)"></div>
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.precio * it.cantidad)}" style="background:#fff;color:var(--gris-60);"></div>
        <button type="button" class="multi-item-remove" onclick="eliminarItemSim('${it.id}')">✕</button>
      </div>
    </div>
  `).join('');
  calcTotalSim();
}

function buscarProductoSim(id, query){
  const list = document.getElementById('sim-ac-' + id);
  if(!query.trim()){ list.classList.remove('open'); return; }
  const q = query.toLowerCase();
  const resultados = PRODUCTOS.filter(p =>
    p.nombre.toLowerCase().includes(q) || p.referencia.toLowerCase().includes(q)
  );
  if(!resultados.length){
    list.innerHTML = '<div class="autocomplete-item" style="color:var(--gris-60);">Sin resultados</div>';
  } else {
    list.innerHTML = resultados.map(p => `
      <div class="autocomplete-item" onclick="seleccionarProductoSim('${id}','${p.id}')"
           style="display:flex;align-items:center;gap:8px;">
        ${p.foto_url ? `<img src="${p.foto_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;">` : `<span>${p.icono || '📦'}</span>`}
        <span>${p.nombre} <span class="ac-ref">${p.referencia}</span>
        <span class="ac-stock" style="color:${p.stock > 0 ? 'var(--verde)' : 'var(--rojo)'};">Stock: ${p.stock}</span></span>
      </div>
    `).join('');
  }
  list.classList.add('open');
}

function seleccionarProductoSim(id, productoId){
  const p = PRODUCTOS.find(x => x.id === productoId);
  if(!p) return;
  const item = _simItems.find(it => it.id === id);
  item.ref = p.id;
  item.nombre = p.nombre;
  item.precio = p.precio;
  item.stock = p.stock;
  item.icon = p.icono || '📦';
  item.foto_url = p.foto_url || null;
  renderItemsSim();
}

function cambiarCantidadSim(id, valor){
  const item = _simItems.find(it => it.id === id);
  item.cantidad = Math.max(1, parseInt(valor) || 1);
  const row = document.querySelector(`#sim-items-list [data-id="${id}"]`);
  row.querySelector('input[readonly]').value = formatCOP(item.precio * item.cantidad);
  calcTotalSim();
}

function cambiarPrecioSim(id, valor){
  const item = _simItems.find(it => it.id === id);
  item.precio = rawNum({value: valor});
  const row = document.querySelector(`#sim-items-list [data-id="${id}"]`);
  row.querySelector('input[readonly]').value = formatCOP(item.precio * item.cantidad);
  calcTotalSim();
}

function calcTotalSim(){
  const total = _simItems.reduce((acc, it) => acc + (it.precio * it.cantidad), 0);
  document.getElementById('sim-subtotal').textContent = formatCOP(total);
  document.getElementById('sim-total').textContent = formatCOP(total);
}



function eliminarSimulacion(id){
  confirmarAccion('¿Eliminar esta cotización?', () => {
    document.getElementById(id)?.remove();
    showToast('🗑️ Cotización eliminada', 'info');
  });
}

async function generarFacturaSimulada(){
  const cliente = document.getElementById('sim-cliente').value.trim() || 'Cliente';
  const itemsValidos = _simItems.filter(it => it.ref);
  if(!itemsValidos.length){
    showToast('⚠️ Agrega al menos un producto', 'error');
    return;
  }

  const total = itemsValidos.reduce((acc, it) => acc + (it.precio * it.cantidad), 0);

  await sb.from('cotizaciones_clientes').insert({
    cliente_nombre: cliente,
    total,
    fecha: new Date().toISOString().split('T')[0],
    items: itemsValidos.map(it => ({
      nombre: it.nombre,
      cantidad: it.cantidad,
      precio: it.precio,
      subtotal: it.precio * it.cantidad,
      foto_url: it.foto_url || null,
      icon: it.icon
    }))
  });

  cerrarModalSimulador();
  await cargarSimulaciones();
  showToast('✅ Cotización guardada', 'success');
}

async function cargarSimulaciones(){
  const { data, error } = await sb
    .from('cotizaciones_clientes')
    .select('*')
    .order('created_at', { ascending: false });

  if(error){ showToast('❌ Error: ' + error.message, 'error'); return; }

  const lista = document.getElementById('simulador-lista');
  if(!lista) return;

  if(!data?.length){
    lista.innerHTML = '<div style="padding:30px;text-align:center;color:var(--gris-60);font-size:13px;">No hay cotizaciones guardadas.</div>';
    return;
  }

  lista.innerHTML = data.map(s => {
    const simId = 'sim-' + s.id;
    const items = s.items || [];
    const fechaCorta = new Date(s.fecha + 'T00:00:00').toLocaleDateString('es-CO');

    const itemsResumen = items.map(it => `
      <div class="venta-item-row">
        <div class="venta-item-thumb">${it.foto_url ? `<img src="${it.foto_url}" style="width:30px;height:30px;border-radius:7px;object-fit:cover;">` : it.icon || '📦'}</div>
        <div class="venta-item-info">${it.nombre} x${it.cantidad}</div>
        <div class="venta-item-total">${formatCOP(it.subtotal)}</div>
      </div>
    `).join('');

    return `
      <div class="venta-grupo cotiz-row" id="${simId}">
       <div class="venta-grupo-head" style="background:#fff;" onclick="toggleVentaDetalle(this)">
          <div class="venta-cliente">
           <span style="background:var(--gris-20);color:var(--gris-80);font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} producto${items.length > 1 ? 's' : ''}</span>
            <div class="venta-cliente-nombre">Cotización — ${s.cliente_nombre}</div>
          </div>
          <div class="venta-grupo-meta">
            <span class="cotiz-mes-badge">📅 ${fechaCorta}</span>
            <span class="venta-grupo-total">${formatCOP(s.total)}</span>
            <button class="btn-icon" title="Ver factura" onclick="verFacturaSimDB('${s.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </button>
            <button class="btn-icon" title="Eliminar" onclick="eliminarSimulacionDB('${s.id}')" style="color:var(--rojo);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
            <span class="venta-chev">▼</span>
          </div>
        </div>
        <div class="venta-detalle collapsed">${itemsResumen}</div>
      </div>
    `;
  }).join('');
}

async function verFacturaSimDB(id){
  const { data: s } = await sb.from('cotizaciones_clientes').select('*').eq('id', id).single();
  if(!s) return;

  const fecha = new Date(s.fecha + 'T00:00:00').toLocaleDateString('es-CO', {year:'numeric', month:'long', day:'numeric'});
  const items = s.items || [];

  const fechaArchivo = new Date(s.fecha + 'T00:00:00').toLocaleDateString('es-CO', {day:'2-digit', month:'2-digit', year:'2-digit'});
  const nombreArchivo = `Cotizacion_${(s.cliente_nombre || 'Cliente').replace(/\s+/g,'_')}_${fechaArchivo.replace(/\//g,'-')}`;

  const pdfBlob = await construirFacturaPDF({
    titulo: 'Cotización de Factura',
    fecha, cliente: s.cliente_nombre || 'Sin definir', telefono: '',
    metodoPago: '', items: items.map(it => ({
      nombre: it.nombre, cantidad: it.cantidad,
      precio: it.precio, subtotal: it.subtotal
    })),
    descuento: 0, total: s.total
  });

  mostrarFacturaPDF(pdfBlob, nombreArchivo);
}

async function eliminarSimulacionDB(id){
  confirmarAccion('¿Eliminar esta cotización?', async () => {
    await sb.from('cotizaciones_clientes').delete().eq('id', id);
    showToast('🗑️ Cotización eliminada', 'info');
    await cargarSimulaciones();
  });
}

function contactoTab(tab, el){
  document.querySelectorAll('#view-contactos .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('contacto-tab-clientes').style.display = tab === 'clientes' ? 'block' : 'none';
  document.getElementById('contacto-tab-proveedores').style.display = tab === 'proveedores' ? 'block' : 'none';
}

function descargarFacturaPDF(htmlContent, nombreArchivo){
  const modal = document.getElementById('modal-factura-preview');
  const iframe = document.getElementById('factura-iframe');
  modal.classList.add('open');
  const blob = new Blob([htmlContent], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  iframe.src = url;
  // Guardar blob para descarga y compartir
  window._facturaBlob = blob;
  window._facturaNombre = nombreArchivo;
}

function imprimirFacturaPreview(){
  const iframe = document.getElementById('factura-iframe');
  iframe.contentWindow.print();
}

function cerrarFacturaPreview(){
  document.getElementById('modal-factura-preview').classList.remove('open');
  const iframe = document.getElementById('factura-iframe');
  iframe.src = '';
  const visor = document.getElementById('factura-img-visor');
  if(visor){ visor.innerHTML = ''; visor.style.display = 'none'; }
}

function imprimirFacturaPreview(){
  document.getElementById('factura-iframe').contentWindow.print();
}

function buscarVentas(query){
  const q = query.toLowerCase();
  document.querySelectorAll('#ventas-lista .venta-grupo').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function buscarCompras(query){
  const q = query.toLowerCase();
  document.querySelectorAll('#compras-lista .venta-grupo').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}


async function compartirWhatsApp(){
  if(!window._facturaPdfBlob) return;
  const nombreArchivo = (window._facturaNombre || 'factura') + '.pdf';
  const isMobile = window.innerWidth <= 768;

  if(isMobile){
    const pdfFile = new File([window._facturaPdfBlob], nombreArchivo, {type:'application/pdf'});
    if(navigator.canShare && navigator.canShare({files:[pdfFile]})){
      try {
        await navigator.share({files:[pdfFile]});
        return;
      } catch(e){
        if(e.name === 'AbortError') return;
      }
    }
    showToast('⚠️ Descarga el PDF y adjúntalo desde WhatsApp', 'error');
  } else {
    window.open('https://web.whatsapp.com', '_blank');
    showToast('💬 Abriendo WhatsApp Web — adjunta el PDF descargándolo desde Descargar', 'info');
  }
}

async function logoBase64(){
  try {
    const res = await fetch(window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + 'assets/img/logo.png');
    const blob = await res.blob();
    return await new Promise(r => {
      const reader = new FileReader();
      reader.onload = () => r(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch(e){ 
    console.error('Logo error:', e);
    return ''; 
  }
}
function buscarCliente(query){
  const q = query.toLowerCase();
  document.querySelectorAll('#clientes-lista .contacto-row').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function buscarProveedor(query){
  const q = query.toLowerCase();
  document.querySelectorAll('#proveedores-lista .contacto-row').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

async function verAbonosCompra(compraId){
  const { data, error } = await sb.from('abonos_compras')
    .select('*').eq('compra_id', compraId)
    .order('created_at', {ascending: false});

  const c = COMPRAS.find(x => x.id === compraId);
  
  if(error || !data?.length){
    showToast(`Sin abonos registrados`, 'info');
    return;
  }

  const modal = document.getElementById('modal-confirm');
  document.getElementById('confirm-title').textContent = `📋 ${c?.proveedor_nombre || 'Proveedor'}`;
  document.getElementById('confirm-msg').innerHTML = `
    <div style="font-size:13px;color:var(--gris-60);margin-bottom:10px;">
      Saldo pendiente: <strong style="color:var(--rojo);">${formatCOP(c?.saldo_credito || 0)}</strong>
    </div>
    ${data.map(ab => `
      <div style="padding:6px 0;border-bottom:1px solid var(--gris-20);font-size:13px;display:flex;justify-content:space-between;align-items:center;">
        <span>Abonaste <strong>${formatCOP(ab.monto)}</strong> el ${new Date(ab.fecha+'T00:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})} <span style="color:var(--gris-60);">(${ab.fuente})</span></span>
        <button onclick="eliminarAbonoCompra('${ab.id}', ${ab.monto}, '${ab.fuente}', '${compraId}')" style="background:none;border:none;cursor:pointer;color:var(--rojo);font-size:16px;" title="Eliminar abono">🗑️</button>
      </div>
    `).join('')}
  `;
  modal.classList.add('open');

  const btnOk = document.getElementById('confirm-ok');
  const newOk = btnOk.cloneNode(true);
  btnOk.replaceWith(newOk);
  newOk.textContent = 'Cerrar';
  newOk.addEventListener('click', () => modal.classList.remove('open'));

  const btnCancel = document.getElementById('confirm-cancel');
  const newCancel = btnCancel.cloneNode(true);
  btnCancel.replaceWith(newCancel);
  newCancel.style.display = 'none';
}

async function eliminarAbonoCompra(abonoId, monto, fuente, compraId){
  document.getElementById('modal-confirm').classList.remove('open');

  // Revertir saldo en la compra
  const c = COMPRAS.find(x => x.id === compraId);
  const nuevoSaldo = (c?.saldo_credito || 0) + monto;
  await sb.from('compras').update({ saldo_credito: nuevoSaldo }).eq('id', compraId);

  // Revertir en caja
  await actualizarSaldoCaja(fuente, monto, `Reverso abono compra — ${formatCOP(monto)}`);

  // Borrar registro es_abono en compras
  await sb.from('compras').delete().eq('es_abono', true).eq('compra_origen_id', compraId).eq('total', monto);

  // Borrar de abonos_compras
  await sb.from('abonos_compras').delete().eq('id', abonoId);

  showToast('🗑️ Abono eliminado y saldo revertido', 'info');
  await cargarCompras();
}