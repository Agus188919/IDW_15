import { AppointmentManager } from './reserva.js';

const paciente = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');
const manager = new AppointmentManager();

//MAPA USADO PARA CONVERSION DE OBRA SOCIALES
const OBRA_SOCIAL = {
    1: "Osde", 2: "Swiss Medical", 3: "Galeno",
    4: "Medifé", 5: "Medicus", 6: "Particular"
};

const formPerfil = document.getElementById('form-perfil');
const inputNombre = document.getElementById('perfil-nombre');
const inputDni = document.getElementById('perfil-dni');
const inputOs = document.getElementById('perfil-os');
const inputEmail = document.getElementById('perfil-email');
const btnEditar = document.getElementById('btn-editar-perfil');
const btnGuardar = document.getElementById('btn-guardar-perfil');
const btnCancelar = document.getElementById('btn-cancelar-perfil');
const tbodyTurnos = document.getElementById('tabla-turnos');
const sinTurnosMsg = document.getElementById('sin-turnos');
const formTurno = document.getElementById('form-turno');
const selectProfesional = document.getElementById('select-profesional');
const inputFecha = document.getElementById('fechaTurno');
const inputHora = document.getElementById('horaTurno');

if (!paciente) {
    alert('Debes iniciar sesión como paciente para ver tu perfil.');
    window.location.href = './login-inicial.html';
}

/**
 * ACTUALIZAMOS EL PERFIL DEL USUARIO LOGUEADO
 */
function renderPerfil() {
    inputNombre.value = `${paciente.nombrePaciente} ${paciente.apellidoPaciente}`;
    inputDni.value = paciente.dniPaciente;
    inputOs.value = OBRA_SOCIAL[paciente.os] || 'No especificada';
    inputEmail.value = paciente.emailPaciente;
}

/**
 * HABILITAMOS LA EDICION DEL FORMULARIO DEL USUARIO LOGUEADO
 */
function habilitarEdicion() {
    inputNombre.disabled = false;
    inputEmail.disabled = false;
    btnGuardar.disabled = false;
    btnCancelar.classList.remove('d-none');
    btnEditar.disabled = true;
}

/**
 * SE CANCELA LA EDICION DEL USUARIO LOGUEADO
 */
function cancelarEdicion() {
    renderPerfil();
    inputNombre.disabled = true;
    inputEmail.disabled = true;
    btnGuardar.disabled = true;
    btnCancelar.classList.add('d-none');
    btnEditar.disabled = false;
}

/**
 * GUARDAMOS EL PERFIL LUEGO DE EDICION DEL USUARIO
 * 
 * @param {*} e 
 * @returns 
 */
function guardarPerfil(e) {
    e.preventDefault();
    const partes = inputNombre.value.trim().split(' ');
    const nombreNuevo = partes.shift() || '';
    const apellidoNuevo = partes.join(' ') || '';
    const emailNuevo = inputEmail.value.trim();
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
    const idx = pacientes.findIndex(p => p.dniPaciente === paciente.dniPaciente);
    if (idx === -1) {
        alert('No se pudo encontrar el paciente en la base local.');
        return;
    }
    const actualizado = { ...pacientes[idx], nombrePaciente: nombreNuevo, apellidoPaciente: apellidoNuevo, emailPaciente: emailNuevo };
    pacientes[idx] = actualizado;
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    localStorage.setItem('pacienteActivo', JSON.stringify(actualizado));
    alert('Datos actualizados correctamente');
    cancelarEdicion();
}

/**
 * ACTUALIZAMOS LA TABLA DE LOS TURNOS VINCULADOS AL USUARIO LOGUEADO
 * 
 * @returns 
 */
function renderTurnos() {
    const turnos = manager.getAppointments({ dniPaciente: paciente.dniPaciente });
    const profesionales = JSON.parse(localStorage.getItem('profesionales') || '[]');
    const mapaProfes = new Map(profesionales.map(p => [Number(p.matricula), p]));
    if (!turnos.length) {
        tbodyTurnos.innerHTML = '';
        sinTurnosMsg.classList.remove('d-none');
        return;
    }
    sinTurnosMsg.classList.add('d-none');
    tbodyTurnos.innerHTML = turnos.map(t => {
        const prof = mapaProfes.get(Number(t.matriculaProfesional));
        const nombreProf = prof ? `${prof.nombreProfesional} ${prof.apellidoProfesional}` : `Mat. ${t.matriculaProfesional}`;
        const precioFormateado = t.valorFinal ? t.valorFinal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : 'N/A';
        return `
            <tr>
                <td>${t.fechaTurno}</td>
                <td>${t.horaTurno}</td>
                <td>${nombreProf}</td>
                <td>${t.status}</td>
                <td>${precioFormateado}</td>
            </tr>
        `;
    }).join('');
}

/**
 * SE RECUPERA EL PROFESIONAL AL CUAL LE QUEEREMOS GENERAR
 * UN TURNO CON EL USUARIO LOGUEADO
 * 
 */
function cargarProfesionalesSelect() {
    const profesionales = JSON.parse(localStorage.getItem('profesionales') || '[]');
    profesionales.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.matricula;
        option.textContent = `${prof.nombreProfesional} ${prof.apellidoProfesional} (${prof.especialidadAlta})`;
        selectProfesional.appendChild(option);
    });
}

/**
 * GENERACION DE VALIDACIONES
 * 
 * @returns 
 */
function configurarValidadoresVisuales() {
    if (!inputFecha) {
        return;
    }
    const hoy = new Date();
    const anioMin = hoy.getFullYear();
    const mesMin = (hoy.getMonth() + 1).toString().padStart(2, '0'); // +1 (porque es 0-11) y "09"
    const diaMin = hoy.getDate().toString().padStart(2, '0');
    const minDate = `${anioMin}-${mesMin}-${diaMin}`;
    const anioMax = hoy.getFullYear();
    const mesActual = hoy.getMonth();
    const ultimoDiaDelMes = new Date(anioMax, mesActual + 1, 0);
    const diaMax = ultimoDiaDelMes.getDate().toString().padStart(2, '0');
    const mesMax = (mesActual + 1).toString().padStart(2, '0');
    const maxDate = `${anioMax}-${mesMax}-${diaMax}`;
    inputFecha.setAttribute('min', minDate);
    inputFecha.setAttribute('max', maxDate);
}

/**
 * SE GENERA UN NUEVO TURNO A PARTIR DE LAS CONDICIONES
 * POSIBLES DE GENERACION
 * @param {*} e 
 */
function agendarNuevoTurno(e) {
    e.preventDefault();
    try {
        const nuevoTurno = manager.createAppointment({
            matriculaProfesional: selectProfesional.value,
            dniPaciente: paciente.dniPaciente,
            fechaTurno: inputFecha.value,
            horaTurno: inputHora.value
        });
        console.log('Turno creado:', nuevoTurno);
        alert('Turno creado correctamente');
        formTurno.reset();
        renderTurnos();
        const tab = new bootstrap.Tab(document.getElementById('turnos-tab'));
        tab.show();

    } catch (err) {
        console.error('Error creando turno:', err);
        alert('Error al crear el turno. Revisá los datos.');
    }
}

/**
 * SE RESTRIGE LA GENERACION DE HORARIOS FUERA DEL RANGO
 * DE ATENCION POSIBLE
 * 
 * @returns 
 */
function cargarHorariosDisponibles() {
    const HORA_INICIO_NUM = 8;
    const HORA_FIN_NUM = 20;
    const INTERVALO_MINUTOS = 30;
    if (!inputHora) {
        return;
    }
    for (let hora = HORA_INICIO_NUM; hora < HORA_FIN_NUM; hora++) {
        for (let min = 0; min < 60; min += INTERVALO_MINUTOS) {
            const horaStr = hora.toString().padStart(2, '0');
            const minStr = min.toString().padStart(2, '0');
            const valorTiempo = `${horaStr}:${minStr}`;
            const option = document.createElement('option');
            option.value = valorTiempo;
            option.textContent = valorTiempo;
            inputHora.appendChild(option);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    btnEditar.addEventListener('click', habilitarEdicion);
    btnCancelar.addEventListener('click', cancelarEdicion);
    formPerfil.addEventListener('submit', guardarPerfil);
    formTurno.addEventListener('submit', agendarNuevoTurno);
    renderPerfil();
    renderTurnos();
    cargarProfesionalesSelect();
    configurarValidadoresVisuales();
    cargarHorariosDisponibles();
    const hash = window.location.hash;
    if (hash === '#pedir-turno') {
        const tabBoton = document.getElementById('pedir-tab');
        if (tabBoton) {
            const tab = new bootstrap.Tab(tabBoton);
            tab.show();
        }
    }
    const profesionalSeleccionado = JSON.parse(localStorage.getItem('profesionalSeleccionado') || 'null');
    if (profesionalSeleccionado && selectProfesional) {
        selectProfesional.value = profesionalSeleccionado.matricula;
        localStorage.removeItem('profesionalSeleccionado');
    }
});