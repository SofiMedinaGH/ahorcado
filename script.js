let palabras = [
  "CSS",
  "HTML",
  "REACT",
  "JAVASCRIPT",
  "JAVA",
  "ANGULAR",
  "VUE",
  "MYSQL",
  "FRAMEWORK",
  "NODEJS",
  "SWIFT",
  "PHYTON",
];

let letra_A = 65,
  letra_Z = 90,
  letra_a = 97,
  letra_z = 122;

let palabraRandom = "";
let letrasIncorrectas = "";
let letrasCorrectas = "";
let contadorLetras = 0;

const body = document.querySelector("body");

const pantallaDibujo = document.getElementById("ahorcado");
const pincelDibujo = pantallaDibujo.getContext("2d");
const pantallaGuionesLetras = document.getElementById("guiones");
const pincelLetras = pantallaGuionesLetras.getContext("2d");

const botonAgregarPalabra = document.getElementById("botonAgregarPalabra");
const botonHaciaJugar = document.getElementById("aJuego");
const botonHaciaAgrPalabra = document.getElementById("aAgregarPalabra");
const paginaAhorcado = document.getElementById("jugarPage");
const paginaAgrPalabra = document.getElementById("agregarPalabraPage");

const outputIncorrectas = document.getElementById("letrasIncorrectas");

function recargarPagina() {
    window.location.reload();
}

function sortear() {
  const palabrasAlmacenadas =
    JSON.parse(localStorage.getItem("palabrasAgregadas")) || [];

  palabras = [...palabras, ...palabrasAlmacenadas];

  let n = Math.round(Math.random() * (palabras.length - 1));
  palabraRandom = palabras[n];
  console.log(palabraRandom);
}

function ocultarAgregarPalabra() {
  paginaAgrPalabra.style.display = "none";
  botonHaciaJugar.style.display = "none";
}

function haciaAgregarPalabra() {
  body.removeEventListener("onkeypress", esUnaLetra(event), true);
  paginaAhorcado.style.display = "none";
  paginaAgrPalabra.style.display = "block";
  botonHaciaAgrPalabra.style.display = "none";
  botonHaciaJugar.style.display = "inline";
}

function haciaJugar() {
  crearPalabraSecreta();
  outputIncorrectas.value = "";
  //let pincel = pantallaDibujo.getContext("2d");

  pincelDibujo.fillStyle = "#d6eef1";
  pincelDibujo.beginPath();
  pincelDibujo.fillRect(0, 0, 300, 500);

  paginaAhorcado.style.display = "block";
  paginaAgrPalabra.style.display = "none";
  botonHaciaJugar.style.display = "none";
  botonHaciaAgrPalabra.style.display = "inline";

  letrasIncorrectas = "";
  letrasCorrectas = "";
  contadorLetras = 0;
  return letrasIncorrectas, letrasCorrectas, contadorLetras;
}

function crearPalabraSecreta() {
  ocultarAgregarPalabra();
  sortear();

  let distanciaGuiones = [0, 90, 180, 270, 360, 450, 540, 630, 720, 810, 900];
  let anchoCanvaGuiones = document.getElementById("guiones");
  anchoCanvaGuiones.setAttribute(
    "width",
    distanciaGuiones[palabraRandom.length]
  );

  for (contador = 0; contador < palabraRandom.length; contador++) {
    guiones(distanciaGuiones[contador]);
  }
}

function guiones(x) {
  pincelLetras.fillStyle = "#054952";
  pincelLetras.beginPath();
  pincelLetras.moveTo(x + 5, 100);
  pincelLetras.fillRect(0, 100, 80, 4);
  pincelLetras.beginPath();
  pincelLetras.moveTo(x + 90, 100);
  pincelLetras.fillRect(x, 100, 80, 4);
}

function escucharEvento(event) {
  body.addEventListener("onkeypress", esUnaLetra(event), true);
}

function esUnaLetra(event) {
  let tecla = event.keyCode || event.wich;

  if (
    (tecla >= letra_A && tecla <= letra_Z) ||
    (tecla >= letra_a && tecla <= letra_z)
  ) {
    let letraPulsada = event.key.toUpperCase();
    comprobarLetra(letraPulsada);
  }
}

function comprobarLetra(letra) {
  let contador = 0;
  let contadorIncorrectas = 0;
  const coordenadasLetras = [20, 120, 210, 300, 390, 480, 570, 660, 750, 840];

  while (contador < palabraRandom.length) {
    if (
      letra == palabraRandom[contador] &&
      letrasCorrectas.includes(letra, [0]) == false
    ) {
      dibujarLetraCorrecta(
        event.key.toUpperCase(),
        coordenadasLetras[contador],
        letrasIncorrectas.length
      );

      contador++;
    } else if (letrasCorrectas.includes(letra, [0]) == true) {
      contador++;
      break;
    } else {
      contadorIncorrectas++;
      if (
        contadorIncorrectas == palabraRandom.length &&
        letrasIncorrectas.length < 10
      ) {
        escribirLetraIncorrecta(letra);
      }
      contador++;
    }
  }
  letrasCorrectas = letrasCorrectas + letra;
  return letrasCorrectas;
}

function dibujarLetraCorrecta(letra, coordenada, quedanIntentos) {
  contadorLetras++;

  if (contadorLetras == palabraRandom.length && quedanIntentos <= 9) {
    let pantalla = document.getElementById("guiones");
    let pincel = pantalla.getContext("2d");
    pincel.beginPath();
    pincel.fillStyle = "#054952";
    pincel.font = "bold normal 50px arial";
    pincel.moveTo(coordenada, 80);
    pincel.fillText(letra, coordenada, 80);
    ganaste();
  } else if (quedanIntentos < 10) {
    let pantalla = document.getElementById("guiones");
    let pincel = pantalla.getContext("2d");
    pincel.beginPath();
    pincel.fillStyle = "#054952";
    pincel.font = "bold normal 50px arial";
    pincel.moveTo(coordenada, 80);
    pincel.fillText(letra, coordenada, 80);
  }
}

function escribirLetraIncorrecta(letra) {
  if (
    letrasIncorrectas.includes(letra, [0]) == false &&
    contadorLetras < palabraRandom.length
  ) {
    letrasIncorrectas = letrasIncorrectas + letra;
    outputIncorrectas.value = letrasIncorrectas;
    dibujarAhorcado(letrasIncorrectas.length);
  }
}

function ganaste() {
  pincelDibujo.font = "bold normal 29px sans-serif";
  pincelDibujo.fillStyle = "#054952";
  pincelDibujo.beginPath();
  pincelDibujo.fillText("Ganaste, Felicidades!", 0, 460);
}

function dibujarLineas(x, y, width, height) {
  pincelDibujo.beginPath();
  pincelDibujo.fillRect(x, y, width, height);
}

function dibujarCuerpo(x, y, x1, y1) {
  pincelDibujo.beginPath();
  pincelDibujo.moveTo(x, y);
  pincelDibujo.lineTo(x1, y1);
  pincelDibujo.stroke();
}
function dibujarAhorcado(nroIntento) {
  pincelDibujo.fillStyle = "#054952";
  pincelDibujo.lineWidth = 6;
  pincelDibujo.strokeStyle = "#054952";
  pincelDibujo.font = "bold normal 50px sans-serif";

  switch (nroIntento) {
    case 1:
      dibujarLineas(0, 394, 390, 6);
      break;
    case 2:
      dibujarLineas(50, 394, 6, -394);
      break;
    case 3:
      dibujarLineas(50, 0, 180, 6);
      break;
    case 4:
      dibujarLineas(230, 0, 6, 50);
      break;
    case 5:
      pincelDibujo.beginPath();
      pincelDibujo.arc(230, 90, 40, 0, 2 * Math.PI);
      pincelDibujo.stroke();
      break;
    case 6:
      dibujarCuerpo(230, 130, 230, 270);
      break;
    case 7:
      dibujarCuerpo(230, 130, 190, 210);
      break;
    case 8:
      dibujarCuerpo(230, 130, 270, 210);
      break;
    case 9:
      dibujarCuerpo(230, 270, 190, 350);
      break;
    case 10:
      dibujarCuerpo(230, 270, 270, 350);
      pincelDibujo.beginPath();
      pincelDibujo.font = "bold normal 45px sans-serif";
      pincelDibujo.fillText("Fin del Juego", 5, 460);
      const laPalabraEra = document.getElementById("laPalabraEra");
      laPalabraEra.value = `  La palabra era:  ${palabraRandom}`;
      laPalabraEra.style.fontSize = "20px";
      laPalabraEra.style.minWidth = "300px";
      laPalabraEra.style.textAlign= "center";
     
      break;
  }
}

function agregarPalabra() {
  const inputnuevaPalabra = document.getElementById("ingresarPalabra");
  nuevaPalabra = "";
  nuevaPalabra = inputnuevaPalabra.value.toUpperCase();
  inputnuevaPalabra.value = "";

  const palabrasAlmacenadas =
    JSON.parse(localStorage.getItem("palabrasAgregadas")) || [];
  palabrasAlmacenadas.push(nuevaPalabra);
  palabras.push(nuevaPalabra);

  localStorage.setItem(
    "palabrasAgregadas",
    JSON.stringify(palabrasAlmacenadas)
  );
}

botonHaciaAgrPalabra.onclick = haciaAgregarPalabra;
botonHaciaJugar.onclick = haciaJugar;
