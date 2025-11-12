const token = sessionStorage.getItem('accessToken');

if (!token) {
    window.location.href = '../src/administrador.html';
}