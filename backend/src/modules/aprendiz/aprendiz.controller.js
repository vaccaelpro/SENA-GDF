const service = require('./aprendiz.service')

exports.test = async (req, res) => {
    try {
        const result = await service.getTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

exports.obtenerMiGrupo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const grupo = await service.obtenerMiGrupo(id_usuario);
        if (!grupo) {
            return res.status(404).json({ error: 'No tienes un grupo asignado' });
        }
        res.json(grupo);
    } catch (error) {
        console.error("ERROR MI GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener mi grupo' });
    }
}

exports.obtenerMiembrosMiGrupo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const miembros = await service.obtenerMiembrosMiGrupo(id_usuario);
        res.json(miembros);
    } catch (error) {
        console.error("ERROR MIEMBROS MI GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener miembros' });
    }
}

exports.obtenerMensajesMiGrupo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const mensajes = await service.obtenerMensajesMiGrupo(id_usuario);
        res.json(mensajes);
    } catch (error) {
        console.error("ERROR MENSAJES MI GRUPO:", error);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
}

// ============= METAS DE AHORRO =============

exports.listarMetas = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const metas = await service.listarMetas(id_usuario);
        res.json(metas);
    } catch (error) {
        console.error("ERROR LISTAR METAS:", error);
        res.status(500).json({ error: 'Error al listar metas' });
    }
};

exports.crearMeta = async (req, res) => {
    try {
        const nueva = await service.crearMeta(req.body);
        res.status(201).json(nueva);
    } catch (error) {
        console.error("ERROR CREAR META:", error);
        res.status(500).json({ error: 'Error al crear meta' });
    }
};

exports.editarMeta = async (req, res) => {
    try {
        const { id_ahorro } = req.params;
        const actualizada = await service.editarMeta(id_ahorro, req.body);
        res.json(actualizada);
    } catch (error) {
        console.error("ERROR EDITAR META:", error);
        res.status(500).json({ error: 'Error al editar meta' });
    }
};

exports.agregarMonto = async (req, res) => {
    try {
        const { id_ahorro } = req.params;
        const { monto } = req.body;
        const result = await service.agregarMonto(id_ahorro, monto);
        res.json(result);
    } catch (error) {
        console.error("ERROR AGREGAR MONTO:", error);
        res.status(500).json({ error: 'Error al agregar monto' });
    }
};

exports.eliminarMeta = async (req, res) => {
    try {
        const { id_ahorro } = req.params;
        const result = await service.eliminarMeta(id_ahorro);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR META:", error);
        res.status(500).json({ error: 'Error al eliminar meta' });
    }
};

// ============= INGRESOS =============

exports.listarIngresos = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const ingresos = await service.listarIngresos(id_usuario);
        res.json(ingresos);
    } catch (error) {
        console.error("ERROR LISTAR INGRESOS:", error);
        res.status(500).json({ error: 'Error al listar ingresos' });
    }
};

exports.crearIngreso = async (req, res) => {
    try {
        const nuevo = await service.crearIngreso(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("ERROR CREAR INGRESO:", error);
        res.status(500).json({ error: 'Error al crear ingreso' });
    }
};

exports.eliminarIngreso = async (req, res) => {
    try {
        const { id_ingreso } = req.params;
        const result = await service.eliminarIngreso(id_ingreso);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR INGRESO:", error);
        res.status(500).json({ error: 'Error al eliminar ingreso' });
    }
};

// ============= GASTOS =============

exports.listarGastos = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const gastos = await service.listarGastos(id_usuario);
        res.json(gastos);
    } catch (error) {
        console.error("ERROR LISTAR GASTOS:", error);
        res.status(500).json({ error: 'Error al listar gastos' });
    }
};

exports.crearGasto = async (req, res) => {
    try {
        const nuevo = await service.crearGasto(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("ERROR CREAR GASTO:", error);
        res.status(500).json({ error: 'Error al crear gasto' });
    }
};

exports.eliminarGasto = async (req, res) => {
    try {
        const { id_gasto } = req.params;
        const result = await service.eliminarGasto(id_gasto);
        res.json(result);
    } catch (error) {
        console.error("ERROR ELIMINAR GASTO:", error);
        res.status(500).json({ error: 'Error al eliminar gasto' });
    }
};

