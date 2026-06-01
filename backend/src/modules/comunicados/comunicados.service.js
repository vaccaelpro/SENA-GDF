const db = require('../../config/database');
const { saveBase64Image, deleteImage } = require('../../utils/uploadHelper');

exports.listarPublicos = async () => {
  try {
    const [rows] = await db.query(
      `SELECT id_comunicado, titulo, contenido, categoria, imagen_url, url_referencia, fecha_publicacion
       FROM comunicados
       ORDER BY fecha_publicacion DESC`
    );
    return rows;
  } catch (error) {
    console.error('Error en listarPublicos:', error);
    throw error;
  }
};

exports.listarAdmin = async () => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.primer_nombre, u.primer_apellido
       FROM comunicados c
       JOIN usuario u ON c.usuario_id_usuario = u.id_usuario
       ORDER BY c.fecha_publicacion DESC`
    );
    return rows;
  } catch (error) {
    console.error('Error en listarAdmin:', error);
    throw error;
  }
};

exports.obtenerPorId = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.primer_nombre, u.primer_apellido
       FROM comunicados c
       JOIN usuario u ON c.usuario_id_usuario = u.id_usuario
       WHERE c.id_comunicado = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error en obtenerPorId:', error);
    throw error;
  }
};

exports.crear = async (data, usuarioId) => {
  try {
    const { titulo, contenido, categoria, imagen_base64, url_referencia } = data;

    // Guardar imagen si viene en base64
    let imagen_url = null;
    if (imagen_base64) {
      imagen_url = saveBase64Image(imagen_base64);
    }

    const [result] = await db.query(
      `INSERT INTO comunicados (titulo, contenido, categoria, imagen_url, url_referencia, fecha_publicacion, ultima_actualizacion, usuario_id_usuario)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
      [titulo, contenido, categoria || 'Noticias', imagen_url, url_referencia || null, usuarioId]
    );

    return { success: true, id_comunicado: result.insertId, imagen_url };
  } catch (error) {
    console.error('Error en crear:', error);
    throw error;
  }
};

exports.actualizar = async (id, data) => {
  try {
    const { titulo, contenido, categoria, imagen_base64, url_referencia, mantener_imagen } = data;

    // Si viene nueva imagen en base64, guardarla y borrar la anterior
    let imagen_url = null;
    if (imagen_base64) {
      // Obtener la imagen anterior para borrarla
      const actual = await this.obtenerPorId(id);
      if (actual && actual.imagen_url) {
        deleteImage(actual.imagen_url);
      }
      imagen_url = saveBase64Image(imagen_base64);
    } else if (mantener_imagen) {
      // Mantener la imagen existente — obtenerla de la DB
      const actual = await this.obtenerPorId(id);
      imagen_url = actual ? actual.imagen_url : null;
    }
    // Si mantener_imagen es false y no hay imagen_base64, se setea a null (borrar imagen)

    await db.query(
      `UPDATE comunicados SET
        titulo = ?, contenido = ?, categoria = ?,
        imagen_url = ?, url_referencia = ?,
        ultima_actualizacion = NOW()
       WHERE id_comunicado = ?`,
      [titulo, contenido, categoria, imagen_url, url_referencia || null, id]
    );

    return { success: true, imagen_url };
  } catch (error) {
    console.error('Error en actualizar:', error);
    throw error;
  }
};

exports.eliminar = async (id) => {
  try {
    // Obtener datos para borrar la imagen del filesystem
    const actual = await this.obtenerPorId(id);
    if (actual && actual.imagen_url) {
      deleteImage(actual.imagen_url);
    }

    await db.query('DELETE FROM comunicados WHERE id_comunicado = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error en eliminar:', error);
    throw error;
  }
};
