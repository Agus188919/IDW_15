import { AppointmentManager } from './Appointments.js';

const appointmentManager = new AppointmentManager();

const pacienteActivo = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');
const profesionalSeleccionado = JSON.parse(localStorage.getItem('profesionalSeleccionado') || 'null');

const titulo = document.getElementById('titulo-turno');
const form = document.getElementById('form-turno');
const inputFecha = document.getElementById('fechaTurno');
const inputHora = document.getElementById('horaTurno');

console.log('form:', form);
console.log('pacienteActivo:', pacienteActivo);
console.log('profesionalSeleccionado:', profesionalSeleccionado);


if (!pacienteActivo) {
  alert('Debes iniciar sesión como paciente para pedir un turno');
  window.location.href = './login-inicial.html';
}


if (!profesionalSeleccionado) {
  if (titulo) {
    titulo.textContent = 'Profesional no seleccionado';
  }
  alert('Primero debés elegir un profesional');
  window.location.href = './buscar-doctor.html';
} else {
  if (titulo) {
    titulo.textContent =
      `Turno con ${profesionalSeleccionado.nombreProfesional} ` +
      `${profesionalSeleccionado.apellidoProfesional} • ` +
      `${profesionalSeleccionado.especialidadAlta}`;
  }
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
      const nuevoTurno = appointmentManager.createAppointment({
        matriculaProfesional: profesionalSeleccionado.matricula,
        dniPaciente: pacienteActivo.dniPaciente,
        fechaTurno: inputFecha.value,
        horaTurno: inputHora.value
      });

      console.log('Turno creado:', nuevoTurno);
      alert('Turno creado correctamente');


      window.location.href = './buscar-doctor.html';
    } catch (err) {
      console.error('Error creando turno:', err);
      alert('Error al crear el turno. Revisá los datos.');
    }
  });
} else {
  console.error('No encontré el formulario #form-turno');
}
