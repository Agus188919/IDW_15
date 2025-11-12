import { initializeLocalStorage } from './initLS.js';

const PROFESIONALES = 'profesionales';
const carouselInner = document.querySelector('.carousel-inner');

/**
 * RECUPERAMOS LA INFORMACION DE LOS PROFESIONALES
 * ALMACENADOS EN EL LOCALSTORAGE
 * 
 * @param {*} key 
 * @returns 
 */
function getStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * ACTUALIZAMOS EL CARROUSEL QUE MUESTRA
 * LOS PROFESIONALES ALMACENADOS EN EL LOCALSTORAGE
 * 
 * @returns 
 */
function renderCarousel() {
    if (!carouselInner) {
        return;
    }
    const profesionales = getStorageData(PROFESIONALES);
    carouselInner.innerHTML = '';
    for (let i = 0; i < profesionales.length; i += 3) {
        const group = profesionales.slice(i, i + 3);
        const isActive = i === 0 ? 'active' : '';
        const cardsHTML = group.map(profesional => {
            const isFemale = profesional.nombreProfesional.toLowerCase().endsWith('a');
            const prefix = isFemale ? 'Dra.' : 'Dr.';
            const fullName = `${prefix} ${profesional.nombreProfesional} ${profesional.apellidoProfesional}`;
            return `
                <div class="col-12 col-md-4 mb-4 d-flex">
                <div class="card h-100 w-100">
                    <img src="${profesional.imagenProfesional}" class="card-img-top" alt="${fullName}">
                    <div class="card-body d-flex flex-column"> 
                    <h5 class="card-title title-clamp-2">${fullName} - ${profesional.especialidadAlta}</h5>
                    <p class="card-text clamp-3">${profesional.infoProfesional}</p>
                    
                    <button class="btn btn-primary btn-card mt-auto" 
                            data-action="agendar" 
                            data-id="${profesional.matricula}">
                        Agendar Turno
                    </button>

                    </div>
                </div>
                </div>
                `;
        }).join('');
        carouselInner.innerHTML += `
                    <div class="carousel-item ${isActive}">
                    <div class="container">
                        <div class="row justify-content-center">
                        ${cardsHTML}
                        </div>
                    </div>
                    </div>
                `;
    }
}

/**
 * SE LE DA FUNCIONALIDAD AL BTN DE AGENDAR CITA
 * AL MEDICO SELECCIONADO Y SE ALMANCENA LA 
 * INFORMACION DEL MEDICO PARA REGISTRAR UN TURNO
 * 
 * @param {*} event 
 * @returns 
 */
function agendarDesdeCarousel(event) {
    const target = event.target;
    if (target.dataset.action !== 'agendar') {
        return;
    }
    const matricula = Number(target.dataset.id);
    if (!matricula) {
        return;
    }
    const profesionales = getStorageData(PROFESIONALES);
    const prof = profesionales.find(p => p.matricula === matricula);
    if (!prof) {
        return;
    }
    localStorage.setItem('profesionalSeleccionado', JSON.stringify(prof));
    const pacienteActivo = localStorage.getItem('pacienteActivo');
    if (pacienteActivo) {
        window.location.href = './src/mi-perfil.html#pedir-turno';
    } else {
        window.location.href = './src/login-pacientes.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorage();
    renderCarousel();
    if (carouselInner) {
        carouselInner.addEventListener('click', agendarDesdeCarousel);
    }
});