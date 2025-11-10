const PACIENTES = localStorage.getItem("pacientes");
/**
 * RECUPERAMOS LA INFORMACION DE LOS PACIONES DEL
 * LOCALSTORAGE
 * 
 * @param {*} key 
 * @returns 
 */
function getStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * ACTUALIZAMOS LA INFORAMCION DE LOS PACIENTES
 * AL LOCALSTORAGE
 * @param {*} key 
 * @param {*} data 
 */
function setStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * AGREMOS UN NUEVO PACIENTE DESDE EL ALTA 
 * DE PACIENTES NUEVOS DEL LOGUEO
 * 
 * @param {*} event 
 * @returns 
 */
function addPaciente(event) {
    event.preventDefault();

    const newPaciente = {
        dniPaciente: Number(document.getElementById('dniPaciente').value),
        nombrePaciente: document.getElementById('nombrePaciente').value,
        apellidoPaciente: document.getElementById('apellidoPaciente').value,
        os: document.getElementById('OS').value,
        emailPaciente: document.getElementById('emailPaciente').value,
        passwordPaciente: document.getElementById('passwordPaciente').value
    };

    const pacientes = getStorageData(PACIENTES);
    const dniExiste = pacientes.find(p => p.dniPaciente === newPaciente.dniPaciente);
    if (dniExiste) {
        alert('Error: El DNI ingresado ya se encuentra registrado.');
        return;
    }
    pacientes.push(newPaciente);
    setStorageData(PACIENTES, pacientes);
    localStorage.setItem('pacienteActivo', JSON.stringify(newPaciente));
    window.location.href = "../src/mi-perfil.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const formAltaPaciente = document.getElementById('alta-portal-paciente');
    if (formAltaPaciente) {
        formAltaPaciente.addEventListener('submit', addPaciente);
    }
});