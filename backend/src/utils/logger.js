/**
 * Logger centralizado para SENA-GDF.
 * - Sin dependencias externas (usa console nativo de Node.js).
 * - Niveles: INFO, WARN, ERROR.
 * - Timestamps ISO para compatibilidad con Render y cualquier entorno.
 * - NO registra contrasenas, tokens completos ni documentos de identidad.
 */

const LEVELS = { INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };

/**
 * Escribe una linea de log formateada en stdout o stderr.
 * @param {'INFO'|'WARN'|'ERROR'} level
 * @param {string} context - Modulo o componente (ej: 'AUTH', 'DB', 'ADMIN')
 * @param {string} message - Mensaje descriptivo
 * @param {object} [meta]  - Metadatos adicionales sin datos sensibles
 */
function log(level, context, message, meta) {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    const line = `[${timestamp}] [${level}] [${context}] ${message}${metaStr}`;

    if (level === LEVELS.ERROR) {
        console.error(line);
    } else {
        console.log(line);
    }
}

const logger = {
    info:  (context, message, meta) => log(LEVELS.INFO,  context, message, meta),
    warn:  (context, message, meta) => log(LEVELS.WARN,  context, message, meta),
    error: (context, message, meta) => log(LEVELS.ERROR, context, message, meta),

    /**
     * Registra una peticion HTTP entrante. No registra el body para evitar
     * exponer datos sensibles (contrasenas, tokens, informacion personal).
     * @param {import('express').Request} req
     */
    request: (req) => {
        log(LEVELS.INFO, 'HTTP', `${req.method} ${req.path}`);
    },
};

module.exports = logger;
