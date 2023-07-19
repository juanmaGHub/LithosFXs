const claseNota = 'nota';
const claseCerrarNota = 'cerrar-nota';
const clasesTipo = ['info', 'ok', 'error', 'advertencia'];

export class Nota {
    constructor(texto, tipo, duracion = 3000) {
        let nota = document.createElement('div');
        nota.classList.add(claseNota);

        if (clasesTipo.includes(tipo)) nota.classList.add(tipo);
        else throw new Error('El tipo de nota no es válido');

        let mensaje = document.createElement('span');
        mensaje.textContent = texto;
        nota.appendChild(mensaje);

        let cerrar = document.createElement('span');
        cerrar.classList.add(claseCerrarNota);
        cerrar.innerHTML = '<span></span><span></span>';
        nota.appendChild(cerrar);

        cerrar.addEventListener('click', function () {
            nota.classList.add('ocultar-nota');
        });

        document.body.appendChild(nota);

        setTimeout(function () {
            nota.classList.add('ocultar-nota');
            setTimeout(function () {
                nota.remove();
            }, 1000);
            
        }, duracion);
    }
}