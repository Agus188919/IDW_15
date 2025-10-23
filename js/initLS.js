import { PROFESIONALES, PACIENTES, ADMINISTRADORES } from './info.js';

export function initializeLocalStorage() {
    const profesionalesIsPresent = localStorage.getItem("profesionales");
    const pacientesIsPresent = localStorage.getItem("pacientes");
    const administradorIsPresent = localStorage.getItem("administradores");


    if (!profesionalesIsPresent || profesionalesIsPresent == []) {
        localStorage.setItem("profesionales", JSON.stringify(PROFESIONALES));
    }
    if (!pacientesIsPresent || pacientesIsPresent == []) {
        localStorage.setItem("pacientes", JSON.stringify(PACIENTES));
    }
    if (!administradorIsPresent || administradorIsPresent == []) {
        localStorage.setItem("administradores", JSON.stringify(ADMINISTRADORES));
    }
}



