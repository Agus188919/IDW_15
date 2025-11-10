document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('nav-auth-item');
    const adminBtn = document.getElementById('admin-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (!authLink || !adminBtn || !logoutBtn) {
        return;
    }

    const pacienteActivo = JSON.parse(localStorage.getItem('pacienteActivo') || 'null');
    const adminToken = sessionStorage.getItem('accessToken');
    let rootPath = '.';
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        rootPath = './src';
    }
    if (pacienteActivo) {
        authLink.textContent = `Hola, ${pacienteActivo.nombrePaciente}`;
        authLink.href = `${rootPath}/mi-perfil.html`;
        authLink.removeAttribute('target');
        logoutBtn.classList.remove('d-none');

    } else if (adminToken) {
        authLink.textContent = 'Panel Admin';
        authLink.href = `${rootPath}/admin-dashboard.html`;
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
        sessionStorage.removeItem('accessToken');
        const homePath = (rootPath === './src') ? 'index.html' : '../index.html';
        window.location.href = homePath;
    });
});