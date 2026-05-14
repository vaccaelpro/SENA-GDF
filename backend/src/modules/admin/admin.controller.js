const service = require('./admin.service')

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await service.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error("ERROR LISTAR:", error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.actualizarUsuario(id, req.body);
        res.json(result);
    } catch (error) {
        console.error("ERROR ACTUALIZAR:", error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
}

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.eliminarUsuario(id);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR:", error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}

exports.test = async (req, res) => {
    try {
        const result = await service.getTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

exports.registrarExportacion = async (req, res) => {
    try {
        console.log("RECIBIENDO SOLICITUD DE EXPORTACION:", req.body);
        const result = await service.registrarExportacion(req.body);
        console.log("EXPORTACION REGISTRADA CON EXITO:", result);
        res.json(result);
    } catch (error) {
        console.error("ERROR REGISTRAR EXPORTACION (CONTROLLER):", error);
        res.status(500).json({ error: 'Error al registrar la exportación' });
    }
}

// ------------------------------------------------------------------------
// CONTROLADOR PARA COMUNICADOS (NOVEDADES)
// ------------------------------------------------------------------------
// Este bloque actúa como un intermediario entre las peticiones HTTP y la lógica de base de datos (servicios).
// Su responsabilidad es recibir los datos, validarlos/prepararlos y devolver la respuesta al cliente.

// Función para recuperar todos los comunicados. Devuelve un arreglo JSON al frontend.
exports.listarComunicados = async (req, res) => {
    try {
        const comunicados = await service.listarComunicados();
        res.json(comunicados);
    } catch (error) {
        console.error("ERROR LISTAR COMUNICADOS:", error);
        res.status(500).json({ error: 'Error al obtener comunicados' });
    }
}

// Función para procesar la creación de un comunicado.
exports.crearComunicado = async (req, res) => {
    try {
        // Obtenemos los campos de texto del cuerpo de la petición (FormData)
        const { titulo, contenido, categoria, url } = req.body;
        
        // Si multer guardó un archivo, obtenemos el nombre de ese archivo generado; si no, es nulo.
        const imagen = req.file ? req.file.filename : null; 

        // Organizamos los datos antes de enviarlos a la base de datos
        // Por ahora se pasa `usuario_id_usuario: 1` por defecto (idealmente esto viene del token de sesión)
        const data = { titulo, contenido, categoria, imagen, url, usuario_id_usuario: 1 };
        
        const result = await service.crearComunicado(data);
        res.status(201).json(result); // Respondemos con estado 201 (Creado)
    } catch (error) {
        console.error("ERROR CREAR COMUNICADO:", error);
        res.status(500).json({ error: 'Error al crear comunicado' });
    }
}

// Función para gestionar la edición de un comunicado existente.
exports.actualizarComunicado = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID desde la URL
        const { titulo, contenido, categoria, url } = req.body; // Campos modificados
        
        const data = { titulo, contenido, categoria, url };
        
        // Solo actualizamos la imagen en la base de datos si el usuario subió una nueva
        if (req.file) {
            data.imagen = req.file.filename;
        }

        const result = await service.actualizarComunicado(id, data);
        res.json(result);
    } catch (error) {
        console.error("ERROR ACTUALIZAR COMUNICADO:", error);
        res.status(500).json({ error: 'Error al actualizar comunicado' });
    }
}

// Función para eliminar un comunicado de la base de datos.
exports.eliminarComunicado = async (req, res) => {
    try {
        const { id } = req.params; // ID a eliminar
        const result = await service.eliminarComunicado(id);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR COMUNICADO:", error);
        res.status(500).json({ error: 'Error al eliminar comunicado' });
    }
}
