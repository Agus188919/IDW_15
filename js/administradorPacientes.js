//MAPA PARA REALIZAR CONVERSION ID -> NOMBRE
const OS_MAP = {
    "1": "Osde",
    "2": "Swiss Medical",
    "3": "Galeno",
    "4": "Medifé",
    "5": "Medicus"
};

export class PacienteAdministrador {
    constructor() {
        this.PACIENTES = 'pacientes';
        this.form = document.getElementById('addPacienteForm');
        this.tbody = document.getElementById('pacientes-tbody');
        this.inputDni = document.getElementById('admin-dni-paciente');
        this.inputNombre = document.getElementById('admin-nombre-paciente');
        this.inputApellido = document.getElementById('admin-apellido-paciente');
        this.inputOS = document.getElementById('admin-os-paciente');
        this.inputEmail = document.getElementById('admin-email-paciente');
        this.inputPass = document.getElementById('admin-pass-paciente');
    }

    /**
     * INICIALIZAMOS EL MODULO  Y ACTUALIZAMOS
     * 
     * @returns 
     */
    init() {
        if (!this.tbody || !this.form) {
            return;
        }
        this.renderPacientes();
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.form.addEventListener('submit', this.addPaciente.bind(this));
        this.tbody.addEventListener('click', this.actionForPaciente.bind(this));
    }

    /**
     * RECUPERAMOS LA INFORMACION DE LOS PACIENTES 
     * ALMACENADAS EN EL LOCALSTORAGE
     * 
     * @param {*} key 
     * @returns 
     */
    getStorageData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    /**
     * ACTUALIZAMOS LOS VALORES DEL PACIENTE
     * AL LOCALSTORAGE
     * 
     * @param {*} key 
     * @param {*} data 
     */
    setStorageData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * CREAMOS NUEVO PACIENTE Y LO ACTUALIZAMOS AL
     * LOCALSTORAGE
     * 
     * @param {} event 
     * @returns 
     */
    addPaciente(event) {
        event.preventDefault();

        const newPaciente = {
            dniPaciente: Number(this.inputDni.value),
            nombrePaciente: this.inputNombre.value,
            apellidoPaciente: this.inputApellido.value,
            os: this.inputOS.value,
            emailPaciente: this.inputEmail.value,
            passwordPaciente: this.inputPass.value
        };
        const pacientes = this.getStorageData(this.PACIENTES);
        const dniExiste = pacientes.find(p => p.dniPaciente === newPaciente.dniPaciente);
        //VALIDACION DNI DUPLICADO
        if (dniExiste) {
            alert('Error: El DNI ingresado ya se encuentra registrado.');
            return;
        }
        pacientes.push(newPaciente);
        this.setStorageData(this.PACIENTES, pacientes);
        this.renderPacientes();
        this.form.reset();
    }

    /**
     * REDIBUJAMOS EN LA TABLA DE PACIENTES
     * UNA VEZ ACTUALIZADA
     * @returns 
     */
    renderPacientes() {
        const pacientes = this.getStorageData(this.PACIENTES);
        this.tbody.innerHTML = ""; // Limpiar tabla

        if (pacientes.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-muted">No hay pacientes registrados.</td></tr>';
            return;
        }

        pacientes.forEach(p => {
            const fila = document.createElement("tr");
            const osNombre = OS_MAP[p.os] || 'No especificada';

            fila.innerHTML = `
                <td>${p.dniPaciente}</td>
                <td>${p.nombrePaciente}</td>
                <td>${p.apellidoPaciente}</td>
                <td>${p.emailPaciente}</td>
                <td>${osNombre}</td>
                <td class="text-center">
                    <button class="btn-editar" data-id="${p.dniPaciente}">Editar</button>
                    <button class="btn-eliminar" data-id="${p.dniPaciente}">Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(fila);
        });
    }

    /**
     * ACCIONES DE CLIENTE POR MEDIO DE LOS
     * BOTONES DE ELIMINACION Y EDICION
     * 
     * @param {*} event 
     * @returns 
     */
    actionForPaciente(event) {
        const target = event.target;
        const dni = Number(target.dataset.id);
        if (!dni) return;

        if (target.classList.contains('btn-editar')) {
            this.editarPaciente(dni);
        }
        if (target.classList.contains('btn-eliminar')) {
            this.eliminarPaciente(dni);
        }
    }

    /**
     * EDICION Y ACTUALIZACION DE PACIENTES Y 
     * REDIBUJADO DE TABLA DE PACIENTES
     * 
     * @param {*} dni 
     * @returns 
     */
    editarPaciente(dni) {
        let pacientes = this.getStorageData(this.PACIENTES);
        const paciente = pacientes.find(p => p.dniPaciente === dni);
        if (!paciente) return;
        const nuevoEmail = prompt("Editar Email:", paciente.emailPaciente);
        const nuevaPass = prompt("Editar Contraseña:");
        if (nuevoEmail !== null) {
            paciente.emailPaciente = nuevoEmail;
            if (nuevaPass) {
                paciente.passwordPaciente = nuevaPass;
            }
            this.setStorageData(this.PACIENTES, pacientes);
            this.renderPacientes();
        }
    }

    /**
     * ELIMINAMOS Y ACTUALIZAMOS LOS DATOS DE LOS PACIENTES
     * ALMACENADOS EN EL LOCALSTORAGE Y REDIBUJAMOS LA 
     * TABLA DIBUJADA PARA QUE CONTENGA LOS DATOS ACTULIZADOS
     * 
     * @param {*} dni 
     * @returns 
     */
    eliminarPaciente(dni) {
        if (!confirm(`¿Desea eliminar al paciente con DNI ${dni}?`)) return;

        let pacientes = this.getStorageData(this.PACIENTES);
        pacientes = pacientes.filter(p => p.dniPaciente !== dni);
        this.setStorageData(this.PACIENTES, pacientes);
        this.renderPacientes(); // Re-dibuja la tabla actualizada
    }
}