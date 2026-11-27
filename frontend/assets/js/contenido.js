/* Planificador de contenido: datos y portadas privados por usuario en Supabase. */
const contenido = (() => {
  const vista = document.getElementById('view-contenido');
  const dialogo = document.getElementById('cont-dialogo');
  const formulario = document.getElementById('cont-detalle-form');
  const formularioIdea = document.getElementById('cont-idea-form');
  const formularioPerfil = document.getElementById('cont-perfil-form');
  const archivoPortada = document.getElementById('cont-portada-archivo');
  const imagenPortada = document.getElementById('cont-portada-vista');
  const errorFormulario = document.getElementById('cont-error-form');
  const descartar = document.getElementById('cont-descartar');
  const alerta = document.getElementById('cont-aviso');
  const estados = [
    ['idea', 'Ideas'], ['desarrollo', 'En desarrollo'],
    ['listo', 'Listos para publicar'], ['publicado', 'Publicados']
  ];
  const formatos = { video: 'Video / reel', carrusel: 'Carrusel', foto: 'Foto' };
  const redes = { instagram: 'Instagram', tiktok: 'TikTok' };
  const vacioPerfil = () => ({ nombre: '', orden: [] });
  let usuario = null;
  let red = 'instagram';
  let filtro = null;
  let publicaciones = [];
  let perfiles = { instagram: vacioPerfil(), tiktok: vacioPerfil() };
  let portadas = new Map();
  let listo = false;
  let ocupado = false;
  let generacion = 0;
  let idEditando = null;
  let portadaAnterior = null;
  let quitarPortada = false;
  let urlTemporal = null;
  let modificado = false;
  let confirmarEliminar = false;
  let arrastre = null;

  function aviso(mensaje, reintentar = false) {
    alerta.hidden = !mensaje;
    alerta.querySelector('span').textContent = mensaje;
    document.getElementById('cont-reintentar').hidden = !reintentar;
  }
  function errorForm(mensaje = '') {
    errorFormulario.hidden = !mensaje;
    errorFormulario.textContent = mensaje;
  }
  function tipoError(error) {
    if (error?.code === 'PGRST205' || error?.code === '42P01')
      return 'Falta crear las tablas de Contenido en Supabase. Ejecuta la migración de contenido y vuelve a intentar.';
    return 'No se pudo conectar con Supabase. Revisa tu conexión y vuelve a intentar.';
  }
  function accesoValido() { return listo && !ocupado && !!usuario; }
  function ponerOcupado(valor) {
    ocupado = valor;
    formularioIdea.querySelector('button').disabled = valor || !listo;
    document.getElementById('cont-editar-perfil').disabled = valor || !listo;
    document.getElementById('cont-guardar').disabled = valor;
    document.getElementById('cont-eliminar').disabled = valor;
  }
  function ordenarPublicaciones(redActual = red) {
    const disponibles = publicaciones.filter(item => item.redes?.includes(redActual));
    const orden = perfiles[redActual].orden || [];
    const posiciones = new Map(orden.map((id, i) => [id, i]));
    return disponibles.slice().sort((a, b) => {
      const pa = posiciones.has(a.id) ? posiciones.get(a.id) : Infinity;
      const pb = posiciones.has(b.id) ? posiciones.get(b.id) : Infinity;
      return pa - pb || String(b.creado_en).localeCompare(String(a.creado_en)) || a.id.localeCompare(b.id);
    });
  }
  function fechaBonita(fecha) {
    if (!fecha) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(fecha + 'T12:00:00Z'));
  }
  function renderizar() {
    vista.querySelectorAll('[data-cont-red]').forEach(boton => boton.setAttribute('aria-pressed', String(boton.dataset.contRed === red)));
    document.getElementById('cont-titulo-red').textContent = `Planificador · ${redes[red]}`;
    const entradas = publicaciones.filter(item => item.redes?.includes(red));
    document.getElementById('cont-estados').innerHTML = estados.map(([id, nombre]) => {
      const cantidad = entradas.filter(item => item.estado === id).length;
      return `<button type="button" class="cont-estado ${id}" data-cont-filtro="${id}" aria-pressed="${filtro === id}"><span>${nombre}</span><strong>${cantidad}</strong><small>${filtro === id ? 'Mostrar todos' : 'Toca para filtrar'}</small></button>`;
    }).join('');
    const visibles = filtro ? entradas.filter(item => item.estado === filtro) : entradas;
    const secciones = estados.map(([id, nombre]) => {
      const grupo = visibles.filter(item => item.estado === id);
      if (!grupo.length) return '';
      const tarjetas = grupo.map(item => {
        const url = portadas.get(item.portada_path);
        const icono = item.formato === 'carrusel' ? '▣' : item.formato === 'foto' ? '✦' : '▶';
        const detalle = [item.hook, item.guion, item.llamada_accion, item.fecha, item.portada_path].filter(Boolean).length;
        return `<button type="button" class="cont-fila" data-cont-editar="${esc(item.id)}"><span class="cont-fila-portada ${esc(item.formato)}">${url ? `<img src="${esc(url)}" alt="">` : icono}</span><span class="cont-fila-info"><strong>${esc(item.titulo)}</strong><small>${esc(item.hook || 'Agrega el hook y los detalles cuando quieras')}</small><span class="cont-etiquetas"><b>${esc(formatos[item.formato] || 'Contenido')}</b>${item.redes.map(r => `<i class="${esc(r)}">${r === 'instagram' ? 'IG' : 'TT'}</i>`).join('')}</span></span><span class="cont-fila-fecha"><b>${esc(fechaBonita(item.fecha))}</b><small>${detalle}/5 detalles</small></span></button>`;
      }).join('');
      return `<div class="cont-grupo ${id}"><div class="cont-grupo-titulo">${esc(nombre)} · ${grupo.length}</div>${tarjetas}</div>`;
    }).join('');
    document.getElementById('cont-lista').innerHTML = secciones || `<div class="cont-vacio">${filtro ? 'No hay publicaciones en este estado.' : 'Aún no hay ideas para esta red. Escribe la primera arriba.'}</div>`;
    const nombre = perfiles[red].nombre.trim();
    document.getElementById('cont-perfil-nombre').textContent = nombre ? '@' + nombre.replace(/^@+/, '') : `Tu perfil de ${redes[red]}`;
    document.getElementById('cont-perfil-cantidad').textContent = `${entradas.length} ${entradas.length === 1 ? 'publicación planificada' : 'publicaciones planificadas'}`;
    const ordenadas = ordenarPublicaciones();
    document.getElementById('cont-cuadricula').innerHTML = ordenadas.length ? ordenadas.map((item, indice) => {
      const url = portadas.get(item.portada_path);
      return `<article class="cont-cuadro ${esc(item.formato)}" data-cont-cuadro="${esc(item.id)}"><button type="button" class="cont-cuadro-abrir" data-cont-editar="${esc(item.id)}" aria-label="Abrir ${esc(item.titulo)}">${url ? `<img src="${esc(url)}" alt="">` : `<span>${esc(item.titulo)}</span>`}<b class="cont-cuadro-tipo">${item.formato === 'carrusel' ? '▣' : item.formato === 'foto' ? '✦' : '▶'}</b>${item.fecha ? `<small>${esc(fechaBonita(item.fecha))}</small>` : ''}</button><div class="cont-orden-controles"><button type="button" data-cont-mover="-1" data-id="${esc(item.id)}" aria-label="Mover ${esc(item.titulo)} antes" ${indice === 0 ? 'disabled' : ''}>‹</button><button type="button" class="cont-agarrar" data-cont-agarrar="${esc(item.id)}" aria-label="Arrastrar ${esc(item.titulo)}" title="Arrastrar para ordenar">⠿</button><button type="button" data-cont-mover="1" data-id="${esc(item.id)}" aria-label="Mover ${esc(item.titulo)} después" ${indice === ordenadas.length - 1 ? 'disabled' : ''}>›</button></div></article>`;
    }).join('') : '<p class="cont-cuadricula-vacia">Tus ideas aparecerán aquí.</p>';
  }
  async function cargarPortadas(items) {
    const rutas = [...new Set(items.map(item => item.portada_path).filter(Boolean))];
    if (!rutas.length) return new Map();
    const { data, error } = await sb.storage.from('contenido-portadas').createSignedUrls(rutas, 86400);
    if (error) throw error;
    return new Map((data || []).filter(item => item.signedUrl && item.path).map(item => [item.path, item.signedUrl]));
  }
  async function abrir() {
    const carga = ++generacion;
    listo = false;
    ponerOcupado(false);
    aviso('Cargando contenido...');
    try {
      const sesion = await sb.auth.getSession();
      const actual = sesion.data?.session?.user?.id;
      if (!actual) throw new Error('sesion');
      usuario = actual;
      const [resultado, datosPerfil] = await Promise.all([
        sb.from('contenido_publicaciones').select('*').eq('usuario_id', actual).order('creado_en', { ascending: false }),
        sb.from('contenido_perfiles').select('*').eq('usuario_id', actual)
      ]);
      if (resultado.error) throw resultado.error;
      if (datosPerfil.error) throw datosPerfil.error;
      const imagenes = await cargarPortadas(resultado.data || []);
      if (carga !== generacion) return;
      publicaciones = resultado.data || [];
      perfiles = { instagram: vacioPerfil(), tiktok: vacioPerfil() };
      (datosPerfil.data || []).forEach(p => { if (perfiles[p.red]) perfiles[p.red] = { nombre: p.nombre || '', orden: p.orden || [] }; });
      portadas = imagenes;
      listo = true;
      filtro = null;
      aviso('');
      ponerOcupado(false);
      renderizar();
    } catch (error) {
      if (carga !== generacion) return;
      usuario = null;
      publicaciones = [];
      portadas = new Map();
      perfiles = { instagram: vacioPerfil(), tiktok: vacioPerfil() };
      ponerOcupado(false);
      renderizar();
      aviso(tipoError(error), true);
    }
  }
  async function crearIdea(event) {
    event.preventDefault();
    if (!accesoValido()) return;
    const entrada = formularioIdea.elements.titulo;
    const titulo = entrada.value.trim();
    if (!titulo) { entrada.focus(); return; }
    ponerOcupado(true);
    try {
      const { data, error } = await sb.from('contenido_publicaciones').insert({ usuario_id: usuario, titulo, redes: [red] }).select('*').single();
      if (error || !data) throw error || new Error('sin datos');
      publicaciones.unshift(data);
      entrada.value = '';
      filtro = null;
      aviso('');
      renderizar();
      showToast('✅ Idea guardada');
    } catch (error) { aviso(tipoError(error), true); }
    finally { ponerOcupado(false); }
  }
  function revocarTemporal() {
    if (urlTemporal) URL.revokeObjectURL(urlTemporal);
    urlTemporal = null;
  }
  function cambiarPortada(url) {
    imagenPortada.hidden = !url;
    if (url) imagenPortada.src = url; else imagenPortada.removeAttribute('src');
    document.getElementById('cont-quitar-portada').hidden = !url;
  }
  function cerrar(forzar = false) {
    if (ocupado) return;
    if (modificado && !forzar) {
      errorForm('Tienes cambios sin guardar. Guárdalos o descártalos para cerrar.');
      descartar.hidden = false;
      return;
    }
    dialogo.close();
    revocarTemporal();
    archivoPortada.value = '';
    modificado = false;
    confirmarEliminar = false;
  }
  function editar(id) {
    if (!accesoValido()) return;
    const item = publicaciones.find(p => p.id === id);
    if (!item) return;
    idEditando = id;
    portadaAnterior = item.portada_path || null;
    quitarPortada = false;
    confirmarEliminar = false;
    modificado = false;
    descartar.hidden = true;
    errorForm();
    revocarTemporal();
    formulario.reset();
    for (const nombre of ['titulo', 'formato', 'estado', 'fecha', 'hook', 'guion', 'llamada_accion']) formulario.elements[nombre].value = item[nombre] || '';
    formulario.querySelectorAll('[name=redes]').forEach(input => { input.checked = item.redes.includes(input.value); });
    document.getElementById('cont-eliminar').textContent = 'Eliminar';
    cambiarPortada(portadas.get(portadaAnterior));
    dialogo.showModal();
  }
  async function guardarDetalle(event) {
    event.preventDefault();
    if (!accesoValido()) return;
    const item = publicaciones.find(p => p.id === idEditando);
    if (!item) return;
    const titulo = formulario.elements.titulo.value.trim();
    const seleccionadas = [...formulario.querySelectorAll('[name=redes]:checked')].map(input => input.value);
    if (!titulo || !seleccionadas.length) { errorForm(!titulo ? 'Escribe una idea.' : 'Selecciona al menos una red social.'); return; }
    const actual = usuario;
    const nueva = archivoPortada.files[0];
    let rutaNueva = null;
    ponerOcupado(true);
    errorForm();
    try {
      if (nueva) {
        if (!nueva.type.startsWith('image/')) throw new Error('Selecciona un archivo de imagen.');
        const archivo = await prepararImagenParaSubir(nueva);
        if (archivo.size > 5 * 1024 * 1024) throw new Error('La imagen debe pesar máximo 5 MB.');
        rutaNueva = `${actual}/${crypto.randomUUID()}`;
        const subida = await sb.storage.from('contenido-portadas').upload(rutaNueva, archivo, { contentType: archivo.type || nueva.type, upsert: false });
        if (subida.error) throw subida.error;
      }
      const cambios = {
        titulo, redes: seleccionadas, formato: formulario.elements.formato.value,
        estado: formulario.elements.estado.value, fecha: formulario.elements.fecha.value || null,
        hook: formulario.elements.hook.value.trim(), guion: formulario.elements.guion.value.trim(),
        llamada_accion: formulario.elements.llamada_accion.value.trim(),
        portada_path: rutaNueva || (quitarPortada ? null : portadaAnterior), actualizado_en: new Date().toISOString()
      };
      const { data, error } = await sb.from('contenido_publicaciones').update(cambios).eq('id', item.id).eq('usuario_id', actual).select('*').single();
      if (error || !data) throw error || new Error('No se pudo guardar el contenido.');
      publicaciones = publicaciones.map(p => p.id === item.id ? data : p);
      modificado = false;
      let avisoPortada = '';
      if (rutaNueva) {
        try {
          const firma = await sb.storage.from('contenido-portadas').createSignedUrl(rutaNueva, 86400);
          if (firma.error || !firma.data?.signedUrl) throw firma.error || new Error('sin enlace');
          portadas.set(rutaNueva, firma.data.signedUrl);
        } catch { avisoPortada = 'Se guardó el contenido, pero no se pudo cargar la portada. Actualiza la vista para volver a intentar.'; }
      }
      if (portadaAnterior && portadaAnterior !== cambios.portada_path) {
        try {
          const eliminada = await sb.storage.from('contenido-portadas').remove([portadaAnterior]);
          if (!eliminada.error) portadas.delete(portadaAnterior);
        } catch { /* El contenido ya está guardado; la portada anterior puede eliminarse después. */ }
      }
      ponerOcupado(false);
      cerrar(true);
      aviso(avisoPortada, !!avisoPortada);
      renderizar();
      showToast('✅ Contenido guardado');
    } catch (error) {
      if (rutaNueva && modificado) {
        try { await sb.storage.from('contenido-portadas').remove([rutaNueva]); } catch { /* No ocultar el error original. */ }
      }
      const mensaje = error?.message || '';
      errorForm(mensaje.startsWith('Selecciona') || mensaje.startsWith('La imagen debe')
        ? mensaje : 'No se pudo guardar. Revisa la conexión y vuelve a intentar.');
      ponerOcupado(false);
    }
  }
  async function eliminar() {
    if (!accesoValido()) return;
    if (!confirmarEliminar) {
      confirmarEliminar = true;
      document.getElementById('cont-eliminar').textContent = 'Confirmar eliminación';
      errorForm('Pulsa “Confirmar eliminación” si deseas eliminar esta idea.');
      return;
    }
    const item = publicaciones.find(p => p.id === idEditando);
    if (!item) return;
    ponerOcupado(true);
    try {
      const { data, error } = await sb.from('contenido_publicaciones').delete().eq('id', item.id).eq('usuario_id', usuario).select('id').single();
      if (error || !data) throw error || new Error('No se pudo eliminar.');
      publicaciones = publicaciones.filter(p => p.id !== item.id);
      modificado = false;
      ponerOcupado(false);
      cerrar(true);
      renderizar();
      if (item.portada_path) {
        try { await sb.storage.from('contenido-portadas').remove([item.portada_path]); } catch { /* La idea ya fue eliminada. */ }
      }
    } catch (error) { errorForm(error?.message || 'No se pudo eliminar.'); ponerOcupado(false); }
  }
  async function guardarPerfil(nuevoPerfil, redActual = red) {
    const { error } = await sb.from('contenido_perfiles').upsert({ usuario_id: usuario, red: redActual, ...nuevoPerfil }, { onConflict: 'usuario_id,red' });
    if (error) throw error;
    perfiles[redActual] = nuevoPerfil;
  }
  async function mover(id, destino) {
    if (!accesoValido()) return;
    const orden = ordenarPublicaciones().map(item => item.id);
    const origen = orden.indexOf(id);
    if (origen < 0 || destino < 0 || destino >= orden.length || origen === destino) return;
    orden.splice(destino, 0, orden.splice(origen, 1)[0]);
    const redActual = red;
    ponerOcupado(true);
    try { await guardarPerfil({ ...perfiles[redActual], orden }, redActual); aviso(''); renderizar(); }
    catch (error) { aviso('No se pudo guardar el orden. Inténtalo de nuevo.'); }
    finally { ponerOcupado(false); }
  }
  vista.addEventListener('click', event => {
    const btnRed = event.target.closest('[data-cont-red]');
    if (btnRed && accesoValido()) { red = btnRed.dataset.contRed; filtro = null; formularioPerfil.hidden = true; renderizar(); return; }
    const btnFiltro = event.target.closest('[data-cont-filtro]');
    if (btnFiltro && listo) { filtro = filtro === btnFiltro.dataset.contFiltro ? null : btnFiltro.dataset.contFiltro; renderizar(); return; }
    const btnEditar = event.target.closest('[data-cont-editar]');
    if (btnEditar) { editar(btnEditar.dataset.contEditar); return; }
    const btnMover = event.target.closest('[data-cont-mover]');
    if (btnMover) { const lista = ordenarPublicaciones(); mover(btnMover.dataset.id, lista.findIndex(item => item.id === btnMover.dataset.id) + Number(btnMover.dataset.contMover)); }
  });
  vista.addEventListener('pointerdown', event => {
    const asa = event.target.closest('[data-cont-agarrar]');
    if (!asa || !accesoValido() || !event.isPrimary || event.button !== 0) return;
    arrastre = { id: asa.dataset.contAgarrar, pointer: event.pointerId, inicioX: event.clientX, inicioY: event.clientY, movido: false };
    asa.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  vista.addEventListener('pointermove', event => {
    if (!arrastre || event.pointerId !== arrastre.pointer) return;
    if (Math.hypot(event.clientX - arrastre.inicioX, event.clientY - arrastre.inicioY) > 8) arrastre.movido = true;
    vista.querySelectorAll('.cont-arrastre-destino').forEach(el => el.classList.remove('cont-arrastre-destino'));
    if (arrastre.movido) document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cont-cuadro]')?.classList.add('cont-arrastre-destino');
  });
  function finalizarArrastre(event) {
    if (!arrastre || event.pointerId !== arrastre.pointer) return;
    const destino = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cont-cuadro]')?.dataset.contCuadro;
    const id = arrastre.id;
    const movido = arrastre.movido;
    arrastre = null;
    vista.querySelectorAll('.cont-arrastre-destino').forEach(el => el.classList.remove('cont-arrastre-destino'));
    if (event.type !== 'pointercancel' && movido && destino) mover(id, ordenarPublicaciones().findIndex(item => item.id === destino));
  }
  vista.addEventListener('pointerup', finalizarArrastre);
  vista.addEventListener('pointercancel', finalizarArrastre);
  formularioIdea.addEventListener('submit', crearIdea);
  formulario.addEventListener('submit', guardarDetalle);
  formulario.addEventListener('input', () => { modificado = true; });
  formulario.addEventListener('change', () => { modificado = true; });
  archivoPortada.addEventListener('change', () => {
    revocarTemporal();
    if (archivoPortada.files[0]) { urlTemporal = URL.createObjectURL(archivoPortada.files[0]); quitarPortada = false; cambiarPortada(urlTemporal); }
  });
  document.getElementById('cont-quitar-portada').addEventListener('click', () => { archivoPortada.value = ''; revocarTemporal(); quitarPortada = true; modificado = true; cambiarPortada(null); });
  document.getElementById('cont-cerrar').addEventListener('click', () => cerrar());
  descartar.addEventListener('click', () => cerrar(true));
  dialogo.addEventListener('cancel', event => { event.preventDefault(); cerrar(); });
  document.getElementById('cont-eliminar').addEventListener('click', eliminar);
  document.getElementById('cont-reintentar').addEventListener('click', abrir);
  document.getElementById('cont-editar-perfil').addEventListener('click', () => {
    if (!accesoValido()) return;
    formularioPerfil.hidden = false;
    document.getElementById('cont-perfil-input').value = perfiles[red].nombre.replace(/^@+/, '');
    document.getElementById('cont-perfil-input').focus();
  });
  document.getElementById('cont-cancelar-perfil').addEventListener('click', () => { formularioPerfil.hidden = true; });
  formularioPerfil.addEventListener('submit', async event => {
    event.preventDefault();
    if (!accesoValido()) return;
    const redActual = red;
    const nombre = document.getElementById('cont-perfil-input').value.trim().replace(/^@+/, '');
    ponerOcupado(true);
    try { await guardarPerfil({ ...perfiles[redActual], nombre }, redActual); formularioPerfil.hidden = true; aviso(''); renderizar(); }
    catch (error) { aviso('No se pudo guardar el nombre del perfil. Inténtalo de nuevo.'); }
    finally { ponerOcupado(false); }
  });
  ponerOcupado(false);
  return { abrir };
})();
