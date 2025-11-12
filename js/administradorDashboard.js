const OS_MAP = {
    "1": "Osde",
    "2": "Swiss Medical",
    "3": "Galeno",
    "4": "Medifé",
    "5": "Medicus",
    "6": "Particular"
};

export class AdministradorDashboard {
    constructor() {
        this.PROFESIONALES = 'profesionales';
        this.addProfesionalForm = document.getElementById('addProfesional');
        this.tableAdministrador = document.getElementById("medicos-tbody-placeholder");
        this.imagenInput = document.getElementById('imagenPaciente');
        this.pacienteImagenBase64 = null;
    }

    init() {
        this.renderAdministrador();
        this.bindEventListeners();
    }

    bindEventListeners() {
        if (this.addProfesionalForm) {
            this.addProfesionalForm.addEventListener('submit', this.addProfesionalForAdministrador.bind(this));
        }
        if (this.tableAdministrador) {
            this.tableAdministrador.addEventListener('click', this.actionForAdministrador.bind(this));
        }
        if (this.imagenInput) {
            this.imagenInput.addEventListener('change', this.setImgProfesional.bind(this));
        }
        $('.selectpicker').selectpicker();
    }

    /**
     * GETTER DE LOCALSTORAGE
     * 
     * @param {KEY} key 
     * @returns INFORMACION ALMACENADA EN EL LOCALSTORAGE
     */
    getStorageData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    /**
     * SETTER AL LOCALSTORAGE
     * 
     * @param {*} key 
     * @param {*} data 
     */
    setStorageData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * REALIZA LA CONVERSION DE ENUMERADO DE OS A NOMBRE
     * 
     * @param {*} values 
     * @returns 
     */
    getOsName(values) {
        if (values == null) return;
        if (!Array.isArray(values)) {
            values = [values];
        }
        const names = values.map(value => {
            return OS_MAP[value] || "No especificada";
        });
        return names.join(', ');
    }
    /**
     * SETEAMOS IMAGEN PARA NUEVOS USUARIOS
     * 
     * @param {*} event 
     * @returns 
     */
    setImgProfesional(event) {
        const file = event.target.files[0];
        if (!file) {
            this.pacienteImagenBase64 = null;
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Error: La imagen es muy grande (máximo 2MB).");
            event.target.value = null;
            this.pacienteImagenBase64 = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.pacienteImagenBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    /**
     * ACTUALIZAMOS LA TABLA QUE MUESTRA LA INFORMACION
     * DE LOS MEDICOS ALMACENADOS EN EL LOCALSTORAGE
     * 
     * @returns 
     */
    renderAdministrador() {
        if (!this.tableAdministrador) {
            console.error('No se encontró el <tbody> de médicos.');
            return;
        }
        const profesionales = this.getStorageData(this.PROFESIONALES);
        this.tableAdministrador.innerHTML = "";
        profesionales.forEach(m => {
            const fila = document.createElement("tr");
            const osNombres = this.getOsName(m.osProfesional);
            fila.innerHTML = `
                <td>${m.matricula}</td>
                <td>${m.nombreProfesional}</td>
                <td>${m.apellidoProfesional}</td>
                <td>${osNombres}</td>
                <td>${m.especialidadAlta}</td>
                <td>${m.valorConsulta}</td>
                <td>${m.infoProfesional}</td>
                <td>
                    <button class="btn-editar" data-id="${m.matricula}">Editar</button>
                    <button class="btn-eliminar" data-id="${m.matricula}">Eliminar</button>
                </td>
            `;
            this.tableAdministrador.appendChild(fila);
        });
    }

    /**
     * ALMACENAMOS UN NUEVO PROFESIONAL CON LA INFORMACION OBTENIDA EN 
     * LA TABLA AL LOCALSTORAGE
     * 
     */
    addProfesional() {
        const selectElement = document.getElementById('osProfesional');
        const osValues = Array.from(selectElement.selectedOptions).map(option => option.value);
        const newProfesional = {
            matricula: Number(document.getElementById('matricula').value),
            nombreProfesional: document.getElementById('nombreProfesional').value,
            apellidoProfesional: document.getElementById('apellidoProfesional').value,
            osProfesional: osValues,
            especialidadAlta: document.getElementById('especialidadAlta').value,
            valorConsulta: document.getElementById('valorConsulta').value,
            infoProfesional: document.getElementById('infoProfesional').value,
            imagenProfesional: this.pacienteImagenBase64
        };
        const profesionales = this.getStorageData(this.PROFESIONALES);
        profesionales.push(newProfesional);
        this.setStorageData(this.PROFESIONALES, profesionales);
    }
    /**
     * MANEJADOR PARA CADA CARGA DE PROFESIONAL, SE BUSCA EL EVENTO
     * NO SE PROPAGUE, GENERAR EL NUEVO PROFESIONAL, RENDERIZAR Y
     * RESETEAR EL FORMULARIO. 
     * 
     * POR OTRO LADO CONSTRUIMOS EL JQUERY DINAMICO DE BOOTSTRAP 
     * PARA EL COMPORTAMIENTO DINAMICO Y LIMPIAMOS LA IMAGEN
     * @param {*} event 
     */
    addProfesionalForAdministrador(event) {
        event.preventDefault();
        this.addProfesional();
        this.renderAdministrador();
        event.target.reset();
        $('.selectpicker').selectpicker('refresh');
    }
    /**
     * ACCIONES QUE SERAN EJECUTADAS POR MEDIO DE 
     * LOS BOTONES DE EDITAR Y ELIMINAR
     * 
     * @param {*} event 
     * @returns 
     */
    actionForAdministrador(event) {
        const target = event.target;
        const matricula = Number(target.dataset.id);
        if (!matricula) return;
        if (target.classList.contains('btn-editar')) {
            this.editarProfesional(matricula);
        }
        if (target.classList.contains('btn-eliminar')) {
            this.eliminarProfesional(matricula);
        }
    }
    /**
     * ACCION DE EDICION DE PROFESIONAL ALMACENADAO
     * 
     * @param {*} id 
     * @returns 
     */
    editarProfesional(id) {
        const profesionales = this.getStorageData(this.PROFESIONALES);
        const profesional = profesionales.find(p => p.matricula === id);
        if (!profesional) return;
        const nuevoNombre = prompt("Editar nombre:", profesional.nombreProfesional);
        const nuevoApellido = prompt("Editar apellido:", profesional.apellidoProfesional);
        const nuevaEspecialidad = prompt("Editar especialidad:", profesional.especialidadAlta);
        const nuevoValor = prompt("Editar valor consulta:", profesional.valorConsulta);
        if (nuevoNombre !== null && nuevoApellido !== null && nuevaEspecialidad !== null && nuevoValor !== null) {
            profesional.nombreProfesional = nuevoNombre;
            profesional.apellidoProfesional = nuevoApellido;
            profesional.especialidadAlta = nuevaEspecialidad;
            profesional.valorConsulta = nuevoValor;
            this.setStorageData(this.PROFESIONALES, profesionales);
            this.renderAdministrador();
        }
    }
    /**
     * ACCION DE ELIMINACION DE PROFESIONAL ALMACENADO
     * 
     * @param {*} id 
     * @returns 
     */
    eliminarProfesional(id) {
        if (!confirm("¿Desea eliminar este profesional?")) return;
        let profesionales = this.getStorageData(this.PROFESIONALES);
        profesionales = profesionales.filter(p => p.matricula !== id);
        this.setStorageData(this.PROFESIONALES, profesionales);
        this.renderAdministrador();
    }
}