const db = require('../../config/database');
const { saveBase64Image, deleteImage } = require('../../utils/uploadHelper');

exports.listarUsuarios = async () => {
    try {
        const [rows] = await db.query(
            "SELECT id_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, tipo_documento, documento, celular, grupo_formacion, correo_electronico, rol, tipo_apoyo FROM usuario WHERE rol != 'ADMIN'"
        );
        return rows;
    } catch (error) {
        console.error("Error en listarUsuarios:", error);
        throw error;
    }
};

exports.actualizarUsuario = async (id, data) => {
    try {
        const {
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            tipo_documento,
            documento,
            celular,
            grupo_formacion,
            correo_electronico,
            rol,
            tipo_apoyo
        } = data;

        await db.query(
            `UPDATE usuario SET 
                primer_nombre = ?, 
                segundo_nombre = ?, 
                primer_apellido = ?, 
                segundo_apellido = ?, 
                tipo_documento = ?, 
                documento = ?, 
                celular = ?, 
                grupo_formacion = ?, 
                correo_electronico = ?, 
                rol = ?, 
                tipo_apoyo = ?,
                ultima_actualizacion = NOW()
            WHERE id_usuario = ?`,
            [
                primer_nombre,
                segundo_nombre || null,
                primer_apellido,
                segundo_apellido || null,
                tipo_documento,
                documento,
                celular,
                grupo_formacion,
                correo_electronico,
                rol,
                tipo_apoyo,
                id
            ]
        );
        return { success: true };
    } catch (error) {
        console.error("Error en actualizarUsuario:", error);
        throw error;
    }
};

exports.eliminarUsuario = async (id) => {
    try {
        await db.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarUsuario:", error);
        throw error;
    }
};

exports.getTestMessage = async () => {
    return { message: "Módulo de administrador funcionando correctamente (Desde Servicio)" };
}

exports.registrarExportacion = async (data) => {
    try {
        console.log("INSERTANDO EXPORTACION EN DB:", data);
        const { nombre_archivo, usuario_id_usuario, tipo_exportacion } = data;
        const [result] = await db.query(
            "INSERT INTO exportaciones (nombre_archivo, fecha_exportacion, ultima_actualizacion, usuario_id_usuario, tipo_exportacion) VALUES (?, NOW(), NOW(), ?, ?)",
            [nombre_archivo, usuario_id_usuario, tipo_exportacion]
        );
        console.log("RESULTADO DB:", result);
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error("Error en registrarExportacion (SERVICE):", error);
        throw error;
    }
};
exports.crearGrupo = async (data) => {
    try {
        const { nombre, descripcion, tipo_apoyo } = data;
        const [result] = await db.query(
            "INSERT INTO grupos (nombre, descripcion, tipo_apoyo, fecha_creacion, ultima_actualizacion) VALUES (?, ?, ?, NOW(), NOW())",
            [nombre, descripcion, tipo_apoyo]
        );
        const grupoId = result.insertId;

        const [usuarios] = await db.query(
            "SELECT id_usuario FROM usuario WHERE tipo_apoyo = ? AND rol = 'USUARIO'",
            [tipo_apoyo]
        );

        if (usuarios.length > 0) {
            const values = usuarios.map(u => [grupoId, u.id_usuario]);
            await db.query(
                "INSERT INTO grupos_usuarios (grupo_id, usuario_id) VALUES ?",
                [values]
            );
        }

        return { success: true, id_grupo: grupoId, usuarios_agregados: usuarios.length };
    } catch (error) {
        console.error("Error en crearGrupo:", error);
        throw error;
    }
};

exports.listarGrupos = async () => {
    try {
        const [rows] = await db.query(
            `SELECT g.*, 
            (SELECT COUNT(*) FROM usuario u WHERE LOWER(TRIM(u.tipo_apoyo)) = LOWER(TRIM(g.tipo_apoyo)) AND u.rol = 'USUARIO') as cantidad_miembros,
            (SELECT GROUP_CONCAT(CONCAT(u2.primer_nombre, ' ', u2.primer_apellido, ' (Ficha: ', IFNULL(u2.grupo_formacion, 'N/A'), ')') SEPARATOR ', ') 
             FROM usuario u2 WHERE LOWER(TRIM(u2.tipo_apoyo)) = LOWER(TRIM(g.tipo_apoyo)) AND u2.rol = 'USUARIO') as nombres_miembros
            FROM grupos g 
            ORDER BY g.fecha_creacion DESC`
        );
        return rows;
    } catch (error) {
        console.error("Error en listarGrupos:", error);
        throw error;
    }
};

exports.obtenerMensajesGrupo = async (grupoId) => {
    try {
        const [rows] = await db.query(
            `SELECT m.id_mensaje, m.mensaje, m.fecha_envio, m.usuario_id, u.primer_nombre, u.primer_apellido, u.rol 
            FROM chat_grupo m 
            JOIN usuario u ON m.usuario_id = u.id_usuario 
            WHERE m.grupo_id = ? 
            ORDER BY m.fecha_envio ASC`,
            [grupoId]
        );
        return rows;
    } catch (error) {
        console.error("Error en obtenerMensajesGrupo:", error);
        throw error;
    }
};

exports.enviarMensajeGrupo = async (grupoId, usuarioId, mensaje) => {
    try {
        const [result] = await db.query(
            "INSERT INTO chat_grupo (grupo_id, usuario_id, mensaje, fecha_envio) VALUES (?, ?, ?, NOW())",
            [grupoId, usuarioId, mensaje]
        );
        return { success: true, id_mensaje: result.insertId };
    } catch (error) {
        console.error("Error en enviarMensajeGrupo:", error);
        throw error;
    }
};

exports.actualizarGrupo = async (id, nombre, descripcion) => {
    try {
        await db.query(
            "UPDATE grupos SET nombre = ?, descripcion = ?, ultima_actualizacion = NOW() WHERE id_grupo = ?",
            [nombre, descripcion, id]
        );
        return { success: true };
    } catch (error) {
        console.error("Error en actualizarGrupo:", error);
        throw error;
    }
};

exports.eliminarGrupo = async (id) => {
    try {
        await db.query("DELETE FROM chat_grupo WHERE grupo_id = ?", [id]);
        await db.query("DELETE FROM grupos_usuarios WHERE grupo_id = ?", [id]);
        await db.query("DELETE FROM grupos WHERE id_grupo = ?", [id]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarGrupo:", error);
        throw error;
    }
};

exports.actualizarMensajeGrupo = async (id, mensaje) => {
    try {
        await db.query(
            "UPDATE chat_grupo SET mensaje = ? WHERE id_mensaje = ?",
            [mensaje, id]
        );
        return { success: true };
    } catch (error) {
        console.error("Error en actualizarMensajeGrupo:", error);
        throw error;
    }
};

exports.eliminarMensajeGrupo = async (id) => {
    try {
        await db.query("DELETE FROM chat_grupo WHERE id_mensaje = ?", [id]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarMensajeGrupo:", error);
        throw error;
    }
};

exports.obtenerDetalleGrupo = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT g.*, 
            (SELECT COUNT(*) FROM usuario u WHERE LOWER(TRIM(u.tipo_apoyo)) = LOWER(TRIM(g.tipo_apoyo)) AND u.rol = 'USUARIO') as total_aprendices
            FROM grupos g 
            WHERE g.id_grupo = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error("Error en obtenerDetalleGrupo:", error);
        throw error;
    }
};

exports.obtenerMiembrosGrupo = async (grupoId) => {
    try {
        const [grupo] = await db.query("SELECT tipo_apoyo FROM grupos WHERE id_grupo = ?", [grupoId]);
        if (grupo.length === 0) return [];
        
        const tipoApoyo = grupo[0].tipo_apoyo;

        const [rows] = await db.query(
            `SELECT id_usuario, primer_nombre, primer_apellido, grupo_formacion, rol 
            FROM usuario 
            WHERE tipo_apoyo = ? AND rol = 'USUARIO'`,
            [tipoApoyo]
        );
        return rows;
    } catch (error) {
        console.error("Error en obtenerMiembrosGrupo:", error);
        throw error;
    }
};

// =================== COMUNICADOS / NOVEDADES ===================

exports.listarComunicadosPublicos = async () => {
    try {
        const [rows] = await db.query(
            `SELECT id_comunicado, titulo, contenido, categoria, imagen_url, url_referencia, fecha_publicacion
             FROM comunicados
             ORDER BY fecha_publicacion DESC`
        );
        return rows;
    } catch (error) {
        console.error('Error en listarComunicadosPublicos:', error);
        throw error;
    }
};

exports.listarComunicadosAdmin = async () => {
    try {
        const [rows] = await db.query(
            `SELECT c.*, u.primer_nombre, u.primer_apellido
             FROM comunicados c
             JOIN usuario u ON c.usuario_id_usuario = u.id_usuario
             ORDER BY c.fecha_publicacion DESC`
        );
        return rows;
    } catch (error) {
        console.error('Error en listarComunicadosAdmin:', error);
        throw error;
    }
};

exports.obtenerComunicadoPorId = async (id) => {
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
        console.error('Error en obtenerComunicadoPorId:', error);
        throw error;
    }
};

exports.crearComunicado = async (data, usuarioId) => {
    try {
        const { titulo, contenido, categoria, imagen_base64, url_referencia } = data;

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
        console.error('Error en crearComunicado:', error);
        throw error;
    }
};

exports.actualizarComunicado = async (id, data) => {
    try {
        const { titulo, contenido, categoria, imagen_base64, url_referencia, mantener_imagen } = data;

        let imagen_url = null;
        if (imagen_base64) {
            const actual = await this.obtenerComunicadoPorId(id);
            if (actual && actual.imagen_url) {
                deleteImage(actual.imagen_url);
            }
            imagen_url = saveBase64Image(imagen_base64);
        } else if (mantener_imagen) {
            const actual = await this.obtenerComunicadoPorId(id);
            imagen_url = actual ? actual.imagen_url : null;
        }

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
        console.error('Error en actualizarComunicado:', error);
        throw error;
    }
};

exports.eliminarComunicado = async (id) => {
    try {
        const actual = await this.obtenerComunicadoPorId(id);
        if (actual && actual.imagen_url) {
            deleteImage(actual.imagen_url);
        }

        await db.query('DELETE FROM comunicados WHERE id_comunicado = ?', [id]);
        return { success: true };
    } catch (error) {
        console.error('Error en eliminarComunicado:', error);
        throw error;
    }
};
