<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$base_datos = "juego_parejas";

// Crear conexión
$conn = new mysqli($host, $usuario, $contrasena, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
}

// echo "✅ Conexión exitosa";
?>
