const filosofo = localStorage.getItem("filosofo");
if (!filosofo) {
    window.location.href = "eleccion.html";
} else {
    const nombreFilosofo = filosofo.charAt(0).toUpperCase() + filosofo.slice(1);
    document.getElementById("tituloFilosofo").textContent = `Has elegido a: ${nombreFilosofo}`;
}

let indice = 0; // Indice de la pregunta
let respuestas = JSON.parse(localStorage.getItem("respuestas")) || []; // Respuestas guardadas
let temporizador;
let tiempoRestante = 60; // Tiempo en segundos
let puntajeTotal = 0; // Puntaje total

// Base de datos de las preguntas
const preguntasFilosofo = {
    presocraticos: [
        {
            pregunta: "¿Es ético vender un software con errores?",
            opciones: [
                { texto: "Sí, si el cliente lo acepta", porcentaje: 10 },
                { texto: "No, porque va contra un estándar universal de calidad", porcentaje: 20 },
                { texto: "Depende de si los errores son visibles o no", porcentaje: 5 },
            ],
        },
        {
            pregunta: "¿Debería la IA tomar decisiones morales por nosotros?",
            opciones: [
                { texto: "Sí, si está programada por humanos", porcentaje: 10 },
                { texto: "No, la moralidad debe ser humana", porcentaje: 20 },
                { texto: "No hay forma de saber", porcentaje: 5 },
            ],
        },
        {
            pregunta: "¿Es la privacidad un derecho absoluto en la era digital?",
            opciones: [
                { texto: "No, depende de la sociedad", porcentaje: 10 },
                { texto: "Sí, es una virtud esencial", porcentaje: 20 },
                { texto: "No existe realmente", porcentaje: 5 },
            ],
        },
        {
            pregunta: "¿Cómo convencerías a un cliente de usar tu software?",
            opciones: [
                { texto: "Con argumentos específicos", porcentaje: 20 },
                { texto: "Demostrando que es un ideal", porcentaje: 10 },
                { texto: "Preguntándole hasta que lo descubra", porcentaje: 5 },
            ],
        },
        {
            pregunta: "¿Es el éxito de un ingeniero medido por el dinero?",
            opciones: [
                { texto: "Sí, si su comunidad lo valora", porcentaje: 10 },
                { texto: "No, por cumplir un propósito ético", porcentaje: 20 },
                { texto: "El éxito no se puede medir", porcentaje: 5 },
            ],
        },
    ],
    protagoras: [
        {
            pregunta: "¿Cómo se aplica el relativismo de Protágoras en la ética del software?",
            opciones: [
                { texto: "Las normas éticas dependen del contexto y las preferencias del usuario", porcentaje: 20 },
                { texto: "Hay un estándar ético universal que debe seguirse siempre", porcentaje: 10 },
                { texto: "La ética no es relevante en el desarrollo de software", porcentaje: 5 }
            ]
        },
        {
            pregunta: "¿Qué habilidad enseñada por Protágoras es crucial para presentar un proyecto de software?",
            opciones: [
                { texto: "Usar la retórica para explicar y persuadir sobre las soluciones técnicas", porcentaje: 20 },
                { texto: "Evitar la comunicación y enfocarse solo en programar", porcentaje: 5 },
                { texto: "Diseñar presentaciones visuales sin explicar el contenido", porcentaje: 10 }
            ]
        },
        {
            pregunta: '¿Cómo se relaciona la frase "el hombre es la medida de todas las cosas" con el diseño de interfaces?',
            opciones: [
                { texto: "Adaptar la interfaz a las necesidades y preferencias individuales", porcentaje: 20 },
                { texto: "Imponer un diseño estándar para todos los usuarios", porcentaje: 5 },
                { texto: "Ignorar las diferencias culturales en el diseño", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué enfoque de Protágoras es útil para la colaboración en equipos de software?",
            opciones: [
                { texto: "Persuadir y negociar soluciones técnicas considerando diferentes perspectivas", porcentaje: 20 },
                { texto: "Trabajar en aislamiento sin buscar feedback", porcentaje: 5 },
                { texto: "Imponer ideas sin escuchar a otros miembros del equipo", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Cómo se aplica el relativismo en la documentación de software?",
            opciones: [
                { texto: "Escribir documentación adaptada a diferentes niveles de usuario", porcentaje: 20 },
                { texto: "Crear una única documentación técnica sin considerar al usuario final", porcentaje: 10 },
                { texto: "No documentar para ahorrar tiempo", porcentaje: 5 }
            ]
        }
    ],
    gorgias: [
        {
            pregunta: "¿Cómo se aplica el escepticismo de Gorgias en la validación de software?",
            opciones: [
                { texto: "Cuestionar todas las suposiciones para encontrar posibles fallos", porcentaje: 20 },
                { texto: "Aceptar las especificaciones sin dudar de su validez", porcentaje: 5 },
                { texto: "Creer que el software siempre funcionará como se espera", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué enseñanza de Gorgias sobre la comunicación es relevante para la documentación técnica?",
            opciones: [
                { texto: "Reconocer que la verdad es difícil de comunicar, por lo que la documentación debe ser clara y precisa", porcentaje: 20 },
                { texto: "Asumir que la documentación no es necesaria si el código es bueno", porcentaje: 5 },
                { texto: "Escribir documentación ambigua para mantener el misterio", porcentaje: 10 }
            ]
        },
        {
            pregunta: '¿Cómo se relaciona la idea de Gorgias de que "nada existe" con el testing de software?',
            opciones: [
                { texto: "Probar exhaustivamente porque no se puede asumir que el software funcione correctamente", porcentaje: 20 },
                { texto: "No realizar pruebas porque nada es seguro", porcentaje: 5 },
                { texto: "Confiar en que el software está libre de errores sin pruebas", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué actitud de Gorgias es útil para un ingeniero en software frente a nuevas tecnologías?",
            opciones: [
                { texto: "Mantener un escepticismo saludable y evaluar críticamente las herramientas", porcentaje: 20 },
                { texto: "Adoptar todas las nuevas tecnologías sin cuestionarlas", porcentaje: 5 },
                { texto: "Rechazar cualquier tecnología nueva por principio", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Cómo se aplica el escepticismo de Gorgias en la revisión de código?",
            opciones: [
                { texto: "Cuestionar cada línea de código para encontrar posibles mejoras", porcentaje: 20 },
                { texto: "Aprobar el código sin revisarlo a fondo", porcentaje: 5 },
                { texto: "Creer que el código es perfecto tal como está", porcentaje: 10 }
            ]
        }
    ],
    socrates: [
        {
            pregunta: "¿Cómo se aplica la mayéutica socrática en la depuración de código?",
            opciones: [
                { texto: "Hacer preguntas iterativas para encontrar y entender los errores", porcentaje: 20 },
                { texto: "Implementar soluciones sin analizar el problema", porcentaje: 5 },
                { texto: "Aceptar bugs como parte inevitable del software", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué actitud socrática es valiosa para un ingeniero en software?",
            opciones: [
                { texto: "Reconocer la propia ignorancia y buscar aprender continuamente", porcentaje: 20 },
                { texto: "Creer que ya se sabe todo sobre programación", porcentaje: 5 },
                { texto: "Evitar nuevas tecnologías por miedo a no entenderlas", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Cómo se relaciona el diálogo socrático con las reuniones de equipo en software?",
            opciones: [
                { texto: "Fomentar la discusión y el cuestionamiento para mejorar las ideas", porcentaje: 20 },
                { texto: "Evitar debates para no perder tiempo", porcentaje: 5 },
                { texto: "Dejar que un solo miembro tome todas las decisiones", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué práctica en software refleja la búsqueda socrática de virtudes universales?",
            opciones: [
                { texto: "Definir estándares éticos claros en el desarrollo", porcentaje: 20 },
                { texto: "Ignorar la ética en favor de la eficiencia", porcentaje: 5 },
                { texto: "Adaptar la ética según el cliente o proyecto", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Cómo se aplica la humildad socrática en la revisión de código?",
            opciones: [
                { texto: "Aceptar feedback y reconocer áreas de mejora", porcentaje: 20 },
                { texto: "Rechazar críticas para no perder tiempo", porcentaje: 5 },
                { texto: "Creer que el propio código es perfecto", porcentaje: 10 }
            ]
        }
    ],
    platon: [
        {
            pregunta: '¿Qué práctica en software refleja el "mundo de las ideas" de Platón?',
            opciones: [
                { texto: "Diseñar modelos abstractos y patrones antes de codificar", porcentaje: 20 },
                { texto: "Codificar sin planificación previa", porcentaje: 5 },
                { texto: "Copiar soluciones de otros proyectos sin analizarlas", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Cómo se relaciona el mito de la caverna con la ingeniería en software?",
            opciones: [
                { texto: 'Reconocer que el código puede ser una "sombra" de un diseño ideal', porcentaje: 20 },
                { texto: "Creer que el primer prototipo es la versión final", porcentaje: 5 },
                { texto: "Ignorar la retroalimentación de los usuarios", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué enfoque platónico es útil para la arquitectura de software?",
            opciones: [
                { texto: "Buscar la perfección en el diseño antes de implementar", porcentaje: 20 },
                { texto: "Implementar rápidamente sin considerar la estructura", porcentaje: 5 },
                { texto: "Priorizar la velocidad sobre la calidad", porcentaje: 10 }
            ]
        },
        {
            pregunta: '¿Cómo se aplica la idea de "formas ideales" en el testing de software?',
            opciones: [
                { texto: "Definir casos de prueba basados en comportamientos ideales", porcentaje: 20 },
                { texto: "Probar solo lo mínimo necesario", porcentaje: 5 },
                { texto: "Evitar el testing para no retrasar el lanzamiento", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué aspecto del platonismo es relevante para la documentación de software?",
            opciones: [
                { texto: "Describir la lógica ideal y el propósito detrás del código", porcentaje: 20 },
                { texto: "Documentar solo lo superficial", porcentaje: 5 },
                { texto: "No documentar para mantener el misterio", porcentaje: 10 }
            ]
        }
    ],
    aristoteles: [
        {
            pregunta: "¿Cómo se aplica el enfoque empírico de Aristóteles en el desarrollo de software?",
            opciones: [
                { texto: "Probar el software para validar su comportamiento", porcentaje: 20 },
                { texto: "Confiar en la teoría sin realizar pruebas", porcentaje: 5 },
                { texto: "Desarrollar sin objetivos claros", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué concepto aristotélico es fundamental en la arquitectura de software?",
            opciones: [
                { texto: "La lógica para estructurar sistemas complejos", porcentaje: 20 },
                { texto: "La improvisación sin un plan definido", porcentaje: 5 },
                { texto: "La estética visual sobre la funcionalidad", porcentaje: 10 }
            ]
        },
        {
            pregunta: '¿Cómo se relaciona la idea de "causa final" de Aristóteles con el diseño de software?',
            opciones: [
                { texto: "Definir el propósito claro de cada componente", porcentaje: 20 },
                { texto: "Crear funcionalidades sin un objetivo definido", porcentaje: 5 },
                { texto: "Priorizar la complejidad sobre la usabilidad", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Qué práctica en software refleja la observación aristotélica?",
            opciones: [
                { texto: "Analizar datos de uso para mejorar el producto", porcentaje: 20 },
                { texto: "Ignorar el feedback de los usuarios", porcentaje: 5 },
                { texto: "Desarrollar basado solo en suposiciones", porcentaje: 10 }
            ]
        },
        {
            pregunta: "¿Cómo se aplica la ética aristotélica en la ingeniería en software?",
            opciones: [
                { texto: "Buscar el equilibrio entre funcionalidad y responsabilidad", porcentaje: 20 },
                { texto: "Maximizar el beneficio sin considerar el impacto", porcentaje: 5 },
                { texto: "Minimizar el esfuerzo ético para ahorrar tiempo", porcentaje: 10 }
            ]
        }
    ]
};

// Función para barajar las opciones
function shuffleOptions(opciones) {
    let shuffledOptions = [...opciones]; // Copia de las opciones
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return shuffledOptions;
}

// Iniciar temporizador
function iniciarTemporizador() {
    clearInterval(temporizador);
    tiempoRestante = 60; // Tiempo en segundos
    const temporizadorElement = document.getElementById("temporizador");
    if (temporizadorElement) {
        temporizadorElement.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
    }
    temporizador = setInterval(() => {
        tiempoRestante--;
        if (temporizadorElement) {
            temporizadorElement.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
            if (tiempoRestante <= 15) temporizadorElement.style.color = "red";
            else if (tiempoRestante > 15 && tiempoRestante <= 30)
                temporizadorElement.style.color = "orange";
            else temporizadorElement.style.color = "green";
        }
        if (tiempoRestante === 0) {
            clearInterval(temporizador);
            mostrarPerdida();
        }
    }, 1000);
}

// Cargar preguntas
function cargarPreguntas() {
    const container = document.getElementById("preguntas");
    container.innerHTML = "";
    const preguntas = preguntasFilosofo[filosofo];

    // Verificar si las preguntas existen
    if (!preguntas) {
        alert("Filosofo no encontrado");
        window.location.href = "eleccion.html";
        return;
    }

    // Mostrar preguntas
    preguntas.forEach((pregunta, i) => {
        const opcionesBarajadas = shuffleOptions(pregunta.opciones);
        const divPregunta = document.createElement("div");
        divPregunta.classList.add("pregunta");

        divPregunta.innerHTML = `
                    <p class="pregunta-texto">${pregunta.pregunta}</p>
                    <div class="opciones">
                        ${opcionesBarajadas // Barajar las opciones
                            .map(
                                (op) =>
                                    `<button class="opcion" data-porcentaje="${op.porcentaje}">${op.texto}</button>`
                            )
                            .join("")}
                    </div>
                `;
        container.appendChild(divPregunta);
    });
    agregarEventosOpciones();
    mostrarPregunta();
}

// Actualizar botones
function updateButtons() {
    document.getElementById("anterior").disabled = indice === 0;
    document.getElementById("siguiente").disabled =
        respuestas[indice] === undefined;
}

// Reiniciar juego
function reiniciarJuego() {
    localStorage.removeItem("respuestas");
    window.location.href = "index.html";
}

// Mostrar que perdio
function mostrarPerdida() {
    document.body.innerHTML = `
            <video autoplay loop muted id="video-fondo">
                <source src="background.mp4" type="video/mp4">
                Tu navegador no soporta elementos de video.
            </video>
                <h1>Has perdido, eres un perdedor.</h1>
                <p>Volverás al inicio en <span id="contadorPerdido">15</span> segundos.</p>
            `;
    let tiempoRestantePerdido = 15;
    const contadorPerdido = setInterval(() => {
        tiempoRestantePerdido--;
        document.getElementById("contadorPerdido").textContent = tiempoRestantePerdido;
        if (tiempoRestantePerdido <= 0) {
            clearInterval(contadorPerdido);
            reiniciarJuego();
        }
    }, 1000);
}

// Mostrar pregunta
function mostrarPregunta() {
    const preguntas = document.querySelectorAll(".pregunta");
    const indicePregunta = document.getElementById("indice-pregunta");

    // Ocultar preguntas no activas
    preguntas.forEach((pregunta, i) => {
        pregunta.classList.toggle("activa", i === indice);
    });

    // Actualizar el indice de la pregunta
    indicePregunta.textContent = `Pregunta ${indice + 1} de 5`;
    updateButtons();
    iniciarTemporizador();
}

// Guardar progreso
function guardarProgreso() {
    localStorage.setItem("respuestas", JSON.stringify(respuestas));
}


// Creadores [NOMBRE, MATRICULA]
const creadores_juego = [
    {nombre: "Ronald Omar Rosario Ramos", matricula: "2024-0141"},
    {nombre: "Wilkin Yonaire Olaverria Romero", matricula: "2024-0093"},
    {nombre: "Ronald Francisco Dominguez Ramirez", matricula: "2024-0094"},
    {nombre: "Oscar Adrian Capellan Almonte", matricula: "2024-0124"},
    {nombre: "Jean Herold Mercius", matricula: "2024-0148"}
]
// Resultado
function mostrarResultado() {
    clearInterval(temporizador); // Detener el temporizador de 60 segundos
    let message;
    if (puntajeTotal >= 80) message = "Excelente!";
    else if (puntajeTotal >= 60) message = "Buen trabajo!";
    else message = "Sigue explorando las implicaciones eticas en software.";
    
    const listaNombre_creadores = creadores_juego.map(creador => `
        <li>
            <div class="nombre">${creador.nombre}</div>
            <div class="matricula">${creador.matricula}</div>
        </li>
        `).join(''); 

    // Actualizar contenido al mostrar la pantalla de resultado
    document.body.innerHTML = `
                <h1 class="resultado">Tu puntaje total es: ${puntajeTotal}%</h1>
                <p class="resultado">${message}</p>
                <p class="resultado">Volverás al inicio en <span id="contadorResultado">15</span> segundos.</p>
                <button onclick="reiniciarJuego();">Volver al inicio</button>
                <div id="creadores" class="creadores_class">
                    <h2>Desarrollado por:</h2>
                    <ul>
                        ${listaNombre_creadores}
                    </ul>
                </div>
            `;
    let tiempoRestanteResultado = 15;
    const contadorResultado = setInterval(() => {
        tiempoRestanteResultado--;
        const contadorElement = document.getElementById("contadorResultado");
        if (contadorElement) {
            contadorElement.textContent = tiempoRestanteResultado;
        }
        if (tiempoRestanteResultado <= 0) {
            clearInterval(contadorResultado);
            reiniciarJuego();
        }
    }, 1000);
}

function agregarEventosOpciones() {
    document.querySelectorAll(".opcion").forEach((button) => {
        button.addEventListener("click", (e) => {
            const porcentaje = parseInt(e.target.dataset.porcentaje);
            respuestas[indice] = porcentaje;
            puntajeTotal += porcentaje;
            guardarProgreso();
            updateButtons();
            if (indice < 4) {
                indice++;
                mostrarPregunta();
            } else {
                console.log("Showing results");
                mostrarResultado();
            }
        });
    });
}

// Boton Anterior
const btn_Anterior = document
    .getElementById("anterior")
    .addEventListener("click", () => {
        if (indice > 0) {
            indice--;
            mostrarPregunta();
        }
    });

// Boton Rendirse
const rendirse = document
    .getElementById("rendirse")
    .addEventListener("click", () => {
        clearInterval(temporizador);
        alert("Te has rendido. Perdedor.");
        reiniciarJuego();
    });

// Boton Siguiente
const btn_Siguiente = document
    .getElementById("siguiente")
    .addEventListener("click", () => {
        if (indice < 4 && respuestas[indice] !== undefined) {
            indice++;
            mostrarPregunta();
        }
    });

cargarPreguntas();
