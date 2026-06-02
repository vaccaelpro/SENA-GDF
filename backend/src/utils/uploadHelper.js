/**
 * Helper de subida de imágenes SIN multer.
 * Convierte base64 → archivo en /uploads.
 * Cuando tengas internet, puedes instalar multer y reemplazar esto.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Asegura que el directorio existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Guarda una imagen en base64 en /uploads.
 * @param {string} base64String - "data:image/png;base64,iVBOR..."
 * @returns {string|null} - nombre del archivo guardado, o null si no hay imagen
 */
exports.saveBase64Image = (base64String) => {
  if (!base64String) return null;

  // Validar formato
  const matches = base64String.match(/^data:image\/(png|jpg|jpeg|gif|webp);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  // Validar que sea una imagen válida (mínimo 100 bytes)
  if (buffer.length < 100) return null;

  const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filepath, buffer);

  return filename;
};

/**
 * Elimina un archivo de imagen de /uploads.
 * @param {string} filename - nombre del archivo
 */
exports.deleteImage = (filename) => {
  if (!filename) return;
  const filepath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};
