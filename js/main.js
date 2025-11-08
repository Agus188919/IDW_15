// js/main.js
import { AppManager } from './AppManager.js';
import { AppointmentManager } from './Appointments.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new AppManager();
  app.init();

  setupNavbarAuth();
  setupAgendarButtons();
});

function setupNavbarAuth() {
  const navAuthItem = document.getElementById('nav-auth-item');
  if (!navAuthItem) return;

  const paciente = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');
  const profesional = JSON.parse(localStorage.getItem('profesionalActivo') || 'null');

  
  const isInsideSrc = window.location.pathname.includes('/src/');
  
  const base = isInsideSrc ? '.' : './src';

  
  if (!paciente && !profesional) {
    navAuthItem.innerHTML = `<a class="nav-link" href="${base}/login-inicial.html">Ingreso</a>`;
    return;
  }

  const nombre = paciente
    ? paciente.nombrePaciente
    : profesional.nombreProfesional;

  navAuthItem.innerHTML = `
    <div class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" role="button"
         data-bs-toggle="dropdown" aria-expanded="false">
        Hola, ${nombre}
      </a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="${base}/mi-perfil.html">Mi perfil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="logout-link">Cerrar sesión</a></li>
      </ul>
    </div>
  `;

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('pacienteActivo');
      localStorage.removeItem('profesionalActivo');
      window.location.href = isInsideSrc ? '../index.html' : './index.html';
    });
  }
}

// misma validación para header y footer
function setupAgendarButtons() {
  const botones = document.querySelectorAll('.js-agendar');
  if (!botones.length) return;

  
  const isInsideSrc = window.location.pathname.includes('/src/');
  const base = isInsideSrc ? '.' : './src';

  botones.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

    
      const paciente = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');
      const profesional = JSON.parse(localStorage.getItem('profesionalActivo') || 'null');

      const estaLogueado = !!(paciente || profesional);

      const urlLogin = `${base}/login-inicial.html`;
      const urlTurnos = `${base}/buscar-doctor.html`; 

      window.location.href = estaLogueado ? urlTurnos : urlLogin;
    });
  });
}

/* REFACTORIZAR DARK
const dark = document.getElementById("darkModeToggle");

function closeMenu() {
  menu.classList.remove('open');
  btn.classList.remove('is-open');
  btn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('noscroll');
}


document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => {
  if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
});
dark.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    this.textContent = "☀️";
  } else {
    this.textContent = "🌙";
  }
});*/