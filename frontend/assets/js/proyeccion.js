const proyeccion = (() => {
  const vista = document.getElementById('view-proyeccion');
  const config = document.getElementById('proy-config');
  const importar = document.getElementById('proy-importar');
  const listaPendientes = document.getElementById('proy-lista-pendientes');
  const formularioManual = document.getElementById('proy-form-manual');
  let pendienteSeleccionado = null;
  document.getElementById('proy-cerrar').innerHTML = ico('x', 18);
  document.getElementById('proy-agregar-manual').innerHTML = ico('plus', 16) + ' Agregar manual';
  document.getElementById('proy-aplicar-config').innerHTML = ico('save', 16);
  vista.querySelectorAll('[data-proy-add="partidas"]').forEach(boton => { boton.innerHTML = ico('plus', 16); });
  document.getElementById('proy-guardar-manual').innerHTML = ico('save', 16);
  document.getElementById('proy-cancelar-manual').innerHTML = ico('x', 16);
  listaPendientes.addEventListener('click', event => {
    const seleccionar = event.target.closest('[data-seleccionar-pendiente]');
    if (seleccionar) {
      pendienteSeleccionado = seleccionar.dataset.seleccionarPendiente;
      actualizarPendientes();
      listaPendientes.querySelector('[data-agregar-pendiente]')?.focus();
      return;
    }
    const boton = event.target.closest('[data-agregar-pendiente]');
    if (!boton || !plan || !confirmarOtrosCambios(null)) return;
    const pendiente = PENDIENTES.find(item => String(item.id) === boton.dataset.agregarPendiente);
    if (!pendiente || plan.deudas.some(item => item.pendiente === String(pendiente.id))) return;
    const saldo = Math.round(Number(pendiente.monto) - (Number(pendiente.monto_abonado) || 0));
    if (saldo <= 0) return;
    plan.deudas.push({ pendiente: String(pendiente.id), nombre: pendiente.descripcion, monto: saldo, inicio: plan.inicio, cuotas: Number(document.querySelector('#proy-plazo input').value) || 10 });
    pendienteSeleccionado = null;
    formulariosEditados.clear();
    edicionPendiente = false;
    guardar();
    renderizarEdicion();
    renderizarResultados();
  });
  const dialogo = document.getElementById('proy-dialogo');
  const abrirBoton = document.getElementById('proy-abrir');
  let edicionPendiente = false;
  const formulariosEditados = new Set();
  const mesesVisibles = new Set();
  let categoriaActiva = 'config';
  let editando = false;
  let usuarioActual;
  let planAnterior = null;
  const aviso = document.getElementById('proy-aviso');
  const botonDescartar = document.getElementById('proy-descartar');

  function notificar(mensaje, permitirDescartar = false) {
    aviso.querySelector('span').textContent = mensaje;
    aviso.hidden = false;
    botonDescartar.hidden = !permitirDescartar;
  }
  function limpiarAviso() { aviso.hidden = true; }
  function esEdicionAnual() { return ['sueldo', 'utilidad', 'compras'].includes(categoriaActiva); }
  function descartarCambios() {
    if (planAnterior) plan = planAnterior;
    planAnterior = null;
    edicionPendiente = false;
    formulariosEditados.clear();
    formularioManual.reset();
    formularioManual.hidden = true;
    renderizarEdicion();
    renderizarResultados();
    dialogo.close();
    limpiarAviso();
  }
  botonDescartar.addEventListener('click', descartarCambios);
  const nombresCategorias = { config: 'Configuración', deudas: 'Deudas', sueldo: 'Sueldo', utilidad: 'Utilidad ideal', compras: 'Compras e inversión', pagos: 'Pagos de deuda' };

  function mostrarDetalle() {
    const lectura = document.getElementById('proy-detalle-lectura');
    document.getElementById('proy-dialogo-titulo').textContent = nombresCategorias[categoriaActiva];
    const botonEdicion = document.getElementById('proy-editar');
    const accion = editando && (categoriaActiva === 'config' || categoriaActiva === 'pagos' || esEdicionAnual()) ? 'Guardar cambios' : editando ? 'Ver detalle' : 'Editar';
    botonEdicion.innerHTML = ico(editando ? 'check' : 'pencil', 16);
    botonEdicion.setAttribute('aria-label', accion);
    botonEdicion.title = accion;
    lectura.hidden = editando;
    dialogo.querySelectorAll('[data-proy-grupo]').forEach(bloque => {
      const grupo = bloque.dataset.proyGrupo;
      bloque.hidden = !editando || (categoriaActiva === 'config' ? grupo !== 'config'
        : categoriaActiva === 'deudas' || categoriaActiva === 'pagos' ? grupo !== 'deudas' : grupo !== 'partidas');
    });
    dialogo.querySelectorAll('[data-proy-tipo]').forEach(seccion => {
      seccion.hidden = seccion.dataset.proyTipo !== categoriaActiva;
    });
    document.getElementById('proy-partida-nota').textContent = categoriaActiva === 'compras'
      ? 'El monto se aplica cada mes. Usa el calendario para elegir meses; sin seleccionarlos, se aplica a todo el año.'
      : 'Define el monto mensual y sus meses de vigencia. Los períodos coincidentes se suman.';
    const esPago = categoriaActiva === 'pagos';
    importar.hidden = esPago;
    document.getElementById('proy-pendientes-nota').hidden = esPago;
    document.getElementById('proy-deudas-titulo').textContent = esPago ? 'Pago de la deuda total' : 'Deudas y pendientes';
    document.getElementById('proy-deudas-editor').hidden = esPago;
    document.getElementById('proy-pagos-editor').hidden = !esPago;
    if (categoriaActiva === 'config') {
      lectura.innerHTML = '';
      return;
    }
    if (esPago) {
      const total = plan.deudas.reduce((suma, deuda) => suma + deuda.monto, 0);
      const plazo = plan.plazo;
      lectura.innerHTML = `<div class="proy-pago-resumen"><span>Deuda total</span><strong>${formatCOP(total)}</strong><span>Plazo</span><strong>${plazo} meses</strong><span>Abono mensual máximo</span><strong>${formatCOP(Math.ceil(total / plazo))}</strong></div>`;
      return;
    }
    const lista = categoriaActiva === 'deudas' ? plan.deudas : plan.partidas.filter(p => p.tipo === categoriaActiva);
    if (!lista.length) {
      lectura.innerHTML = '<p class="proy-nota">Aún no hay datos en este apartado. Pulsa Editar para agregarlos.</p>';
      return;
    }
    lectura.innerHTML = lista.map(item => {
      const descripcion = categoriaActiva === 'deudas' ? 'Saldo de deuda'
        : `${formatearMes(item.inicio)} a ${formatearMes(item.fin)} · mensual`;
      return `<div class="proy-lectura-fila"><div><strong>${esc(item.nombre)}</strong><small>${esc(descripcion)}</small></div><b>${formatCOP(item.monto)}</b></div>`;
    }).join('');
  }

  function abrirDetalle(categoria, boton) {
    if (!plan) return;
    categoriaActiva = categoria;
    edicionPendiente = false;
    formulariosEditados.clear();
    planAnterior = null;
    limpiarAviso();
    editando = categoria === 'config';
    mostrarDetalle();
    dialogo.showModal();
  }

  abrirBoton.addEventListener('click', () => abrirDetalle('config', abrirBoton));
  document.getElementById('proy-plan-resumen').addEventListener('click', event => {
    if (event.target.closest('.proy-plan-item strong')) return;
    const boton = event.target.closest('[data-proy-detalle]');
    if (boton) abrirDetalle(boton.dataset.proyDetalle, boton);
  });
  document.getElementById('proy-editar').addEventListener('click', () => {
    if (editando && categoriaActiva === 'config') {
      const campo = config.elements.dias;
      const dias = Number(campo.value);
      if (!campo.value || !Number.isInteger(dias) || dias < 1 || dias > 31) {
        notificar('Elige una cantidad de días entre 1 y 31.');
        campo.focus();
        return;
      }
      plan.dias = dias;
      edicionPendiente = false;
      formulariosEditados.clear();
      guardar();
      renderizarEdicion();
      renderizarResultados();
      cerrarDetalles();
      return;
    }
    if (!editando && esEdicionAnual()) {
      planAnterior = JSON.parse(JSON.stringify(plan));
      editando = true;
      limpiarAviso();
      mostrarDetalle();
      return;
    }
    if (editando && esEdicionAnual()) {
      const contenedor = document.getElementById('proy-' + categoriaActiva);
      const pendiente = contenedor.querySelector('[data-intervalo-nuevo]');
      if (pendiente || formulariosEditados.size) {
        notificar('Guarda los campos abiertos y completa todos los meses antes de guardar el apartado.');
        (pendiente || [...formulariosEditados][0])?.querySelector('input:not([type=hidden])')?.focus();
        return;
      }
      const elementos = plan.partidas.filter(item => item.tipo === categoriaActiva);
      const hueco = elementos.length ? primerIntervaloLibre(categoriaActiva) : null;
      if (hueco) {
        crearIntervalo(categoriaActiva, hueco.inicio, hueco.fin);
        notificar('Completa el monto para los meses que faltan antes de guardar.');
        return;
      }
      planAnterior = null;
      edicionPendiente = false;
      formulariosEditados.clear();
      guardar();
      renderizarResultados();
      editando = false;
      limpiarAviso();
      mostrarDetalle();
      return;
    }
    if (editando && categoriaActiva === 'pagos') {
      const campo = document.getElementById('proy-plazo-meses');
      if (!Number.isInteger(Number(campo.value)) || Number(campo.value) < 1 || Number(campo.value) > 12 || !campo.value) {
        notificar('Elige una cantidad de meses entre 1 y 12.');
        return;
      }
      plan.plazo = Number(campo.value);
      edicionPendiente = false;
      formulariosEditados.clear();
      guardar();
      renderizarEdicion();
      renderizarResultados();
      editando = false;
      mostrarDetalle();
      return;
    }
    if (editando && edicionPendiente) {
      notificar('Hay cambios sin aplicar. Guárdalos o descártalos para continuar.', true);
      return;
    }
    if (editando) {
      edicionPendiente = false;
      formulariosEditados.clear();
      renderizarEdicion();
    }
    editando = !editando;
    mostrarDetalle();
  });
  document.getElementById('proy-cerrar').addEventListener('click', cerrarDetalles);
  dialogo.addEventListener('cancel', event => {
    event.preventDefault();
    cerrarDetalles();
  });
  function cerrarDetalles() {
    if (edicionPendiente || (planAnterior && JSON.stringify(plan) !== JSON.stringify(planAnterior))) {
      notificar('Hay cambios sin guardar. Guárdalos o descártalos para cerrar.', true);
      return;
    }
    planAnterior = null;
    limpiarAviso();
    dialogo.close();
    formularioManual.reset();
    formularioManual.hidden = true;
    renderizarEdicion();
    const objetivo = categoriaActiva === 'config' ? abrirBoton : document.querySelector(`[data-proy-detalle="${categoriaActiva}"]`);
    objetivo?.focus();
  }
  dialogo.addEventListener('input', event => {
    if (event.target.form === importar) return;
    if (event.target.form) formulariosEditados.add(event.target.form);
    edicionPendiente = true;
  });
  function confirmarOtrosCambios(formulario) {
    const otros = [...formulariosEditados].some(form => form !== formulario);
    if (otros) notificar('Guarda o cancela los campos abiertos antes de continuar.');
    return !otros;
  }
  const tipos = { sueldo: 'Sueldo', utilidad: 'Utilidad objetivo', compras: 'Compras / inversión' };
  const etiquetaMes = new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const maxMonto = 1000000000000;
  let plan;
  let clave;
  let mesFormula;
  let observadorGrafico;
  document.getElementById('proy-mes-formula').addEventListener('change', event => {
    mesFormula = event.target.value;
    renderizarFormula(calcular(plan));
  });

  function indice(mes) {
    const [anio, numero] = mes.split('-').map(Number);
    return anio * 12 + numero - 1;
  }

  function mesISO(indice) {
    return Math.floor(indice / 12) + '-' + String(indice % 12 + 1).padStart(2, '0');
  }

  function montoEnMes(partida, mes) {
    const desde = indice(partida.inicio);
    const hasta = indice(partida.fin);
    const actual = indice(mes);
    if (actual < desde || actual > hasta) return 0;
    return partida.monto;
  }

  function calcular({ inicio, meses, reserva, deudas, partidas, ventas, plazo }) {
    const deudaTotal = deudas.reduce((suma, deuda) => suma + deuda.monto, 0);
    const cuotas = Math.max(1, Math.min(12, Number(plazo) || 10));
    const cuota = Math.floor(deudaTotal / cuotas);
    const resto = deudaTotal % cuotas;
    const base = indice(inicio);
    return Array.from({ length: meses }, (_, i) => {
      const actual = base + i;
      const mes = mesISO(actual);
      const fila = { mes, sueldo: 0, reserva: 0, compras: 0, utilidad: 0, abonos: 0, saldo: 0 };
      for (const partida of partidas) {
        if (actual < indice(partida.inicio) || actual > indice(partida.fin)) continue;
        const tipo = partida.tipo === 'sueldo' && i < reserva ? 'reserva' : partida.tipo;
        fila[tipo] += montoEnMes(partida, mes);
      }
      const pagados = Math.min(cuotas, i + 1);
      fila.saldo = deudaTotal - pagados * cuota - Math.min(resto, pagados);
      if (i < cuotas) fila.abonos = cuota + Number(i < resto);
      const costos = fila.sueldo + fila.reserva + fila.compras + fila.abonos;
      fila.meta = costos + fila.utilidad;
      fila.venta = ventas[mes] ?? fila.meta;
      fila.estimada = fila.venta - costos;
      return fila;
    });
  }

  function guardar() {
    if (planAnterior) return;
    const estado = document.getElementById('proy-estado');
    try {
      localStorage.setItem(clave, JSON.stringify(plan));
      estado.textContent = 'Plan guardado en este navegador.';
    } catch {
      estado.textContent = 'No se pudo guardar el plan en este navegador.';
    }
  }

  function actualizarPendientes() {
    if (!plan) return;
    const agregadas = new Map(plan.deudas.filter(deuda => deuda.pendiente).map(deuda => [String(deuda.pendiente), deuda]));
    const disponibles = PENDIENTES.filter(p => Number(p.monto) - (Number(p.monto_abonado) || 0) > 0);
    const idsDisponibles = new Set(disponibles.map(p => String(p.id)));
    const pendientes = [
      ...disponibles,
      ...Array.from(agregadas.values()).filter(deuda => !idsDisponibles.has(String(deuda.pendiente)))
        .map(deuda => ({ id: deuda.pendiente, descripcion: deuda.nombre, monto: deuda.monto, monto_abonado: 0 }))
    ];
    document.getElementById('proy-deudas-guardadas').hidden = plan.deudas.length === 0;
    const visibles = pendientes;
    listaPendientes.innerHTML = visibles.length ? visibles.map(p => {
      const id = String(p.id);
      const guardada = agregadas.get(id);
      const saldo = guardada ? guardada.monto : Number(p.monto) - (Number(p.monto_abonado) || 0);
      const accion = guardada
        ? ''
        : pendienteSeleccionado === id
          ? `<button type="button" class="proy-icono proy-agregar-pendiente" data-agregar-pendiente="${esc(id)}" aria-label="Agregar ${esc(p.descripcion)}" title="Agregar">${ico('plus', 16)}</button>`
          : '';
      return `<div class="proy-pendiente ${guardada ? 'proy-pendiente-agregado' : ''}"><button type="button" class="proy-elegir-pendiente" data-seleccionar-pendiente="${esc(id)}" aria-pressed="${pendienteSeleccionado === id}"><span>${esc(p.descripcion)}</span><strong>${formatCOP(saldo)}</strong></button>${accion}</div>`;
    }).join('') : '<p class="proy-nota">No hay pendientes disponibles en Caja.</p>';

  }

  function campo(nombre, etiqueta, tipo, valor, reglas = '') {
    return `<label>${etiqueta}<input name="${nombre}" type="${tipo}" value="${esc(valor)}" ${reglas} required></label>`;
  }

  function controlesCompras(item) {
    const rango = item && (item.inicio !== plan.inicio || item.fin !== mesISO(indice(plan.inicio) + 11));
    return `<input type="hidden" name="con_fechas" value="1" ${rango ? '' : 'disabled'}>
      <button type="button" class="proy-icono proy-calendario" data-compras-fechas aria-label="Elegir meses" title="Elegir meses" aria-pressed="${rango ? 'true' : 'false'}">${ico('calendar', 17)}</button>`;
  }

  function fechasCompras(item) {
    const anio = plan.inicio.slice(0, 4);
    const inicio = item?.inicio || plan.inicio;
    const fin = item?.fin || anio + '-12';
    const visible = item && (inicio !== plan.inicio || fin !== anio + '-12');
    const meses = new Intl.DateTimeFormat('es-CO', { month: 'long', timeZone: 'UTC' });
    const opciones = valor => Array.from({ length: 12 }, (_, i) => {
      const mes = anio + '-' + String(i + 1).padStart(2, '0');
      const nombre = meses.format(new Date(mes + '-01T00:00:00Z'));
      return `<option value="${mes}" ${valor === mes ? 'selected' : ''}>${nombre}</option>`;
    }).join('');
    return `<div class="proy-fechas-compras" ${visible ? '' : 'hidden'}>
      <label>Desde<select name="inicio" data-intervalo-inicio ${visible ? '' : 'disabled'}>${opciones(inicio)}</select></label>
      <label>Hasta<select name="fin" data-intervalo-fin data-valor-anterior="${esc(fin)}" ${visible ? '' : 'disabled'}>${opciones(fin)}</select></label>
    </div>`;
  }

  function actualizarBotonAgregar(tipo) {
    const contenedor = document.getElementById('proy-' + tipo);
    const boton = vista.querySelector(`[data-proy-add="partidas"][data-tipo="${tipo}"]`);
    boton.hidden = !!contenedor.querySelector('form');
  }

  function renderizarEdicion() {
    config.elements.inicio.value = plan.inicio;
    config.elements.meses.value = plan.meses;
    config.elements.dias.value = plan.dias;
    document.querySelector('#proy-plazo input').value = plan.plazo || 10;
    for (const lista of ['deudas', 'partidas']) {
      const filas = plan[lista].map((item, i) => {
        const deuda = lista === 'deudas';
        const simple = !deuda && (item.tipo === 'sueldo' || item.tipo === 'utilidad' || item.tipo === 'compras');
        const categoria = deuda ? '' : simple ? `<input type="hidden" name="tipo" value="${item.tipo}"><input type="hidden" name="nombre" value="${esc(item.nombre)}">`
          : `<label>Concepto<select name="tipo">${Object.entries(tipos).map(([k, v]) =>
          `<option value="${k}" ${k === item.tipo ? 'selected' : ''}>${v}</option>`).join('')}</select></label>`;
        const formulario = `<form novalidate class="proy-fila proy-fields" data-lista="${lista}" data-fila="${i}">
          ${categoria}
          ${simple ? '' : campo('nombre', 'Descripción', 'text', item.nombre, 'maxlength="100"')}
          ${simple ? controlesCompras(item) : ''}
          ${campo('monto', deuda ? 'Saldo (COP)' : item.tipo === 'compras' ? 'Monto (COP)' : 'Monto al mes (COP)', 'text', Number(item.monto).toLocaleString('es-CO'), 'inputmode="numeric" data-proy-monto')}
          ${deuda ? '' : simple ? fechasCompras(item) : campo('inicio', 'Desde', 'month', item.inicio, 'min="2020-01" max="9994-12"') + campo('fin', 'Hasta', 'month', item.fin, 'min="2020-01" max="9999-12"')}
          <div class="proy-acciones-fila"><button class="proy-icono" aria-label="Guardar ${esc(item.nombre)}" title="Guardar">${ico('save', 16)}</button>
          <button type="button" class="proy-icono proy-quitar" data-proy-quitar aria-label="Quitar ${esc(item.nombre)}" title="Quitar">${ico('trash', 16)}</button></div>
        </form>`;
        if (!deuda) return formulario;
        return `<details class="proy-deuda-manual"><summary><span><strong>${esc(item.nombre)}</strong><small>${item.pendiente ? 'Pendiente de Caja' : 'Manual'}</small></span><b>${formatCOP(item.monto)}</b><span class="proy-icono" aria-hidden="true">${ico('pencil', 15)}</span></summary>${formulario}</details>`;
      });
      if (lista === 'deudas') {
        document.getElementById('proy-deudas').innerHTML = filas.join('');
      } else {
        for (const tipo of Object.keys(tipos)) {
          document.getElementById('proy-' + tipo).innerHTML = filas.filter((_, i) => plan.partidas[i].tipo === tipo).join('');
          actualizarBotonAgregar(tipo);
        }
      }
    }
    actualizarPendientes();
  }

  function formatearMes(mes) {
    return etiquetaMes.format(new Date(mes + '-01T00:00:00Z'));
  }

  function renderizarResultados() {
    const filas = calcular(plan);
    const total = campo => filas.reduce((suma, fila) => suma + fila[campo], 0);
    const deudaTotal = plan.deudas.reduce((suma, deuda) => suma + deuda.monto, 0);
    const ultimoPago = deudaTotal ? indice(plan.inicio) + plan.plazo - 1 : null;
    const mayor = filas.reduce((mejor, fila) => fila.meta > mejor.meta ? fila : mejor, filas[0]);
    const promedio = total('meta') / filas.length;
    const tarjetas = [
      ['Total del año', formatCOP(total('meta'))],
      ['Promedio mensual', formatCOP(promedio)],
      ['Ventas por día', formatCOP(promedio / plan.dias)],
      ['Mes más exigente', mayor.meta ? formatearMes(mayor.mes) + ' · ' + formatCOP(mayor.meta) : 'Sin meta'],
      ['Terminas de pagar', ultimoPago === null ? 'Sin deudas' : formatearMes(mesISO(ultimoPago))]
    ];
    document.getElementById('proy-resumen').innerHTML = tarjetas.map(([nombre, valor]) =>
      `<div class="proy-info-item"><span>${nombre}</span><strong>${valor}</strong></div>`).join('');
    const categorias = [
      ['Deudas', deudaTotal, 'deudas', 'Saldo total', 'alert'],
      ['Pagos', Math.max(0, ...filas.map(f => f.abonos)), 'pagos', 'Mayor abono mensual', 'clock'],
      ['Sueldo', total('sueldo') + total('reserva'), 'sueldo', 'Total del año', 'user'],
      ['Utilidad', total('utilidad'), 'utilidad', 'Total del año', 'trend'],
      ['Compras', total('compras'), 'compras', 'Total del año', 'cart']
    ];
    document.getElementById('proy-plan-resumen').innerHTML = categorias.map(([nombre, valor, clase, detalle, icono]) =>
      `<button type="button" data-proy-detalle="${clase}" class="proy-plan-item ${clase}"><span class="proy-kpi-cabecera"><span>${nombre}</span><span class="proy-kpi-icono" aria-hidden="true">${ico(icono, 18)}</span></span><strong>${formatCOP(valor)}</strong><small>${detalle}</small><b>Ver detalle ›</b></button>`).join('');
    renderizarFormula(filas);
    const totalDeuda = plan.deudas.reduce((suma, deuda) => suma + deuda.monto, 0);
    const maxAbono = Math.max(0, ...filas.map(fila => fila.abonos));
    document.getElementById('proy-deuda-resumen').textContent =
      `Deuda total ${formatCOP(totalDeuda)} · Mayor abono mensual durante el período ${formatCOP(maxAbono)}`;
    document.getElementById('proy-tarjetas-mes').innerHTML = filas.map((f, posicion) => {
      const cambio = posicion > 0 && f.meta !== filas[posicion - 1].meta;
      const nombreMes = new Intl.DateTimeFormat('es-CO', { month: 'long', timeZone: 'UTC' }).format(new Date(f.mes + '-01T00:00:00Z')).toLocaleUpperCase('es-CO');
      const abierto = mesesVisibles.has(f.mes);
      const conceptos = plan.partidas.filter(item => indice(f.mes) >= indice(item.inicio) && indice(f.mes) <= indice(item.fin))
        .map(item => `<li><span class="proy-concepto-nombre ${esc(item.tipo)}">${esc(item.nombre === 'Monto mensual' ? (tipos[item.tipo] || item.nombre) : item.nombre)}</span><span>${formatCOP(montoEnMes(item, f.mes))}</span></li>`);
      if (f.abonos) conceptos.push(`<li><span class="proy-concepto-nombre deudas">Abonos a deudas</span><span>${formatCOP(f.abonos)}</span></li>`);
      return `<article class="proy-mes ${cambio ? 'proy-mes-cambio' : ''}">
        <div class="proy-mes-head"><span class="proy-mes-nombre">${nombreMes}</span><button type="button" class="proy-mes-ojo" data-mes-detalle="${f.mes}" aria-expanded="${abierto}" aria-controls="proy-detalle-${f.mes}" aria-label="${abierto ? 'Ocultar' : 'Ver'} detalle de ${nombreMes}" title="${abierto ? 'Ocultar' : 'Ver'} detalle">${ico('eye', 17)}</button></div>
        ${cambio ? '<span class="proy-cambio-etiqueta">Cambió la meta</span>' : ''}
        <div class="proy-mes-valor"><small>Debes vender</small><strong>${formatCOP(f.meta)}</strong></div>
        <div class="proy-reparto" aria-label="Composición de la meta">
          ${[['sueldo',f.sueldo+f.reserva],['deudas',f.abonos],['utilidad',f.utilidad],['compras',f.compras]].map(([tipo,monto]) => `<span class="${tipo}" style="width:${f.meta ? monto / f.meta * 100 : 0}%"></span>`).join('')}
        </div>
        <div id="proy-detalle-${f.mes}" class="proy-mes-detalle" ${abierto ? '' : 'hidden'}><ul class="proy-conceptos">${conceptos.join('') || '<li>Sin conceptos este mes</li>'}</ul>
        <div class="proy-por-dia"><span>Por día</span><b>${formatCOP(f.meta / plan.dias)}</b></div></div>
      </article>`;
    }).join('');
    renderizarGraficos(filas);
  }

  function renderizarFormula(filas) {
    const selectorMes = document.getElementById('proy-mes-formula');
    if (!filas.some(fila => fila.mes === mesFormula)) mesFormula = filas[0].mes;
    selectorMes.innerHTML = filas.map(fila => `<option value="${fila.mes}" ${fila.mes === mesFormula ? 'selected' : ''}>${formatearMes(fila.mes)}</option>`).join('');
    const fila = filas.find(item => item.mes === mesFormula);
    const partes = [
      ['Sueldo', fila.sueldo + fila.reserva, 'sueldo'],
      ['Abonos', fila.abonos, 'deudas'],
      ['Utilidad ideal', fila.utilidad, 'utilidad'],
      ['Compras', fila.compras, 'compras'],
      ['Meta de ventas', fila.meta, 'resultado']
    ];
    document.getElementById('proy-formula').innerHTML = partes.map(([nombre, monto, clase], i) =>
      `${i ? '<span class="proy-operador">' + (i === partes.length - 1 ? '=' : '+') + '</span>' : ''}<div class="proy-formula-item ${clase}"><span>${nombre}</span><strong>${formatCOP(monto)}</strong></div>`).join('');
  }

  function renderizarGraficos(filas = calcular(plan)) {
    const resumen = filas.map(fila => `${formatearMes(fila.mes)} ${formatCOP(fila.meta)}`).join(', ');
    document.getElementById('proy-graficos').innerHTML = `<figure class="proy-panel">
      <h3>Meta de ventas por mes</h3>
      <p class="proy-chart-sub">Evolución de la meta mensual de ventas.</p>
      <div class="proy-linea-contenedor"><canvas id="proy-grafico-linea" role="img" aria-label="${esc(resumen)}"></canvas></div>
    </figure>`;
    const canvas = document.getElementById('proy-grafico-linea');
    function dibujar() {
      if (!canvas.isConnected) return;
      const ancho = canvas.clientWidth;
      const alto = canvas.clientHeight;
      if (!ancho || !alto) return;
      const escala = window.devicePixelRatio || 1;
      canvas.width = ancho * escala;
      canvas.height = alto * escala;
      const ctx = canvas.getContext('2d');
      ctx.scale(escala, escala);
      const izquierda = 64, derecha = 12, arriba = 15, abajo = 32;
      const altoGrafico = alto - arriba - abajo;
      const anchoGrafico = ancho - izquierda - derecha;
      const maximo = Math.max(1, ...filas.map(f => f.meta)) * 1.1;
      const estilos = getComputedStyle(vista);
      ctx.font = '11px Poppins, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = estilos.getPropertyValue('--gris-80').trim();
      ctx.strokeStyle = estilos.getPropertyValue('--borde').trim();
      for (let i = 0; i <= 4; i++) {
        const y = arriba + altoGrafico * i / 4;
        ctx.beginPath(); ctx.moveTo(izquierda, y); ctx.lineTo(ancho - derecha, y); ctx.stroke();
        ctx.fillText(formatCOP(maximo * (1 - i / 4)), 0, y + 4, izquierda - 8);
      }
      const puntos = filas.map((fila, i) => ({
        x: izquierda + anchoGrafico * i / Math.max(1, filas.length - 1),
        y: arriba + altoGrafico * (1 - fila.meta / maximo)
      }));
      ctx.strokeStyle = estilos.getPropertyValue('--fucsia').trim();
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      puntos.forEach((punto, i) => { if (i) ctx.lineTo(punto.x, punto.y); else ctx.moveTo(punto.x, punto.y); });
      ctx.stroke();
      puntos.forEach((punto, i) => {
        ctx.beginPath(); ctx.arc(punto.x, punto.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = estilos.getPropertyValue('--fucsia').trim(); ctx.fill();
        ctx.fillStyle = estilos.getPropertyValue('--gris-80').trim();
        ctx.textAlign = 'center'; ctx.fillText(formatearMes(filas[i].mes).split(' ')[0], punto.x, alto - 9);
      });
    }
    if (observadorGrafico) observadorGrafico.disconnect();
    observadorGrafico = new ResizeObserver(dibujar);
    observadorGrafico.observe(canvas);
    dibujar();
  }

  function crearIntervalo(tipo, inicio, fin) {
    const contenedor = document.getElementById('proy-' + tipo);
    const anio = plan.inicio.slice(0, 4);
    const form = document.createElement('form');
    form.className = 'proy-fila proy-fields proy-intervalo-nuevo';
    form.noValidate = true;
    form.dataset.intervaloNuevo = tipo;
    const compras = tipo === 'compras';
    const rango = inicio !== plan.inicio || fin !== anio + '-12' ? { inicio, fin } : null;
    form.innerHTML = `${controlesCompras(rango)}
      ${campo('monto', compras ? 'Monto (COP)' : 'Monto al mes (COP)', 'text', '', 'inputmode="numeric" data-proy-monto')}
      ${fechasCompras(rango)}
      <div class="proy-acciones-fila"><button class="proy-icono" aria-label="Guardar intervalo" title="Guardar intervalo">${ico('save', 16)}</button>
      <button type="button" class="proy-icono proy-quitar" data-cancelar-intervalo aria-label="Cancelar intervalo" title="Cancelar intervalo">${ico('x', 16)}</button></div>`;
    contenedor.append(form);
    actualizarBotonAgregar(tipo);
    form.elements.monto.focus();
  }

  function primerIntervaloLibre(tipo) {
    const inicioAnio = indice(plan.inicio);
    const finAnio = inicioAnio + 11;
    const existentes = plan.partidas.filter(item => item.tipo === tipo);
    const cubierto = mes => existentes.some(item => indice(item.inicio) <= mes && indice(item.fin) >= mes);
    let inicio = inicioAnio;
    while (inicio <= finAnio && cubierto(inicio)) inicio++;
    if (inicio > finAnio) return null;
    let fin = inicio;
    while (fin < finAnio && !cubierto(fin + 1)) fin++;
    return { inicio: mesISO(inicio), fin: mesISO(fin) };
  }

  function agregar(lista, valores = {}) {
    const inicio = plan.inicio;
    const partida = { nombre: 'Monto mensual', tipo: 'sueldo', monto: 0, inicio, fin: mesISO(indice(inicio) + plan.meses - 1) };
    plan[lista].push({ ...partida, ...valores });
    guardar();
    renderizarEdicion();
    renderizarResultados();
    const formulario = vista.querySelector(`form[data-lista="${lista}"][data-fila="${plan[lista].length - 1}"]`);
    formulario?.querySelector('input[name="nombre"]').focus();
  }

  vista.addEventListener('submit', event => {
    event.preventDefault();
    if (!plan) return;
    const form = event.target;
    const values = Object.fromEntries(new FormData(form));
    const tieneIntervalo = !!form.dataset.intervaloNuevo || ['sueldo', 'utilidad', 'compras'].includes(values.tipo);
    if (tieneIntervalo && !values.con_fechas) {
      values.inicio = plan.inicio;
      values.fin = mesISO(indice(plan.inicio) + 11);
    }
    delete values.con_fechas;
    const edicionDeIntervalo = tieneIntervalo && !!planAnterior;
    if (edicionDeIntervalo && form.previousElementSibling?.matches('[data-intervalo-nuevo]')) {
      notificar('Guarda primero el intervalo anterior.');
      return;
    }
    if (!edicionDeIntervalo && !confirmarOtrosCambios(form)) return;
    if (tieneIntervalo) {
      const limite = mesISO(indice(plan.inicio) + 11);
      if (!/^\d{4}-\d{2}$/.test(values.inicio || '') || !/^\d{4}-\d{2}$/.test(values.fin || '') ||
          values.inicio < plan.inicio || values.fin > limite || values.fin < values.inicio) {
        notificar('Elige un intervalo válido dentro del año seleccionado.');
        return;
      }
    }
    let continuacion = null;
    if (form === config) {
      const dias = Number(values.dias);
      if (!values.dias || !Number.isInteger(dias) || dias < 1 || dias > 31) {
        notificar('Elige una cantidad de días entre 1 y 31.');
        return;
      }
      plan.dias = dias;
    } else if (form.id === 'proy-plazo') {
      plan.plazo = Number(values.cuotas);
      edicionPendiente = false;
      formulariosEditados.clear();
      guardar();
      renderizarEdicion();
      renderizarResultados();
      return;
    } else if (form.dataset.intervaloNuevo) {
      const tipo = form.dataset.intervaloNuevo;
      const monto = Number(values.monto.replace(/\D/g, ''));
      if (!monto || monto > maxMonto || !values.inicio || !values.fin || indice(values.fin) < indice(values.inicio)) {
        notificar('Revisa el monto y el intervalo de meses.');
        return;
      }
      plan.partidas.push({ nombre: tipos[tipo], tipo, monto, inicio: values.inicio, fin: values.fin });
      continuacion = { tipo, ...primerIntervaloLibre(tipo) };
      if (!continuacion.inicio) continuacion = null;
    } else if (form === formularioManual) {
      const nombre = values.nombre.trim();
      const monto = Number(values.monto.replace(/\D/g, ''));
      if (!nombre || !monto || monto > maxMonto) {
        notificar('Escribe una descripción y un monto válido.');
        return;
      }
      plan.deudas.push({ nombre, monto, inicio: plan.inicio, cuotas: Number(document.querySelector('#proy-plazo input').value) || 10 });
      formularioManual.reset();
      formularioManual.hidden = true;
    } else {
      const { lista, fila } = form.dataset;
      if (!lista || !plan[lista][fila]) return;
      if (values.fin && indice(values.fin) < indice(values.inicio)) {
        notificar('El mes final debe ser igual o posterior al inicial.');
        return;
      }
      if (!values.nombre.trim()) {
        notificar('Escribe una descripción.');
        return;
      }
      values.nombre = values.nombre.trim();
      values.monto = Number(values.monto.replace(/\D/g, ''));
      if (!values.monto || values.monto > maxMonto) {
        notificar('Escribe un monto válido.');
        return;
      }
      if (values.cuotas) values.cuotas = Number(values.cuotas);
      Object.assign(plan[lista][fila], values);
      if (lista === 'partidas' && (values.tipo === 'sueldo' || values.tipo === 'utilidad' || values.tipo === 'compras')) {
        const pendiente = primerIntervaloLibre(values.tipo);
        if (pendiente) continuacion = { tipo: values.tipo, ...pendiente };
      }
    }
    if (edicionDeIntervalo) {
      if (form.dataset.intervaloNuevo) {
        const tipo = form.dataset.intervaloNuevo;
        delete form.dataset.intervaloNuevo;
        form.dataset.lista = 'partidas';
        form.dataset.fila = String(plan.partidas.length - 1);
        form.insertAdjacentHTML('afterbegin', `<input type="hidden" name="tipo" value="${tipo}"><input type="hidden" name="nombre" value="${esc(tipos[tipo])}">`);
        const quitar = form.querySelector('[data-cancelar-intervalo]');
        quitar.removeAttribute('data-cancelar-intervalo');
        quitar.dataset.proyQuitar = '';
        quitar.setAttribute('aria-label', 'Quitar ' + tipos[tipo]);
        quitar.title = 'Quitar';
        quitar.innerHTML = ico('trash', 16);
      }
      formulariosEditados.delete(form);
      edicionPendiente = formulariosEditados.size > 0;
      renderizarResultados();
      limpiarAviso();
      if (continuacion && !document.querySelector('#proy-' + continuacion.tipo + ' [data-intervalo-nuevo]')) {
        crearIntervalo(continuacion.tipo, continuacion.inicio, continuacion.fin);
        notificar('Completa el monto para los meses restantes antes de guardar.');
      }
      return;
    }
    edicionPendiente = false;
    formulariosEditados.clear();
    guardar();
    renderizarEdicion();
    renderizarResultados();
    limpiarAviso();
  });

  const controlPlazo = document.getElementById('proy-plazo-meses');
  function actualizarVistaPlazo() {
    const meses = Number(controlPlazo.value);
    const total = plan.deudas.reduce((suma, deuda) => suma + deuda.monto, 0);
    document.getElementById('proy-deuda-resumen').textContent =
      controlPlazo.validity.valid ? `Deuda total ${formatCOP(total)} · Abono mensual máximo ${formatCOP(Math.ceil(total / meses))}` : 'Elige entre 1 y 12 meses.';
  }
  controlPlazo.addEventListener('input', actualizarVistaPlazo);
  for (const [id, diferencia] of [['proy-dias-menos', -1], ['proy-dias-mas', 1]]) {
    document.getElementById(id).addEventListener('click', () => {
      const campo = config.elements.dias;
      campo.value = String(Math.max(1, Math.min(31, (Number(campo.value) || 1) + diferencia)));
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
  for (const [id, diferencia] of [['proy-menos', -1], ['proy-mas', 1]]) {
    document.getElementById(id).addEventListener('click', () => {
      controlPlazo.value = String(Math.max(1, Math.min(12, (Number(controlPlazo.value) || 1) + diferencia)));
      controlPlazo.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  document.getElementById('proy-agregar-manual').addEventListener('click', () => {
    formularioManual.hidden = false;
    formularioManual.elements.nombre.focus();
  });
  document.getElementById('proy-cancelar-manual').addEventListener('click', () => {
    formularioManual.reset();
    formularioManual.hidden = true;
    formulariosEditados.delete(formularioManual);
    edicionPendiente = formulariosEditados.size > 0;
  });
  vista.addEventListener('change', event => {
    const fin = event.target;
    if (!fin.matches('[data-intervalo-fin]')) return;
    const form = fin.form;
    let siguiente = form.nextElementSibling;
    const tipo = form.dataset.intervaloNuevo || form.elements.tipo?.value;
    const siguienteInicio = indice(fin.value) + 1;
    const limite = indice(plan.inicio) + 11;
    if (!siguiente || !siguiente.matches('form')) {
      if (siguienteInicio <= limite && tipo) {
        crearIntervalo(tipo, mesISO(siguienteInicio), mesISO(limite));
        notificar('Completa el monto para los meses restantes antes de guardar.');
      }
      fin.dataset.valorAnterior = fin.value;
      return;
    }
    if (siguienteInicio > limite) {
      if (siguiente.dataset.intervaloNuevo && !siguiente.elements.monto.value && !siguiente.nextElementSibling) {
        formulariosEditados.delete(siguiente);
        siguiente.remove();
        fin.dataset.valorAnterior = fin.value;
        limpiarAviso();
        return;
      }
      fin.value = fin.dataset.valorAnterior;
      notificar('Quita el intervalo siguiente antes de extender este hasta diciembre.');
      return;
    }
    const inicio = siguiente.elements.inicio;
    const hasta = siguiente.elements.fin;
    const fechas = siguiente.querySelector('.proy-fechas-compras');
    const calendario = siguiente.querySelector('[data-compras-fechas]');
    fechas.hidden = false;
    calendario.setAttribute('aria-pressed', 'true');
    siguiente.elements.con_fechas.disabled = false;
    fechas.querySelectorAll('select').forEach(select => { select.disabled = false; });
    inicio.value = mesISO(siguienteInicio);
    if (indice(hasta.value) < siguienteInicio) hasta.value = inicio.value;
    hasta.dataset.valorAnterior = hasta.value;
    if (siguiente.dataset.lista === 'partidas') {
      const item = plan.partidas[Number(siguiente.dataset.fila)];
      item.inicio = inicio.value;
      item.fin = hasta.value;
    }
    fin.dataset.valorAnterior = fin.value;
    limpiarAviso();
  });

  vista.addEventListener('input', event => {
    const input = event.target;
    if (!input.matches('[data-proy-monto]')) return;
    const posicion = input.selectionStart;
    const digitosAntes = input.value.slice(0, posicion).replace(/\D/g, '').length;
    const digitos = input.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 13);
    input.value = digitos ? Number(digitos).toLocaleString('es-CO') : '';
    let cursor = 0;
    let contados = 0;
    while (cursor < input.value.length && contados < digitosAntes) {
      if (/\d/.test(input.value[cursor])) contados++;
      cursor++;
    }
    input.setSelectionRange(cursor, cursor);
  });

  vista.addEventListener('click', event => {
    if (!plan) return;
    const ojo = event.target.closest('[data-mes-detalle]');
    if (ojo) {
      const mes = ojo.dataset.mesDetalle;
      const abierto = ojo.getAttribute('aria-expanded') !== 'true';
      if (abierto) mesesVisibles.add(mes); else mesesVisibles.delete(mes);
      ojo.setAttribute('aria-expanded', String(abierto));
      const nombre = ojo.closest('.proy-mes').querySelector('.proy-mes-nombre').textContent;
      ojo.setAttribute('aria-label', `${abierto ? 'Ocultar' : 'Ver'} detalle de ${nombre}`);
      ojo.title = `${abierto ? 'Ocultar' : 'Ver'} detalle`;
      document.getElementById(ojo.getAttribute('aria-controls')).hidden = !abierto;
      return;
    }
    const calendario = event.target.closest('[data-compras-fechas]');
    if (calendario) {
      const visible = calendario.getAttribute('aria-pressed') !== 'true';
      calendario.setAttribute('aria-pressed', String(visible));
      const fechas = calendario.form.querySelector('.proy-fechas-compras');
      const seleccion = calendario.form.elements.con_fechas;
      fechas.hidden = !visible;
      seleccion.disabled = !visible;
      fechas.querySelectorAll('select').forEach(input => {
        input.disabled = !visible;
        input.required = visible;
      });
      seleccion.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    const cancelar = event.target.closest('[data-cancelar-intervalo]');
    if (cancelar) {
      formulariosEditados.delete(cancelar.form);
      edicionPendiente = formulariosEditados.size > 0;
      const tipo = cancelar.form.dataset.intervaloNuevo;
      cancelar.form.remove();
      actualizarBotonAgregar(tipo);
      return;
    }
    const boton = event.target.closest('[data-proy-add], [data-proy-quitar]');
    if (!boton) return;
    if (!confirmarOtrosCambios(null)) return;
    formulariosEditados.clear();
    edicionPendiente = false;
    if (boton.dataset.proyAdd) {
      if (boton.dataset.tipo === 'sueldo' || boton.dataset.tipo === 'utilidad' || boton.dataset.tipo === 'compras') {
        const fin = mesISO(indice(plan.inicio) + 11);
        crearIntervalo(boton.dataset.tipo, plan.inicio, fin);
      } else {
        agregar(boton.dataset.proyAdd, boton.dataset.tipo ? { tipo: boton.dataset.tipo } : {});
      }
      return;
    }
    const { lista, fila } = boton.form.dataset;
    plan[lista].splice(Number(fila), 1);
    guardar();
    renderizarEdicion();
    renderizarResultados();
  });

  function cargarAnio(anio) {
    clave = 'atenas_proyeccion_' + usuarioActual + '_' + anio;
    pendienteSeleccionado = null;
    const base = { inicio: anio + '-01', meses: 12, reserva: 0, dias: 26, plazo: 10, deudas: [], partidas: [], ventas: {} };
    try {
      let guardado = localStorage.getItem(clave);
      if (!guardado && anio === 2027) guardado = localStorage.getItem('atenas_proyeccion_' + usuarioActual);
      const anterior = JSON.parse(guardado);
      plan = { ...base, ...anterior, inicio: base.inicio, meses: 12 };
      plan.plazo = Math.max(1, Math.min(12, Math.trunc(Number(plan.plazo) || 10)));
      plan.dias = Math.max(1, Math.min(31, Math.trunc(Number(plan.dias) || 26)));
    } catch {
      plan = base;
    }
    mesFormula = null;
    document.getElementById('proy-anio-actual').textContent = String(anio);
    document.querySelectorAll('[data-proy-anio]').forEach(boton => {
      const seleccionado = Number(boton.dataset.proyAnio) === Number(anio);
      boton.classList.toggle('activo', seleccionado);
      boton.setAttribute('aria-pressed', String(seleccionado));
    });
    document.getElementById('proy-anio-titulo').textContent = String(anio);
    renderizarEdicion();
    renderizarResultados();
  }

  const selectorAnio = document.getElementById('proy-anio');
  const opcionesAnio = document.getElementById('proy-anio-opciones');
  const ultimoAnio = Math.max(2027, new Date().getFullYear() + 1) + 9;
  for (let anio = 2027; anio <= ultimoAnio; anio++) {
    const opcion = document.createElement('button');
    opcion.type = 'button';
    opcion.dataset.proyAnio = String(anio);
    opcion.textContent = String(anio);
    opcion.setAttribute('aria-pressed', 'false');
    opcionesAnio.append(opcion);
  }
  function cerrarSelectorAnio() {
    opcionesAnio.hidden = true;
    selectorAnio.setAttribute('aria-expanded', 'false');
  }
  selectorAnio.addEventListener('click', () => {
    const abrir = opcionesAnio.hidden;
    opcionesAnio.hidden = !abrir;
    selectorAnio.setAttribute('aria-expanded', String(abrir));
  });
  opcionesAnio.addEventListener('click', event => {
    const opcion = event.target.closest('[data-proy-anio]');
    if (!opcion || !usuarioActual) return;
    cargarAnio(Number(opcion.dataset.proyAnio));
    cerrarSelectorAnio();
    selectorAnio.focus();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#proy-selector-anio')) cerrarSelectorAnio();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !opcionesAnio.hidden) {
      cerrarSelectorAnio();
      selectorAnio.focus();
    }
  });

  async function abrir() {
    const { data } = await sb.auth.getSession();
    const usuario = data?.session?.user?.id;
    if (!usuario) return;
    if (usuario !== usuarioActual) {
      usuarioActual = usuario;
      cargarAnio(2027);
    }
    actualizarPendientes();
  }

  return { abrir, actualizarPendientes };
})();
