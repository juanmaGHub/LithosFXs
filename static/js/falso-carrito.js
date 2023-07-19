import { Nota } from "./notificaciones.js";
const btnCarritoId = "btn-mvl-carrito";
const btnCerrarCarritoId = "cerrar-modal-carrito";
const modalCarritoId = "modal-carrito";
const claseOcultar = "ocultar";

class FalsoCarrito {
    constructor() {
        /**
         * El objeto productos contiene la cantidad de cada producto que hay en el carrito
         * como solo hay 4 productos, se puede usar un objeto con propiedades fijas.
         * @param {HTMLElement} elementoCarrito
         * @property {number} orivore
         * @property {number} fuuter
         * @property {number} fuzzitte
         * @property {number} foutffud
         * @property {number} total
         * @type {Object}
         */

        let productos = {
            orivore: 0,
            fuuter: 0,
            fuzzitte: 0,
            foutffud: 0,
        };

        // No se hace mucho uso del total, pero se puede usar para hacer un resumen del pedido
        // o para hacer un carrito de la compra más realista
        let total = 0;

        this.agregarProducto = (producto) => {
            if (productos.hasOwnProperty(producto) && productos[producto] < 5)
                productos[producto]++;
            total += 100;
            return productos[producto];
        };

        this.quitarProducto = (producto) => {
            if (productos.hasOwnProperty(producto) && productos[producto] > -1) {
                productos[producto]--;
                total -= 100;
            }
        };

        this.resetear = () => {
            productos = {
                orivore: 0,
                fuuter: 0,
                fuzzitte: 0,
                foutffud: 0,
            };
            total = 0;
        };

        this.getProductos = () => productos;
        this.getCantidad = (producto) => productos[producto];
        this.getTotal = () => total;
    }
}

class CarritoModal {
    constructor(modalCarritoId, claseOcultar, falsoCarrito) {
        let elementoCarrito = document.querySelector(`#${modalCarritoId}`);
        this.getElementoCarrito = () => elementoCarrito;

        // se obtienen los elementos del modal del carrito de la compra
        let btnCerrarCarrito = elementoCarrito.querySelector(
            `#${btnCerrarCarritoId}`
        );
        let h2SinProductos = elementoCarrito.querySelector("h2");
        let btnProceder = elementoCarrito.querySelector("button.primario");
        let entradas = elementoCarrito.querySelectorAll("input");

        // se añade un evento a cada input del carrito de la compra para que se actualice el carrito de la compra
        entradas.forEach((entrada) => {
            entrada.addEventListener("change", () => {
                let producto = entrada.parentElement.parentElement.id;
                let cantidad = entrada.value;
                let cantidadActual = falsoCarrito.getCantidad(producto);
                if (cantidad > cantidadActual) {
                    falsoCarrito.agregarProducto(producto);
                    new Nota("Producto añadido al carrito", "ok", 200);
                } else if (cantidad < cantidadActual) {
                    falsoCarrito.quitarProducto(producto);
                    new Nota("Producto eliminado del carrito", "ok", 200);
                }
                this.actualizarModal();
            });
        });

        // actualizar el modal del carrito de la compra con los productos que hay en el carrito
        this.actualizarModal = () => {
            let productos = falsoCarrito.getProductos();

            // por defecto se oculta el botón de proceder al pago y se muestra el h2 de "carrito vacío"
            h2SinProductos.classList.remove(claseOcultar);
            btnProceder.classList.add(claseOcultar);

            // se recorren los productos del carrito
            for (let producto in productos) {
                let elementoProducto = elementoCarrito.querySelector(
                    `#${producto}`
                );
                if (
                    productos.hasOwnProperty(producto) &&
                    productos[producto] > 0
                ) {
                    h2SinProductos.classList.add(claseOcultar);
                    btnProceder.classList.remove(claseOcultar);

                    elementoProducto.classList.remove(claseOcultar);
                    elementoProducto.querySelector("input").value =
                        productos[producto];
                } else {
                    elementoProducto.classList.add(claseOcultar);
                    elementoProducto.querySelector("input").value =
                        productos[producto];
                }
            }
        };

        btnProceder.addEventListener("click", () => {
            new Nota(
                `Su pedido ha sido procesado correctamente. En breve recibirá un correo electrónico con los detalles de su pedido.\n
                Su compra representa un total de ${falsoCarrito.getTotal()}€`,
                "ok"
            );
            falsoCarrito.resetear();
            this.actualizarModal();
            elementoCarrito.classList.toggle("ocultar");
        });

        // no se puede escribir en los inputs del carrito de la compra
        elementoCarrito.querySelectorAll("input").forEach((input) => {
            input.addEventListener("keypress", (e) => {
                e.preventDefault();
            });
        });

        btnCerrarCarrito.addEventListener("click", () => {
            elementoCarrito.classList.toggle("ocultar");
        });
    }
}

window.addEventListener("DOMContentLoaded", function () {
    const carrito = new FalsoCarrito();
    const carritoModal = new CarritoModal(
        modalCarritoId,
        claseOcultar,
        carrito
    );

    const botonesComprar = document.querySelectorAll(
        ".tarjeta button.primario,.tarjeta button.secundario"
    );

    botonesComprar.forEach((boton) => {
        boton.addEventListener("click", function (e) {
            e.preventDefault();
            if (carrito.getCantidad(this.dataset.producto) === 5) {
                new Nota(
                    "Por el momento no podemos garantizar más de 5 unidades de un mismo producto",
                    "advertencia",
                    200
                );
                return;
            }
            let cantidad = carrito.agregarProducto(this.dataset.producto);
            if (cantidad === 5) {
                new Nota(
                    "Por el momento no podemos garantizar más de 5 unidades de un mismo producto",
                    "advertencia",
                    200
                );
            }
            carritoModal.actualizarModal();
            new Nota("Producto añadido al carrito", "ok", 200);
        });
    });

    const btnCarrito = document.querySelector(`#${btnCarritoId}`);
    btnCarrito.addEventListener("click", () => {
        carritoModal.actualizarModal();
        document
            .querySelector(`#${modalCarritoId}`)
            .classList.remove("ocultar");
    });
});
