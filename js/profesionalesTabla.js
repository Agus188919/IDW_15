const STORAGE_KEY = 'profesionales';
const OBRA_SOCIAL = {
  "1": "Osde",
  "2": "Swiss Medical",
  "3": "Galeno",
  "4": "Medifé",
  "5": "Medicus",
};

/**
 * PARSEO DE 
 * @param {*} value 
 * @returns 
 */
function parseOS(value) {
  if (Array.isArray(value)) return value.map(Number).filter(Boolean);
  if (typeof value === 'number') return [value];
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !Number.isNaN(n));
  }
  return [];
}
/**
 * 
 * @param {*} value 
 * @returns 
 */
function formatOS(value) {
  const ids = parseOS(value);
  if (!ids.length) return '—';
  return ids
    .map(id => OBRA_SOCIAL[id] ?? `#${id}`)
    .join(', ');
}

/**
 * 
 */
(function seedIfNeeded() {
  const exists = localStorage.getItem(STORAGE_KEY);
  if (!exists && typeof PROFESIONALES !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PROFESIONALES));
  }
})();


const $tbody = document.getElementById('tabla-profesionales');
const $search = document.getElementById('search-input');

const currencyAR = (n) =>
  Number(n).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const getAll = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function renderTable(rows) {
  $tbody.innerHTML = rows.map(p => `
    <tr>
      <td><span class="badge text-bg-secondary">${p.matricula}</span></td>
      <td>${p.nombreProfesional} ${p.apellidoProfesional}</td>
      <td>${p.especialidadAlta}</td>
      <td>${formatOS(p.osProfesional)}</td>
      <td class="text-end">${currencyAR(p.valorConsulta)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-primary" data-id="${p.matricula}" data-action="ver">
          Ver
        </button>
      </td>
    </tr>
  `).join('');
}
renderTable(getAll());

$search.addEventListener('input', () => {
  const q = $search.value.trim().toLowerCase();
  const filtered = getAll().filter(p => {
    const texto = `${p.matricula} ${p.nombreProfesional} ${p.apellidoProfesional} ${p.especialidadAlta}`.toLowerCase();
    return texto.includes(q);
  });
  renderTable(filtered);
});
const modalAgendarBtn = document.getElementById('modal-agendar-btn');
if (modalAgendarBtn) {
  modalAgendarBtn.addEventListener('click', () => {
    const pacienteActivo = localStorage.getItem('pacienteActivo');
    if (pacienteActivo) {
      window.location.href = 'mi-perfil.html#pedir-turno';
    } else {
      window.location.href = 'login-pacientes.html';
    }
  });
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-action="ver"]');
  if (!trigger) {
    return;
  }
  e.preventDefault();
  const idAttr = trigger.dataset.id;
  const idStr = String(idAttr).trim();
  const prof = getAll().find(p => String(p.matricula).trim() === idStr);
  if (!prof) {
    console.warn('No encontré profesional con id:', idAttr, getAll());
    return;
  }
  localStorage.setItem('profesionalSeleccionado', JSON.stringify(prof));
  const titulo = document.getElementById('modalVerTitulo');
  const body = document.getElementById('modalVerBody');
  titulo.textContent = `${prof.nombreProfesional} ${prof.apellidoProfesional} • ${prof.especialidadAlta}`;
  body.innerHTML = `
    <div class="d-flex gap-3">
      <p class="mb-1"><strong>Matrícula:</strong> ${prof.matricula}</p>
      <p class="mb-1"><strong>Obra social:</strong> ${formatOS(prof.osProfesional)}</p>
      <p class="mb-1"><strong>Valor consulta:</strong> ${currencyAR(prof.valorConsulta)}</p>
    </div>
    <hr>
    <p class="mb-0">${prof.infoProfesional}</p>
  `;
  new bootstrap.Modal(document.getElementById('modalVerProfesional')).show();
});
