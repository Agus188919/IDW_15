const PROFESIONALES = 'profesionales';

/**
 * RECUPERAMOS LA INFORMACION DE LOS PROFESIONALES
 * ALMACENADA EN EL LOCALSTORAGE
 * 
 * @param {*} key 
 * @returns 
 */
function getStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * VALIDAMOS EL PROFESIONAL Y GUARDAMOS EL ESTADO DE 
 * LOGIN PARA EL USUARIO ESPECIFICADO
 * 
 * @param {*} event 
 */
function validarProfesional(event) {
    event.preventDefault();
    const matriculaLogin = Number(document.getElementById('matriculaLogin').value);
    const passwordProfesionalLogin = document.getElementById('passwordProfesionalLogin').value;
    const profesionales = getStorageData(PROFESIONALES);
    const found = profesionales.find(profesional =>
        profesional.passwordProfesional === passwordProfesionalLogin && profesional.matricula === matriculaLogin
    );
    if (found) {
        localStorage.setItem('profesionalActivo', JSON.stringify(found));
        window.location.href = "../src/medico-perfil.html";
    } else {
        localStorage.removeItem('profesionalActivo');
        alert('VERIFICA LOS DATOS INGRESADOS');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogProfesional = document.getElementById('logProfesional');

    if (formLogProfesional) {
        formLogProfesional.addEventListener('submit', validarProfesional);
    }
});