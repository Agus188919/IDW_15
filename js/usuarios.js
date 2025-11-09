// usuarios.js - Gestión de usuarios desde DummyJSON API
// Este módulo NO interfiere con localStorage del proyecto

let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 10;

// Elementos del DOM
const tbody = document.getElementById('usuarios-tbody');
const searchInput = document.getElementById('searchInput');
const genderFilter = document.getElementById('genderFilter');
const ageFilter = document.getElementById('ageFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const totalUsersSpan = document.getElementById('totalUsers');
const filteredUsersSpan = document.getElementById('filteredUsers');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const paginationContainer = document.getElementById('pagination');

// Cargar usuarios al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecutar si estamos en la página de usuarios
    if (tbody && searchInput) {
        fetchUsers();
        setupEventListeners();
    }
});

// Configurar event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', applyFilters);
    genderFilter.addEventListener('change', applyFilters);
    ageFilter.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
}

// Obtener usuarios desde la API
async function fetchUsers() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch('https://dummyjson.com/users?limit=100');
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        allUsers = data.users;
        filteredUsers = [...allUsers];

        updateCounters();
        renderUsers();
        renderPagination();
        
        showLoading(false);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        showError();
        showLoading(false);
    }
}

// Mostrar/ocultar spinner de carga
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('d-none');
    } else {
        loadingSpinner.classList.add('d-none');
    }
}

// Mostrar/ocultar mensaje de error
function showError() {
    errorMessage.classList.remove('d-none');
}

function hideError() {
    errorMessage.classList.add('d-none');
}

// Aplicar filtros
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const gender = genderFilter.value;
    const ageRange = ageFilter.value;

    filteredUsers = allUsers.filter(user => {
        // Filtro de búsqueda (nombre o email)
        const matchesSearch = 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);

        // Filtro de género
        const matchesGender = !gender || user.gender === gender;

        // Filtro de edad
        let matchesAge = true;
        if (ageRange) {
            const age = user.age;
            if (ageRange === '18-30') matchesAge = age >= 18 && age <= 30;
            else if (ageRange === '31-50') matchesAge = age >= 31 && age <= 50;
            else if (ageRange === '51+') matchesAge = age >= 51;
        }

        return matchesSearch && matchesGender && matchesAge;
    });

    currentPage = 1;
    updateCounters();
    renderUsers();
    renderPagination();
}

// Limpiar filtros
function clearFilters() {
    searchInput.value = '';
    genderFilter.value = '';
    ageFilter.value = '';
    applyFilters();
}

// Actualizar contadores
function updateCounters() {
    totalUsersSpan.textContent = allUsers.length;
    filteredUsersSpan.textContent = filteredUsers.length;
}

// Renderizar usuarios en la tabla
function renderUsers() {
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const usersToShow = filteredUsers.slice(startIndex, endIndex);

    if (usersToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <p class="mb-0 text-muted">No se encontraron usuarios</p>
                </td>
            </tr>
        `;
        return;
    }

    usersToShow.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

// Crear fila de usuario (sin datos sensibles)
function createUserRow(user) {
    const tr = document.createElement('tr');
    
    const age = user.age || 'N/A';
    
    tr.innerHTML = `
        <td>${user.id}</td>
        <td>
            <img src="${user.image}" alt="${user.firstName}" 
                 class="user-avatar rounded-circle" 
                 onerror="this.src='https://via.placeholder.com/50'">
        </td>
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
        <td>${age}</td>
        <td>
            <span class="badge ${user.gender === 'male' ? 'bg-info' : 'bg-warning'}">
                ${user.gender === 'male' ? 'Masculino' : 'Femenino'}
            </span>
        </td>
        <td>${user.phone || 'N/A'}</td>
        <td>${user.address?.city || 'N/A'}</td>
        <td class="text-center">
            <button class="btn btn-sm btn-primary" onclick="viewUserDetails(${user.id})">
                Ver Detalles
            </button>
        </td>
    `;

    return tr;
}

// Ver detalles del usuario (sin datos sensibles)
window.viewUserDetails = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    const modalBody = document.getElementById('modalUsuarioBody');
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4 text-center mb-3">
                <img src="${user.image}" alt="${user.firstName}" 
                     class="img-fluid rounded-circle mb-3" 
                     style="max-width: 150px;"
                     onerror="this.src='https://via.placeholder.com/150'">
                <h5>${user.firstName} ${user.lastName}</h5>
                <span class="badge ${user.gender === 'male' ? 'bg-info' : 'bg-warning'}">
                    ${user.gender === 'male' ? 'Masculino' : 'Femenino'}
                </span>
            </div>
            <div class="col-md-8">
                <h6 class="border-bottom pb-2 mb-3">Información de Contacto</h6>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Teléfono:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Edad:</strong> ${user.age || 'N/A'} años</p>
                
                <h6 class="border-bottom pb-2 mb-3 mt-4">Dirección</h6>
                <p><strong>Ciudad:</strong> ${user.address?.city || 'N/A'}</p>
                <p><strong>Estado:</strong> ${user.address?.state || 'N/A'}</p>
                <p><strong>Código Postal:</strong> ${user.address?.postalCode || 'N/A'}</p>
                
                <h6 class="border-bottom pb-2 mb-3 mt-4">Información Adicional</h6>
                <p><strong>Universidad:</strong> ${user.university || 'N/A'}</p>
                <p><strong>Compañía:</strong> ${user.company?.name || 'N/A'}</p>
                <p><strong>Departamento:</strong> ${user.company?.department || 'N/A'}</p>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}

// Renderizar paginación
function renderPagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Botón anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
            Anterior
        </a>
    `;
    paginationContainer.appendChild(prevLi);

    // Números de página
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="#" onclick="changePage(${i}); return false;">
                ${i}
            </a>
        `;
        paginationContainer.appendChild(li);
    }

    // Botón siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
            Siguiente
        </a>
    `;
    paginationContainer.appendChild(nextLi);
}

// Cambiar página
window.changePage = function(page) {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderUsers();
    renderPagination();
    
    // Scroll suave hacia la tabla
    const adminSection = document.querySelector('.admin-medicos');
    if (adminSection) {
        adminSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}