require('dotenv').config();
const db = require('../config/database');

async function crearTabla() {
  const sql = `
    CREATE TABLE IF NOT EXISTS solicitudes_beneficio_metro (
      id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id_usuario INT NOT NULL,
      ruta_archivo VARCHAR(255) NOT NULL,
      nombre_archivo_original VARCHAR(255),
      tarjeta_civica VARCHAR(50),
      tipo_documento VARCHAR(20),
      numero_documento VARCHAR(30),
      nombre_completo VARCHAR(150),
      direccion VARCHAR(150),
      municipio VARCHAR(100),
      barrio VARCHAR(100),
      estrato INT,
      telefono VARCHAR(30),
      email VARCHAR(100),
      fecha_nacimiento VARCHAR(30),
      institucion_educativa VARCHAR(150),
      grado_seccion_facultad VARCHAR(100),
      motivo_solicitud TEXT,
      tiene_firma_estudiante TINYINT(1) DEFAULT 0,
      tiene_firma_acudiente TINYINT(1) DEFAULT 0,
      direccion_coherente TINYINT(1) DEFAULT 0,
      estado_validacion ENUM('APROBADO', 'REQUIERE_REVISION', 'RECHAZADO') DEFAULT 'REQUIERE_REVISION',
      puntaje_confianza DECIMAL(5,2) DEFAULT 0.00,
      observaciones_ia JSON,
      resultado_ia_raw JSON,
      fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_revision DATETIME NULL,
      admin_revisor_id INT NULL,
      FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await db.query(sql);
    console.log('✅ Tabla solicitudes_beneficio_metro creada/verificada exitosamente.');
  } catch (error) {
    console.error('❌ Error al crear tabla solicitudes_beneficio_metro:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

crearTabla();
