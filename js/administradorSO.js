// js/adminObrasSociales.js

export class AdministradorOS {
    constructor() {
        this.STORAGE_KEY = 'obrasSociales';
        this.form = document.getElementById('addOSForm');
        this.tbody = document.getElementById('os-tbody');
        this.inputNombre = document.getElementById('admin-nombre-os');
        this.inputDesc = document.getElementById('admin-desc-os');
        this.inputPorcentaje = document.getElementById('admin-porcentaje-os');
        this.inputIdOculto = document.getElementById('edit-os-id');
        this.submitButton = this.form.querySelector('button[type="submit"]');
    }

    init() {
        if (!this.tbody || !this.form) {
            return;
        }
        this.renderObrasSociales();
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.tbody.addEventListener('click', this.handleTableClick.bind(this));
    }

    /**
     * RECUPERAMOS LOS VALORES DE LAS OBRAS SOCIALES
     * ALMACENADAS EN EL LOCALSTORAGE
     * 
     * @returns 
     */
    getStorageData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    /**
     * ACTUALIZAMOS LAS OBRAS SOCIALES AL LOCALSTORAGE
     * @param {*} data 
     */
    setStorageData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * REDIBUJAMOS LA TABLA DE OBRAS SOCIALES MOSTRADAS EN 
     * EL PANEL DE ADMINISTRACION
     * 
     * @returns 
     */
    renderObrasSociales() {
        const obrasSociales = this.getStorageData();
        this.tbody.innerHTML = "";
        if (obrasSociales.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-muted">No hay obras sociales registradas.</td></tr>';
            return;
        }
        obrasSociales.forEach(os => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${os.id}</td>
                <td>${os.nombre}</td>
                <td>${os.descripcion || 'N/A'}</td>
                <td class="text-center">${os.porcentaje}%</td>
                <td class="text-center">
                    <button class="btn-editar" data-id="${os.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${os.id}">Eliminar</button>
                </td>
            `;
            this.tbody.appendChild(fila);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const nombre = this.inputNombre.value.trim();
        const descripcion = this.inputDesc.value.trim();
        const porcentaje = parseFloat(this.inputPorcentaje.value);
        const id = this.inputIdOculto.value;
        if (!nombre || !descripcion || isNaN(porcentaje)) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }
        const data = { nombre, descripcion, porcentaje };
        if (id) {
            this.updateOS(Number(id), data);
        } else {
            this.createOS(data);
        }
        this.form.reset();
        this.inputIdOculto.value = "";
        this.submitButton.textContent = "Agregar Obra Social";
        this.submitButton.classList.remove('btn-warning');
        this.submitButton.classList.add('btn-primary');
    }

    /**
     * CREAMOS NUEVA OBRA SOCIAL GENERANDO UN ID
     * UNICO A PARTIR DE EL ULTIMO ID GENEDADO Y
     * ACTUALIZAMOS EL LOCALSTORAGE DE OS
     * 
     * @param {*} data 
     */
    createOS(data) {
        const obrasSociales = this.getStorageData();
        const maxId = obrasSociales.reduce((max, os) => (os.id > max ? os.id : max), 0);

        const nuevaOS = {
            id: maxId + 1,
            ...data
        };

        obrasSociales.push(nuevaOS);
        this.setStorageData(obrasSociales);
        this.renderObrasSociales();
    }

    /**
     * ACTUALIZAMOS LAS OBRAS SOCIALES QUE COINCIDAN
     * CON EL SELECCIONADO, ACTUALIZAMOS EL LOCALSTORAGE
     * Y REDIBUJAMOS LA TABLA
     * 
     * @param {*} id 
     * @param {*} data 
     */
    updateOS(id, data) {
        const obrasSociales = this.getStorageData();
        const index = obrasSociales.findIndex(os => os.id === id);

        if (index !== -1) {
            obrasSociales[index] = { ...obrasSociales[index], ...data };
            this.setStorageData(obrasSociales);
            this.renderObrasSociales();
        }
    }

    /**
     * ELIMINAMOS Y ACTUALIZAMOS EN EL LOCALSTORAGE
     * LA OBRA SOCIAL
     * 
     */
    eliminarOS(id) {
        if (!confirm(`¿Desea eliminar la Obra Social con ID ${id}?`)) return;

        let obrasSociales = this.getStorageData();
        obrasSociales = obrasSociales.filter(os => os.id !== id);
        this.setStorageData(obrasSociales);
        this.renderObrasSociales();
    }

    handleTableClick(event) {
        const target = event.target;
        const id = Number(target.dataset.id);
        if (target.classList.contains('btn-eliminar')) {
            this.eliminarOS(id);
        }
        if (target.classList.contains('btn-editar')) {
            this.cargarDatosEnFormulario(id);
        }
    }
    /**
     * CARGA DE DATOS EN LA TABLA DE ADMINISTRADOR
     * 
     * @param {*} id 
     * @returns 
     */
    cargarDatosEnFormulario(id) {
        const obrasSociales = this.getStorageData();
        const os = obrasSociales.find(os => os.id === id);
        if (!os) return;

        this.inputNombre.value = os.nombre;
        this.inputDesc.value = os.descripcion || '';
        this.inputPorcentaje.value = os.porcentaje;
        this.inputIdOculto.value = os.id;

        this.submitButton.textContent = `Actualizar (ID: ${id})`;
        this.submitButton.classList.remove('btn-primary');
        this.submitButton.classList.add('btn-warning');
        this.inputNombre.focus();
    }
}