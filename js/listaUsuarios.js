export const ListaUsuario = {
    allUsers: [],
    filteredUsers: [],
    currentPage: 1,
    usersPerPage: 10,
    tbody: null,
    searchInput: null,
    genderFilter: null,
    ageFilter: null,
    clearFiltersBtn: null,
    totalUsersSpan: null,
    filteredUsersSpan: null,
    loadingSpinner: null,
    errorMessage: null,
    paginationContainer: null,

    /**
     * INICIALIZAMOS LA LISTA DE USUARIOS A MOSTRART
     * RECUPERANDO INFORAMCION DE LA TABLA
     * 
     * @returns 
     */
    init() {
        this.tbody = document.getElementById('usuarios-tbody');
        this.searchInput = document.getElementById('searchInput');
        this.genderFilter = document.getElementById('genderFilter');
        this.ageFilter = document.getElementById('ageFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.totalUsersSpan = document.getElementById('totalUsers');
        this.filteredUsersSpan = document.getElementById('filteredUsers');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.paginationContainer = document.getElementById('pagination');
        if (!this.tbody || !this.searchInput) {
            return;
        }
        this.fetchUsers();
        this.setupEventListeners();
        window.viewUserDetails = this.viewUserDetails.bind(this);
        window.changePage = this.changePage.bind(this);
    },

    //MANEJADOR DE EVENTOS
    setupEventListeners() {
        this.searchInput.addEventListener('input', this.applyFilters.bind(this));
        this.genderFilter.addEventListener('change', this.applyFilters.bind(this));
        this.ageFilter.addEventListener('change', this.applyFilters.bind(this));
        this.clearFiltersBtn.addEventListener('click', this.clearFilters.bind(this));
    },

    async fetchUsers() {
        try {
            this.showLoading(true);
            this.hideError();
            const response = await fetch('https://dummyjson.com/users?limit=100');
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await response.json();
            this.allUsers = data.users;
            this.filteredUsers = [...this.allUsers];
            this.updateCounters();
            this.renderUsers();
            this.renderPagination();
            this.showLoading(false);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            this.showError();
            this.showLoading(false);
        }
    },

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('d-none');
        } else {
            this.loadingSpinner.classList.add('d-none');
        }
    },
    showError() {
        this.errorMessage.classList.remove('d-none');
    },
    hideError() {
        this.errorMessage.classList.add('d-none');
    },

    /**
     * APLICAMOS FILRTOS A LA LISTA DE USUARIOS
     * CONSUMIDOS DE LA API DUMMYJSON
     */
    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const gender = this.genderFilter.value;
        const ageRange = this.ageFilter.value;

        this.filteredUsers = this.allUsers.filter(user => {
            const matchesSearch =
                user.firstName.toLowerCase().includes(searchTerm) ||
                user.lastName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm);
            const matchesGender = !gender || user.gender === gender;
            let matchesAge = true;
            if (ageRange) {
                const age = user.age;
                if (ageRange === '18-30') matchesAge = age >= 18 && age <= 30;
                else if (ageRange === '31-50') matchesAge = age >= 31 && age <= 50;
                else if (ageRange === '51+') matchesAge = age >= 51;
            }
            return matchesSearch && matchesGender && matchesAge;
        });

        this.currentPage = 1;
        this.updateCounters();
        this.renderUsers();
        this.renderPagination();
    },
    /**
     * LIMPIAMOS FILTROS
     */
    clearFilters() {
        this.searchInput.value = '';
        this.genderFilter.value = '';
        this.ageFilter.value = '';
        this.applyFilters();
    },

    updateCounters() {
        this.totalUsersSpan.textContent = this.allUsers.length;
        this.filteredUsersSpan.textContent = this.filteredUsers.length;
    },

    renderUsers() {
        this.tbody.innerHTML = '';
        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const endIndex = startIndex + this.usersPerPage;
        const usersToShow = this.filteredUsers.slice(startIndex, endIndex);

        if (usersToShow.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4"><p class="mb-0 text-muted">No se encontraron usuarios</p></td></tr>`;
            return;
        }
        usersToShow.forEach(user => {
            const row = this.createUserRow(user);
            this.tbody.appendChild(row);
        });
    },

    createUserRow(user) {
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
    },

    viewUserDetails(userId) {
        const user = this.allUsers.find(u => u.id === userId);
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
    },

    renderPagination() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
        this.paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${this.currentPage - 1}); return false;">Anterior</a>`;
        this.paginationContainer.appendChild(prevLi);

        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
            this.paginationContainer.appendChild(li);
        }

        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${this.currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${this.currentPage + 1}); return false;">Siguiente</a>`;
        this.paginationContainer.appendChild(nextLi);
    },

    changePage(page) {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.renderUsers();
        this.renderPagination();
        const adminSection = document.getElementById('usuarios-panel');
        if (adminSection) {
            adminSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};