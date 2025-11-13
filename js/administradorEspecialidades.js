export class AdministradorEspecialidades {
    constructor() {
        this.STORAGE_KEY = 'especialidades';
        this.form = document.getElementById('addEspecialidadForm');
        this.tbody = document.getElementById('especialidades-tbody');
        this.inputNombre = document.getElementById('admin-nombre-especialidad');
        this.inputIdOculto = document.getElementById('edit-especialidad-id');
        this.submitButton = this.form.querySelector('button[type="submit"]');
    }

    init() {
        if (!this.tbody || !this.form) {
            console.error("No se encontraron los elementos del DOM para Especialidades.");
            return;
        }
        this.renderEspecialidades();
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.tbody.addEventListener('click', this.handleTableClick.bind(this));
    }
    /**
     * RECUPERAMOS LOS DATOS DE ESPECIALIDADES ALMACENADAS EN
     * EL LOCALSTORAGE
     * 
     * @returns Especialidades almacenadas en el localStorage
     */
    getStorageData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    /**
     * ACTUALIZAMOS ESPECIALIDADES ALMACENADAS EN EL LOCALSTORAGE
     * @param {*} data 
     */
    setStorageData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * CREAMOS UNA NUEVA ESPECIALIDAD Y ACTUALIZAMOS LA TABLA
     * 
     * @returns Nueva Fila de especialidad
     */
    renderEspecialidades() {
        const especialidades = this.getStorageData();
        this.tbody.innerHTML = "";

        if (especialidades.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-muted">No hay especialidades registradas.</td></tr>';
            return;
        }

        especialidades.forEach(esp => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${esp.id}</td>
                <td>${esp.nombre}</td>
                <td class="text-center">
                    <button class="btn-editar" data-id="${esp.id}" data-nombre="${esp.nombre}">Editar</button>
                    <button class="btn-eliminar" data-id="${esp.id}">Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(fila);
        });
    }

    /**
     * CREAMOS Y ACTUALIZAMOS ESPECIALIDADES DESDE
     * EL ADMINISTRADOR DASHBOARD
     * 
     * @param {*} event 
     * @returns 
     */
    handleSubmit(event) {
        event.preventDefault();
        const nombre = this.inputNombre.value.trim();
        const id = this.inputIdOculto.value;

        if (!nombre) {
            alert("El nombre no puede estar vacío.");
            return;
        }
        if (id) {
            this.updateEspecialidad(Number(id), nombre);
        } else {
            this.createEspecialidad(nombre);
        }
        this.form.reset();
        this.inputIdOculto.value = "";
        this.submitButton.textContent = "Agregar Especialidad";
        this.submitButton.classList.remove('btn-warning');
        this.submitButton.classList.add('btn-primary');
    }

    /**
     * CREAMOS NUEVA ESPECIALIDAD Y ALMACENAMOS EN
     * EL LOCALSTORAGE
     * 
     * @param {*} nombre 
     */
    createEspecialidad(nombre) {
        const especialidades = this.getStorageData();
        //SE ARMA LOGICA DE GENERACION DE IDS
        const maxId = especialidades.reduce((max, esp) => (esp.id > max ? esp.id : max), 0);
        const newId = maxId + 1;
        const nuevaEspecialidad = {
            id: newId,
            nombre: nombre
        };
        especialidades.push(nuevaEspecialidad);
        this.setStorageData(especialidades);
        this.renderEspecialidades();
    }

    /**
     * ACTUALIZAMOS, ALMACENAMOS ESPECIALIDAD EN
     * EL LOCALSTORAGE JUNTO CON LA ACTULIZACION
     * DE LA TABLA
     * 
     * @param {*} id 
     * @param {*} nombre 
     */
    updateEspecialidad(id, nombre) {
        const especialidades = this.getStorageData();
        const index = especialidades.findIndex(esp => esp.id === id);

        if (index !== -1) {
            especialidades[index].nombre = nombre;
            this.setStorageData(especialidades);
            this.renderEspecialidades();
        }
    }

    /**
     * ELIMINAMOS LA ESPECIALIDAD JUNTO CON 
     * LA ACTUALIZACION AL LOCALSTORAGE
     * @param {*} id 
     * @returns 
     */
    eliminarEspecialidad(id) {
        if (!confirm(`¿Desea eliminar la especialidad con ID ${id}?`)) return;

        let especialidades = this.getStorageData();
        especialidades = especialidades.filter(esp => esp.id !== id);
        this.setStorageData(especialidades);
        this.renderEspecialidades();
    }

    /**
     * ESCUCHADOR DE EVENTOS DE ELIMINACION Y 
     * EDICION POR MEDIO DE LOS BTNS
     * 
     * @param {*} event 
     */
    handleTableClick(event) {
        const target = event.target;
        const id = Number(target.dataset.id);
        if (target.classList.contains('btn-eliminar')) {
            this.eliminarEspecialidad(id);
        }
        if (target.classList.contains('btn-editar')) {
            const nombre = target.dataset.nombre;
            this.cargarDatosEnFormulario(id, nombre);
        }
    }

    /**
     * CARGA INICIAL AL FORMULARIO DE ESPECIALIDADES
     * 
     * @param {*} id 
     * @param {*} nombre 
     */
    cargarDatosEnFormulario(id, nombre) {
        this.inputNombre.value = nombre;
        this.inputIdOculto.value = id;
        this.submitButton.textContent = `Actualizar (ID: ${id})`;
        this.submitButton.classList.remove('btn-primary');
        this.submitButton.classList.add('btn-warning');
        this.inputNombre.focus();
    }
}