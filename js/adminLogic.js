import { initializeLocalStorage } from './initLS.js';
import { AdministradorDashboard } from './administradorDashboard.js';
import { ListaUsuario } from './listaUsuarios.js';
import { PacienteAdministrador } from './administradorPacientes.js';
import { AdministradorEspecialidades } from './administradorEspecialidades.js';
import { AdministradorOS } from './administradorSO.js';
import { AdministradorReserva } from './administradorReservas.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeLocalStorage();
    const medicosTab = new AdministradorDashboard();
    medicosTab.init();
    //USUARIOS
    const usuariosTabBtn = document.getElementById('usuarios-tab');
    let usuariosTabInicializada = false;
    if (usuariosTabBtn) {
        usuariosTabBtn.addEventListener('shown.bs.tab', () => {
            if (!usuariosTabInicializada) {
                ListaUsuario.init();
                usuariosTabInicializada = true;
            }
        });
    }
    //PACIENTES
    const pacientesTabBtn = document.getElementById('pacientes-tab');
    let pacientesTabInicializado = false;
    if (pacientesTabBtn) {
        pacientesTabBtn.addEventListener('shown.bs.tab', () => {
            if (!pacientesTabInicializado) {
                const pacienteAdmin = new PacienteAdministrador();
                pacienteAdmin.init();
                pacientesTabInicializado = true;
            }
        });
    }
    //ESPECIALIDADES
    const especialidadesTabBtn = document.getElementById('especialidades-tab');
    let especialidadesTabInicializada = false;
    if (especialidadesTabBtn) {
        especialidadesTabBtn.addEventListener('shown.bs.tab', () => {
            if (!especialidadesTabInicializada) {
                const specialtyAdmin = new AdministradorEspecialidades();
                specialtyAdmin.init();
                especialidadesTabInicializada = true;
            }
        });
    }
    //OS
    const osTabBtn = document.getElementById('os-tab');
    let osTabInicializada = false;
    if (osTabBtn) {
        osTabBtn.addEventListener('shown.bs.tab', () => {
            if (!osTabInicializada) {
                const osAdmin = new AdministradorOS();
                osAdmin.init();
                osTabInicializada = true;
            }
        });
    }
    //RESERVAS
    const reservasTabBtn = document.getElementById('reservas-tab');
    let reservasTabInicializada = false;
    if (reservasTabBtn) {
        reservasTabBtn.addEventListener('shown.bs.tab', () => {
            if (!reservasTabInicializada) {
                const reservationAdmin = new AdministradorReserva();
                reservationAdmin.init();
                reservasTabInicializada = true;
            }
        });
    }
});