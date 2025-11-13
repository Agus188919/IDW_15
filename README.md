# IDW_15 - Proyecto Centro Médico

Proyecto de la cátedra IDW que simula la aplicación web de un Centro Médico. La app está desarrollada puramente en front-end (HTML, CSS, Bootstrap y JavaScript) y gestiona todos los datos (pacientes, profesionales y administradores) a través de `localStorage` y `sessionStorage`.

## 🚀 Integrantes

* Daiana Guerrero
* Florencia Agustina Mammana
* Facundo Orona
* Agustín Ruiz


## 🛠️ Cómo Ejecutar el Proyecto

Esta aplicación es un proyecto de front-end estático que utiliza Módulos de JavaScript (ES Modules `import`/`export`).

Por esta razón, **no puede ejecutarse** simplemente abriendo el archivo `index.html` directamente en el navegador (dará un error de CORS al intentar importar archivos).

La forma correcta de ejecutarlo es a través de un servidor local.

### Opción Recomendada: Live Server VSC

1.  Abre la carpeta completa del proyecto en Visual Studio Code.
2.  Asegúrate de tener instalada la extensión **"Live Server"**.
3.  Haz clic derecho sobre el archivo `index.html` en el explorador de archivos.
4.  Selecciona la opción **"Open with Live Server"**.
5.  Esto abrirá el proyecto en tu navegador (generalmente en `http://127.0.0.1:5500/`).


## ✨ Funcionalidades Principales

* 👩‍⚕️ **Panel de Administrador:** Permite la gestión (CRUD - Crear, Leer, Modificar, Eliminar) del staff médico.
* 👤 **Gestión de Usuarios:** Soporta registro y login para Pacientes y Profesionales.
* 🏠 **Home Page:** Renderiza un carrusel dinámico con los profesionales cargados en el sistema.
* 💾 **Persistencia de Datos:** Toda la información se almacena localmente en el navegador usando `localStorage`.
* 🌙 **Modo Oscuro:** La interfaz cuenta con un interruptor para cambiar entre tema claro y oscuro.


## 🔑 Credenciales de Acceso 

Los datos iniciales se cargan desde el archivo `/js/info.js` en `localStorage` la primera vez que se ejecuta la app.

### Administradores

* **Usuario:** `Emilys`
* **Contraseña:** `emilyspass`

### Profesional 

* **Matrícula:** `17899`
* **Contraseña:** `17899`

### Paciente 

* **DNI:** `54769876`
* **Contraseña:** `123`

