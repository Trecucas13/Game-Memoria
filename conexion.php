<?php
$host = "localhost";
$usuario = "root";  // Reemplazar con tu usuario de MySQL
$contrasena = "";  // Reemplazar con tu contraseña de MySQL
$base_datos = "juego_parejas";

$conexion = new mysqli($host, $usuario, $contrasena, $base_datos);

if ($conexion->connect_error) {
    die("❌ Error de conexión: " . $conexion->connect_error);
}

// Establecer el conjunto de caracteres a utf8
$conexion->set_charset("utf8");
?>
