// Escuchar el evento de envío del formulario de registro
// document.getElementById("playerForm").addEventListener("submit", function(event) {
//     event.preventDefault();
    
function mostrarGame() {
    

    // Ocultar el formulario y los elementos de animación
    document.querySelector(".form").style.display = "none";
    document.querySelector("#rays").style.display = "none";
    document.querySelector("#emiter").style.display = "none";
    
    // Mostrar el tablero de juego y las estadísticas
    document.querySelector(".game-container").style.display = "grid";
    document.querySelector("#statsContainer").style.display = "block";
    
    // Iniciar la animación de salida y luego el juego
    document.getElementById("Container").style.animation = "fadeOut 0.5s forwards";
    setTimeout(() => {
        startGame();
    }, 500);

}
    // });


// function dataGame() {

    
// }




// Lista de emojis para el juego (cada uno aparece dos veces)
const emojis = ['🔥', '✨', '🦋', '📖', '💪', '🫂', '🌿', '🤍', '🔥', '✨', '🦋', '📖', '💪', '🫂', '🌿', '🤍'];
let shuffled = []; // Array para los emojis barajados
let board = document.getElementById("gameBoard"); // Referencia al tablero
let moves = 0, timer = 0, firstCard = null, secondCard = null, matchedPairs = 0;
let timeInterval;

// Función para iniciar el juego
function startGame() {
    // Reiniciar contadores y variables
    moves = 0;
    timer = 0;
    matchedPairs = 0;
    document.getElementById("moves").textContent = moves;
    document.getElementById("timer").textContent = timer;
    

    // Limpiar el tablero anterior si existe
    board.innerHTML = "";
    
    // Barajar los emojis usando el algoritmo Fisher-Yates
    shuffled = [...emojis];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Iniciar el temporizador
    if(timeInterval) clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        document.getElementById("timer").textContent = ++timer;
    }, 1000);
    
    // Crear el tablero de cartas
    createBoard();
}

// Función para crear el tablero de cartas
function createBoard() {
    shuffled.forEach((emoji, index) => {
        let card = document.createElement("div");
        card.classList.add("card", "hidden");
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.onclick = flipCard;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Carta " + (index + 1));
        card.setAttribute("tabindex", "0");
        // Permitir voltear la carta con Enter o Espacio
        card.addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") {
                flipCard.call(this);
            }
        });
        board.appendChild(card);
    });
}

// Función para voltear una carta
function flipCard() {
    // No permitir voltear si ya está revelada o si hay dos cartas abiertas
    if (this.classList.contains("revealed") || secondCard) return;
    this.classList.remove("hidden");
    this.textContent = this.dataset.emoji;
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        moves++;
        document.getElementById("moves").textContent = moves;
        setTimeout(checkMatch, 500); // Esperar antes de comprobar coincidencia
    }
}

// Función para comprobar si las dos cartas abiertas son iguales
function checkMatch() {
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        firstCard.classList.add("revealed");
        secondCard.classList.add("revealed");
        matchedPairs++;
        // Si se encontraron todas las parejas, finalizar el juego
        if (matchedPairs === 8) {
            finalizarJuego();
        }
    } else {
        // Si no coinciden, ocultar las cartas de nuevo
        firstCard.classList.add("hidden");
        secondCard.classList.add("hidden");
        firstCard.textContent = "";
        secondCard.textContent = "";
    }
    firstCard = secondCard = null;
}

// Función para finalizar el juego y mostrar mensaje
function finalizarJuego() {
    // Detener el temporizador
    clearInterval(timeInterval);
    
    // Obtener los datos del juego desde el formulario y las estadísticas
    const nombre = document.getElementById('playerName').value || "Jugador";
    const campana = document.getElementById('campaignName').value || "Sin campaña";
    const movimientos = parseInt(document.getElementById('moves').textContent);
    const tiempo = parseInt(document.getElementById('timer').textContent);
    
    // Guardar los datos en la base de datos
    guardarDatosJuego(nombre, campana, movimientos, tiempo);
    
    // Mostrar mensaje de felicitación al usuario
    setTimeout(() => {
        alert(`¡Felicidades ${nombre}! Has completado el juego en ${tiempo} segundos con ${movimientos} movimientos.`);
    }, 500);
}

// Función para guardar los datos del juego en la base de datos (versión única corregida)
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    console.log("Enviando datos:", nombre, campana, movimientos, tiempo);
    
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => {
        console.log("Respuesta recibida");
        return response.text();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    // Rellenar el formulario oculto con los datos
    document.getElementById('playerNameInput').value = nombre;
    document.getElementById('campaignNameInput').value = campana;
    document.getElementById('movesInput').value = movimientos;
    document.getElementById('timeInput').value = tiempo;
    
    // Enviar el formulario
    document.getElementById('formFinal').submit();
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nombre=${encodeURIComponent(nombre)}&campana=${encodeURIComponent(campana)}&movimientos=${movimientos}&tiempo=${tiempo}`
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (!data.includes("✅")) {
            alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.");
    });
}
// Función para guardar los datos del juego en la base de datos
function guardarDatosJuego(nombre, campana, movimientos, tiempo) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })}
