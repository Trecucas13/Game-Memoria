<?php
include 'conexion.php';

// Verificar si se recibieron los datos
if (!isset($_POST['nombre']) || !isset($_POST['campana']) || !isset($_POST['movimientos']) || !isset($_POST['tiempo'])) {
    echo "❌ Error: Datos incompletos";
    exit;
}

$nombre = $_POST['nombre'];
$campana = $_POST['campana'];
$movimientos = $_POST['movimientos'];
$tiempo = $_POST['tiempo'];

// Depuración - mostrar los datos recibidos
echo "Datos recibidos: <br>";
echo "Nombre: " . $nombre . "<br>";
echo "Campaña: " . $campana . "<br>";
echo "Movimientos: " . $movimientos . "<br>";
echo "Tiempo: " . $tiempo . "<br>";

$sql = "INSERT INTO jugadores (nombre, campana, movimientos, tiempo) VALUES (?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssii", $nombre, $campana, $movimientos, $tiempo);

if ($stmt->execute()) {
    echo "✅ Datos guardados correctamente";
} else {
    echo "❌ Error al guardar los datos: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
