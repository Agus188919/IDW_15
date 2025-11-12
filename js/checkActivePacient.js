function iniciarSesionPaciente(event) {
    const pacienteActivo = localStorage.getItem('pacienteActivo')

    if (pacienteActivo) {
        window.location.href = "./src/mi-perfil.html";
    } else {
        window.location.href = './src/login-pacientes.html'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogPaciente = document.querySelector('.js-agendar');
    if (formLogPaciente) {
        formLogPaciente.addEventListener('click', iniciarSesionPaciente);
    }
});


