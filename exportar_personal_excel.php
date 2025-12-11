<?php
require_once 'config/auth_protect.php';
require_role_or_404('ADMIN');

include("config/db.php");

$sql = "SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, tipo_documento, documento, grupo_formacion, correo_electronico, tipo_apoyo, rol FROM Usuario WHERE rol != 'ADMIN' ORDER BY primer_nombre ASC";
$result = $conn->query($sql);

$fecha_actual = date('Y-m-d');
$nombre_archivo = "exportacion_finanzas_" . $fecha_actual . ".xlsx";

header("Content-Type: application/vnd.ms-excel; charset=UTF-8");
header("Content-Disposition: attachment; filename=\"$nombre_archivo\"");
header("Pragma: no-cache");
header("Expires: 0");

echo "\xEF\xBB\xBF"; 
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>Primer Nombre</th>
                <th>Segundo Nombre</th>
                <th>Primer Apellido</th>
                <th>Segundo Apellido</th>
                <th>Tipo Documento</th>
                <th>Documento</th>
                <th>Grupo Formación</th>
                <th>Correo Electrónico</th>
                <th>Tipo de Apoyo</th>
                <th>Rol</th>
            </tr>
        </thead>
        <tbody>
            <?php if($result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['primer_nombre']) ?></td>
                        <td><?= htmlspecialchars($row['segundo_nombre']) ?></td>
                        <td><?= htmlspecialchars($row['primer_apellido']) ?></td>
                        <td><?= htmlspecialchars($row['segundo_apellido']) ?></td>
                        <td><?= htmlspecialchars($row['tipo_documento']) ?></td>
                        <td><?= htmlspecialchars($row['documento']) ?></td>
                        <td><?= htmlspecialchars($row['grupo_formacion']) ?></td>
                        <td><?= htmlspecialchars($row['correo_electronico']) ?></td>
                        <td><?= htmlspecialchars($row['tipo_apoyo']) ?></td>
                        <td><?= htmlspecialchars($row['rol']) ?></td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr>
                    <td colspan="10">No hay usuarios registrados</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>
<?php
$conn->close();
exit();
?>
