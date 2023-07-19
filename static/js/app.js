import { Nota } from './notificaciones.js';

const btnHamburguesaId = 'btn-mvl-hamburguesa';
const menuNavegadorId = 'menu-navegador-principal';
const seccionContactoId = 'seccion-contacto';
const seccionSobreNosotrosId = 'seccion-sobre-nosotros';
const cerrarModalSobreNosotrosId = 'cerrar-modal-sobre-nosotros';
const logoId = 'logo';
const claseActivo = 'activo';
const claseAnimar = 'animar';
const claseBtnMvl = 'btn-mvl';
const claseHamburguesa = 'hamburguesa';
const claseOcultar = 'ocultar';

let alternaMenuMvl = (icono, menu, claseActivo, claseAnimar) => {
    icono.classList.add(claseAnimar);
    icono.classList.toggle(claseActivo);

    menu.classList.add(claseAnimar);
    menu.classList.toggle(claseActivo);
};

let navegaLinks = (links, icono, menu, claseActivo) => {
    links.forEach((link) => {
        link.addEventListener('click', () => {
            icono.classList.remove(claseActivo);
            menu.classList.remove(claseActivo);
        });
    });
};

window.addEventListener('DOMContentLoaded', function () {
    const menu = document.querySelector(`#${menuNavegadorId}`);

    // mostrar menú para dispositivos móviles y animar el icono
    const btnHamburguesa = document.querySelector(`#${btnHamburguesaId}`);
    const iconHamburguesa = btnHamburguesa.querySelector(`.${claseHamburguesa}`);
    btnHamburguesa.addEventListener('click', () => {
        alternaMenuMvl(iconHamburguesa, menu, claseActivo, claseAnimar)
    });

    // cerrar menú al hacer click en un enlace o en el logo
    const logo = document.querySelector(`#${logoId}`);
    const menuLinks = menu.querySelectorAll('a');
    const botonesMvl = document.querySelectorAll(`.${claseBtnMvl}:not(#${btnHamburguesaId})`);
    
    let links = Array.from([logo]).concat(Array.from(menuLinks)).concat(Array.from(botonesMvl));
    navegaLinks(links, iconHamburguesa, menu, claseActivo);
    
    // onsubmit del formulario de contacto
    const formularioContacto = document.querySelector(`#${seccionContactoId} form`);
    formularioContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        new Nota('Su mensaje ha sido enviado correctamente', 'ok');
        formularioContacto.reset();
    });

    // modal acerca de nosotros
    const modalSobreNosotros = document.querySelector(`#${seccionSobreNosotrosId}`);
    const cerrarModalSobreNosotros = document.querySelector(`#${cerrarModalSobreNosotrosId}`);
    cerrarModalSobreNosotros.addEventListener('click', function (e) {
        this.parentElement.parentElement.classList.add(claseOcultar);
    });

    document.querySelector('#link-sobre-nosotros').addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#modal-sobre-nosotros').classList.remove('ocultar');
    });

    // quitar animación de menú y botón de menú al redimensionar la ventana
    window.addEventListener('resize', function () {
        if (this.innerWidth > 768) {
            iconHamburguesa.classList.remove(claseAnimar);
            iconHamburguesa.classList.remove(claseActivo);
            menu.classList.remove(claseAnimar);
            menu.classList.remove(claseActivo);
        }
    });
});