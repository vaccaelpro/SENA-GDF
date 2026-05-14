const db = require('../../config/database')

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

// ------------------------------------------------------------------------
// SERVICIO DE BASE DE DATOS PARA COMUNICADOS (NOVEDADES)
// ------------------------------------------------------------------------
// Aquí es donde ejecutamos las sentencias SQL reales.
// Aislar esto del controlador mantiene el código ordenado y reutilizable.

// Obtiene todos los comunicados ordenados por los más recientes primero.
exports.listarComunicados = async () => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM comunicados ORDER BY fecha_publicacion DESC"
        );
        return rows;
    } catch (error) {
        console.error("Error en listarComunicados:", error);
        throw error;
    }
};

// Inserta un nuevo registro en la tabla comunicados.
exports.crearComunicado = async (data) => {
    try {
        const { titulo, contenido, categoria, imagen, url, usuario_id_usuario } = data;
        const [result] = await db.query(
            "INSERT INTO comunicados (titulo, contenido, categoria, imagen, url, fecha_publicacion, ultima_actualizacion, usuario_id_usuario) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)",
            [titulo, contenido, categoria, imagen, url, usuario_id_usuario || 1] // Asignando admin (ID 1) por defecto si no viene
        );
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error("Error en crearComunicado:", error);
        throw error;
    }
};

// Actualiza un registro existente usando su ID. 
// Construye la consulta dinámicamente: solo actualiza la imagen si se envía una nueva.
exports.actualizarComunicado = async (id, data) => {
    try {
        const { titulo, contenido, categoria, imagen, url } = data;
        let query = "UPDATE comunicados SET titulo = ?, contenido = ?, categoria = ?, url = ?, ultima_actualizacion = NOW()";
        let params = [titulo, contenido, categoria, url];

        // Si hay una nueva imagen adjunta, la añadimos al query y a los parámetros
        if (imagen !== undefined && imagen !== null) {
            query += ", imagen = ?";
            params.push(imagen);
        }

        query += " WHERE id_comunicado = ?";
        params.push(id);

        await db.query(query, params);
        return { success: true };
    } catch (error) {
        console.error("Error en actualizarComunicado:", error);
        throw error;
    }
};

// Borra definitivamente un comunicado usando su ID.
exports.eliminarComunicado = async (id) => {
    try {
        await db.query("DELETE FROM comunicados WHERE id_comunicado = ?", [id]);
        return { success: true };
    } catch (error) {
        console.error("Error en eliminarComunicado:", error);
        throw error;
    }
};
