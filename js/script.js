const buscaminas = {
    numMinasTotales: 0,
    numMinasEncontradas: 0,
    numFilas: 0,
    numColumnas: 0,
    aCampoMinas: []
};

function pintarTablero() {
    const tablero = document.querySelector("#tablero");
    document.querySelector("html").style.setProperty("--num-filas", buscaminas.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas", buscaminas.numColumnas);
    while (tablero.firstChild) {
        tablero.firstChild.removeEventListener("contextmenu", marcar);
        tablero.firstChild.removeEventListener("click", destapar);
        tablero.removeChild(tablero.firstChild);
    }
    for (let f = 0; f < buscaminas.numFilas; f++) {
        for (let c = 0; c < buscaminas.numColumnas; c++) {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("id", `f${f}_c${c}`);
            newDiv.dataset.fila = f;
            newDiv.dataset.columna = c;
            newDiv.addEventListener("contextmenu", marcar);
            newDiv.addEventListener("click", destapar);
            tablero.appendChild(newDiv);
        }
    }
}

function generarCampoMinasVacio() {
    buscaminas.aCampoMinas = Array.from({ length: buscaminas.numFilas }, () => Array(buscaminas.numColumnas));
}

function esparcirMinas() {
    let numMinasEsparcidas = 0;
    while (numMinasEsparcidas < buscaminas.numMinasTotales) {
        const fila = Math.floor(Math.random() * buscaminas.numFilas);
        const columna = Math.floor(Math.random() * buscaminas.numColumnas);
        if (buscaminas.aCampoMinas[fila][columna] !== "B") {
            buscaminas.aCampoMinas[fila][columna] = "B";
            numMinasEsparcidas++;
        }
    }
}

function contarMinasAlrededorCasilla(fila, columna) {
    let numeroMinasAlrededor = 0;
    for (let zFila = fila - 1; zFila <= fila + 1; zFila++) {
        for (let zColumna = columna - 1; zColumna <= columna + 1; zColumna++) {
            if (zFila > -1 && zFila < buscaminas.numFilas && zColumna > -1 && zColumna < buscaminas.numColumnas) {
                if (buscaminas.aCampoMinas[zFila][zColumna] === "B") {
                    numeroMinasAlrededor++;
                }
            }
        }
    }
    buscaminas.aCampoMinas[fila][columna] = numeroMinasAlrededor;
}

function contarMinas() {
    for (let fila = 0; fila < buscaminas.numFilas; fila++) {
        for (let columna = 0; columna < buscaminas.numColumnas; columna++) {
            if (buscaminas.aCampoMinas[fila][columna] !== "B") {
                contarMinasAlrededorCasilla(fila, columna);
            }
        }
    }
}

function marcar(miEvento) {
    if (miEvento.type === "contextmenu") {
        miEvento.stopPropagation();
        miEvento.preventDefault();
        const casilla = miEvento.currentTarget;
        const fila = parseInt(casilla.dataset.fila, 10);
        const columna = parseInt(casilla.dataset.columna, 10);
        if (fila >= 0 && columna >= 0 && fila < buscaminas.numFilas && columna < buscaminas.numColumnas) {
            if (casilla.classList.contains("icon-bandera")) {
                casilla.classList.remove("icon-bandera");
                casilla.classList.add("icon-duda");
                buscaminas.numMinasEncontradas--;
            } else if (casilla.classList.contains("icon-duda")) {
                casilla.classList.remove("icon-duda");
            } else if (casilla.classList.length === 0) {
                casilla.classList.add("icon-bandera");
                buscaminas.numMinasEncontradas++;
                if (buscaminas.numMinasEncontradas === buscaminas.numMinasTotales) {
                    resolverTablero(true);
                }
            }
            actualizarNumMinasRestantes();
        }
    }
}

function destapar(miEvento) {
    if (miEvento.type === "click") {
        const casilla = miEvento.currentTarget;
        const fila = parseInt(casilla.dataset.fila, 10);
        const columna = parseInt(casilla.dataset.columna, 10);
        destaparCasilla(fila, columna);
    }
}

function destaparCasilla(fila, columna) {
    if (fila > -1 && fila < buscaminas.numFilas && columna > -1 && columna < buscaminas.numColumnas) {
        const casilla = document.querySelector(`#f${fila}_c${columna}`);
        if (!casilla.classList.contains("destapado")) {
            if (!casilla.classList.contains("icon-bandera")) {
                casilla.classList.add("destapado");
                casilla.innerHTML = buscaminas.aCampoMinas[fila][columna];
                casilla.classList.add(`c${buscaminas.aCampoMinas[fila][columna]}`);
                if (buscaminas.aCampoMinas[fila][columna] !== "B") {
                    if (buscaminas.aCampoMinas[fila][columna] == 0) {
                        destaparCasilla(fila - 1, columna - 1);
                        destaparCasilla(fila - 1, columna);
                        destaparCasilla(fila - 1, columna + 1);
                        destaparCasilla(fila, columna - 1);
                        destaparCasilla(fila, columna + 1);
                        destaparCasilla(fila + 1, columna - 1);
                        destaparCasilla(fila + 1, columna);
                        destaparCasilla(fila + 1, columna + 1);
                        casilla.innerHTML = "";
                    }
                } else {
                    casilla.innerHTML = "";
                    casilla.classList.add("icon-bomba");
                    casilla.classList.add("sinmarcar");
                    resolverTablero(false);
                }
            }
        }
    }
}

function resolverTablero(isOK) {
    const aCasillas = tablero.children;
    for (let i = 0; i < aCasillas.length; i++) {
        aCasillas[i].removeEventListener("click", destapar);
        aCasillas[i].removeEventListener("contextmenu", marcar);
        const fila = parseInt(aCasillas[i].dataset.fila, 10);
        const columna = parseInt(aCasillas[i].dataset.columna, 10);
        if (aCasillas[i].classList.contains("icon-bandera")) {
            if (buscaminas.aCampoMinas[fila][columna] === "B") {
                aCasillas[i].classList.add("destapado");
                aCasillas[i].classList.remove("icon-bandera");
                aCasillas[i].classList.add("icon-bomba");
            } else {
                aCasillas[i].classList.add("destapado");
                aCasillas[i].classList.add("banderaErronea");
                isOK = false;
            }
        } else if (!aCasillas[i].classList.contains("destapado")) {
            if (buscaminas.aCampoMinas[fila][columna] === "B") {
                aCasillas[i].classList.add("destapado");
                aCasillas[i].classList.add("icon-bomba");
            }
        }
    }
    if (isOK) {
        alert("¡¡¡Enhorabuena!!!");
    }
}

function actualizarNumMinasRestantes() {
    document.querySelector("#numMinasRestantes").innerHTML =
        (buscaminas.numMinasTotales - buscaminas.numMinasEncontradas);
}

function inicio() {
    let numFilas = 20
    let numColumnas = 20
    let numMinasTotales = 22
    // Definir las variables CSS como propiedades de estilo
    document.documentElement.style.setProperty('--num-columnas', numFilas);
    document.documentElement.style.setProperty('--num-filas', numColumnas);
    document.documentElement.style.setProperty('--size', '32px');
    
    buscaminas.numFilas = numFilas;
    buscaminas.numColumnas = numColumnas;
    buscaminas.numMinasTotales = numMinasTotales;
    pintarTablero();
    generarCampoMinasVacio();
    esparcirMinas();
    contarMinas();
    actualizarNumMinasRestantes();
}

window.onload = inicio;