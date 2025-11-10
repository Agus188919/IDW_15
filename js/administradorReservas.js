export class AdministradorReserva {
    constructor() {
        this.APPOINTMENTS_KEY = 'appointments';
        this.PACIENTES_KEY = 'pacientes';
        this.PROFESIONALES_KEY = 'profesionales';
        this.tbody = document.getElementById('reservas-tbody');
    }

    init() {
        if (!this.tbody) {
            return;
        }
        this.renderReservas();
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.tbody.addEventListener('change', this.handleStatusChange.bind(this));
    }

    /**
     * RECUPERAMOS LA INFORMACION DE LAS RESERVAS 
     * ALMACENADAS EN EL LOCALSTORAGE
     * 
     * @param {*} key 
     * @returns 
     */
    getStorageData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    /**
     * ACTUALIZAMOS LA INFORMACION DE LAS
     * RESERVAS AL LOCALSTORAGE
     * 
     * @param {*} key 
     * @param {*} data 
     */
    setStorageData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * ACTUALIZAMOS LA TABLA QUE MUESTRA LA INFORMACION
     * DE LAS RESERVAS EN EL PANEL DE ADMINISTRADOR
     * 
     * @returns 
     */
    renderReservas() {
        const reservas = this.getStorageData(this.APPOINTMENTS_KEY);
        const pacientes = this.getStorageData(this.PACIENTES_KEY);
        const profesionales = this.getStorageData(this.PROFESIONALES_KEY);
        const pacienteMap = new Map(pacientes.map(p => [p.dniPaciente, `${p.nombrePaciente} ${p.apellidoPaciente}`]));
        const profesionalMap = new Map(profesionales.map(p => [p.matricula, `${p.nombreProfesional} ${p.apellidoProfesional}`]));
        this.tbody.innerHTML = "";
        if (reservas.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="7" class="text-center p-4 text-muted">No hay reservas registradas.</td></tr>';
            return;
        }
        reservas.forEach(reserva => {
            const fila = document.createElement("tr");
            const nombrePaciente = pacienteMap.get(reserva.dniPaciente) || `DNI ${reserva.dniPaciente}`;
            const nombreProfesional = profesionalMap.get(reserva.matriculaProfesional) || `Mat. ${reserva.matriculaProfesional}`;
            const valorFormateado = (reserva.valorFinal || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            fila.innerHTML = `
                <td class="small">${reserva.id.substring(0, 8)}...</td>
                <td>${reserva.fechaTurno}</td>
                <td>${reserva.horaTurno}</td>
                <td>${nombrePaciente}</td>
                <td>${nombreProfesional}</td>
                <td class="text-end">${valorFormateado}</td>
                <td class="text-center">
                    ${this.createStatusSelect(reserva.id, reserva.status)}
                </td>
            `;
            this.tbody.appendChild(fila);
        });
    }

    /**
     * CREAMOS LA SELECCION  DE ESTADO PARA APROBAR, RECHAZAR O
     * MANTENER PENDIENTE EL ESTADO DE LOS TURNOS SOLICITADOS
     * 
     * @param {*} id 
     * @param {*} currentStatus 
     * @returns 
     */
    createStatusSelect(id, currentStatus) {
        const statuses = ['Pendiente', 'Aceptado', 'Rechazado'];
        let options = statuses.map(status => {
            const selected = (status === currentStatus) ? 'selected' : '';
            return `<option value="${status}" ${selected}>${status}</option>`;
        }).join('');
        return `<select class="form-select form-select-sm select-estado" data-id="${id}">${options}</select>`;
    }

    handleStatusChange(event) {
        const target = event.target;
        if (target.classList.contains('select-estado')) {
            const id = target.dataset.id;
            const newStatus = target.value;
            this.updateStatus(id, newStatus);
            const fila = target.closest('tr');
            fila.classList.add('fila-guardada');
            //AGREGAMOS UNA ANIMACION PARA CONFIRMAR EL CAMBIO
            setTimeout(() => {
                fila.classList.remove('fila-guardada');
            }, 1200);
        }
    }

    /**
     * ACTUALIZAMOS EL ESTADO DE LOS TURNOS DE LA RESERVAS
     * MOSTRADAS DESDE EL PANEL DE ADMINISTRACION
     * @param {*} id 
     * @param {*} newStatus 
     */
    updateStatus(id, newStatus) {
        let reservas = this.getStorageData(this.APPOINTMENTS_KEY);
        const index = reservas.findIndex(r => r.id === id);

        if (index !== -1) {
            reservas[index].status = newStatus;
            this.setStorageData(this.APPOINTMENTS_KEY, reservas);
            console.log(`Reserva ${id} actualizada a ${newStatus}`);
        }
    }
}