import { initializeLocalStorage } from './initLS.js';

const OS_MAP = {
    "1": "Osde",
    "2": "Swiss Medical",
    "3": "Galeno",
    "4": "Medifé",
    "5": "Medicus",
};
export class AppManager {

    constructor() {
        this.PACIENTES = 'pacientes';
        this.PROFESIONALES = 'profesionales';
        this.ADMINISTRADOR = 'administradores';

        this.formPaciente = document.getElementById('alta-portal-paciente');
        this.formProfesional = document.getElementById('alta-portal-profesional');
        this.logPaciente = document.getElementById('log-paciente');
        this.logProfesional = document.getElementById('logProfesional');
        this.administrador = document.getElementById('administrador');
        this.staffMedico = document.getElementById('form-medico');
        this.addProfesionalForm = document.getElementById('addProfesional');
        this.tableAdministrador = document.querySelector("#tabla-medicos tbody");
        this.carouselInner = document.querySelector('.carousel-inner');
    }

    init() {
        initializeLocalStorage();

        this.renderCarousel();
        this.renderAdministrador();
        this.bindEventListeners();
    }

    bindEventListeners() {
        if (this.formPaciente) {
            this.formPaciente.addEventListener('submit', this.addPaciente.bind(this));
        }
        if (this.logPaciente) {
            this.logPaciente.addEventListener('submit', this.iniciarSesionPaciente.bind(this));
        }
        if (this.formProfesional) {
            this.formProfesional.addEventListener('submit', this.registroProfesional.bind(this));
        }
        if (this.logProfesional) {
            this.logProfesional.addEventListener('submit', this.validarProfesional.bind(this));
        }
        if (this.administrador) {
            this.administrador.addEventListener('submit', this.validarAdministrador.bind(this));
        }
        if (this.staffMedico) {
            this.staffMedico.addEventListener('submit', this.addProfesionalForAdministrador.bind(this));
        }
        if (this.addProfesionalForm) {
            this.addProfesionalForm.addEventListener('submit', this.addProfesionalForAdministrador.bind(this));
        }
        if (this.tableAdministrador) {
            this.tableAdministrador.addEventListener('click', this.actionForAdministrador.bind(this));
        }
    }


    getStorageData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }


    setStorageData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }


    addPaciente(event) {
        event.preventDefault();

        const newPaciente = {
            dniPaciente: document.getElementById('dniPaciente').value,
            nombrePaciente: document.getElementById('nombrePaciente').value,
            apellidoPaciente: document.getElementById('apellidoPaciente').value,
            os: document.getElementById('OS').value,
            emailPaciente: document.getElementById('emailPaciente').value,
            passwordPaciente: document.getElementById('passwordPaciente').value
        };

        const pacientes = this.getStorageData(this.PACIENTES);
        pacientes.push(newPaciente);
        this.setStorageData(this.PACIENTES, pacientes);

        window.location.href = "../src/confirm.html";
    }

    iniciarSesionPaciente(event) {
        event.preventDefault();

        const dniPaciente = document.getElementById('dniLog').value;
        const passwordPaciente = document.getElementById('passwordLog').value;
        const pacientes = this.getStorageData(this.PACIENTES);

        const found = pacientes.find(paciente =>
            paciente.passwordPaciente === passwordPaciente && paciente.dniPaciente === dniPaciente
        );

        if (found) {
            window.location.href = "../src/page-in-progress.html";
        } else {
            alert('VERIFICA LOS DATOS INGRESADOS');
        }
    }

    registroProfesional(event) {
        event.preventDefault();
        this.addProfesional();
        window.location.href = "../src/confirm.html";
    }

    validarProfesional(event) {
        event.preventDefault();

        const matriculaLogin = document.getElementById('matriculaLogin').value;
        const passwordProfesionalLogin = document.getElementById('passwordProfesionalLogin').value;
        const profesionales = this.getStorageData(this.PROFESIONALES);

        const found = profesionales.find(profesional =>
            profesional.passwordProfesional === passwordProfesionalLogin && profesional.matricula === matriculaLogin
        );

        if (found) {
            window.location.href = "../src/page-in-progress.html";
        } else {
            alert('VERIFICA LOS DATOS INGRESADOS');
        }
    }

    validarAdministrador(event) {
        event.preventDefault();

        const userAdmin = document.getElementById('userAdmin').value;
        const passwordAdmin = document.getElementById('passwordAdmin').value;
        const administradores = this.getStorageData(this.ADMINISTRADOR);

        const found = administradores.find(admin =>
            admin.userName === userAdmin && admin.password == passwordAdmin
        );

        if (found) {
            window.location.href = "../src/medicos.html";
        } else {
            alert("NO TIENES PERMISO DE INGRESO");
        }
    }

    addProfesionalForAdministrador(event) {
        event.preventDefault();
        this.addProfesional();
        this.renderAdministrador();
        event.target.reset();
    }

    actionForAdministrador(event) {
        const target = event.target;
        const matricula = target.dataset.id;

        if (!matricula) {
            return;
        }

        if (target.classList.contains('btn-editar')) {
            this.editarProfesional(matricula);
        }

        if (target.classList.contains('btn-eliminar')) {
            this.eliminarProfesional(matricula);
        }
    }


    addProfesional() {
        const selectElement = document.getElementById('osProfesional');
        const osValues = Array.from(selectElement.selectedOptions).map(option => option.value);
        const newProfesional = {
            matricula: document.getElementById('matricula').value,
            nombreProfesional: document.getElementById('nombreProfesional').value,
            apellidoProfesional: document.getElementById('apellidoProfesional').value,
            osProfesional: osValues,
            especialidadAlta: document.getElementById('especialidadAlta').value,
            valorConsulta: document.getElementById('valorConsulta').value,
            infoProfesional: document.getElementById('infoProfesional').value,
            passwordProfesional: document.getElementById('passwordProfesional')?.value,
            imagenProfesional: document.getElementById('imagenProfesional')?.value
        };

        const profesionales = this.getStorageData(this.PROFESIONALES);
        profesionales.push(newProfesional);
        this.setStorageData(this.PROFESIONALES, profesionales);
    }


renderCarousel() {
        if (!this.carouselInner) return;

        const profesionales = this.getStorageData(this.PROFESIONALES);
        this.carouselInner.innerHTML = '';

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
      <div class="card-body">
        <h5 class="card-title title-clamp-2">${fullName} - ${profesional.especialidadAlta}</h5>
        <p class="card-text clamp-3">${profesional.infoProfesional}</p>
        <a href="./src/page-in-progress.html" class="btn btn-primary btn-card">Ver más</a>
      </div>
    </div>
  </div>
`;
            }).join('');

            this.carouselInner.innerHTML += `
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


    renderAdministrador() {
        if (!this.tableAdministrador) {
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
              <td>${m.imagenProfesional}</td>
              <td>
                <button class="btn-editar" data-id="${m.matricula}">Editar</button>
                <button class="btn-eliminar" data-id="${m.matricula}">Eliminar</button>
              </td>
            `;
            this.tableAdministrador.appendChild(fila);
        });
    }

    eliminarProfesional(id) {
        if (!confirm("¿Desea eliminar este profesional?")) {
            return;
        }

        const matricula = Number(id);
        let profesionales = this.getStorageData(this.PROFESIONALES);

        profesionales = profesionales.filter(p => p.matricula !== matricula);

        this.setStorageData(this.PROFESIONALES, profesionales);
        this.renderAdministrador();
    }

    editarProfesional(id) {
        const matricula = Number(id);
        const profesionales = this.getStorageData(this.PROFESIONALES);
        const profesional = profesionales.find(p => p.matricula === matricula);

        if (!profesional) {
            return;
        }

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

    getOsName(values) {
        if (values == null) {
            return;
        }
        if (!Array.isArray(values)) {
            values = [values];
        }
        const names = values.map(value => {
            return OS_MAP[value] || "No especificada";
        });

        return names.join(', ');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new AppManager();
    app.init();
});