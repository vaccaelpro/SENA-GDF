<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "sena";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>