const profesional = JSON.parse(localStorage.getItem('profesionalActivo') || 'null');
const PROFESIONALES_KEY = 'profesionales';

const OS_MAP = {
    "1": "Osde", "2": "Swiss Medical", "3": "Galeno",
    "4": "Medifé", "5": "Medicus"
};

if (!profesional) {
    alert('Debes iniciar sesión como profesional para ver tu perfil.');
    window.location.href = './login-profesional.html';
}

const formPerfil = document.getElementById('form-perfil-profesional');
const inputMatricula = document.getElementById('perfil-matricula');
const inputNombre = document.getElementById('perfil-nombre');
const inputApellido = document.getElementById('perfil-apellido');
const inputEspecialidad = document.getElementById('perfil-especialidad');
const inputValor = document.getElementById('perfil-valor');
const inputInfo = document.getElementById('perfil-info');
const inputOS = document.getElementById('perfil-os');
const btnEditar = document.getElementById('btn-editar-perfil');
const btnGuardar = document.getElementById('btn-guardar-perfil');
const btnCancelar = document.getElementById('btn-cancelar-perfil');
const inputImagen = document.getElementById('perfil-imagen');
const camposEditables = [inputEspecialidad, inputValor, inputInfo];

/**
 * PARSEAMOS EL OS CONTRA EL ID RECIBIDO PARA
 * CONOCER LA OBRA SOCIAL A MOSTRAR
 * 
 * @param {*} value 
 * @returns 
 */
function parseOS(value) {
    if (Array.isArray(value)) return value.map(Number).filter(Boolean);
    if (typeof value === 'number') return [value];
    if (typeof value === 'string') {
        return value
            .split(',')
            .map(s => Number(s.trim()))
            .filter(n => !Number.isNaN(n));
    }
    return [];
}

/**
 * CONVERSION DE ARRAY DE IDS DE OS A UN STRING DE NOMBRES
 * 
*/
function formatOS(values) {
    const ids = parseOS(values); // <-- Usa la función ayudante
    if (!ids.length) return 'No especificadas';
    return ids
        .map(id => OS_MAP[id] || 'Desconocida')
        .join(', ');
}

/**
 * CARGA DE LOS DATOS DE PROFESIONALES ACTIVOS EN EL FORMULARIO
 */
function renderPerfil() {
    inputMatricula.value = profesional.matricula;
    inputNombre.value = profesional.nombreProfesional;
    inputApellido.value = profesional.apellidoProfesional;
    inputEspecialidad.value = profesional.especialidadAlta;
    inputValor.value = profesional.valorConsulta;
    inputInfo.value = profesional.infoProfesional;
    inputOS.value = formatOS(profesional.osProfesional);
    if (profesional.imagenProfesional) {
        inputImagen.src = profesional.imagenProfesional;
    } else {
        //IMAGEN GENERICA SI NO TENEMOS IMAGEN ASIGNADA
        inputImagen.src = "https://via.placeholder.com/150";
    }
}

/**
 * SE HABILITAN CAMPOS PARA EDICION
 */
function habilitarEdicion() {
    camposEditables.forEach(input => input.disabled = false);
    btnGuardar.disabled = false;
    btnCancelar.classList.remove('d-none');
    btnEditar.disabled = true;
}

/**
 * CANCELAMOS LA EDICION Y REVERTIMOS LOS CAMBIOS
 * A REALIZAR
 */
function cancelarEdicion() {
    renderPerfil(); // Restaura los valores originales
    camposEditables.forEach(input => input.disabled = true);
    btnGuardar.disabled = true;
    btnCancelar.classList.add('d-none');
    btnEditar.disabled = false;
}

/**
 * GUARDAMOS LOS CAMBIOS EN EL LOCALSTORAGE
 * @param {*} e 
 * @returns 
 */
function guardarPerfil(e) {
    e.preventDefault();
    const profesionales = JSON.parse(localStorage.getItem(PROFESIONALES_KEY) || '[]');
    const idx = profesionales.findIndex(p => p.matricula === profesional.matricula);
    if (idx === -1) {
        alert('Error: No se pudo encontrar al profesional en la base de datos.');
        return;
    }
    const profesionalActualizado = {
        ...profesionales[idx],
        especialidadAlta: inputEspecialidad.value,
        valorConsulta: Number(inputValor.value),
        infoProfesional: inputInfo.value,
    };
    profesionales[idx] = profesionalActualizado;
    localStorage.setItem(PROFESIONALES_KEY, JSON.stringify(profesionales));
    localStorage.setItem('profesionalActivo', JSON.stringify(profesionalActualizado)); // ¡Importante!
    alert('Perfil actualizado correctamente.');
    cancelarEdicion();
}

document.addEventListener('DOMContentLoaded', () => {
    btnEditar.addEventListener('click', habilitarEdicion);
    btnCancelar.addEventListener('click', cancelarEdicion);
    formPerfil.addEventListener('submit', guardarPerfil);
    renderPerfil();
});