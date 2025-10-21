import { PROFESIONALES, PACIENTES, ADMINISTRADORES } from './info.js';

export function initializeLocalStorage() {
    const profesionalesIsPresent = localStorage.getItem("profesionales");
    const pacientesIsPresent = localStorage.getItem("pacientes");
    const administradorIsPresent = localStorage.getItem("administradores");


    if (!profesionalesIsPresent) {
        localStorage.setItem("profesionales", JSON.stringify(PROFESIONALES));
    }
    if (!pacientesIsPresent) {
        localStorage.setItem("pacientes", JSON.stringify(PACIENTES));
    }
    if (!administradorIsPresent) {
        localStorage.setItem("administradores", JSON.stringify(ADMINISTRADORES));
    }
}



