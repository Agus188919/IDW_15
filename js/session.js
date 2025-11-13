document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('nav-auth-item');
    const adminBtn = document.getElementById('admin-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (!authLink || !adminBtn || !logoutBtn) {
        return;
    }

    const pacienteActivo = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');
    const profesionalActivo = JSON.parse(localStorage.getItem('profesionalActivo') || 'null');
    const adminToken = sessionStorage.getItem('accessToken');
    let rootPath = '.';
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        rootPath = './src';
    }
    if (adminToken) {
        authLink.textContent = 'Panel Admin';
        authLink.href = `${rootPath}/administrador-dashboard.html`;
        authLink.removeAttribute('target');
        logoutBtn.classList.remove('d-none');
    } else if (profesionalActivo) {
        authLink.textContent = `Hola, Dr. ${profesionalActivo.nombreProfesional}`;
        authLink.href = `${rootPath}/medico-perfil.html`;
        authLink.removeAttribute('target');
        logoutBtn.classList.remove('d-none');
    } else if (pacienteActivo) {
        authLink.textContent = `Hola, ${pacienteActivo.nombrePaciente}`;
        authLink.href = `${rootPath}/mi-perfil.html`;
        authLink.removeAttribute('target');
        logoutBtn.classList.remove('d-none');
    } else {
        authLink.textContent = 'Ingreso';
        authLink.href = `${rootPath}/login-inicial.html`;
        authLink.setAttribute('target', '_blank');
        logoutBtn.classList.add('d-none');
    }

    logoutBtn.addEventListener('click', () => {
        if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            return;
        }

        localStorage.removeItem('pacienteActivo');
        localStorage.removeItem('profesionalActivo');
        sessionStorage.removeItem('accessToken');
        const homePath = (rootPath === './src') ? 'index.html' : '../index.html';
        window.location.href = homePath;
    });
});