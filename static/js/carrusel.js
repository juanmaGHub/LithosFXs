class Carrusel3I {
    constructor(elemento) {
        let imagenes = elemento.querySelectorAll('img');
        let dots = elemento.parentElement.querySelectorAll('.dot');
        let indiceActivo = 1;
        let escalaActivo = 1.2;

        let inicioXTouch = 0;

        this.setEscalaActivo = (escala) => {
            escalaActivo = escala;
            moverCarrusel(indiceActivo);
        };

        let getIndiceClicado = (e=null) => {
            // si no hay evento (e) se devuelve el siguiente índice
            if (e == null) return (indiceActivo + 1) % imagenes.length;

            // comprobar si se ha clicado en un dot (punto indicador)
            let indice = Array.from(dots).indexOf(e.target);
            if (indice === indiceActivo) return -1;
            if (indice > -1) return indice;

            // obtener el índice de la imagen clicada
            return Array.from(imagenes).indexOf(e.target);
        };

        let setActivo = (e) => {
            let indice = getIndiceClicado(e);
            if (indice === -1) return;

            // dispositivos de escritorio: si se ha clicado en el elemento activo, no hacer nada
            if (window.innerWidth >= 768 && indice === indiceActivo) return;

            // dispositivos móviles: si se ha hecho un swipe, mover el carrusel
            // en la dirección del swipe, si no, mover el carrusel a la derecha
            if (window.innerWidth < 768 && indice === indiceActivo) {
                if (e.changedTouches && e.changedTouches[0].clientX < inicioXTouch) {
                    indice = (indice + 1) % imagenes.length;    
                } else {
                    indice = (indice - 1 + imagenes.length) % imagenes.length;
                }
            }

            // mover el elemento activo
            moverCarrusel(indice);

            // actualizar el elemento y su estado (dot) activo
            imagenes[indice].classList.add('activo');
            imagenes[indiceActivo].classList.remove('activo');

            dots[indice].classList.add('activo');
            dots[indiceActivo].classList.remove('activo');
            
            indiceActivo = indice;
        };

        let moverCarrusel = (indiceClicado) => {
            // dirección del movimiento (1 (derecha) o -1 (izquierda) )
            // el elemento activo siempre estará en el centro, por tanto:
            let signo = 1 - indiceClicado;
            for (let i = 0; i < imagenes.length; i++) {
                let siguiente = i + signo; // siguiente imagen a la que se moverá

                // mapear el índice para que esté entre 0 y el número de elementos - 1, 
                // incluso para valores negativos
                siguiente = siguiente % imagenes.length;
                if (siguiente < 0) {
                    siguiente = (imagenes.length + siguiente) % imagenes.length;
                }

                // Calcular el desplazamiento en porcentaje
                let ds = 100 * (siguiente - i);

                // compensar el desplazamiento para esconder parte de las imágenes inactivas
                if (i === (indiceClicado + 1) % imagenes.length) ds -= 50;
                if (i === (indiceClicado - 1 + imagenes.length) % imagenes.length) ds += 50;

                // escala del elemento activo
                let escala = (i == indiceClicado) ? escalaActivo : 1;
                if (window.innerWidth < 768) {
                    escala = 1;
                } 
                
                
                // mover cada elemento a su correspondiente posición
                imagenes[i].style.transform = `translateX(${ds}%) scale(${escala})`;
            }
        };

        // inicializar el carrusel
        this.init = () => {
            Array.from(imagenes).concat(Array.from(dots)).forEach((elemento) => {
                elemento.addEventListener('click', setActivo);
                elemento.addEventListener('touchstart', (e) => {
                    inicioXTouch = e.changedTouches[0].clientX;
                });
                elemento.addEventListener('touchend', setActivo);
            });
        };
    }
}

window.addEventListener('DOMContentLoaded', function () {
    let elementoCarrusel = document.querySelector('.hero-carrusel');
    let carrusel = new Carrusel3I(elementoCarrusel);
    carrusel.init();

    this.window.addEventListener('resize', function () {
        carrusel.setEscalaActivo(1.2);
        if (window.innerWidth < 768) {
            carrusel.setEscalaActivo(1);
        }
    });
});