// Datos iniciales, para tener algo al inicio:
const MEDICOS_INICIALES = [
    { id: 1, nombre: "Laura Pérez", especialidad: "Cardiología", telefono: "3412345678" },
    { id: 2, nombre: "Juan Gómez", especialidad: "Neurología", telefono: "3418765432" },
];

// Con esto inicia el local stroage:
if (!localStorage.getItem("medicos")) {
    localStorage.setItem("medicos", JSON.stringify(MEDICOS_INICIALES));
}

// Obtener médicos del local storage:
function obtenerMedicos() {
    return JSON.parse(localStorage.getItem("medicos")) || [];
}

// Renderizar tabla
function listarMedicos() {
    const medicos = obtenerMedicos();
    const tbody = document.querySelector("#tabla-medicos tbody");
    tbody.innerHTML = "";

    medicos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
      <td>${m.id}</td>
      <td>${m.nombre}</td>
      <td>${m.especialidad}</td>
      <td>${m.telefono}</td>
      <td>
        <button class="btn-editar" onclick="editarMedico(${m.id})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarMedico(${m.id})">Eliminar</button>
      </td>
    `;
        tbody.appendChild(fila);
    });
}

// Crear una nueva entrada con el médico:
function agregarMedico(e) {
    e.preventDefault();
    const medicos = obtenerMedicos();

    const nuevo = {
        id: Date.now(),
        nombre: document.getElementById("nombre").value.trim(),
        especialidad: document.getElementById("especialidad").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
    };

    if (!nuevo.nombre || !nuevo.especialidad || !nuevo.telefono) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    medicos.push(nuevo);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    listarMedicos();
    e.target.reset();
}

// Editar un médico que ya exista:
function editarMedico(id) {
    const medicos = obtenerMedicos();
    const medico = medicos.find(m => m.id === id);
    if (!medico) return;

    const nuevoNombre = prompt("Editar nombre:", medico.nombre);
    const nuevaEspecialidad = prompt("Editar especialidad:", medico.especialidad);
    const nuevoTelefono = prompt("Editar teléfono:", medico.telefono);

    if (nuevoNombre && nuevaEspecialidad && nuevoTelefono) {
        medico.nombre = nuevoNombre;
        medico.especialidad = nuevaEspecialidad;
        medico.telefono = nuevoTelefono;
        localStorage.setItem("medicos", JSON.stringify(medicos));
        listarMedicos();
    }
}

// Eliminar un médico:
function eliminarMedico(id) {
    if (!confirm("¿Desea eliminar este médico?")) return;
    const medicos = obtenerMedicos().filter(m => m.id !== id);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    listarMedicos();
}

// Iniciar todo:
document.addEventListener("DOMContentLoaded", () => {
    listarMedicos();
    document.getElementById("form-medico").addEventListener("submit", agregarMedico);
});
