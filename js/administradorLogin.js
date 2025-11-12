async function validarAdministrador(event) {
    event.preventDefault();
    const username = document.getElementById('userAdmin').value;
    const password = document.getElementById('passwordAdmin').value;
    if (!username || !password) {
        alert("El usuario y la contraseña no deben estar vacios.");
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Credenciales inválidas');
        }
        const data = await response.json();
        sessionStorage.setItem('accessToken', data.accessToken);
    } catch (error) {
        alert(`NO TIENES PERMISO DE INGRESO: ${error.message}`);
    }
    finally {
        window.location.href = "../src/administrador-dashboard.html";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formAdmin = document.getElementById('administrador');
    if (formAdmin) {
        formAdmin.addEventListener('submit', validarAdministrador);
    }
});