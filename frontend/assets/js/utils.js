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

/** Convierte un dataURL (base64) en un Blob para subirlo a Cloudinary o compartirlo */
function dataURLtoBlob(dataURL){
  try {
    const partes = String(dataURL).split(',');
    const mime = (partes[0].match(/data:(.*?);/) || [])[1] || 'image/jpeg';
    const bin = atob(partes[1] || '');
    const arr = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  } catch(e){
    return null;
  }
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