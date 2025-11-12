const PROFESIONALES = [
    {
        matricula: 17899,
        nombreProfesional: "Roberto",
        apellidoProfesional: "Pérez",
        osProfesional: 1,
        especialidadAlta: "Traumatología",
        valorConsulta: 25000,
        conchita: true,
        infoProfesional: `El Dr. Roberto Pérez se especializa en la prevención, diagnóstico y tratamiento
    de lesiones y enfermedades del sistema musculoesquelético.`,
        passwordProfesional: "17899",
        imagenProfesional: "./img/dr-1.jpg"
    },
    {
        matricula: 22345,
        nombreProfesional: "Pedro",
        apellidoProfesional: "García",
        osProfesional: 2,
        especialidadAlta: "Medicina Clínica",
        valorConsulta: 25000,
        infoProfesional: `El Dr. Pedro García brinda atención integral a pacientes adultos,
    abordando la prevención y tratamiento de enfermedades comunes y crónicas.`,
        passwordProfesional: "22345",
        imagenProfesional: "./img/dr-2.jpg"
    },
    {
        matricula: 30987,
        nombreProfesional: "Juan Pablo",
        apellidoProfesional: "Rodríguez",
        osProfesional: 3,
        especialidadAlta: "Neurocirugía",
        valorConsulta: 25000,
        infoProfesional: `El Dr. Juan Pablo Rodríguez se dedica al diagnóstico y tratamiento quirúrgico
    de enfermedades del sistema nervioso central y periférico.`,
        passwordProfesional: "30987",
        imagenProfesional: "./img/dr-3.webp"
    },
    {
        matricula: 90273,
        nombreProfesional: "Carla",
        apellidoProfesional: "Sánchez",
        osProfesional: 4,
        especialidadAlta: "Pediatría",
        valorConsulta: 25000,
        infoProfesional: `La Dra. Carla Sánchez se especializa en el cuidado integral de niños y adolescentes,
    acompañando cada etapa de su crecimiento.`,
        passwordProfesional: "90273",
        imagenProfesional: "./img/dr-4.jpg"
    },
    {
        matricula: 55643,
        nombreProfesional: "Florencia",
        apellidoProfesional: "Ramírez",
        osProfesional: 4,
        especialidadAlta: "Cardiología",
        valorConsulta: 25999,
        infoProfesional: `La Dra. Florencia Ramírez está dedicada al diagnóstico, tratamiento y prevención de
    enfermedades cardiovasculares.`,
        passwordProfesional: "55643",
        imagenProfesional: "./img/dr-5.webp"
    },
    {
        matricula: 61235,
        nombreProfesional: "Adrián",
        apellidoProfesional: "Franco",
        osProfesional: 5,
        especialidadAlta: "Ginecología",
        valorConsulta: 25000,
        infoProfesional: `El Dr. Adrián Franco se especializa en la salud integral de la mujer,
    brindando atención preventiva y diagnóstica.`,
        passwordProfesional: "61235",
        imagenProfesional: "./img/dr-6.webp"
    }
];

const PACIENTES = [
    {
        dniPaciente: 54769876,
        nombrePaciente: "Juana",
        apellidoPaciente: "Flores",
        os: 1,
        emailPaciente: "juana@hotmail.com",
        passwordPaciente: "123"
    },
    {
        dniPaciente: 98765432,
        nombrePaciente: "Juan",
        apellidoPaciente: "Juano",
        os: 5,
        emailPaciente: "juano@hotmail.com",
        passwordPaciente: "123"
    },
    {
        dniPaciente: 123,
        nombrePaciente: "Prueba",
        apellidoPaciente: "Probando",
        os: 5,
        emailPaciente: "prueb@hotmail.com",
        passwordPaciente: "123"
    }
];

const OBRAS_SOCIALES = [
    { id: 1, nombre: "Osde", descripcion: "Cobertura nacional premium", porcentaje: 30 },
    { id: 2, nombre: "Swiss Medical", descripcion: "Planes privados", porcentaje: 25 },
    { id: 3, nombre: "Galeno", descripcion: "Cobertura integral", porcentaje: 20 },
    { id: 4, nombre: "Medifé", descripcion: "Planes para familias", porcentaje: 15 },
    { id: 5, nombre: "Medicus", descripcion: "Medicina prepaga", porcentaje: 10 }
];

const ESPECIALIDADES = [
    { id: 1, nombre: "Traumatología" },
    { id: 2, nombre: "Medicina Clínica" },
    { id: 3, nombre: "Neurocirugía" },
    { id: 4, nombre: "Pediatría" },
    { id: 5, nombre: "Cardiología" },
    { id: 6, nombre: "Ginecología" }
];

export { PROFESIONALES, PACIENTES, OBRAS_SOCIALES, ESPECIALIDADES };
