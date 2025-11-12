const PROFESIONALES = 'profesionales';
let pacienteImagenBase64 = null;

/**
 * RECUPERAMOS LA INFORAMCION DE LOS PROFESIONALES
 * ALMACENADOS EN EL LOCALSTORAGE
 * 
 * @param {*} key 
 * @returns 
 */
function getStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * SETEAMOS Y ACTUALIZAMOS LA INFORMACION DE LOS PROFESIONALES
 * EN EL LOCALSTORAGE
 * 
 * @param {*} key 
 * @param {*} data 
 */
function setStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * AGREGAMOS Y ACTUALIZAMOS LA IAMGEN DEL 
 * PROFESIONAL SEGUN LAS ESPECIFICACIONES
 * PEDIDAS
 * 
 * @param {*} event 
 * @returns 
 */
function setImgProfesional(event) {
    const file = event.target.files[0];
    if (!file) {
        pacienteImagenBase64 = null;
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert("Error: La imagen es muy grande (máximo 2MB).");
        event.target.value = null;
        pacienteImagenBase64 = null;
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        pacienteImagenBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * AGREGAMOS Y ACTUALIZAMOS EL PROFESIONAL EN EL 
 * LOCALSTORAGE 
 * 
 * @returns 
 */
function addProfesional() {
    const selectElement = document.getElementById('osProfesional');
    const osValues = Array.from(selectElement.selectedOptions).map(option => option.value);
    const newProfesional = {
        matricula: Number(document.getElementById('matricula').value),
        nombreProfesional: document.getElementById('nombreProfesional').value,
        apellidoProfesional: document.getElementById('apellidoProfesional').value,
        osProfesional: osValues,
        especialidadAlta: document.getElementById('especialidadAlta').value,
        valorConsulta: document.getElementById('valorConsulta').value,
        infoProfesional: document.getElementById('infoProfesional').value,
        passwordProfesional: document.getElementById('passwordProfesional')?.value,
        imagenProfesional: pacienteImagenBase64
    };

    const profesionales = getStorageData(PROFESIONALES);
    const matriculaExiste = profesionales.find(p => p.matricula === newProfesional.matricula);
    if (matriculaExiste) {
        alert('Error: La matrícula ingresada ya se encuentra registrada.');
        return null;
    }
    profesionales.push(newProfesional);
    setStorageData(PROFESIONALES, profesionales);
    return newProfesional;
}

/**
 * SI EL REGISTRO FUE EXITOSO MOSTRAMOS EL PERFIL
 * DE PROFESIONAL PROPIO
 * 
 * @param {*} event 
 */
function registroProfesional(event) {
    event.preventDefault();

    const nuevoProfesional = addProfesional();
    if (nuevoProfesional) {
        localStorage.setItem('profesionalActivo', JSON.stringify(nuevoProfesional));
        window.location.href = "../src/medico-perfil.html";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formAltaProfesional = document.getElementById('alta-portal-profesional');
    const inputImagen = document.getElementById('imagenPaciente');
    if (formAltaProfesional) {
        formAltaProfesional.addEventListener('submit', registroProfesional);
    }
    if (inputImagen) {
        inputImagen.addEventListener('change', setImgProfesional);
    }
});