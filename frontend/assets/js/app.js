
  /* ──----───────────────────────────────────────────── 
   ATENAS ERP - app.js
   Navegación, Inventario (vistas/modal) y Caja (paneles)
   ============================================================ */

/* ── ICONOS SVG (reemplazan emojis en la interfaz) ─────────── */
const ICONOS = {
  box:    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  save:   '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  pencil: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  trash:  '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  file:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  chart:  '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 4H4v2a3 3 0 0 0 3 3"/><path d="M17 4h3v2a3 3 0 0 1-3 3"/>',
  crown:  '<path d="M2 18h20"/><path d="M3.5 18 5 7h14l1.5 11"/><path d="M7 18a5 5 0 0 1 10 0"/><circle cx="9" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="15" cy="10" r="1"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  hash:   '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
  link:   '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  alert:  '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  plus:   '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  tag:    '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  gear:   '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  card:   '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  cash:   '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  bank:   '<path d="M3 21h18"/><path d="M4 18h16"/><path d="M6 18V10"/><path d="M10 18V10"/><path d="M14 18V10"/><path d="M18 18V10"/><path d="M2 8l10-5 10 5z"/>',
  home:   '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  users:  '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  truck:  '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  cart:   '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  check:  '<polyline points="20 6 9 17 4 12"/>',
  lock:   '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  star:   '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  moon:   '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun:    '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  paint:  '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
  refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  trend:  '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  pie:    '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  eye:    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  clock:  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  user:   '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  factory:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="14" y1="10" x2="16" y2="10"/>',
  water:  '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  shirt:  '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  x:      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
};

function ico(name, size){
  const w = size || 14;
  const body = ICONOS[name] || ICONOS.box;
  return `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;">${body}</svg>`;
}

/* Icono de producto: si no tiene emoji propio, muestra caja SVG */
function proIcon(icono, size){
  return (icono && icono !== '📦') ? icono : ico('box', size || 16);
}

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

  // La alerta roja de cierre de mes NO se muestra en la vista Caja
  actualizarVisibilidadBannerCierre();

  localStorage.setItem('atenas_vista_actual', name);
}


/** Abre/cierra el menú hamburguesa móvil */
function toggleMobileMenu(){
  document.getElementById('mobile-menu').classList.toggle('open');
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ── INVENTARIO: Toggle vista Referencia / Agrupado ─────────── */
let _invModo = 'lista';
function invModo(modo, el){
  _invModo = modo;
  document.querySelectorAll('#view-inventario .inv-modo-btn').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  const invRef = document.getElementById('inv-ref');
  const invCards = document.getElementById('inv-cards');
  if(invRef) invRef.style.display = modo === 'lista' ? 'block' : 'none';
  if(invCards) invCards.style.display = modo === 'cajitas' ? 'grid' : 'none';
}

function invView(which, el){
  document.querySelectorAll('#view-inventario .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('inv-grp').style.display = which === 'grp' ? 'block' : 'none';

  const showList = which === 'ref' || which === 'sin-stock';
  const invRef = document.getElementById('inv-ref');
  const invCards = document.getElementById('inv-cards');
  if(showList){
    if(invRef) invRef.style.display = _invModo === 'lista' ? 'block' : 'none';
    if(invCards) invCards.style.display = _invModo === 'cajitas' ? 'grid' : 'none';
  } else {
    if(invRef) invRef.style.display = 'none';
    if(invCards) invCards.style.display = 'none';
  }

  if(which === 'sin-stock'){
    document.querySelectorAll('#inv-tbody tr').forEach(row => {
      const badge = row.querySelector('.badge');
      row.style.display = badge && badge.classList.contains('badge-rojo') ? '' : 'none';
    });
    // Mobile
    document.querySelectorAll('#inv-mobile-cards > div').forEach(card => {
      const badge = card.querySelector('.badge');
      card.style.display = badge && badge.classList.contains('badge-rojo') ? '' : 'none';
    });
    // Cajitas
    document.querySelectorAll('#inv-cards > .inv-card').forEach(card => {
      const badge = card.querySelector('.badge');
      card.style.display = badge && badge.classList.contains('badge-rojo') ? '' : 'none';
    });
  } else {
    // Mostrar todos si cambia de vista
    document.querySelectorAll('#inv-tbody tr').forEach(r => r.style.display = '');
    document.querySelectorAll('#inv-mobile-cards > div').forEach(c => c.style.display = '');
    document.querySelectorAll('#inv-cards > .inv-card').forEach(c => c.style.display = '');
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
  const cp = document.getElementById('chat-panel');
  if(cp) cp.classList.remove('open');
  const launcher = document.querySelector('.chat-launcher');
  if(launcher) launcher.classList.remove('hidden');
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
  { ref:'ATS-001', nombre:'Ampolla Anticaída', precio:28000, stock:8, icon: ico('water', 14) },
  { ref:'ATS-002', nombre:'Ampolla Embrión de Pato', precio:30000, stock:3, icon: ico('water', 14) },
  { ref:'ATS-003', nombre:'Camisa Básica Talla M', precio:45000, stock:0, icon: ico('shirt', 14) },
  { ref:'ATS-004', nombre:'Crema Hidratante Facial', precio:45000, stock:12, icon: ico('water', 14) },
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
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.precio * it.cantidad)}" style="background:var(--surface-2);color:var(--gris-60);"></div>
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
        : `<span style="flex-shrink:0;">${proIcon(p.icono, 14)}</span>`}
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
  const val = document.getElementById('f-mes').value;
  const mes = val === '' ? null : parseInt(val);
  const anio = parseInt(document.getElementById('f-anio').value) || new Date().getFullYear();
  cargarVentas(mes, anio);
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
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.costo * it.cantidad)}" style="background:var(--surface-2);color:var(--gris-60);"></div>
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
        : `<span style="flex-shrink:0;">${proIcon(p.icono, 14)}</span>`}
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


function filtrarCompras(){
  const val = document.getElementById('c-mes').value;
  const mes = val === '' ? null : parseInt(val);
  const anio = parseInt(document.getElementById('c-anio').value) || new Date().getFullYear();
  cargarCompras(mes, anio);
}

/* ============================================================
   GASTOS
   ============================================================ */

const TIPOS_GASTO = {
  empaque:   { label:'Empaque',            icono:'box',   clase:'gasto-empaque' },
  descuento: { label:'Descuento',          icono:'tag',   clase:'gasto-descuento' },
  ajustes:   { label:'Ajustes',            icono:'gear',  clase:'gasto-ajustes' },
  envios:    { label:'Envíos/Domicilios',  icono:'truck', clase:'gasto-envios' },
  nomina:    { label:'Nómina/Sueldo',      icono:'users', clase:'gasto-nomina' },
  otros:     { label:'Otros',              icono:'box',   clase:'gasto-otros' },
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
  const val = document.getElementById('g-mes').value;
  const mes = val === '' ? null : parseInt(val);
  const anio = parseInt(document.getElementById('g-anio').value) || new Date().getFullYear();
  cargarGastos(mes, anio);
}
/* ============================================================
   PENDIENTES (Caja)
   ============================================================ */

const FUENTES_PENDIENTE = {
  efectivo:    { label:'Efectivo' },
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
  document.querySelector('#modal-pendiente .btn-primary').innerHTML = ico('plus', 13) + ' Agregar';
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
      const fuente = (p.fuente || '').toLowerCase();
      
      if(saldoRestante > 0 && fuente){
        const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
        const nuevoValor = (cajaActual[fuente] || 0) + saldoRestante;
        await sb.from('caja_saldo').update({ [fuente]: nuevoValor }).eq('id', 1);
      }
    }

    await sb.from('pendientes').delete().eq('id', id);
    quitarPendienteResaltado(id);
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
  preparacion: { label:'Preparación', icono:'file',   clase:'badge-gris' },
  enviado:     { label:'Enviado',     icono:'send',   clase:'badge-amarillo' },
  entregado:   { label:'Entregado',   icono:'check',  clase:'badge-verde' },
  liquidado:   { label:'Liquidado',   icono:'cash',   clase:'badge-rojo' },
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
  document.getElementById('cli-modal-title').innerHTML = ico('user', 13) + ' Nuevo Cliente';
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
  document.getElementById('cli-modal-title').innerHTML = ico('pencil', 13) + ' Editar Cliente';
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
  document.getElementById('prov-modal-title').innerHTML = ico('factory', 13) + ' Nuevo Proveedor';
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
  document.getElementById('prov-modal-title').innerHTML = ico('pencil', 13) + ' Editar Proveedor';
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
        ${ico('user', 12)} ${c.nombre}${c.apellido && c.apellido !== 'null' ? ' ' + c.apellido : ''} <span class="ac-stock">${c.ciudad}</span>
      </div>
    `;
  });

  // Opción siempre disponible: cliente esporádico
  html += `
    <div class="autocomplete-item" style="color:var(--gris-60);" onclick="seleccionarClienteVenta('Sin definir')">
      ${ico('clock', 12)} Sin definir / Cliente esporádico
    </div>
  `;

  if(!resultados.length){
    html = `<div class="autocomplete-item" style="color:var(--rojo);">
      ${ico('alert', 12)} Cliente no existe — <strong>regístralo en Contactos</strong>
    </div>` + html;
  }

  list.innerHTML = html;
  list.classList.add('open');

  // Validar al escribir: si no coincide exacto con ninguno y no es "Sin definir"
  const coincideExacto = CLIENTES.some(c => `${c.nombre} ${c.apellido || ''}`.toLowerCase() === q);
  if(!coincideExacto && q !== 'sin definir'){
    hint.innerHTML = ico('alert', 12) + ' Cliente no existe — puedes registrarlo en Contactos o usar "Sin definir"';
    hint.style.color = 'var(--rojo)';
  }
}

function seleccionarClienteVenta(nombre){
  document.getElementById('v-cliente').value = nombre;
  document.getElementById('v-cliente-ac').classList.remove('open');

  const hint = document.getElementById('v-cliente-hint');
  if(nombre === 'Sin definir'){
    hint.innerHTML = ico('clock', 12) + ' Cliente esporádico (no se guarda en Contactos)';
    hint.style.color = 'var(--gris-60)';
  } else {
    hint.innerHTML = ico('check', 12) + ' Cliente registrado';
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
        ${ico('factory', 12)} ${p.nombre} <span class="ac-stock">${p.ciudad || ''}</span>
      </div>
    `;
  });

  if(!resultados.length){
    html = `<div class="autocomplete-item" style="color:var(--rojo);">
      ${ico('alert', 12)} Proveedor no existe — <strong>regístralo en Contactos</strong>
    </div>`;
  }

  list.innerHTML = html;
  list.classList.add('open');

  const coincideExacto = PROVEEDORES.some(p => p.nombre.toLowerCase() === q);
  if(!coincideExacto){
    hint.innerHTML = ico('alert', 12) + ' Proveedor no existe — regístralo en Contactos';
    hint.style.color = 'var(--rojo)';
  }
}

function seleccionarProveedorCompra(nombre){
  document.getElementById('co-proveedor').value = nombre;
  document.getElementById('co-proveedor-ac').classList.remove('open');
  document.getElementById('co-proveedor-hint').innerHTML = ico('check', 12) + ' Proveedor registrado';
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
  document.getElementById('cot-modal-title').innerHTML = ico('file', 13) + ' Nueva Cotización';
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
    list.innerHTML = `<div class="autocomplete-item" style="color:var(--rojo);">${ico('alert', 12)} Proveedor no existe — regístralo en Contactos</div>`;
  } else {
    list.innerHTML = resultados.map(p => `
      <div class="autocomplete-item" onclick="seleccionarProveedorCotiz('${p.nombre}')">
        ${ico('factory', 12)} ${p.nombre} <span class="ac-stock">${p.ciudad || ''}</span>
      </div>
    `).join('');
  }
  list.classList.add('open');

  const coincide = PROVEEDORES.some(p => p.nombre.toLowerCase() === q);
  if(!coincide){
    hint.innerHTML = ico('alert', 12) + ' Proveedor no existe — regístralo en Contactos';
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
      ${ico('user', 12)} ${c.nombre} ${c.apellido || ''} <span class="ac-stock">${c.ciudad || ''}</span>
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
  document.getElementById('cot-proveedor-hint').innerHTML = ico('check', 12) + ' Proveedor registrado';
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
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.costo * it.cantidad)}" style="background:var(--surface-2);color:var(--gris-60);"></div>
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
        : `<span style="flex-shrink:0;">${proIcon(p.icono, 14)}</span>`}
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
  document.getElementById('cot-modal-title').innerHTML = ico('pencil', 13) + ' Editar Cotización';
  document.getElementById('cot-proveedor').value = proveedor;
  document.getElementById('cot-proveedor-hint').innerHTML = ico('check', 12) + ' Proveedor registrado';
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

  const etiqueta = itemsValidos.length > 1 ? `${ico('box', 11)} ${itemsValidos.length} productos` : `${ico('box', 11)} 1 producto`;
  const mesLabel = `${ico('calendar', 11)} ${MESES_NOMBRE[parseInt(mes)]} ${anio}`;

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
          <button class="btn-icon" onclick="editarCotizacion(this)">${ico('pencil', 14)}</button>
          <button class="btn-icon" onclick="eliminarCotizacion(this)">${ico('trash', 14)}</button>
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
    msg.innerHTML = ico('trend', 14) + ' Estamos un poco lejos... sigamos!';
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
    msg.innerHTML = ico('trend', 14) + ` ¡Meta superada! (+${Math.round(pct-100)}%)`;
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

  document.getElementById('cerrar-mes-titulo').innerHTML = ico('lock', 13) + ` Cerrar Mes — ${MESES_NOMBRE[mes]} ${anio}`;
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
    icon.innerHTML = ico('check', 18);
    title.textContent = '¡CAJA CUADRADA!';
  } else if(diferencia > 0){
    alert.classList.add('sobra');
    icon.innerHTML = ico('alert', 18);
    title.textContent = `Sobran ${formatCOP(diferencia)}`;
  } else {
    alert.classList.add('falta');
    icon.innerHTML = ico('x', 18);
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
   initConfig();
   // Precalienta logo + fuentes de la factura en segundo plano: "Ver factura" abre mucho más rápido
   logoMini().catch(() => {});
   if(document.fonts && document.fonts.load){
     ['600 11px "Poppins"', '700 12px "Poppins"', '800 30px "Poppins"', '400 34px "Great Vibes"']
       .forEach(f => { try{ document.fonts.load(f); }catch(e){} });
   }
   await cargarProductos(); // primero siempre
   actualizarSugerenciasChat();
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
     // Fijar mes actual por defecto en filtros
  const mesHoy = new Date().getMonth() + 1;
  const selVentas = document.getElementById('f-mes');
  if(selVentas) selVentas.value = mesHoy;
  const selCompras = document.getElementById('c-mes');
  if(selCompras) selCompras.value = mesHoy;
  const selGastos = document.getElementById('g-mes');
  if(selGastos) selGastos.value = mesHoy;
   // Restaurar la última vista visitada al recargar
  const vistaGuardada = localStorage.getItem('atenas_vista_actual');
  if(vistaGuardada && document.getElementById('view-' + vistaGuardada)) showView(vistaGuardada);
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
  const cardsCont = document.getElementById('inv-cards');

  if(PRODUCTOS.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--gris-60);padding:30px;">Aún no has agregado productos. Click en "＋ Nuevo Producto" para empezar.</td></tr>`;
    mobileCont.innerHTML = `<div style="text-align:center;color:var(--gris-60);padding:30px;font-size:13px;">Aún no has agregado productos.</div>`;
    if(cardsCont) cardsCont.innerHTML = `<div class="section-box" style="text-align:center;color:var(--gris-60);padding:30px;font-size:13px;">Aún no has agregado productos.</div>`;
  } else {
    tbody.innerHTML = PRODUCTOS.map(p=>{
      const pct = calcularMargenPct(p.costo, p.precio);
      const thumb = p.foto_url
        ? `<img src="${p.foto_url}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;">`
        : `<div class="prod-thumb">${proIcon(p.icono, 18)}</div>`;
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
        : `<div style="width:52px;height:52px;border-radius:10px;background:var(--gris-10);display:flex;align-items:center;justify-content:center;font-size:22px;border:1px solid var(--gris-20);">${proIcon(p.icono, 22)}</div>`;
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

    if(cardsCont){
      cardsCont.innerHTML = PRODUCTOS.map(p=>{
        const pct = calcularMargenPct(p.costo, p.precio);
        const thumb = p.foto_url
          ? `<img src="${p.foto_url}" style="width:52px;height:52px;border-radius:12px;object-fit:cover;">`
          : `<div style="width:52px;height:52px;border-radius:12px;background:var(--gris-10);display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid var(--gris-20);">${proIcon(p.icono, 24)}</div>`;
        return `
          <div class="inv-card">
            <div class="inv-card-head">
              ${thumb}
              <div class="inv-card-actions">
                <button class="btn-icon" onclick="editarProducto('${p.id}')" title="Editar">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-icon" onclick="eliminarProducto('${p.id}')" title="Eliminar" style="color:var(--rojo);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
            <div class="inv-card-name">${p.nombre}</div>
            <span class="prod-ref">${p.referencia}</span>
            <div class="inv-card-stats">
              <div class="inv-stat">
                <span class="lbl">Stock</span>
                <span class="badge ${claseStock(p.stock)}" style="font-size:11px;">${p.stock}</span>
              </div>
              <div class="inv-stat">
                <span class="lbl">Costo</span>
                <strong>${formatCOP(p.costo)}</strong>
              </div>
              <div class="inv-stat">
                <span class="lbl">Precio</span>
                <strong>${formatCOP(p.precio)}</strong>
              </div>
              <div class="inv-stat">
                <span class="lbl">Margen</span>
                <strong class="${claseMargen(pct)}">${pct.toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
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
      const icono = proIcon(productos[0].icono, 16);
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
  document.getElementById('modal-prod-title').innerHTML = ico('plus', 13) + ' Nuevo Producto';
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
    <label class="photo-drop" for="foto-input">${ico('camera', 14)} Click para subir foto</label>
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
  document.getElementById('modal-prod-title').innerHTML = ico('pencil', 13) + ' Editar Producto';
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
  document.querySelectorAll('#inv-cards > .inv-card').forEach(card=>{
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
  document.getElementById('confirm-title').innerHTML = titulo || (ico('alert', 13) + ' Confirmar acción');
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
  document.getElementById('cli-modal-title').innerHTML = ico('user', 13) + ' Nuevo Cliente';
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
  document.getElementById('cli-modal-title').innerHTML = ico('pencil', 13) + ' Editar Cliente';
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
  document.getElementById('prov-modal-title').innerHTML = ico('factory', 13) + ' Nuevo Proveedor';
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
  document.getElementById('prov-modal-title').innerHTML = ico('pencil', 13) + ' Editar Proveedor';
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
    const mesLabel = `${ico('calendar', 11)} ${MESES_NOMBRE[cot.mes_objetivo]} ${cot.anio_objetivo}`;
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
    : `${proIcon(it.producto_icono, 14)}`;
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
        <div class="venta-grupo-head" onclick="toggleVentaDetalle(this)">
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
  const m = mes !== undefined ? mes : hoy.getMonth() + 1;

  let query = sb.from('ventas').select('*, venta_items(*)').order('created_at', { ascending: false });
  if(m === null) query = query.eq('anio', a);
  else query = query.eq('mes', m).eq('anio', a);

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
      ? `<span class="badge badge-amarillo">${ico('file', 11)} Contra Entrega</span>`
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
              : `<div class="prod-thumb">${proIcon(items[0].producto_icono, 16)}</div>`;
          })()
        : `<div class="prod-thumb">${ico('box', 16)}</div>`;

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
        : `${proIcon(it.producto_icono, 14)}`;
      return `
        <div class="venta-item-row">
          <div class="venta-item-thumb">${thumb}</div>
          <div class="venta-item-info">${it.producto_nombre} x${it.cantidad}</div>
          <div class="venta-item-total">${formatCOP(it.precio_unitario * it.cantidad)}</div>
        </div>
      `;
    }).join('');
   const tipoClase = v.tipo === 'credito' ? 'tipo-credito'
      : v.tipo === 'contraentrega' && v.estado_contraentrega === 'liquidado' ? 'tipo-contado'
      : v.tipo === 'contraentrega' ? 'tipo-contra'
      : 'tipo-contado';
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
          <div class="venta-grupo-head ${tipoClase}" onclick="toggleVentaDetalle(this)">
            <div class="venta-cliente">
              ${badgeMultiVenta}
              <div class="venta-cliente-nombre">${nombreVenta}</div>
            </div>
            <div class="venta-grupo-meta">
              ${metodoBadge}
              <span style="font-size:11px;color:var(--gris-60);">${new Date(v.fecha+'T00:00:00').toLocaleDateString('es-CO')}</span>
              <span class="venta-grupo-total">${formatCOP(v.tipo === 'credito' && v.saldo_credito > 0 ? v.saldo_credito : v.total)}</span>
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
          <div class="venta-grupo-head ${tipoClase}" style="cursor:default;">
            <div class="venta-cliente">
              ${thumb}
              <div class="venta-cliente-nombre">${nombreVenta}</div>
            </div>
            <div class="venta-grupo-meta">
              ${metodoBadge}
              <span style="font-size:11px;color:var(--gris-60);">${new Date(v.fecha+'T00:00:00').toLocaleDateString('es-CO')}</span>
              <span class="venta-grupo-total">${formatCOP(v.tipo === 'credito' && v.saldo_credito > 0 ? v.saldo_credito : v.total)}</span>
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
    playSonido('venta');
    showToast(`✅ Venta registrada: ${formatCOP(total)} — ${clienteEl.value.trim()} (${etiqueta})`);

    // Si es a crédito, agregar automáticamente a pendientes
    if(tipo === 'credito'){
      await sb.from('pendientes').insert({
        descripcion: `Venta crédito — ${clienteEl.value.trim()} (${etiqueta})`,
        monto: total,
        monto_abonado: 0,
        fuente: null,
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
  const m = mes !== undefined ? mes : hoy.getMonth() + 1;

  let query = sb.from('compras').select('*, compra_items(*)')
    .or('es_abono.is.null,es_abono.eq.false')
    .order('created_at', { ascending: false });
  if(m === null) query = query.eq('anio', a);
  else query = query.eq('mes', m).eq('anio', a);

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
      ? `<span class="badge badge-rojo">${ico('card', 11)} A Crédito</span>`
      : c.fuente === 'nequi'
        ? `<span class="badge fuente-nequi">Nequi</span>`
        : c.fuente === 'bancolombia'
          ? `<span class="badge fuente-banco">Bancolombia</span>`
          : `<span class="badge fuente-efectivo">Efectivo</span>`;

    const tipoClase = c.tipo === 'credito' && c.saldo_credito > 0 ? 'tipo-credito' : 'tipo-contado';
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
              : `<div class="prod-thumb">${proIcon(items[0].producto_icono, 16)}</div>`;
          })()
        : `<div class="prod-thumb">${ico('box', 16)}</div>`;

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
        : `${proIcon(it.producto_icono, 14)}`;
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
          <div class="venta-grupo-head ${tipoClase}" onclick="toggleVentaDetalle(this)">
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
          <div class="venta-grupo-head ${tipoClase}" style="cursor:default;">
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
    playSonido('compra');
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
  const m = mes !== undefined ? mes : hoy.getMonth() + 1;

  let query = sb.from('gastos').select('*').order('created_at', { ascending: false });
  if(m === null) query = query.eq('anio', a);
  else query = query.eq('mes', m).eq('anio', a);

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
  document.getElementById('kpi-gastos-mayor-cat').textContent = mayorTipo ? TIPOS_GASTO[mayorTipo[0]]?.label : '—';
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
    const info = TIPOS_GASTO[g.tipo] || { label: g.tipo, icono: 'box', clase: 'gasto-otros' };
    const fecha = new Date(g.fecha + 'T00:00:00').toLocaleDateString('es-CO');
    return `
      <tr data-id="${g.id}">
        <td><strong>${g.concepto}</strong></td>
        <td><span class="gasto-tipo-badge ${info.clase}">${ico(info.icono || 'box', 12)} ${info.label}</span></td>
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

  // Sumar a caja según fuente — el dinero sí está ingresando ahora
  await actualizarSaldoCaja(fuente, monto, `Abono venta — ${formatCOP(monto)}`);

  // Buscar el pendiente asociado a la venta
  const { data: pendiente } = await sb.from('pendientes')
    .select('*').eq('venta_id', _abonoVentaId).maybeSingle();

  if(pendiente){
    const nuevoAbonado = (pendiente.monto_abonado || 0) + monto;
    if(nuevoSaldo === 0){
      // Ya está pagado completamente: eliminar de pendientes y pasar a contado
      await sb.from('pendientes').delete().eq('venta_id', _abonoVentaId);
      await sb.from('ventas').update({
        tipo: 'contado',
        metodo_pago: fuente === 'efectivo' ? 'efectivo' : 'transferencia',
        banco: fuente === 'nequi' ? 'Nequi' : fuente === 'bancolombia' ? 'Bancolombia' : null
      }).eq('id', _abonoVentaId);
      showToast(`✅ Venta pagada completamente`, 'success');
    } else {
      await sb.from('pendientes')
        .update({ monto_abonado: nuevoAbonado, pagado: false })
        .eq('id', pendiente.id);
      showToast(`✅ Abono de ${formatCOP(monto)} — Saldo restante: ${formatCOP(nuevoSaldo)}`, 'success');
    }
  } else if(nuevoSaldo === 0){
    await sb.from('ventas').update({
      tipo: 'contado',
      metodo_pago: fuente === 'efectivo' ? 'efectivo' : 'transferencia',
      banco: fuente === 'nequi' ? 'Nequi' : fuente === 'bancolombia' ? 'Bancolombia' : null
    }).eq('id', _abonoVentaId);
    showToast(`✅ Venta pagada completamente`, 'success');
  }

  cerrarModalAbonoVenta();
  await cargarVentas();
  await cargarPendientes();
  await cargarCaja();
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

  abrirModalFacturaCargando();
  try{
    const pdfBlob = await construirFacturaPDF({
      titulo: 'Comprobante de Venta',
      fecha, cliente: v.cliente_nombre || 'Sin definir', telefono: clienteTel,
      metodoPago, numero: numeroFactura(v.id),
      items: items.map(it => ({
        nombre: it.producto_nombre, cantidad: it.cantidad,
        precio: it.precio_unitario, subtotal: it.precio_unitario * it.cantidad,
        foto: it.foto_url || null
      })),
      descuento: v.descuento || 0, total: v.total
    });

    mostrarFacturaPDF(pdfBlob, nombreArchivo);
  }catch(e){
    cerrarFacturaPreview();
    showToast('❌ No se pudo generar la factura: ' + (e.message || e), 'error');
  }
}

/** Número de factura determinístico a partir del id */
function numeroFactura(id){
  const hex = String(id || '').replace(/[^0-9a-f]/gi, '').slice(0, 8);
  const n = parseInt(hex || '1', 16) % 899999 + 100000;
  return String(n).padStart(6, '0');
}

/* Logo de Atenas en caché y reducido (el original es 2835×2835px y ralentiza el render) */
let _fxLogoData = null;
async function logoMini(){
  if(_fxLogoData !== null) return _fxLogoData;
  const full = await logoBase64();
  if(!full){ _fxLogoData = ''; return ''; }
  try {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = full; });
    const S = 512;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    c.getContext('2d').drawImage(img, 0, 0, S, S);
    _fxLogoData = c.toDataURL('image/png');
  } catch(e){
    _fxLogoData = full;
  }
  return _fxLogoData;
}

/* Miniaturas de fotos de productos en caché: en la factura solo se ven a 46px,
   así que descargar la foto en resolución completa es el mayor cuello de botella al generar el PDF */
const _fxImgMiniCache = new Map();
async function imagenMini(url){
  if(!url) return '';
  if(_fxImgMiniCache.has(url)) return _fxImgMiniCache.get(url);
  let resultado = url;
  try {
    const img = await new Promise((res, rej) => {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = url;
    });
    const MAX = 200;
    const w = img.naturalWidth || MAX, h = img.naturalHeight || MAX;
    const esc = Math.min(1, MAX / Math.max(w, h));
    if(esc < 1){
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w * esc));
      c.height = Math.max(1, Math.round(h * esc));
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resultado = c.toDataURL('image/jpeg', 0.85);
    }
  } catch(e){ /* sin CORS u otro fallo: se usa la URL original */ }
  _fxImgMiniCache.set(url, resultado);
  return resultado;
}

/** Iconos lineales usados en la factura */
function fxIcon(nombre, tam, color){
  const s = tam || 14;
  const c = color || '#E91E83';
  const svg = {
    pin:   `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
    tel:   `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>`,
    ig:    `<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`,
    doc:   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
    cal:   `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    user:  `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    card:  `<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
    tag:   `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`
  }[nombre] || '';
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`;
}

/* ============================================================
   FACTURA PREMIUM — Light Glassmorphism + Soft UI
   Bloques reutilizables para construir cada página del PDF.
   ============================================================ */

/** Bloque de estilos de la factura */
function fxInvoiceStyle(){
  return `
  :root{
    --fx-rosa:#E91E83; --fx-rosa2:#F22991; --fx-rosa-deep:#C2185B;
    --fx-pastel:#FCE7F3; --fx-soft:#FFF0F8; --fx-borde:#F6CBE4;
    --fx-lavanda:#A78BFA; --fx-lavanda-soft:#F3EFFF;
    --fx-texto:#232A3C; --fx-texto2:#8A93A6;
    --fx-sombra:0 10px 30px rgba(233,30,131,.10);
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Poppins',sans-serif;background:#fff;color:var(--fx-texto);}
  .fx-page{
    position:relative;width:210mm;height:297mm;
    background:linear-gradient(180deg,#FFFFFF 0%,#FFFDFE 100%);
    overflow:hidden;padding:30px 32px 40px;
  }
  .fx-flow{position:relative;z-index:3;display:flex;flex-direction:column;gap:16px;height:100%;}

  /* ---- decoraciones suaves ---- */
  .fx-topblob{position:absolute;top:-70px;left:-60px;z-index:1;width:230px;height:170px;
    background:linear-gradient(135deg,#FDEBF6 0%,#F8E0F1 100%);border-radius:58% 42% 60% 40%/55% 48% 52% 45%;opacity:.85;}
  .fx-topblob2{position:absolute;top:10px;left:-24px;z-index:1;width:80px;height:60px;
    background:linear-gradient(135deg,#F5C2E0 0%,#F0B0D8 100%);border-radius:50% 50% 42% 58%/58% 44% 56% 42%;opacity:.45;}
  .fx-dots{position:absolute;top:18px;right:22px;z-index:1;width:60px;height:60px;
    background-image:radial-gradient(circle,rgba(233,30,131,.26) 1.6px,transparent 1.8px);background-size:13px 13px;opacity:.85;}
  .fx-footer-decor{position:absolute;left:0;right:0;bottom:0;z-index:1;height:130px;pointer-events:none;}
  .fx-blob-a{position:absolute;bottom:-40px;left:5%;width:150px;height:150px;border-radius:50%;
    background:radial-gradient(circle at 35% 35%,rgba(200,240,240,.9),rgba(200,240,240,.18) 70%);}
  .fx-blob-l{position:absolute;bottom:-36px;left:43%;width:130px;height:130px;border-radius:50%;
    background:radial-gradient(circle at 40% 40%,rgba(237,233,254,.95),rgba(237,233,254,.18) 72%);}
  .fx-blob-r{position:absolute;bottom:-32px;right:2%;width:150px;height:150px;border-radius:50%;
    background:radial-gradient(circle at 30% 30%,rgba(249,168,212,.85),rgba(249,168,212,.15) 72%);}
  .fx-wave{position:absolute;left:-4%;width:108%;border-radius:50% 50% 0 0/100% 100% 0 0;}
  .fx-wave-1{bottom:-2px;height:36px;background:#E9B8DC;opacity:.5;}
  .fx-wave-2{bottom:-2px;height:25px;background:#F3B8DA;opacity:.55;}
  .fx-wave-3{bottom:-2px;height:13px;background:#F9CFE8;opacity:.7;}

  /* ---- encabezado ---- */
  .fx-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;}
  .fx-brand{display:flex;align-items:center;gap:14px;min-width:0;}
  .fx-brand-txt{display:flex;flex-direction:column;gap:5px;min-width:0;}
  .fx-brand-name{font-size:21px;font-weight:800;color:var(--fx-rosa);letter-spacing:3px;line-height:1.1;white-space:nowrap;}
  .fx-brand-sub{font-size:8px;font-weight:700;letter-spacing:4.5px;color:var(--fx-texto2);text-transform:uppercase;}
  .fx-logo-box{
    width:132px;height:132px;flex-shrink:0;border-radius:26px;
    background:rgba(255,255,255,.85);border:1px solid rgba(233,30,131,.18);
    box-shadow:var(--fx-sombra);
    display:flex;align-items:center;justify-content:center;padding:12px;
    backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  }
  .fx-logo{width:100%;height:100%;object-fit:contain;}
  .fx-comp{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0;}
  .fx-comp-badge{
    display:inline-flex;align-items:center;gap:8px;
    background:linear-gradient(135deg,#E91E83,#F22991);color:#fff;
    font-size:12px;font-weight:700;letter-spacing:2.5px;
    padding:10px 18px;border-radius:999px;box-shadow:0 8px 20px rgba(233,30,131,.30);
  }
  .fx-comp-meta{
    display:flex;align-items:center;gap:10px;
    background:rgba(255,255,255,.82);border:1px solid var(--fx-borde);
    border-radius:14px;padding:8px 14px;box-shadow:0 4px 14px rgba(23,32,58,.06);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  }
  .fx-comp-num{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;}
  .fx-comp-num .lbl{font-size:8.5px;letter-spacing:2px;color:var(--fx-texto2);font-weight:700;}
  .fx-comp-num .n{color:var(--fx-rosa);letter-spacing:.5px;}
  .fx-comp-fecha{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--fx-texto2);font-weight:600;border-left:1px solid #F6E7F1;padding-left:10px;}

  /* ---- contacto ---- */
  .fx-contact{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;}
  .fx-contact-pill{
    display:inline-flex;align-items:center;gap:6px;
    background:rgba(255,255,255,.7);border:1px solid rgba(233,30,131,.14);
    border-radius:999px;padding:6px 13px;font-size:10.5px;font-weight:600;color:#5A6478;
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
  }

  /* ---- tarjeta información ---- */
  .fx-info{
    display:flex;border-radius:20px;overflow:hidden;
    background:rgba(255,255,255,.78);border:1px solid rgba(233,30,131,.16);
    box-shadow:var(--fx-sombra);
    backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  }
  .fx-info-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;padding:18px 12px;text-align:center;}
  .fx-info-col+.fx-info-col{border-left:1px solid rgba(233,30,131,.10);}
  .fx-ico{
    width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,rgba(252,231,243,.9),rgba(243,239,255,.9));
    box-shadow:0 4px 12px rgba(233,30,131,.12);
  }
  .fx-info-label{font-size:8.5px;font-weight:700;letter-spacing:2.2px;color:var(--fx-texto2);}
  .fx-info-val{font-size:13px;font-weight:700;color:var(--fx-texto);line-height:1.35;word-break:break-word;max-width:100%;}

  /* ---- productos ---- */
  .fx-prods{
    background:rgba(255,255,255,.82);border:1px solid rgba(233,30,131,.16);
    border-radius:20px;overflow:hidden;box-shadow:0 6px 22px rgba(23,32,58,.05);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  }
  .fx-prods-head{
    display:flex;align-items:center;gap:8px;
    background:linear-gradient(135deg,#E91E83,#F22991);color:#fff;
    font-size:9.5px;font-weight:700;letter-spacing:1.8px;padding:11px 16px;
  }
  .fx-prods-head .c{flex:1;}
  .fx-prods-head .n{width:52px;text-align:center;}
  .fx-prods-head .p{width:96px;text-align:right;}
  .fx-prods-head .t{width:98px;text-align:right;}
  .fx-prow{display:flex;align-items:center;gap:8px;padding:11px 16px;break-inside:avoid;page-break-inside:avoid;}
  .fx-prow+.fx-prow{border-top:1px solid rgba(233,30,131,.09);}
  .fx-prow .fx-pcol{flex:1;display:flex;align-items:center;gap:12px;min-width:0;}
  .fx-pimgwrap{width:46px;height:46px;flex-shrink:0;}
  .fx-pimg{width:46px;height:46px;object-fit:cover;border-radius:14px;border:1px solid #F6D3E8;background:#FFF5FA;}
  .fx-pimg-ph{display:flex;align-items:center;justify-content:center;border-radius:14px;
    background:linear-gradient(135deg,#FDE7F3,#F1E9FE);box-shadow:inset 0 0 0 1px rgba(233,30,131,.14);}
  .fx-pinfo{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
  .fx-pname{font-size:12.5px;font-weight:600;color:var(--fx-texto);line-height:1.3;word-break:break-word;}
  .fx-pdesc{font-size:9.5px;color:var(--fx-texto2);}
  .fx-prow .fx-pnum{width:52px;text-align:center;font-size:12.5px;font-weight:700;color:var(--fx-texto);}
  .fx-prow .fx-pprecio{width:96px;text-align:right;font-size:11.5px;color:var(--fx-texto2);font-weight:600;}
  .fx-prow .fx-ptotal{width:98px;text-align:right;font-size:12.5px;font-weight:800;color:var(--fx-rosa);}

  /* ---- total ---- */
  .fx-total{
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    background:linear-gradient(135deg,rgba(252,231,243,.95),rgba(255,240,248,.9));
    border:1px solid rgba(233,30,131,.25);border-radius:20px;padding:16px 22px;
    box-shadow:0 8px 24px rgba(233,30,131,.14);
  }
  .fx-total-left{display:flex;align-items:center;gap:14px;}
  .fx-total-tag{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.95);
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(233,30,131,.18);}
  .fx-total-txt{display:flex;flex-direction:column;gap:3px;}
  .fx-total-label{font-size:9.5px;font-weight:800;letter-spacing:2.6px;color:var(--fx-rosa);}
  .fx-total-num{font-size:30px;font-weight:800;color:var(--fx-rosa);line-height:1;letter-spacing:.5px;}
  .fx-descuento{font-size:10.5px;color:var(--fx-texto2);font-weight:600;}
  .fx-descuento span{color:#D11A70;font-weight:700;}

  /* ---- pago ---- */
  .fx-pago-wrap{display:flex;justify-content:center;}
  .fx-pago{display:inline-flex;align-items:center;gap:7px;
    background:var(--fx-pastel);color:var(--fx-rosa);
    font-size:12px;font-weight:700;letter-spacing:.4px;
    padding:9px 20px;border-radius:999px;box-shadow:0 4px 14px rgba(233,30,131,.14);}

  /* ---- gracias / redes ---- */
  .fx-gracias{display:flex;flex-direction:column;align-items:center;gap:4px;padding-top:2px;}
  .fx-gracias-txt{font-family:'Great Vibes',cursive;font-size:34px;color:var(--fx-texto);line-height:1.15;}
  .fx-heart{font-size:20px;color:var(--fx-rosa);line-height:1;}
  .fx-social{display:flex;align-items:center;justify-content:center;gap:8px;padding-top:2px;}
  .fx-social-ico{display:flex;}
  .fx-social-handle{font-size:12.5px;font-weight:700;color:var(--fx-texto);letter-spacing:.3px;}

  /* ---- encabezado reducido (páginas 2+) ---- */
  .fx-compact{
    display:flex;align-items:center;gap:14px;
    background:rgba(255,255,255,.8);border:1px solid rgba(233,30,131,.14);
    border-radius:18px;padding:10px 16px;box-shadow:0 4px 16px rgba(23,32,58,.05);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  }
  .fx-logo-sm{width:46px;height:46px;object-fit:contain;flex-shrink:0;}
  .fx-compact-brand{font-size:13px;font-weight:800;color:var(--fx-rosa);letter-spacing:1.5px;flex-shrink:0;white-space:nowrap;}
  .fx-compact-mid{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0;}
  .fx-compact-badge{font-size:10.5px;font-weight:800;letter-spacing:2px;color:var(--fx-rosa);}
  .fx-compact-meta{font-size:10.5px;font-weight:600;color:var(--fx-texto2);}`;
}

/** Encabezado completo (página 1) */
function fxHeadHTML({numero, titulo, logo, fecha}){
  return `
    <div class="fx-head">
      <div class="fx-brand">
        <div class="fx-logo-box">
          ${logo ? `<img src="${logo}" alt="Atenas Style Shop" class="fx-logo">` : ''}
        </div>
        <div class="fx-brand-txt">
          <span class="fx-brand-name">ATENAS STYLE SHOP</span>
          <span class="fx-brand-sub">Moda · Accesorios</span>
        </div>
      </div>
      <div class="fx-comp">
        <div class="fx-comp-badge">${fxIcon('doc', 13, '#fff')} ${(titulo || 'Comprobante de Venta').toUpperCase()}</div>
        <div class="fx-comp-meta">
          <div class="fx-comp-num"><span class="lbl">FACTURA</span> <span class="n">N° ${numero || '000000'}</span></div>
          <div class="fx-comp-fecha">${fxIcon('cal', 12, '#E91E83')} ${fecha || ''}</div>
        </div>
      </div>
    </div>`;
}

/** Encabezado reducido (páginas 2+) */
function fxCompactHTML({numero, titulo, logo, fecha, pagina}){
  return `
    <div class="fx-compact">
      ${logo ? `<img src="${logo}" alt="Atenas" class="fx-logo-sm">` : ''}
      <span class="fx-compact-brand">ATENAS STYLE SHOP</span>
      <div class="fx-compact-mid">
        <span class="fx-compact-badge">${(titulo || 'Comprobante de Venta').toUpperCase()}</span>
        <span class="fx-compact-meta">N° ${numero || '000000'} · ${fecha || ''}${pagina ? ` · Pág. ${pagina}` : ''}</span>
      </div>
    </div>`;
}

/** Línea de contacto (ciudad · teléfono · instagram) */
function fxContactHTML(){
  return `
    <div class="fx-contact">
      <span class="fx-contact-pill">${fxIcon('pin', 12, '#E91E83')} Cartagena, Colombia</span>
      <span class="fx-contact-pill">${fxIcon('tel', 12, '#E91E83')} 318 434 6975</span>
      <span class="fx-contact-pill">${fxIcon('ig', 12, '#E91E83')} @atenas.style_ctg</span>
    </div>`;
}

/** Tarjeta glassmorphism: Fecha | Cliente | Método de pago */
function fxInfoHTML({fecha, cliente, metodoPago}){
  return `
    <div class="fx-info">
      <div class="fx-info-col">
        <span class="fx-ico">${fxIcon('cal', 16, '#E91E83')}</span>
        <span class="fx-info-label">FECHA</span>
        <span class="fx-info-val">${fecha || '—'}</span>
      </div>
      <div class="fx-info-col">
        <span class="fx-ico">${fxIcon('user', 16, '#E91E83')}</span>
        <span class="fx-info-label">CLIENTE</span>
        <span class="fx-info-val">${cliente || '—'}</span>
      </div>
      <div class="fx-info-col">
        <span class="fx-ico">${fxIcon('card', 16, '#E91E83')}</span>
        <span class="fx-info-label">MÉTODO DE PAGO</span>
        <span class="fx-info-val">${metodoPago || '—'}</span>
      </div>
    </div>`;
}

/** Una fila de producto */
function fxRowHTML(it){
  const foto = it.foto || '';
  const img = foto
    ? `<img src="${foto}" class="fx-pimg" crossorigin="anonymous" alt="producto">`
    : `<span class="fx-pimg fx-pimg-ph">${fxIcon('tag', 15, '#E91E83')}</span>`;
  return `
    <div class="fx-prow">
      <div class="fx-pcol">
        <span class="fx-pimgwrap">${img}</span>
        <span class="fx-pinfo">
          <span class="fx-pname">${it.nombre || '—'}</span>
          ${it.desc ? `<span class="fx-pdesc">${it.desc}</span>` : ''}
        </span>
      </div>
      <div class="fx-pnum">${String(it.cantidad || 0)}</div>
      <div class="fx-pprecio">${formatCOP(it.precio)}</div>
      <div class="fx-ptotal">${formatCOP(it.subtotal)}</div>
    </div>`;
}

/** Tabla de productos */
function fxProdsHTML(rowsHtml){
  return `
    <div class="fx-prods">
      <div class="fx-prods-head">
        <div class="c">PRODUCTO</div>
        <div class="n">CANT.</div>
        <div class="p">PRECIO UNIT.</div>
        <div class="t">TOTAL</div>
      </div>
      ${rowsHtml || '<div class="fx-prow"><div class="fx-pcol"><div class="fx-pinfo"><div class="fx-pname">Sin productos</div></div></div></div>'}
    </div>`;
}

/** Bloque total + método de pago */
function fxTotalHTML({total, descuento, metodoPago}){
  const descRow = descuento > 0
    ? `<div class="fx-descuento">Descuento <span>− ${formatCOP(descuento)}</span></div>`
    : '';
  return `
    <div class="fx-total">
      <div class="fx-total-left">
        <span class="fx-total-tag">${fxIcon('tag', 18, '#E91E83')}</span>
        <span class="fx-total-txt">
          <span class="fx-total-label">TOTAL A PAGAR</span>
          ${descRow}
        </span>
      </div>
      <span class="fx-total-num">${formatCOP(total)}</span>
    </div>
    ${metodoPago ? `<div class="fx-pago-wrap"><span class="fx-pago">${fxIcon('card', 13, '#E91E83')} ${metodoPago}</span></div>` : ''}`;
}

/** Despedida + redes */
function fxFooterContentHTML(){
  return `
    <div class="fx-gracias">
      <div class="fx-gracias-txt">¡Gracias por tu compra!</div>
      <div class="fx-heart">♥</div>
    </div>
    <div class="fx-social">
      <span class="fx-social-ico">${fxIcon('ig', 14, '#E91E83')}</span>
      <span class="fx-social-handle">@atenas.style_ctg</span>
    </div>`;
}

/** Decoraciones sutiles de cada página */
function fxDecorHTML(){
  return `
    <div class="fx-topblob"></div>
    <div class="fx-topblob2"></div>
    <div class="fx-dots"></div>
    <div class="fx-footer-decor">
      <span class="fx-blob-a"></span>
      <span class="fx-blob-l"></span>
      <span class="fx-blob-r"></span>
      <span class="fx-wave fx-wave-1"></span>
      <span class="fx-wave fx-wave-2"></span>
      <span class="fx-wave fx-wave-3"></span>
    </div>`;
}

/** Construye el HTML completo de la factura (documento de una sola página fluida, usado como plantilla de medición) */
function construirFacturaHTML({numero, titulo, fecha, cliente, telefono, metodoPago, items, descuento, total, logo, footer}){
  const rowsHtml = (items || []).map(fxRowHTML).join('');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Great+Vibes&display=swap" rel="stylesheet">
<style>${fxInvoiceStyle()}</style>
</head>
<body>
  <div class="fx-page" style="height:auto;overflow:visible;">
    ${fxDecorHTML()}
    <div class="fx-flow" style="height:auto;">
      ${fxHeadHTML({numero, titulo, logo, fecha})}
      ${fxContactHTML()}
      ${fxInfoHTML({fecha, cliente, metodoPago})}
      ${fxProdsHTML(rowsHtml)}
      ${fxTotalHTML({total, descuento, metodoPago})}
      ${fxFooterContentHTML()}
    </div>
    <div class="fx-compact-measure" style="position:absolute;top:0;left:-6000px;width:195mm;visibility:hidden;">${fxCompactHTML({numero, titulo, logo, fecha, pagina:'1'})}</div>
  </div>
</body>
</html>`;
}

/** Espera a que carguen imágenes y fuentes dentro de un nodo */
async function esperarAssets(cont){
  const imgs = Array.from(cont.querySelectorAll('img'));
  await Promise.all(imgs.map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));
  const fontProms = [];
  if(document.fonts && document.fonts.load){
    fontProms.push(document.fonts.load('600 11px "Poppins"'));
    fontProms.push(document.fonts.load('700 12px "Poppins"'));
    fontProms.push(document.fonts.load('800 30px "Poppins"'));
    fontProms.push(document.fonts.load('400 34px "Great Vibes"'));
  }
  await Promise.all(fontProms);
}

/** Renderiza UNA página de la factura a canvas (210×297mm exactos) */
async function renderPaginaFactura(cont, {numero, titulo, fecha, cliente, metodoPago, rows, logo, total, descuento}, tipo, pagina, escala = 2){
  const page = document.createElement('div');
  page.className = 'fx-page';
  page.style.cssText = 'position:absolute;top:0;left:0;';
  const rowsHtml = rows.map(it => fxRowHTML(it)).join('');
  const prodsBlock = rowsHtml ? fxProdsHTML(rowsHtml) : '';
  let flow = '';
  if(tipo === 'single'){
    flow = `${fxHeadHTML({numero, titulo, logo, fecha})}
      ${fxContactHTML()}
      ${fxInfoHTML({fecha, cliente, metodoPago})}
      ${prodsBlock}
      ${fxTotalHTML({total, descuento, metodoPago})}
      ${fxFooterContentHTML()}`;
  } else if(tipo === 'first'){
    flow = `${fxHeadHTML({numero, titulo, logo, fecha})}
      ${fxContactHTML()}
      ${fxInfoHTML({fecha, cliente, metodoPago})}
      ${prodsBlock}`;
  } else if(tipo === 'mid'){
    flow = `${fxCompactHTML({numero, titulo, logo, fecha, pagina})}
      ${prodsBlock}`;
  } else {
    flow = `${fxCompactHTML({numero, titulo, logo, fecha, pagina})}
      ${prodsBlock}
      ${fxTotalHTML({total, descuento, metodoPago})}
      ${fxFooterContentHTML()}`;
  }
  page.innerHTML = `${fxDecorHTML()}<div class="fx-flow">${flow}</div>`;
  cont.appendChild(page);

  const imgs = Array.from(page.querySelectorAll('img'));
  await Promise.all(imgs.map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));
  imgs.forEach(img => {
    if(img.naturalWidth === 0 && img.parentNode){
      const ph = document.createElement('span');
      ph.className = 'fx-pimg fx-pimg-ph';
      ph.innerHTML = fxIcon('tag', 15, '#E91E83');
      img.parentNode.replaceChild(ph, img);
    }
  });

  const canvas = await window.html2canvas(page, {
    scale: escala,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#FFFFFF',
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1024,
    windowHeight: Math.max(page.offsetHeight, 1200),
    logging: false
  });
  page.remove();
  return canvas;
}

/** Construye el PDF de factura con paginación correcta (sin cortar filas, con encabezado repetido) */
async function construirFacturaPDF({titulo, fecha, cliente, telefono, metodoPago, items, descuento, total, numero}){
  const { jsPDF } = window.jspdf;
  if(!window.html2canvas){
    showToast('⚠️ No se pudo generar la factura (falta html2canvas)', 'error');
    return { blob: new jsPDF().output('blob'), canvases: [] };
  }

  // En móvil usamos una resolución menor para renderizar mucho más rápido
  const isMobile = window.innerWidth <= 768;
  const ESCALA = isMobile ? 1.5 : 2;

  showToast('⏳ Generando factura…', 'info');
  const logo = await logoMini();
  const rows = await Promise.all((items || []).map(async it => ({
    nombre: it.nombre, cantidad: it.cantidad,
    precio: it.precio, subtotal: it.subtotal,
    foto: await imagenMini(it.foto || ''), desc: it.desc || ''
  })));

  const html = construirFacturaHTML({
    numero, titulo, fecha, cliente, telefono, metodoPago,
    items: rows, descuento, total, logo
  });

  const cont = document.createElement('div');
  cont.style.cssText = 'position:fixed;top:0;left:-10000px;z-index:-1;';
  cont.innerHTML = html;
  document.body.appendChild(cont);

  try {
    await esperarAssets(cont);

    const pageEl = cont.querySelector('.fx-page');
    const pageW = pageEl.getBoundingClientRect().width;
    const pageH = pageW * (297 / 210);

    const q = sel => cont.querySelector(sel);
    const bH = el => el ? el.getBoundingClientRect().height : 0;

    const hHead = bH(q('.fx-head'));
    const hContact = bH(q('.fx-contact'));
    const hInfo = bH(q('.fx-info'));
    const hProdsHead = bH(q('.fx-prods-head'));
    const hTotal = bH(q('.fx-total'));
    const hPago = q('.fx-pago-wrap') ? bH(q('.fx-pago-wrap')) : 0;
    const hGracias = bH(q('.fx-gracias'));
    const hSocial = bH(q('.fx-social'));
    const hCompact = bH(q('.fx-compact-measure'));

    const rowEls = Array.from(cont.querySelectorAll('.fx-prow'));
    const rowH = rowEls.map(el => el.getBoundingClientRect().height);
    const n = rowH.length;
    const all = Array.from({length: n}, (_, i) => i);

    const GAP = 16, PAD_T = 30, PAD_B = 40, SLACK = 6;
    const cap = pageH - PAD_T - PAD_B - SLACK;
    const flowOf = blocks => blocks.reduce((a, b, i) => a + b + (i > 0 ? GAP : 0), 0);
    const sumRows = idxs => idxs.reduce((a, i) => a + rowH[i], 0);
    const prods = idxs => hProdsHead + sumRows(idxs);

    const headTop = flowOf([hHead, hContact, hInfo]);
    const totalTail = flowOf([hTotal, hPago, hGracias, hSocial]);

    const layoutPages = [];
    if(n === 0 || flowOf([hHead, hContact, hInfo, prods(all), hTotal, hPago, hGracias, hSocial]) <= cap){
      layoutPages.push({type: 'single', rows: all});
    } else {
      const rowsBudgetLast = cap - flowOf([hCompact, hProdsHead]) - totalTail;
      let i = 0;

      const p1rows = [];
      let b1 = cap - headTop - GAP - hProdsHead;
      for(; i < n; i++){
        if(rowH[i] <= b1){ p1rows.push(i); b1 -= rowH[i]; } else break;
      }
      if(p1rows.length === 0 && i < n) p1rows.push(i++);
      layoutPages.push({type: 'first', rows: p1rows});

      while(i < n){
        const remainingSum = sumRows(all.slice(i));
        if(remainingSum <= rowsBudgetLast){
          layoutPages.push({type: 'last', rows: all.slice(i)});
          i = n;
          break;
        }
        const mid = [];
        let bm = cap - flowOf([hCompact, hProdsHead]);
        for(; i < n; i++){
          if(rowH[i] > bm) break;
          mid.push(i);
          bm -= rowH[i];
          if(sumRows(all.slice(i + 1)) <= rowsBudgetLast){ i++; break; }
        }
        if(mid.length === 0 && i < n) mid.push(i++);
        layoutPages.push({type: 'mid', rows: mid});
      }

      if(!layoutPages.some(p => p.type === 'last')) layoutPages.push({type: 'last', rows: []});
    }

    const pdf = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'a4'});
    const datosPagina = {numero, titulo, fecha, cliente, metodoPago, rows, logo, total, descuento: descuento || 0};
    const canvases = await Promise.all(layoutPages.map((lp, p) =>
      renderPaginaFactura(cont, datosPagina, lp.type, String(p + 1), ESCALA)
    ));
    canvases.forEach((canvas, p) => {
      if(p > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    });

    return { blob: pdf.output('blob'), canvases };
  } finally {
    cont.remove();
  }
}

/** Devuelve (y crea si hace falta) el contenedor de vista previa por imágenes en móvil */
function getFacturaVisor(){
  const iframe = document.getElementById('factura-iframe');
  let visor = document.getElementById('factura-img-visor');
  if(!visor){
    visor = document.createElement('div');
    visor.id = 'factura-img-visor';
    visor.style.cssText = 'overflow-y:auto;background:#525659;padding:8px;';
    iframe.parentNode.insertBefore(visor, iframe);
  }
  return visor;
}

/** Abre el modal de la factura de inmediato con un estado de carga */
function abrirModalFacturaCargando(){
  const modal = document.getElementById('modal-factura-preview');
  modal.classList.add('open');
  if(window.innerWidth <= 768){
    document.getElementById('factura-iframe').style.display = 'none';
    const visor = getFacturaVisor();
    visor.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;font-size:13px;">⏳ Generando factura...</div>';
    visor.style.display = 'block';
  }
}

/** Muestra el PDF en el modal y prepara descarga/compartir */
async function mostrarFacturaPDF(resultado, nombreArchivo){
  const pdfBlob = resultado && resultado.blob ? resultado.blob : resultado;
  const canvases = resultado && resultado.canvases ? resultado.canvases : [];
  const modal = document.getElementById('modal-factura-preview');
  if(!modal.classList.contains('open')) return;
  const iframe = document.getElementById('factura-iframe');
  window._facturaPdfBlob = pdfBlob;
  window._facturaNombre = nombreArchivo;
  const isMobile = window.innerWidth <= 768;

  if(isMobile){
    iframe.style.display = 'none';

    // En móvil mostramos directo los canvas ya generados (evita volver a renderizar con pdf.js)
    if(canvases && canvases.length){
      const visor = getFacturaVisor();
      visor.style.display = 'block';
      visor.innerHTML = '';
      canvases.forEach(c => {
        c.style.cssText = 'width:100%;display:block;margin-bottom:4px;';
        visor.appendChild(c);
      });
      return;
    }

    // Limpiar visor anterior
    const visor = getFacturaVisor();
    visor.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;font-size:13px;">⏳ Cargando vista previa...</div>';
    visor.style.display = 'block';

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
      const viewport = page.getViewport({scale: 1.5});
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
        <td><span class="badge ${info.clase}">${ico(info.icono || 'box', 12)} ${info.label}</span></td>
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
          <span class="badge ${info.clase}">${ico(info.icono || 'box', 12)} ${info.label}</span>
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

  const resaltados = getPendientesResaltados();
  lista.innerHTML = PENDIENTES.map(p => {
    const fecha = new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-CO');
    const fuenteLabel = p.fuente ? (p.fuente === 'efectivo' ? `${ico('cash', 11)} Efectivo` : p.fuente === 'nequi' ? 'nequi' : 'Bancolombia') : `${ico('clock', 11)} A crédito`;
    return `
      <div class="pendiente-row${resaltados.has(p.id) ? ' resaltado' : ''}" id="pend-${p.id}" data-monto="${p.monto}" ondblclick="toggleResaltarPendiente('${p.id}')">
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

/* Resaltado de pendientes (doble clic): marca cuáles deben pagarse este mes */
function getPendientesResaltados(){
  try{ return new Set(JSON.parse(localStorage.getItem('pendientes_resaltados') || '[]')); }
  catch(e){ return new Set(); }
}
function guardarPendientesResaltados(set){
  localStorage.setItem('pendientes_resaltados', JSON.stringify([...set]));
}
function toggleResaltarPendiente(id){
  const set = getPendientesResaltados();
  if(set.has(id)){ set.delete(id); } else { set.add(id); }
  guardarPendientesResaltados(set);
  const row = document.getElementById('pend-' + id);
  if(row) row.classList.toggle('resaltado', set.has(id));
}
function quitarPendienteResaltado(id){
  const set = getPendientesResaltados();
  if(set.delete(id)) guardarPendientesResaltados(set);
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
    const fuenteVieja = (pViejo.fuente || '').toLowerCase();
    const fuenteNueva = (fuente || '').toLowerCase();

    // Revertir el monto viejo (solo si tenía fuente descontada de caja)
    if(fuenteVieja){
      const { data: cajaActual } = await sb.from('caja_saldo').select('*').eq('id',1).single();
      const valorRevertido = (cajaActual[fuenteVieja] || 0) + montoViejo;
      await sb.from('caja_saldo').update({ [fuenteVieja]: valorRevertido }).eq('id', 1);
      CAJA[fuenteVieja] = valorRevertido;
    }

    // Aplicar el monto nuevo (solo si tiene fuente)
    if(fuenteNueva){
      const valorNuevo = (CAJA[fuenteNueva] || 0) - monto;
      await sb.from('caja_saldo').update({ [fuenteNueva]: valorNuevo }).eq('id', 1);
      CAJA[fuenteNueva] = valorNuevo;
    }

    const { error } = await sb.from('pendientes')
      .update({ descripcion: desc, monto, fuente: fuenteNueva || null })
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
    quitarPendienteResaltado(_abonoPendienteId);
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
/* ============================================================
   DASHBOARD - CONEXIÓN SUPABASE
   ============================================================ */

function actualizarDonutMargen(){
  const el = document.getElementById('dash-margen');
  const donut = document.getElementById('donut-margen');
  if(!el || !donut) return;
  const pct = parseFloat(el.textContent.replace(/[^0-9.,-]/g,'').replace(',','.'));
  const val = isNaN(pct) ? 0 : Math.max(0, Math.min(100, pct));
  donut.style.setProperty('--p', val);
}

async function cargarDashboard(mes, anio){
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();
  const m = mes || mesActual;
  const a = anio || anioActual;

  // Generar opciones del selector dinámicamente
  const selector = document.getElementById('dash-mes-general');
  if(selector){
    selector.innerHTML = `<option value="">Mes actual (${MESES_NOMBRE[mesActual]})</option>`;
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
      actualizarDonutMargen();

     // Top productos — del cierre o de tablas reales
      if(cierre.top_productos){
        const medallas = ['🥇','🥈','🥉'];
        const contProd = document.getElementById('dash-top-productos');
        if(contProd) contProd.innerHTML = cierre.top_productos.map((p,i) => `
          <div class="top3-card">
            <div class="top3-icon">${ico('box', 18)}</div>
            <div class="top3-name">${p.nombre}</div>
            <div class="top3-medal">${medallas[i]}</div>
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
          .select('total, cliente_nombre, cliente_id, fecha').eq('mes', m).eq('anio', a);
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
      actualizarDonutMargen();
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
  actualizarDonutMargen();

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
    return `
      <div class="top3-card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;">
        <div style="position:relative;">
          ${prod?.foto_url
            ? `<img src="${prod.foto_url}" style="width:100%;height:120px;object-fit:cover;display:block;">`
            : `<div style="width:100%;height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;background:var(--gris-10);">${proIcon(p.icono, 40)}</div>`
          }
        </div>
        <div style="padding:8px 10px;text-align:center;">
          <div class="top3-name" style="font-size:11px;margin-bottom:3px;">${p.nombre}</div>
          <div class="top3-medal">${medallas[i]}</div>
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
    if(!v.fecha) return;
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
    if(!d.fecha) return '';
    const fecha = new Date(d.fecha + 'T00:00:00');
    if(isNaN(fecha.getTime())) return '';
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
  }).filter(Boolean).join('');
}

/** Formato abreviado para etiquetas compactas: $1,2M / $850K */
function formatCOPCorto(n){
  n = Number(n) || 0;
  const abs = Math.abs(n);
  if(abs >= 1e6){
    const m = n / 1e6;
    return '$' + (m >= 10 ? String(Math.round(m)) : m.toFixed(1).replace('.', ',')) + 'M';
  }
  if(abs >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
  return '$' + Math.round(n);
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
    const valorCorto = formatCOPCorto(totales[i]);
    return `
      <div class="bar-chart-col" data-mes="${mes}">
        <div class="bar-chart-bar ${esActual ? 'actual' : ''}" style="height:${Math.max(pct,2)}%;">
          <span class="bar-chart-value"><span class="bcv-full">${valor}</span><span class="bcv-short">${valorCorto}</span></span>
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

 // Sumar utilidad al saldo inicial global (solo al crear el cierre nuevo, para no duplicarla)
  if(!existente){
    const { data: confActual } = await sb.from('configuracion').select('saldo_inicial_global').eq('id', 1).single();
    const nuevoSaldo = (confActual?.saldo_inicial_global || 0) + utilidad;
    await sb.from('configuracion').update({ saldo_inicial_global: nuevoSaldo }).eq('id', 1);
  }

  // Avanzar mes en configuracion
  const nuevoMes = mes === 12 ? 1 : mes + 1;
  const nuevoAnio = mes === 12 ? anio + 1 : anio;
  await sb.from('configuracion').update({ mes_actual: nuevoMes, anio_actual: nuevoAnio }).eq('id', 1);

  showToast(`✅ Mes de ${MESES_NOMBRE[mes]} cerrado — Utilidad: ${formatCOP(utilidad)}`, 'success');
  cerrarModalCerrarMes();

  await cargarDashboard();
  await actualizarBotonCerrarMes();
}

function editarPendiente(id){
  const p = PENDIENTES.find(x => x.id === id);
  if(!p) return;

  document.getElementById('pe-descripcion').value = p.descripcion;
  document.getElementById('pe-monto').value = p.monto.toLocaleString('es-CO');
  document.getElementById('pe-fuente').value = p.fuente || 'efectivo';
  _pendienteEditando = id;
  document.getElementById('modal-pendiente').classList.add('open');
  document.querySelector('#modal-pendiente .btn-primary').innerHTML = ico('save', 13) + ' Guardar Cambios';
}

async function actualizarBotonCerrarMes(){
  const hoy = new Date();
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const diaActual = hoy.getDate();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();
  const mesNombre = MESES_NOMBRE[mesActual];
  const siguienteMes = mesActual === 12 ? 1 : mesActual + 1;
  const btn = document.getElementById('btn-cerrar-mes');
  const hint = document.getElementById('cerrar-mes-hint');
  if(!btn) return;

  // Verificar si el mes actual ya fue cerrado
  const { data: cierre } = await sb.from('cierres_mensuales')
    .select('id').eq('mes', mesActual).eq('anio', anioActual).maybeSingle();
  const mesCerrado = !!cierre;

  // Solo a partir del primer mes real (junio 2026)
  const primerMesReal = 6;
  const primerAnioReal = 2026;
  const esDespuesDelPrimerMes = (anioActual > primerAnioReal) ||
    (anioActual === primerAnioReal && mesActual >= primerMesReal);

  // Se activa solo el último día; si pasa ese día sin cerrar, sigue activo
  const permitido = esDespuesDelPrimerMes && !mesCerrado && diaActual >= ultimoDia;

  if(permitido){
    btn.disabled = false;
    btn.style.opacity = '1';
    if(hint) hint.textContent = diaActual === ultimoDia
      ? `¡Hoy es el último día de ${mesNombre}!`
      : `${ico('alert', 12)} No cerraste ${mesNombre} — ciérralo lo antes posible`;
  } else if(mesCerrado){
    btn.disabled = true;
    btn.style.opacity = '.5';
    if(hint) hint.innerHTML = `${ico('check', 12)} ${mesNombre} cerrado — disponible el último día de ${MESES_NOMBRE[siguienteMes]}`;
  } else {
    btn.disabled = true;
    btn.style.opacity = '.5';
    if(hint) hint.textContent = `Disponible el ${ultimoDia} de ${mesNombre}`;
  }

  // Alerta roja persistente desde el último día del mes hasta que se cierre
  let banner = document.getElementById('banner-cierre-pendiente');
  if(banner) banner.remove();

  if(esDespuesDelPrimerMes && !mesCerrado && diaActual >= ultimoDia){
    banner = document.createElement('div');
    banner.id = 'banner-cierre-pendiente';
    banner.style.cssText = `
      background:var(--rojo);color:#fff;
      padding:10px 18px;text-align:center;
      font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;
      display:flex;align-items:center;justify-content:center;gap:12px;
      flex-wrap:wrap;
      border-radius:14px;
      margin-bottom:16px;
      box-shadow:0 4px 14px rgba(229,57,53,.35);
    `;
    banner.innerHTML = `
      <span>${ico('alert', 12)} No has cerrado el mes de ${mesNombre} ${anioActual} — ciérralo para no olvidarte</span>
      <button onclick="showView('caja')" style="background:#fff;color:var(--rojo);border:none;border-radius:20px;padding:4px 14px;font-weight:800;font-size:12px;cursor:pointer;font-family:'Nunito',sans-serif;">
        Ir a Caja
      </button>
    `;
    const main = document.querySelector('.main');
    if(main) main.prepend(banner);
    else document.body.prepend(banner);
  }

  actualizarVisibilidadBannerCierre();
}

function actualizarVisibilidadBannerCierre(){
  const banner = document.getElementById('banner-cierre-pendiente');
  if(!banner) return;
  const viewActiva = document.querySelector('.view.active');
  const enCaja = viewActiva && viewActiva.id === 'view-caja';
  banner.style.display = enCaja ? 'none' : 'flex';
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
    preparacion: {emoji: ico('box', 16),      clase:'est-prep',      label:'Preparación', bg:'var(--amarillo-light)'},
    enviado:     {emoji: ico('truck', 16),    clase:'est-camino',    label:'En camino',   bg:'var(--celeste-light)'},
    entregado:   {emoji: ico('check', 16),    clase:'est-entregado', label:'Entregado',   bg:'var(--verde-light)'},
    devuelto:    {emoji: ico('refresh', 16),  clase:'est-devuelto',  label:'Devuelto',    bg:'var(--rojo-light)'},
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
            <button class="env-btn-estado ${estado==='preparacion'?'est-prep':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','preparacion')">${ico('box', 12)} Prep.</button>
            <button class="env-btn-estado ${estado==='enviado'?'est-camino':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','enviado')">${ico('truck', 12)} Camino</button>
            <button class="env-btn-estado ${estado==='entregado'?'est-entregado':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','entregado')">${ico('check', 12)} Entregado</button>
            <button class="env-btn-estado ${estado==='devuelto'?'est-devuelto':''}" onclick="cambiarEstadoEnvio(event,'${v.id}','devuelto')">${ico('refresh', 12)} Dev.</button>
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
  const estadoLabel = {preparacion:'En Preparación', enviado:'En camino', entregado:'Entregado', devuelto:'Devuelto'};
  const estadoEmoji = {preparacion: ico('box', 12), enviado: ico('truck', 12), entregado: ico('check', 12), devuelto: ico('refresh', 12)};

  const ciudad = (v.ciudad_envio || '').toLowerCase().trim().split('-')[0].trim().split(',')[0].trim();
  const coords = CIUDADES_COORDS[ciudad];
  const origen = CIUDADES_COORDS['cartagena'];

  const iconOrigen = L.divIcon({
    html:`<div style="background:#E91E8C;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
    iconSize:[14,14], iconAnchor:[7,7], className:''
  });
  const markerOrigen = L.marker([origen.lat, origen.lng], {icon:iconOrigen})
    .addTo(_leafletMap).bindPopup(`${ico('box', 12)} Origen: Cartagena`);
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
      <div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));">${ico('truck', 24)}</div>
    </div>`,
    iconSize:[80,50], iconAnchor:[40,50], className:''
  });
 const popupCamion = `
    <div style="font-family:'Poppins',sans-serif;font-size:12px;min-width:160px;">
      <div style="font-weight:800;color:#E91E8C;margin-bottom:4px;">Pedido de ${v.cliente_nombre}</div>
      <div style="color:#666;">📍 ${v.ciudad_envio}</div>
      <div style="color:#666;">${ico('truck', 12)} ${v.transportadora || 'Sin transportadora'}</div>
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
    icon.innerHTML = ico('check', 18);
    title.textContent = '¡CAJA CUADRADA!';
    sub.textContent = '';
  } else if(diferencia > 0){
    el.classList.add('sobra');
    icon.innerHTML = ico('alert', 18);
    title.textContent = `Sobran ${formatCOP(diferencia)}`;
    sub.textContent = '';
  } else {
    el.classList.add('falta');
    icon.innerHTML = ico('x', 18);
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
        <div><div class="form-label">Subtotal</div><input class="form-input" readonly value="${formatCOP(it.precio * it.cantidad)}" style="background:var(--surface-2);color:var(--gris-60);"></div>
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
        ${p.foto_url ? `<img src="${p.foto_url}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;">`         : `<span>${proIcon(p.icono, 14)}</span>`}
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
        <div class="venta-item-thumb">${it.foto_url ? `<img src="${it.foto_url}" style="width:30px;height:30px;border-radius:7px;object-fit:cover;">` : proIcon(it.icon, 14)}</div>
        <div class="venta-item-info">${it.nombre} x${it.cantidad}</div>
        <div class="venta-item-total">${formatCOP(it.subtotal)}</div>
      </div>
    `).join('');

    return `
      <div class="venta-grupo cotiz-row" id="${simId}">
       <div class="venta-grupo-head" onclick="toggleVentaDetalle(this)">
          <div class="venta-cliente">
           <span style="background:var(--gris-20);color:var(--gris-80);font-size:10px;font-weight:800;padding:4px 10px;border-radius:8px;white-space:nowrap;">${items.length} producto${items.length > 1 ? 's' : ''}</span>
            <div class="venta-cliente-nombre">Cotización — ${s.cliente_nombre}</div>
          </div>
          <div class="venta-grupo-meta">
            <span class="cotiz-mes-badge">${ico('calendar', 11)} ${fechaCorta}</span>
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

  abrirModalFacturaCargando();
  try{
    const pdfBlob = await construirFacturaPDF({
      titulo: 'Cotización de Factura',
      fecha, cliente: s.cliente_nombre || 'Sin definir', telefono: '',
      metodoPago: '', numero: numeroFactura(s.id),
      items: items.map(it => ({
        nombre: it.nombre, cantidad: it.cantidad,
        precio: it.precio, subtotal: it.subtotal,
        foto: it.foto_url || null
      })),
      descuento: 0, total: s.total
    });

    mostrarFacturaPDF(pdfBlob, nombreArchivo);
  }catch(e){
    cerrarFacturaPreview();
    showToast('❌ No se pudo generar la cotización: ' + (e.message || e), 'error');
  }
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

const _FX_LOGO_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAYAAADNkKWqAAAAAXNSR0IArs4c6QAAATxlWElmTU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAABGAAAAcgE7AAIAAAA2AAAAuIdpAAQAAAABAAAA7gAAAAAAAABgAAAAAQAAAGAAAAABQ2FudmEgZG9jPURBSE5KbHZDc1M4IHVzZXI9VUFGODVhcVhRMm8gYnJhbmQ9dW5pdmVyc2lkYWQgZGUgY2FydGFnZW5hADAyMjE5MjAwMTYgWVVSSUFOQSBDQU5USUxMTyBTQUJBTFpBIEVTVFVESUFOVEUgQUNUSVZPAAAGkAAABwAAAAQwMjEwkQEABwAAAAQBAgMAoAAABwAAAAQwMTAwoAEAAwAAAAEAAQAAoAIABAAAAAEAAAFAoAMABAAAAAEAAAFAAAAAAM5QF1QAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAZ2aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yMDAwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6RXhpZlZlcnNpb24+MDIxMDwvZXhpZjpFeGlmVmVyc2lvbj4KICAgICAgICAgPGV4aWY6Rmxhc2hQaXhWZXJzaW9uPjAxMDA8L2V4aWY6Rmxhc2hQaXhWZXJzaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjAwMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbXBvbmVudHNDb25maWd1cmF0aW9uPgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaT4xPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+MjwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPjM8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT4wPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC9leGlmOkNvbXBvbmVudHNDb25maWd1cmF0aW9uPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIGRvYz1EQUhOSmx2Q3NTOCB1c2VyPVVBRjg1YXFYUTJvIGJyYW5kPXVuaXZlcnNpZGFkIGRlIGNhcnRhZ2VuYTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj45NjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+OTY8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDxkYzp0aXRsZT4KICAgICAgICAgICAgPHJkZjpBbHQ+CiAgICAgICAgICAgICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+RGlzZcOxbyBzaW4gdMOtdHVsbyAtIDE8L3JkZjpsaT4KICAgICAgICAgICAgPC9y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';

/** Logo embebido como data-URL (512×512). Regenerar con:
    sips -z 320 320 assets/img/logo1.png --out /tmp/logo512.png
    y pegar su base64 en _FX_LOGO_B64. Cae a esta copia si el fetch local
    no está permitido (p. ej. abrir index.html vía file://). */
async function logoBase64(){
  try {
    const res = await fetch(window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + 'assets/img/logo1.png');
    if(res.ok){
      const blob = await res.blob();
      return await new Promise(r => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result);
        reader.readAsDataURL(blob);
      });
    }
  } catch(e){
    console.warn('Logo: usando versión embebida', e);
  }
  return _FX_LOGO_B64 ? 'data:image/png;base64,' + _FX_LOGO_B64 : '';
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
  document.getElementById('confirm-title').textContent = c?.proveedor_nombre || 'Proveedor';
  document.getElementById('confirm-msg').innerHTML = `
    <div style="font-size:13px;color:var(--gris-60);margin-bottom:10px;">
      Saldo pendiente: <strong style="color:var(--rojo);">${formatCOP(c?.saldo_credito || 0)}</strong>
    </div>
    ${data.map(ab => `
      <div style="padding:6px 0;border-bottom:1px solid var(--gris-20);font-size:13px;display:flex;justify-content:space-between;align-items:center;">
        <span>Abonaste <strong>${formatCOP(ab.monto)}</strong> el ${new Date(ab.fecha+'T00:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})} <span style="color:var(--gris-60);">(${ab.fuente})</span></span>
        <button onclick="eliminarAbonoCompra('${ab.id}', ${ab.monto}, '${ab.fuente}', '${compraId}')" style="background:none;border:none;cursor:pointer;color:var(--rojo);font-size:16px;" title="Eliminar abono">${ico('trash', 14)}</button>
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

/* ============================================================
   CONFIGURACIÓN VISUAL - temas, modo noche y sonidos
   ============================================================ */
const TEMAS_APP = [
  { id:'atena',     nombre:'Atenas',    a:'#7FE8E0', c:'#8B5CF6' },
  { id:'oceano',    nombre:'Océano',    a:'#4FC3F7', c:'#2F6BFF' },
  { id:'violeta',   nombre:'Violeta',   a:'#A78BFA', c:'#6D28D9' },
  { id:'esmeralda', nombre:'Esmeralda', a:'#34D399', c:'#0D9488' },
  { id:'amanecer',  nombre:'Amanecer',  a:'#FBBF24', c:'#F97316' },
  { id:'rosa',      nombre:'Rosa',      a:'#F472B6', c:'#A855F7' }
];

let CONFIG = { tema:'atena', modoNoche:false, sonidos:true, colorPrimario:null, colorSecundario:null };

function cargarConfig(){
  try{
    const guardado = JSON.parse(localStorage.getItem('atenas_config'));
    if(guardado) CONFIG = Object.assign(CONFIG, guardado);
  }catch(e){}
}

function guardarConfig(){
  localStorage.setItem('atenas_config', JSON.stringify(CONFIG));
}

function hexToRgb(hex){
  hex = hex.replace('#','');
  return [parseInt(hex.substr(0,2),16), parseInt(hex.substr(2,2),16), parseInt(hex.substr(4,2),16)];
}

function mezclarColor(hex, pct, base){
  const r1 = hexToRgb(hex);
  const r2 = base ? hexToRgb(base) : [255,255,255];
  const k = pct / 100;
  const c = r1.map((v,i) => Math.round(v + (r2[i] - v) * k));
  return '#' + c.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2,'0')).join('');
}
const aclarar   = (hex, pct) => mezclarColor(hex, pct, '#ffffff');
const oscurecer = (hex, pct) => mezclarColor(hex, pct, '#000000');

function aplicarConfig(){
  const raiz = document.documentElement;
  raiz.setAttribute('data-modo', CONFIG.modoNoche ? 'noche' : 'dia');

  const props = ['--celeste','--celeste-dark','--celeste-light','--grad-a','--grad-b',
                 '--fucsia','--fucsia-dark','--fucsia-light','--fucsia-claro',
                 '--accent','--accent-light','--accent-rgb'];

  if(CONFIG.tema === 'personalizado' && CONFIG.colorPrimario && CONFIG.colorSecundario){
    raiz.setAttribute('data-tema', 'personalizado');
    const p = CONFIG.colorPrimario, s = CONFIG.colorSecundario;
    const set = (k, v) => raiz.style.setProperty(k, v);
    set('--celeste', p);
    set('--celeste-dark', oscurecer(p, 20));
    set('--celeste-light', aclarar(p, 85));
    set('--grad-a', p);
    set('--grad-b', oscurecer(p, 25));
    set('--fucsia', s);
    set('--fucsia-dark', oscurecer(s, 18));
    set('--fucsia-light', aclarar(s, 85));
    set('--fucsia-claro', aclarar(s, 25));
    set('--accent', s);
    set('--accent-light', aclarar(s, 40));
    set('--accent-rgb', hexToRgb(s).join(','));
  } else {
    raiz.setAttribute('data-tema', CONFIG.tema);
    props.forEach(k => raiz.style.removeProperty(k));
  }
}

function renderTemas(){
  const grid = document.getElementById('tema-grid');
  if(!grid) return;
  const temas = TEMAS_APP.map(t => `
    <div class="tema-option ${CONFIG.tema === t.id ? 'active' : ''}" onclick="aplicarTema('${t.id}')">
      <div class="tema-swatch" style="background:linear-gradient(120deg,${t.a},${t.c});"></div>
      <div class="tema-name">${t.nombre}</div>
    </div>
  `).join('');
  const perso = `
    <div class="tema-option ${CONFIG.tema === 'personalizado' ? 'active' : ''}" onclick="aplicarTema('personalizado')">
      <div class="tema-swatch" style="background:conic-gradient(#FF5F6D,#FFC371,#FF5F6D);"></div>
      <div class="tema-name">Personalizado</div>
    </div>`;
  grid.innerHTML = temas + perso;
}

function aplicarTema(tema){
  if(tema === 'personalizado'){
    if(!CONFIG.colorPrimario) CONFIG.colorPrimario = document.getElementById('cfg-color-primario').value;
    if(!CONFIG.colorSecundario) CONFIG.colorSecundario = document.getElementById('cfg-color-secundario').value;
  }
  CONFIG.tema = tema;
  guardarConfig();
  aplicarConfig();
  renderTemas();
  mostrarConfigEnInputs();
}

function cambiarModoNoche(checked){
  CONFIG.modoNoche = !!checked;
  guardarConfig();
  aplicarConfig();
}

function cambiarSonidos(checked){
  CONFIG.sonidos = !!checked;
  guardarConfig();
}

function aplicarColoresPersonalizados(){
  CONFIG.tema = 'personalizado';
  CONFIG.colorPrimario = document.getElementById('cfg-color-primario').value;
  CONFIG.colorSecundario = document.getElementById('cfg-color-secundario').value;
  guardarConfig();
  aplicarConfig();
  renderTemas();
}

function restaurarTemaAtenas(){
  CONFIG.tema = 'atena';
  CONFIG.colorPrimario = null;
  CONFIG.colorSecundario = null;
  guardarConfig();
  aplicarConfig();
  renderTemas();
  mostrarConfigEnInputs();
  showToast('🎨 Tema Atenas restaurado', 'info');
}

function mostrarConfigEnInputs(){
  const noche = document.getElementById('cfg-modo-noche');
  if(noche) noche.checked = CONFIG.modoNoche;
  const sonidos = document.getElementById('cfg-sonidos');
  if(sonidos) sonidos.checked = CONFIG.sonidos;
  const cp = document.getElementById('cfg-color-primario');
  if(cp && CONFIG.colorPrimario) cp.value = CONFIG.colorPrimario;
  const cs = document.getElementById('cfg-color-secundario');
  if(cs && CONFIG.colorSecundario) cs.value = CONFIG.colorSecundario;
}

function initConfig(){
  cargarConfig();
  aplicarConfig();
  renderTemas();
  mostrarConfigEnInputs();
}

/* ============================================================
   SONIDOS - Web Audio API (sin archivos externos)
   ============================================================ */
let _audioCtx = null;
function playSonido(tipo){
  if(!CONFIG.sonidos) return;
  try{
    if(!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    if(ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const notas = tipo === 'venta'
      ? [880, 1174.66, 1567.98]
      : tipo === 'compra'
        ? [523.25, 659.25, 783.99]
        : [783.99, 1046.5];
    notas.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.09;
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }catch(e){}
}

/* ============================================================
   CHATBOT ATENAS - Asistente de inventario y facturas
   ============================================================ */
let _chatItems = [];

const CHAT_BIENVENIDA = 'Hola, soy el asistente de Atenas y conozco tu inventario y tus ventas. Mándame tu pedido y te digo qué tienes y qué está agotado, o toca <i>"Análisis"</i> para ver cómo va tu negocio.';

let CHAT_AYUDA = 'Puedo ayudarte con:<br><br>📦 <b>Revisar un pedido:</b> escríbeme los productos y sus cantidades<br>🧾 <b>Simulación de factura:</b> escribe <i>"hazme una simulación de factura"</i><br>🔎 <b>Consultar un producto:</b> <i>"¿cuánto stock hay de ...?"</i><br>📊 <b>Análisis:</b> <i>"¿cómo van las ventas este mes?"</i>';

function toggleChat(){
  const panel = document.getElementById('chat-panel');
  if(!panel) return;
  const launcher = document.querySelector('.chat-launcher');
  const abrir = !panel.classList.contains('open');
  panel.classList.toggle('open');
  if(launcher) launcher.classList.toggle('hidden', abrir);
  if(abrir){
    const rp = document.getElementById('resumen-panel');
    if(rp) rp.classList.remove('open');
    actualizarSugerenciasChat();
    const msgs = document.getElementById('chat-msgs');
    if(msgs && msgs.children.length === 0) appendMsg('bot', CHAT_BIENVENIDA);
    setTimeout(()=>{ const i = document.getElementById('chat-input'); if(i) i.focus(); }, 80);
  }
}

function appendMsg(rol, html){
  const cont = document.getElementById('chat-msgs');
  if(!cont) return;
  const d = document.createElement('div');
  d.className = 'chat-msg ' + rol;
  d.innerHTML = html;
  cont.appendChild(d);
  chatScroll();
}

function chatScroll(){
  const cont = document.getElementById('chat-msgs');
  if(cont) cont.scrollTop = cont.scrollHeight;
}

function chatQuick(texto){
  const input = document.getElementById('chat-input');
  if(input) input.value = texto;
  enviarChat();
}

let _modoStock = false;

function chatConsultarStock(){
  _modoStock = true;
  appendMsg('bot', '🔎 Escribe el nombre del producto que quieres revisar, ej: <i>"ampolla anticaída"</i>.');
  setTimeout(()=>{ const i = document.getElementById('chat-input'); if(i) i.focus(); }, 60);
}

function enviarChat(){
  const input = document.getElementById('chat-input');
  if(!input) return;
  const texto = input.value.trim();
  if(!texto) return;
  input.value = '';
  appendMsg('user', escapeHtml(texto));
  setTimeout(()=>procesarChat(texto), 350);
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function normalizar(s){
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
}

const _STOP_BUSQ = new Set(['de','la','el','los','las','del','un','una','unos','unas','que','hay','en','para','con','y','me','te']);

function _canon(t){
  t = t.toLowerCase();
  if(t.endsWith('es') && t.length > 4) return t.slice(0, -2);
  if(t.endsWith('s') && t.length > 3) return t.slice(0, -1);
  return t;
}

function buscarCandidatos(nombre){
  const n = normalizar(nombre).replace(/[?.!]+$/, '');
  if(!n) return [];
  const ref = PRODUCTOS.filter(p => normalizar(p.referencia) === n);
  if(ref.length) return ref;
  const exact = PRODUCTOS.filter(p => normalizar(p.nombre) === n);
  if(exact.length) return exact;
  const cont = PRODUCTOS.filter(p => normalizar(p.nombre).includes(n) || n.includes(normalizar(p.nombre)));
  if(cont.length) return cont;
  const qt = n.split(/\s+/).map(_canon).filter(t => t.length > 2 && !_STOP_BUSQ.has(t));
  if(!qt.length) return [];
  const scored = PRODUCTOS
    .map(p => ({ p, inter: qt.filter(t => normalizar(p.nombre).split(/\s+/).map(_canon).includes(t)).length }))
    .filter(x => x.inter > 0)
    .sort((a, b) => b.inter - a.inter);
  if(!scored.length) return [];
  const top = scored.filter(x => x.inter === scored[0].inter);
  return top.map(x => x.p);
}

function buscarProducto(nombre){
  const cands = buscarCandidatos(nombre);
  return cands.length === 1 ? cands[0] : null;
}

function actualizarSugerenciasChat(){
  if(!PRODUCTOS.length) return;
  const grupos = {};
  for(const p of PRODUCTOS){
    const primera = normalizar(p.nombre).split(/\s+/)[0];
    if(!primera || primera.length < 3 || _STOP_BUSQ.has(primera)) continue;
    grupos[primera] = (grupos[primera] || 0) + 1;
  }
  const top = Object.entries(grupos).sort((a,b) => b[1] - a[1]).slice(0, 6);
  if(!top.length) return;
  const fams = top.map(e => e[0]);
  const ej = PRODUCTOS.filter(p => fams.includes(normalizar(p.nombre).split(/\s+/)[0]));
  if(ej.length >= 2){
    const ej1 = ej[0].nombre, ej2 = ej.find(p => normalizar(p.nombre).split(/\s+/)[0] !== normalizar(ej1).split(/\s+/)[0]).nombre || ej[1].nombre;
    const inp = document.getElementById('chat-input');
    if(inp) inp.placeholder = 'Ej: 2 ' + ej1 + ', 1 ' + ej2;
    CHAT_AYUDA = 'Puedo ayudarte con:<br><br>📦 <b>Revisar un pedido:</b> escribe tu pedido, ej. <i>"2 ' + escapeHtml(ej1) + ', 1 ' + escapeHtml(ej2) + '"</i>, y te digo qué tienes y qué está agotado<br>🧾 <b>Factura:</b> después del pedido escribe <i>"simular factura"</i> y te hago el PDF con los que tienes stock<br>📊 <b>Análisis:</b> toca el botón <i>"Análisis"</i> o escribe <i>"¿cómo van las ventas este mes?"</i>';
  }
}

function parsearPedido(texto){
  let t = texto.replace(/^(revisar|revisa|revisame|verifica|chequea|mira|valida|dime|tengo)\s+(el\s+|mi\s+|mis\s+|este\s+|estos\s+|estas\s+|los\s+|las\s+|unos\s+|un\s+|una\s+)?(pedido|lista|listado|productos|producto|articulos)?\s*:?\s*/i, '');
  t = t.replace(/^(hola|buenas|hola buenas|buenos dias|hey|oye|oye mira)[,\s!]+(mira|chequea|revisa|revisame|verifica|dime)?\s*(estos|estas|los|las|mis|unos)?\s*(productos|producto|articulos|pedido|lista)?\s*:?\s*/i, '');
  t = t.replace(/^pedido\s*:?\s*/i, '');
  const partes = t.split(/,|;|\n|\by\b/i);
  const items = [];
  for(const parte of partes){
    const p = parte.trim().replace(/\s+/g,' ').replace(/\.$/,'');
    if(!p) continue;
    const m = p.match(/^(\d+(?:[.,]\d+)?)[\s\-]+(.+)$/);
    const cantidad = m && m[1] ? Math.max(1, Math.round(parseFloat(m[1].replace(',','.')))) : 1;
    const nombre = m ? m[2].trim() : p;
    if(nombre.length > 1 && !/^(revisar|revisa|pedido|hola|buenas|ayuda|gracias)$/i.test(nombre)) items.push({ cantidad, nombre });
  }
  return items;
}

function extraerConsulta(texto){
  const t = normalizar(texto).replace(/[?.!]+$/,'');
  const patrones = [
    /stock\s+disponible\s+(?:de\s+)?(.+)/i,
    /stock\s+(?:hay\s+)?(?:de\s+)?(.+)/i,
    /precio\s+(?:de\s+)?(.+)/i,
    /cuanto\s+stock\s+(?:hay\s+)?(?:de\s+)?(.+)/i,
    /cuanto\s+(?:cuesta|vale|es)\s+(.+)/i,
    /cuanto\s+hay\s+(?:de\s+)?(.+)/i,
    /hay\s+stock\s+(?:de\s+)?(.+)/i,
    /tienes\s+stock\s+(?:de\s+)?(.+)/i,
    /tienes\s+(.+)/i,
    /tengo\s+(?:stock\s+)?(?:de\s+)?(.+)/i,
    /queda\s+(?:stock\s+)?(?:de\s+)?(.+)/i,
    /disponible\s+(?:de\s+)?(.+)/i
  ];
  for(const rx of patrones){
    const m = t.match(rx);
    if(m && m[1]) return m[1].trim();
  }
  return null;
}

const PALABRAS_ANALISIS = ['analiza','analisis','reporte','resumen','estadistic','utilidad','proyeccion','como van','como vamos','como va','ventas del','compras del','gastos del','este mes','el mes','ultimo mes','mejor producto','mas vendido','menos vendido','agotado','sin stock','inventario','cuanto vend','cuanto gast','cuanto compr','balance'];

let _chatHistorial = [];

function procesarChat(texto){
  const t = normalizar(texto);

  if(_modoStock){
    _modoStock = false;
    consultarProducto(extraerConsulta(texto) || texto);
    return;
  }

  if(t.includes('factura') || t.includes('simul') || t.includes('cotiz') || t.includes('pdf')){
    generarSimulacion();
    return;
  }

  const consulta = extraerConsulta(texto);
  if(consulta && !/\d/.test(t) && (t.includes('stock') || t.includes('precio') || t.includes('cuesta') || t.includes('vale') || t.includes('cuanto') || t.includes('hay') || t.includes('tengo') || t.includes('tienes') || t.includes('queda') || t.includes('disponible'))){
    consultarProducto(consulta);
    return;
  }

  const items = parsearPedido(texto);
  const encontroAlguno = items.some(it => buscarCandidatos(it.nombre).length > 0);
  if(items.length && (/\d/.test(t) || encontroAlguno)){
    revisarPedido(items);
    return;
  }

  if(PALABRAS_ANALISIS.some(p => t.includes(p))){
    preguntarAI(texto);
    return;
  }

  if(t.includes('ayuda') || /^(hola|buenas|que\s+tal)/.test(t)){
    appendMsg('bot', CHAT_AYUDA);
    return;
  }

  preguntarAI(texto);
}

async function preguntarAI(texto){
  const cont = document.getElementById('chat-msgs');
  const pensando = document.createElement('div');
  pensando.className = 'chat-msg bot';
  pensando.innerHTML = '⏳ Pensando...';
  cont.appendChild(pensando);
  chatScroll();

  _chatHistorial.push({ role: 'user', content: texto });
  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: texto, historial: _chatHistorial.slice(-8, -1) })
    });
    if(res.status === 501) throw new Error('no-key');
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    pensando.remove();
    const rta = data.respuesta || 'Sin respuesta.';
    _chatHistorial.push({ role: 'bot', content: rta });
    appendMsg('bot', rta);
  }catch(e){
    pensando.remove();
    _chatHistorial = [];
    console.error('Error /api/chat:', e);
    if(e.message === 'no-key'){
      appendMsg('bot', 'La IA aún no está configurada: falta la clave <i>GROQ_API_KEY</i> en Vercel. ' + CHAT_AYUDA);
    } else if(e.message === 'HTTP 404'){
      appendMsg('bot', 'No encontré la función de la IA. Esto pasa cuando pruebas la página abierta en tu computador o cuando el despliegue de Vercel aún no tiene la carpeta <i>api/</i>. ' + CHAT_AYUDA);
    } else if(e.message.startsWith('HTTP')){
      appendMsg('bot', 'La IA respondió con el error <b>' + e.message + '</b>. Entra a vercel.com → tu proyecto → <b>Logs</b> para ver el detalle. ' + CHAT_AYUDA);
    } else {
      appendMsg('bot', 'No pude conectar con la IA: <b>' + escapeHtml(e.message) + '</b>. Si estás probando desde tu computador, abre tu página de Vercel (la que termina en <i>.vercel.app</i>), no el archivo local. ' + CHAT_AYUDA);
    }
  }
}

function revisarPedido(items){
  const faltan = [], ok = [], noEncontrados = [];
  _chatItems = [];
  for(const it of items){
    const prod = buscarProducto(it.nombre);
    if(!prod){ noEncontrados.push({ nombre: it.nombre, cantidad: it.cantidad }); continue; }
    if(prod.stock < it.cantidad) faltan.push({ prod, cantidad: it.cantidad });
    else ok.push({ prod, cantidad: it.cantidad });
  }
  if(ok.length) _chatItems = ok.map(o => ({ prod: o.prod, cantidad: o.cantidad }));

  let html = '';
  if(ok.length){
    html += `✅ <b>Tienes stock para el pedido de:</b><br>`;
    for(const o of ok){
      html += `&nbsp;&nbsp;•&nbsp; ${o.prod.nombre} — pides <b>${o.cantidad}</b>, tienes <b>${o.prod.stock}</b><br>`;
    }
  }
  if(faltan.length){
    html += `⚠️ <b>Sin suficiente stock:</b><br>`;
    for(const f of faltan){
      const faltantes = f.cantidad - f.prod.stock;
      const estado = f.prod.stock <= 0 ? 'AGOTADO' : `tienes ${f.prod.stock}, te faltan ${faltantes}`;
      html += `&nbsp;&nbsp;•&nbsp; ${f.prod.nombre} — pides <b>${f.cantidad}</b>, <b>${estado}</b><br>`;
    }
  }
  if(noEncontrados.length){
    html += `🤔 No encontré: ${noEncontrados.map(n => `"${escapeHtml(n.nombre)}"`).join(', ')}<br>`;
  }
  if(ok.length){
    html += `<br>Si quieres, genera la factura con los productos disponibles:<br><button class="chat-btn-accion" onclick="generarSimulacion()">🧾 Simular factura</button>`;
  } else {
    html += `<br>No quedó ningún producto con stock para facturar. Abastece el inventario e inténtalo de nuevo.`;
  }
  appendMsg('bot', html);
}

function consultarProducto(nombre){
  const cands = buscarCandidatos(nombre);
  if(!cands.length){
    appendMsg('bot', `🤔 No encontré "<i>${escapeHtml(nombre)}</i>" en el inventario.`);
    return;
  }
  if(cands.length === 1){
    const prod = cands[0];
    const margen = prod.costo > 0 ? Math.round(((prod.precio - prod.costo) / prod.costo) * 100) : 0;
    appendMsg('bot', `<b>${prod.nombre}</b> (${prod.referencia})<br>📦 Stock: <b>${prod.stock}</b><br>💰 Precio: <b>${formatCOP(prod.precio)}</b><br>📉 Costo: ${formatCOP(prod.costo)} — margen ${margen}%`);
    return;
  }
  let html = `Encontré ${cands.length} productos que coinciden con "<i>${escapeHtml(nombre)}</i>":<br>`;
  for(const p of cands.slice(0, 8)){
    html += `&nbsp;&nbsp;•&nbsp; ${p.nombre} (${p.referencia}) — <b>${p.stock}</b> — ${formatCOP(p.precio)}<br>`;
  }
  appendMsg('bot', html);
}

async function generarSimulacion(){
  if(!_chatItems || !_chatItems.length){
    appendMsg('bot', 'Primero mándame tu pedido, ej: <i>"2 ampolla anticaída, 1 vestido de baño"</i>, y luego me dices <i>"simular factura"</i> y te hago el PDF con los que tienes stock.');
    return;
  }
  appendMsg('bot', '🧾 Generando simulación de factura...');
  const fecha = new Date().toLocaleDateString('es-CO', {day:'2-digit', month:'long', year:'numeric'});
  const items = _chatItems.map(it => ({
    nombre: it.prod.nombre, cantidad: it.cantidad,
    precio: it.prod.precio, subtotal: Math.round(it.prod.precio * it.cantidad), foto: null
  }));
  const total = items.reduce((s, i) => s + i.subtotal, 0);
  try{
    abrirModalFacturaCargando();
    const pdfBlob = await construirFacturaPDF({
      titulo: 'Simulación de Factura',
      fecha, cliente: 'SIMULACIÓN', telefono: '',
      metodoPago: 'Simulación', numero: 'SIM-' + String(Date.now()).slice(-6),
      items, descuento: 0, total
    });
    mostrarFacturaPDF(pdfBlob, `Simulacion_Factura_${new Date().toISOString().slice(0, 10)}`);
    appendMsg('bot', `✅ Simulación lista — total: <b>${formatCOP(total)}</b>. Se abrió la vista previa del PDF.`);
  }catch(e){
    appendMsg('bot', '❌ Ocurrió un error generando la factura: ' + e.message);
  }
}

/* ── Copiar al portapapeles: clic sobre un valor con $ ───────── */
document.addEventListener('click', (e) => {
  const t = e.target;
  if(!t || t.nodeType !== 1) return;
  if(t.closest('button, input, select, textarea, a, label, [onclick], [onchange], [contenteditable], [data-no-copy]')) return;
  const texto = (t.innerText || t.textContent || '').trim();
  const m = texto.match(/[-]?\$\s*[\d][\d.,]*/);
  if(!m) return;
  const valor = m[0].trim();
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(valor)
      .then(() => showToast('📋 Copiado: ' + valor, 'info'))
      .catch(() => {});
  }
});