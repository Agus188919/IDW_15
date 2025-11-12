/**
 * CAMBIO DE MODOS. SETEO Y ACTUALIZACION
 * DE ICONOS DE NAVBAR
 * 
 * @returns 
 */
function setDarkModeToggle() {
    const darkBtn = document.getElementById('darkBtn');
    if (!darkBtn) return;

    function updateButtonText() {
        if (document.body.classList.contains("dark-mode")) {
            darkBtn.textContent = "☀️";
        } else {
            darkBtn.textContent = "🌙";
        }
    }

    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        updateButtonText();
    });

    updateButtonText();
}

document.addEventListener('DOMContentLoaded', setDarkModeToggle);