export class AppointmentManager {
    constructor(storageKey = 'appointments') {
        this.STORAGE_KEY = storageKey;
    }

    getStorageData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    setStorageData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    // crea un turno
    createAppointment({ matriculaProfesional, dniPaciente, fechaTurno, horaTurno }) {
        if (!matriculaProfesional || !dniPaciente || !fechaTurno || !horaTurno) {
            throw new Error('Faltan datos para crear el turno');
        }
        const profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
        const profesional = profesionales.find(p => p.matricula === Number(matriculaProfesional));
        const paciente = pacientes.find(p => p.dniPaciente === Number(dniPaciente));
        if (!profesional || !paciente) {
            console.error("No se encontró al profesional o al paciente.", { profesional, paciente });
            throw new Error('Error de datos: No se encontró al profesional o al paciente.');
        }
        const osPaciente = obrasSociales.find(os => os.id === Number(paciente.os));
        const valorConsultaBase = parseFloat(profesional.valorConsulta);
        let porcentajeDescuento = 0;
        let valorFinal;
        if (osPaciente) {
            porcentajeDescuento = parseFloat(osPaciente.porcentaje);
        }
        valorFinal = valorConsultaBase * (1 - (porcentajeDescuento / 100));
        const appointments = this.getStorageData();
        const nuevoTurno = {
            id: crypto.randomUUID(),
            matriculaProfesional: Number(matriculaProfesional),
            dniPaciente: Number(dniPaciente),
            fechaTurno,
            horaTurno,
            status: 'Pendiente',
            fechaCreacion: new Date().toISOString(),
            valorFinal: valorFinal
        };
        appointments.push(nuevoTurno);
        this.setStorageData(appointments);
        return nuevoTurno;
    }

    getAppointments({ dniPaciente, matriculaProfesional, status } = {}) {
        let appointments = this.getStorageData();

        if (dniPaciente) {
            appointments = appointments.filter(t => t.dniPaciente === Number(dniPaciente));
        }
        if (matriculaProfesional) {
            appointments = appointments.filter(t => t.matriculaProfesional === Number(matriculaProfesional));
        }
        if (status) {
            appointments = appointments.filter(t => t.status === status);
        }

        return appointments;
    }

    getAppointmentById(id) {
        return this.getStorageData().find(t => t.id === id) || null;
    }

    updateAppointment(id, fieldsToUpdate) {
        const appointments = this.getStorageData();
        const index = appointments.findIndex(t => t.id === id);

        if (index === -1) return null;

        const updated = {
            ...appointments[index],
            ...fieldsToUpdate,
            fechaActualizacion: new Date().toISOString()
        };

        appointments[index] = updated;
        this.setStorageData(appointments);
        return updated;
    }

    deleteAppointment(id) {
        const appointments = this.getStorageData();
        const filtered = appointments.filter(t => t.id !== id);

        if (filtered.length === appointments.length) {
            return false;
        }

        this.setStorageData(filtered);
        return true;
    }
}