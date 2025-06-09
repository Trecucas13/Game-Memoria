# Juego de Encontrar Parejas

Un sencillo juego web de memoria donde el jugador debe encontrar pares de emojis. El juego registra el nombre del jugador, la campaña, los movimientos y el tiempo empleado.

## Características Principales

*   Juego de memoria clásico con emojis.
*   Formulario de registro para nombre de jugador y campaña.
*   Contador de movimientos y tiempo.
*   Guardado de resultados en una base de datos MySQL.
*   Tabla de clasificación para mostrar los mejores puntajes (ordenados por movimientos y luego por tiempo).
*   Opción para descargar los resultados en formato CSV desde la tabla de clasificación.

## Tecnologías Utilizadas

*   **Frontend**: HTML, CSS, JavaScript
*   **Backend**: PHP
*   **Base de datos**: MySQL

## Estructura del Proyecto

*   `index.html`: Página principal que contiene el formulario de registro y el tablero de juego.
*   `main.js`: Contiene toda la lógica del juego implementada en JavaScript, incluyendo:
    *   Inicialización y barajado de las cartas (emojis).
    *   Manejo de la interacción del usuario (voltear cartas).
    *   Verificación de coincidencias de pares.
    *   Conteo de movimientos y cronómetro.
    *   Envío de los datos del juego al backend al finalizar.
*   `formulario.css`: Archivo CSS que define los estilos visuales para el formulario y otros elementos de la página.
*   `guardar_datos.php`: Script PHP que recibe los datos del juego (nombre, campaña, movimientos, tiempo) y los guarda en la base de datos.
*   `conexion.php`: Script PHP que establece la conexión con la base de datos MySQL. Contiene los parámetros de conexión (host, usuario, contraseña, nombre de la base de datos).
*   `resultados.php`: Script PHP que consulta los resultados almacenados en la base de datos y los muestra en una tabla HTML. Permite descargar los resultados en formato CSV.
*   `juego_parejas.sql`: Archivo SQL que contiene la sentencia `CREATE TABLE` para la tabla `resultados` y algunos datos de ejemplo. Esta tabla almacena la información de cada partida jugada.
*   `andesBpo.png`: Imagen utilizada como icono (favicon) de la aplicación.
*   `Particles_8___49s___4k_res.mp4`: Video utilizado como fondo animado en la página principal.

## Configuración e Instalación

Para ejecutar este proyecto localmente, necesitarás un servidor web compatible con PHP (como XAMPP, WAMP, MAMP o Laragon) y un servidor de base de datos MySQL.

1.  **Clonar o descargar el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```
    O descarga el archivo ZIP y extráelo.

2.  **Crear la base de datos**:
    *   Abre phpMyAdmin o tu cliente MySQL preferido.
    *   Crea una nueva base de datos llamada `juego_parejas`.
    *   Importa el archivo `juego_parejas.sql` en esta base de datos. Esto creará la tabla `resultados` y cargará algunos datos de ejemplo.

3.  **Configurar la conexión a la base de datos**:
    *   Abre el archivo `conexion.php`.
    *   Verifica que los siguientes parámetros coincidan con tu configuración de MySQL:
        ```php
        $host = "localhost";
        $usuario = "root";
        $contrasena = ""; // Ajusta si tu usuario root tiene contraseña
        $base_datos = "juego_parejas";
        ```
    *   Guarda los cambios si has modificado algo.

4.  **Ejecutar la aplicación**:
    *   Copia la carpeta del proyecto al directorio de tu servidor web (por ejemplo, `htdocs` en XAMPP).
    *   Abre tu navegador web y navega a la dirección correspondiente (por ejemplo, `http://localhost/nombre_de_la_carpeta_del_proyecto/`). Esto debería cargar `index.html`.
    *   Para ver la tabla de resultados, navega a `http://localhost/nombre_de_la_carpeta_del_proyecto/resultados.php`.

## Posibles Mejoras Futuras

*   **Seguridad**: Implementar sentencias preparadas en los scripts PHP (`guardar_datos.php` y `resultados.php`) para prevenir inyecciones SQL.
*   **Refactorización de JavaScript**: Unificar las múltiples declaraciones de la función `guardarDatosJuego` en `main.js` a una sola versión funcional.
*   **Interfaz de Usuario**:
    *   Mejorar el diseño visual y la experiencia de usuario.
    *   Añadir más emojis o la posibilidad de seleccionar diferentes sets de cartas.
    *   Implementar diferentes niveles de dificultad (por ejemplo, más pares, límite de tiempo).
*   **Validación**: Añadir validación más robusta tanto en el frontend (JavaScript) como en el backend (PHP).
*   **Gestión de Sesiones**: Implementar sesiones de usuario si se desea una experiencia más personalizada o persistente.
