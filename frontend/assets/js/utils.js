/* ============================================================
   ATENAS ERP - utils.js
   Funciones compartidas: formato de números, toasts
   ============================================================ */

/** Formatea un input mientras escribes: 28000 -> 28.000 */
function formatNum(input){
  let val = input.value.replace(/\D/g,'');
  if(val === ''){ input.value=''; return; }
  input.value = parseInt(val,10).toLocaleString('es-CO');
}

/** Obtiene el valor numérico real de un input formateado */
function rawNum(input){
  return parseInt(String(input.value).replace(/\D/g,''),10) || 0;
}

/** Formatea un número como pesos colombianos: 28000 -> $28.000 */
function formatCOP(value){
  const num = parseFloat(value) || 0;
  return '$' + Math.round(num).toLocaleString('es-CO');
}

/** Muestra una notificación tipo toast. type: success | error | info */
function showToast(msg, type){
  type = type || 'success';
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(()=>{
    toast.style.opacity='0';
    toast.style.transition='opacity .3s';
    setTimeout(()=>toast.remove(),300);
  }, 2500);
}