import { PROFESIONALES, PACIENTES, OBRAS_SOCIALES, ESPECIALIDADES } from './info.js';

export function initializeLocalStorage() {
    const PROFESIONALES_LOCAL = localStorage.getItem("profesionales");
    const PACIENTES_LOCAL = localStorage.getItem("pacientes");
    const OBRAS_SOCIALES_LOCAL = localStorage.getItem("obrasSociales");
    const ESPECIALIDADES_LOCAL = localStorage.getItem("especialidades");

    if (!PROFESIONALES_LOCAL || PROFESIONALES_LOCAL == []) {
        localStorage.setItem("profesionales", JSON.stringify(PROFESIONALES));
    }

    if (!PACIENTES_LOCAL || PACIENTES_LOCAL == []) {
        localStorage.setItem("pacientes", JSON.stringify(PACIENTES));
    }

    if (!OBRAS_SOCIALES_LOCAL || OBRAS_SOCIALES_LOCAL == []) {
        localStorage.setItem("obrasSociales", JSON.stringify(OBRAS_SOCIALES));
    }

    if (!ESPECIALIDADES_LOCAL || ESPECIALIDADES_LOCAL == "[]") {
        localStorage.setItem("especialidades", JSON.stringify(ESPECIALIDADES));
    }
}



