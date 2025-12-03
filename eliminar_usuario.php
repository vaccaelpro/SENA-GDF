<?php
session_start();
include("config/db.php");

if (!isset($_SESSION['id_usuario'])) {
    header("Location: login.php");
    exit;
}

if (!isset($_GET['documento'])) {
    header("Location: gestiondeusuarios.php");
    exit;
}

$documento = $_GET['documento'];

$sql = "DELETE FROM Usuario WHERE documento=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $documento);
$stmt->execute();

header("Location: gestiondeusuarios.php");
exit;
?>
x
