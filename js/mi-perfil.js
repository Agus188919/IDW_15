import { AppointmentManager } from './Appointments.js';

const paciente = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');

if (!paciente) {
  alert('Debes iniciar sesión como paciente para ver tu perfil.');
  window.location.href = './login-inicial.html';
}

const OBRA_SOCIAL = {
  1: "Osde",
  2: "Swiss Medical",
  3: "Galeno",
  4: "Medifé",
  5: "Medicus",
  6: "Particular"
};

const formPerfil = document.getElementById('form-perfil');
const inputNombre = document.getElementById('perfil-nombre');
const inputDni = document.getElementById('perfil-dni');
const inputOs = document.getElementById('perfil-os');
const inputEmail = document.getElementById('perfil-email');
const btnEditar = document.getElementById('btn-editar-perfil');
const btnGuardar = document.getElementById('btn-guardar-perfil');
const btnCancelar = document.getElementById('btn-cancelar-perfil');

function renderPerfil() {
  inputNombre.value = `${paciente.nombrePaciente} ${paciente.apellidoPaciente}`;
  inputDni.value = paciente.dniPaciente;
  inputOs.value = OBRA_SOCIAL[paciente.os] || 'No especificada';
  inputEmail.value = paciente.emailPaciente;
}

// Habilitar edición
btnEditar.addEventListener('click', () => {
  inputNombre.disabled = false;
  inputEmail.disabled = false;

  btnGuardar.disabled = false;
  btnCancelar.classList.remove('d-none');
  btnEditar.disabled = true;
});

// Cancelar edición
btnCancelar.addEventListener('click', () => {
  renderPerfil();

  inputNombre.disabled = true;
  inputEmail.disabled = true;

  btnGuardar.disabled = true;
  btnCancelar.classList.add('d-none');
  btnEditar.disabled = false;
});


formPerfil.addEventListener('submit', (e) => {
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

  const actualizado = {
    ...pacientes[idx],
    nombrePaciente: nombreNuevo,
    apellidoPaciente: apellidoNuevo,
    emailPaciente: emailNuevo,
  };

  pacientes[idx] = actualizado;

  
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
  localStorage.setItem('pacienteActivo', JSON.stringify(actualizado));

  alert('Datos actualizados correctamente');

  
  inputNombre.disabled = true;
  inputEmail.disabled = true;
  btnGuardar.disabled = true;
  btnCancelar.classList.add('d-none');
  btnEditar.disabled = false;
});

function renderTurnos() {
  const manager = new AppointmentManager();
  const turnos = manager.getAppointments({ dniPaciente: paciente.dniPaciente });

  const tbody = document.getElementById('tabla-turnos');
  const sinTurnos = document.getElementById('sin-turnos');

  const profesionales = JSON.parse(localStorage.getItem('profesionales') || '[]');
  const mapaProfes = new Map(
    profesionales.map(p => [Number(p.matricula), p])
  );

  if (!turnos.length) {
    tbody.innerHTML = '';
    sinTurnos.classList.remove('d-none');
    return;
  }

  sinTurnos.classList.add('d-none');

  tbody.innerHTML = turnos.map(t => {
    const prof = mapaProfes.get(Number(t.matriculaProfesional));
    const nombreProf = prof
      ? `${prof.nombreProfesional} ${prof.apellidoProfesional}`
      : `Mat. ${t.matriculaProfesional}`;

    return `
      <tr>
        <td>${t.fechaTurno}</td>
        <td>${t.horaTurno}</td>
        <td>${nombreProf}</td>
        <td>${t.status}</td>
      </tr>
    `;
  }).join('');
}

renderPerfil();
renderTurnos();

