import { Nota } from "./notificaciones.js";

const modalUsuarioId = "modal-usuario";
const cerrarModalUsuarioId = "cerrar-modal-usuario";
const btnUsuarioId = "btn-mvl-usuario";
const claseOcultar = "ocultar";

class FalsaDB {
    constructor() {
        /**
         * Esta clase pretende simular una base de datos de usuarios usando el localStorage.
         * En cada instancia de la clase se crea un objeto vacío en el localStorage con la clave 'usuarios-lithosfxs'
         *
         * @type {Object}
         * @property {function} consulta Consulta un usuario en la "base de datos"
         * @property {function} registro Registra un usuario en la "base de datos"
         */

        window.localStorage.setItem("usuarios-lithosfxs", JSON.stringify({}));

        this.consulta = (email, clave) => {
            let db = JSON.parse(
                window.localStorage.getItem("usuarios-lithosfxs")
            );
            if (db.hasOwnProperty(email) && db[email].clave === clave) {
                return db[email];
            }
            return false;
        };

        this.registro = (usuario, email, clave) => {
            let db = JSON.parse(
                window.localStorage.getItem("usuarios-lithosfxs")
            );
            if (!db.hasOwnProperty(email)) {
                db[email] = {
                    usuario: usuario,
                    clave: clave,
                };
                window.localStorage.setItem(
                    "usuarios-lithosfxs",
                    JSON.stringify(db)
                );
                return db[email];
            } else {
                new Nota("El email ya está registrado", "error");
                return false;
            }
        };
    }
}

class ModalUsuario {
    constructor(modalUsuarioId, cerrarModalUsuarioId) {
        /**
         * Esta clase representa al modal de usuario
         * @type {Object}
         */
        this.modo = "acceso";
        this.elementoModalUsuario = document.querySelector(
            `#${modalUsuarioId}`
        );
        this.formulario = this.elementoModalUsuario.querySelector("form");
        this.botones = {
            cerrar: this.elementoModalUsuario.querySelector(
                `#${cerrarModalUsuarioId}`
            ),
            enviar: this.elementoModalUsuario.querySelector(
                'button[type="submit"]'
            ),
        };
        this.entradas = {
            nombre: this.elementoModalUsuario.querySelector(
                'input[name="nombre"]'
            ),
            email: this.elementoModalUsuario.querySelector(
                'input[name="email"]'
            ),
            clave: this.elementoModalUsuario.querySelector(
                'input[name="password"]'
            ),
        };

        // Los selectores a continuación son para los textos que se muestran en el modal
        // están ligados al HTML y al diseño actual, por lo que no se recomienda modificarlos
        this.textos = {
            cabecera: this.elementoModalUsuario.querySelector("h1"),
            registro: {
                enlace: this.elementoModalUsuario.querySelector("p>a"),
                texto: this.elementoModalUsuario.querySelector("p>span"),
            },
            claveOlvidada: {
                enlace: this.elementoModalUsuario.querySelector(
                    "p:last-child>a"
                ),
                texto: this.elementoModalUsuario.querySelector(
                    "p:last-child>span"
                ),
            },
        };

        this.ocultarEntrada = (entrada) => {
            entrada.removeAttribute("required");
            entrada.setAttribute("disabled", "disabled");
            entrada.parentElement.classList.add(claseOcultar);
        };

        this.mostrarEntrada = (entrada) => {
            entrada.setAttribute("required", "required");
            entrada.removeAttribute("disabled");
            entrada.parentElement.classList.remove(claseOcultar);
        };

        this.setModo = (modo) => {
            switch (modo) {
                case "acceso":
                    this.textos.cabecera.textContent = "Accede a tu cuenta";

                    this.textos.registro.enlace.classList.remove("ocultar");
                    this.textos.registro.enlace.innerText = "Regístrate";

                    this.textos.registro.texto.classList.remove("ocultar");
                    this.textos.registro.texto.innerHTML = "¿No tienes cuenta?";

                    this.textos.claveOlvidada.texto.classList.remove("ocultar");
                    this.textos.claveOlvidada.enlace.classList.remove(
                        "ocultar"
                    );

                    this.ocultarEntrada(this.entradas.nombre);
                    this.mostrarEntrada(this.entradas.email);
                    this.mostrarEntrada(this.entradas.clave);

                    this.botones.enviar.innerText = "Acceder";

                    this.modo = "acceso";

                    break;
                case "registro":
                    this.textos.cabecera.textContent = "Crea tu cuenta";

                    this.textos.registro.enlace.classList.remove("ocultar");
                    this.textos.registro.enlace.innerText = "Accede";

                    this.textos.registro.texto.classList.remove("ocultar");
                    this.textos.registro.texto.innerHTML =
                        "¿Ya tienes una cuenta?";

                    this.mostrarEntrada(this.entradas.nombre);
                    this.mostrarEntrada(this.entradas.email);
                    this.mostrarEntrada(this.entradas.clave);

                    this.botones.enviar.innerText = "Registrarse";
                    this.modo = "registro";

                    break;
                case "claveOlvidada":
                    this.textos.cabecera.textContent = "Recupera tu cuenta";

                    this.textos.registro.texto.classList.add("ocultar");
                    this.textos.registro.enlace.classList.add("ocultar");

                    this.textos.claveOlvidada.texto.classList.add("ocultar");
                    this.textos.claveOlvidada.enlace.classList.add("ocultar");

                    this.mostrarEntrada(this.entradas.email);
                    this.ocultarEntrada(this.entradas.clave);
                    this.ocultarEntrada(this.entradas.nombre);

                    this.botones.enviar.innerText = "Enviar";
                    this.modo = "claveOlvidada";
                    break;
            }
        };

        this.resetear = () => {
            this.entradas.nombre.value = "";
            this.entradas.email.value = "";
            this.entradas.clave.value = "";

            this.setModo("acceso");
            this.usuario = {};
        };

        this.cerrar = () => {
            this.resetear();
            this.elementoModalUsuario.classList.add(claseOcultar);
        };
    }
}

class FalsoLogin {
    constructor() {
        /**
         * Esta clase pretende simular un login de usuario y/o registro
         * prentedía que fuera más compleja, pero no he tenido tiempo de hacerla
         * @type {Object}
         */
        let usuario = {};
        this.getUsuario = () => usuario;
        this.setUsuario = (valor) => (usuario = valor);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    // instaciar clases
    const falsaDB = new FalsaDB();
    const modalUsuario = new ModalUsuario(modalUsuarioId, cerrarModalUsuarioId);
    const falsoLogin = new FalsoLogin();

    // cerrar modal al pulsar el botón de cerrar
    modalUsuario.botones.cerrar.addEventListener("click", modalUsuario.cerrar);

    // cambiar de modo al pulsar el enlace de registro o clave olvidada
    modalUsuario.textos.registro.enlace.addEventListener("click", function (e) {
        e.preventDefault();
        if (modalUsuario.modo === "acceso") modalUsuario.setModo("registro");
        else modalUsuario.setModo("acceso");
    });
    modalUsuario.textos.claveOlvidada.enlace.addEventListener(
        "click",
        function (e) {
            e.preventDefault();
            modalUsuario.setModo("claveOlvidada");
        }
    );

    // enviar formulario (falso login)
    modalUsuario.formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        let usuario = modalUsuario.entradas.nombre.value;
        let email = modalUsuario.entradas.email.value;
        let clave = modalUsuario.entradas.clave.value;

        if (modalUsuario.modo === "acceso") {
            // en modo acceso comprobar si el usuario existe en la "base de datos"
            let consulta = falsaDB.consulta(email, clave);
            if (consulta) {
                falsoLogin.setUsuario(consulta);
                modalUsuario.cerrar();

                new Nota(`Bienvenido ${consulta.usuario}`, "ok");
            } else {
                new Nota("Usuario o contraseña incorrectos", "error");
                modalUsuario.resetear();
            }
        } else if (modalUsuario.modo === "registro") {
            let registro = falsaDB.registro(usuario, email, clave);

            // si el registro es correcto, iniciar sesión
            if (registro) {
                falsoLogin.setUsuario(registro);
                modalUsuario.cerrar();
                new Nota(`Bienvenido ${registro.usuario}`, "ok");
            } else {
                new Nota("El email ya existe en nuetra base de datos", "error");
                modalUsuario.resetear();
            }
        } else {
            new Nota("Se ha enviado un correo electrónico a su cuenta", "ok");
            modalUsuario.cerrar();
        }
    });

    document
        .querySelector(`#${btnUsuarioId}`)
        .addEventListener("click", function (e) {
            e.preventDefault();
            if (falsoLogin.getUsuario().hasOwnProperty("usuario")) {
                modalUsuario.setModo("acceso");
                falsoLogin.setUsuario({});
                new Nota("Sesión cerrada correctamente", "ok");
                return;
            }
            modalUsuario.elementoModalUsuario.classList.remove("ocultar");
            modalUsuario.setModo("acceso");
        });
});
