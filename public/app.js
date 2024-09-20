let preguntaActual = 0;
let respuestas = [];
const preguntas = [
  // Datos generales
  {
    pregunta: "¿Cuál es tu edad?",
    opciones: [],
    tipo: "input",
    clave: "edad",
  },
  {
    pregunta: "¿Cuál es tu sexo?",
    opciones: ["Masculino", "Femenino"],
    clave: "sexo",
  },
  
  // Preguntas comunes para todas las enfermedades
  {
    pregunta: "¿Has experimentado cansancio excesivo sin razón aparente?",
    opciones: ["Sí", "No"],
    clave: "cansancio",
  },
  {
    pregunta: "¿Has notado pérdida de peso involuntaria en los últimos meses?",
    opciones: ["Sí", "No"],
    clave: "perdidaPeso",
  },
  {
    pregunta: "¿Has tenido sed constante?",
    opciones: ["Sí", "No"],
    clave: "sedConstante",
  },
  {
    pregunta: "¿Has notado cambios en la frecuencia de micción?",
    opciones: ["Sí", "No"],
    clave: "miccionFrecuente",
  },

  // Preguntas para diabetes
  {
    pregunta: "¿Has notado heridas que tardan en cicatrizar?",
    opciones: ["Sí", "No"],
    clave: "heridasCicatrizan",
  },
  {
    pregunta: "¿Has experimentado visión borrosa recientemente?",
    opciones: ["Sí", "No"],
    clave: "visionBorrosa",
  },
  {
    pregunta: "¿Has sentido hormigueo en manos o pies?",
    opciones: ["Sí", "No"],
    clave: "hormigueo",
  },

  // Preguntas para hipertensión
  {
    pregunta: "¿Has sentido dolor de cabeza frecuente?",
    opciones: ["Sí", "No"],
    clave: "dolorCabeza",
  },
  {
    pregunta: "¿Has sentido mareos o sensación de desvanecimiento?",
    opciones: ["Sí", "No"],
    clave: "mareos",
  },
  {
    pregunta: "¿Has tenido dificultad para respirar sin razón aparente?",
    opciones: ["Sí", "No"],
    clave: "dificultadRespirar",
  },

  // Preguntas para cáncer de próstata (para hombres)
  {
    pregunta: "¿Has notado problemas al orinar, como flujo débil o goteo? (solo hombres)",
    opciones: ["Sí", "No"],
    clave: "problemasOrinar",
    condicion: (respuestas) => respuestas.sexo === "Masculino",
  },
  {
    pregunta: "¿Sientes dolor o ardor al orinar? (solo hombres)",
    opciones: ["Sí", "No"],
    clave: "dolorOrinar",
    condicion: (respuestas) => respuestas.sexo === "Masculino",
  },
  {
    pregunta: "¿Has tenido dolor en la parte baja de la espalda o en las caderas? (solo hombres)",
    opciones: ["Sí", "No"],
    clave: "dolorEspalda",
    condicion: (respuestas) => respuestas.sexo === "Masculino",
  },

  // Preguntas para cáncer de mama (para mujeres)
  {
    pregunta: "¿Has notado bultos en el pecho o axilas? (solo mujeres)",
    opciones: ["Sí", "No"],
    clave: "bultos",
    condicion: (respuestas) => respuestas.sexo === "Femenino",
  },
  {
    pregunta: "¿Has tenido cambios en el aspecto de tus pechos (tamaño, forma, piel)? (solo mujeres)",
    opciones: ["Sí", "No"],
    clave: "cambiosPecho",
    condicion: (respuestas) => respuestas.sexo === "Femenino",
  },
  {
    pregunta: "¿Has experimentado secreción del pezón sin estar lactando? (solo mujeres)",
    opciones: ["Sí", "No"],
    clave: "secrecionPezon",
    condicion: (respuestas) => respuestas.sexo === "Femenino",
  },
];

function siguientePregunta() {
  let respuestaSeleccionada = obtenerRespuesta();
  
  if (respuestaSeleccionada === null) {
    alert("Por favor selecciona una respuesta antes de continuar.");
    return;
  }

  respuestas[preguntas[preguntaActual].clave] = respuestaSeleccionada;
  preguntaActual++;

  if (preguntaActual >= preguntas.length) {
    mostrarResultado();
  } else {
    mostrarPregunta();
  }
}

function obtenerRespuesta() {
  const tipoPregunta = preguntas[preguntaActual].tipo || "radio"; // por defecto "radio"
  if (tipoPregunta === "input") {
    const input = document.querySelector("input");
    return input.value || null;
  } else {
    const seleccionada = document.querySelector('input[name="opcion"]:checked');
    return seleccionada ? seleccionada.value : null;
  }
}

function mostrarPregunta() {
  let preguntaElem = document.getElementById("pregunta");
  let opcionesElem = document.getElementById("opciones");

  // Verificar que no nos hemos pasado del índice de preguntas
  if (preguntaActual >= preguntas.length) {
    mostrarResultado();
    return;
  }

  let pregunta = preguntas[preguntaActual];

  // Verificar si la pregunta es válida antes de acceder a sus propiedades
  if (!pregunta) {
    console.error("No hay más preguntas disponibles.");
    return;
  }

  // Si hay una condición (ej. sexo) y no aplica, pasar a la siguiente pregunta
  if (pregunta.condicion && !pregunta.condicion(respuestas)) {
    preguntaActual++;
    mostrarPregunta();
    return;
  }

  preguntaElem.innerText = pregunta.pregunta;
  opcionesElem.innerHTML = "";

  if (pregunta.tipo === "input") {
    opcionesElem.innerHTML = `<input type="number" id="inputRespuesta" value="${respuestas[pregunta.clave] || ''}" />`;
  } else {
    pregunta.opciones.forEach((opcion, index) => {
      const isChecked = respuestas[pregunta.clave] === opcion ? "checked" : "";
      opcionesElem.innerHTML += `
        <label>
          <input type="radio" name="opcion" value="${opcion}" ${isChecked} />
          ${opcion}
        </label><br/>
      `;
    });
  }

  // Mostrar/ocultar botón "Anterior" según sea necesario
  if (preguntaActual === 0) {
    document.getElementById("anterior").style.display = "none";
  } else {
    document.getElementById("anterior").style.display = "inline-block";
  }
}

function mostrarResultado() {
  let diagnosticos = [];

  // Analizar las respuestas para cada enfermedad

  // Diabetes
  if (respuestas.sedConstante === "Sí" && respuestas.miccionFrecuente === "Sí" && respuestas.heridasCicatrizan === "Sí" && respuestas.visionBorrosa === "Sí") {
    diagnosticos.push("Diabetes");
  }

  // Hipertensión
  if (respuestas.dolorCabeza === "Sí" && respuestas.mareos === "Sí" && respuestas.dificultadRespirar === "Sí") {
    diagnosticos.push("Hipertensión");
  }

  // Cáncer de próstata (para hombres)
  if (respuestas.sexo === "Masculino" && respuestas.problemasOrinar === "Sí" && (respuestas.dolorOrinar === "Sí" || respuestas.dolorEspalda === "Sí")) {
    diagnosticos.push("Cáncer de próstata");
  }

  // Cáncer de mama (para mujeres)
  if (respuestas.sexo === "Femenino" && (respuestas.bultos === "Sí" || respuestas.cambiosPecho === "Sí" || respuestas.secrecionPezon === "Sí")) {
    diagnosticos.push("Cáncer de mama");
  }

  let resultadoElem = document.getElementById("resultado");
  if (diagnosticos.length > 0) {
    resultadoElem.innerHTML = `<h2>Resultados</h2><p>${diagnosticos.join(", ")}</p>`;
  } else {
    resultadoElem.innerHTML = "<h2>Resultados</h2><p>No se encontraron coincidencias significativas.</p>";
  }
  resultadoElem.style.display = "block";

  // Mostrar el botón de reiniciar una vez que se muestran los resultados
  document.getElementById("reiniciar").style.display = "block";
}

// Función para retroceder a la pregunta anterior
function preguntaAnterior() {
  if (preguntaActual > 0) {
    preguntaActual--;
    mostrarPregunta();
  }
}

// Función para reiniciar el diagnóstico
function reiniciarDiagnostico() {
    // Reiniciar las variables y el contenido visual
    preguntaActual = 0;
    respuestas = [];
    
    // Ocultar el resultado y el botón de reiniciar
    document.getElementById("resultado").style.display = "none";
    document.getElementById("reiniciar").style.display = "none";
    
    // Mostrar la primera pregunta de nuevo
    mostrarPregunta();
}

// Inicializar la primera pregunta al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  mostrarPregunta();

document.getElementById("siguiente").addEventListener("click", siguientePregunta); document.getElementById("anterior").addEventListener("click", preguntaAnterior); document.getElementById("reiniciar").addEventListener("click", reiniciarDiagnostico); });