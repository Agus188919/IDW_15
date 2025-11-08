// appointmentsManager.js
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

        const appointments = this.getStorageData();

        const nuevoTurno = {
            id: crypto.randomUUID(),
            matriculaProfesional: Number(matriculaProfesional),
            dniPaciente: Number(dniPaciente),
            fechaTurno,          
            horaTurno,           
            status: 'Pendiente', 
            fechaCreacion: new Date().toISOString()
        };

        appointments.push(nuevoTurno);
        this.setStorageData(appointments);

        return nuevoTurno;
    }

    // obtener turnos
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
