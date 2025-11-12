import { initializeLocalStorage } from './initLS.js';

let PACIENTES = 'pacientes';

/**
 * RECUPERAMOS LOS PACIENTES ALMACENADOS EN EL
 * LOCALSTORAGE
 * 
 * @param {*} key 
 * @returns 
 */
function getStorageData(key) {
    initializeLocalStorage();
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * INICIAMOS LA SESION DEL USUARIO
 * CORROBORANDO QUE CUMPLA CON LAS CREDENCIALES
 * DE LOS DATOS ALMACENADOS EN EL LOCALSTORAGE
 * 
 * @param {*} event 
 */
function iniciarSesionPaciente(event) {
    event.preventDefault();
    const dniPaciente = Number(document.getElementById('dniLog').value);
    const passwordPaciente = document.getElementById('passwordLog').value;
    const pacientes = getStorageData(PACIENTES);
    const found = pacientes.find(paciente =>
        paciente.passwordPaciente === passwordPaciente && paciente.dniPaciente === dniPaciente
    );
    if (found) {
        localStorage.setItem('pacienteActivo', JSON.stringify({
            dniPaciente: found.dniPaciente,
            nombrePaciente: found.nombrePaciente,
            apellidoPaciente: found.apellidoPaciente,
            os: found.os,
            emailPaciente: found.emailPaciente
        }));
        window.location.href = "../src/mi-perfil.html";
    } else {
        alert('VERIFICA LOS DATOS INGRESADOS');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogPaciente = document.getElementById('log-paciente');
    if (formLogPaciente) {
        formLogPaciente.addEventListener('submit', iniciarSesionPaciente);
    }
});