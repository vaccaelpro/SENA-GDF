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
