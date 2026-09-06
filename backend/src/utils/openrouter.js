/**
 * Motor OpenRouter con Fallback Loop Automático
 * ================================================
 * Llama a la API de OpenRouter y rota automáticamente de modelo
 * cuando uno se queda sin tokens, excede rate-limit (429), cuota (402)
 * o devuelve cualquier error de servidor (5xx), sin requerir cambiar API keys.
 *
 * Variables de entorno requeridas en .env:
 *   OPENROUTER_API_KEY   - Clave de la API de OpenRouter
 *   OPENROUTER_MODELS    - Lista de modelos separados por coma (en orden de preferencia)
 *   OPENROUTER_SITE_URL  - URL del sitio (opcional, para identificación)
 *   OPENROUTER_SITE_NAME - Nombre del sitio (opcional, para identificación)
 */

const fetch = require('node-fetch');
const logger = require('./logger');

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Códigos de error que indican que el modelo está temporalmente indisponible
 * o sin tokens — en estos casos se pasa al siguiente modelo de la lista.
 */
const FALLBACK_ERROR_CODES = new Set([429, 402, 503, 502, 500]);

/**
 * Obtiene la lista de modelos configurados desde las variables de entorno.
 * @returns {string[]} Array de nombres de modelos
 */
function obtenerModelos() {
    const modelosRaw = process.env.OPENROUTER_MODELS || '';
    const modelos = modelosRaw
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

    if (modelos.length === 0) {
        throw new Error(
            'No hay modelos de OpenRouter configurados. ' +
            'Define OPENROUTER_MODELS en el archivo .env del backend.'
        );
    }
    return modelos;
}

/**
 * Realiza una petición HTTP a OpenRouter con un modelo específico.
 * @param {string} modelo - Nombre del modelo OpenRouter a usar
 * @param {Array<{role: string, content: string}>} mensajes - Historial de mensajes
 * @param {number} [maxTokens=1024] - Límite de tokens de respuesta
 * @returns {Promise<string>} Texto de respuesta del modelo
 * @throws Error si la respuesta no es exitosa o el cuerpo es inválido
 */
async function llamarModelo(modelo, mensajes, maxTokens = 1024) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error(
            'OPENROUTER_API_KEY no está definida en el archivo .env del backend.'
        );
    }

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Headers de identificación opcionales de OpenRouter
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'SENA-GDF',
    };

    const body = JSON.stringify({
        model: modelo,
        messages: mensajes,
        max_tokens: maxTokens,
        temperature: 0.7,
    });

    const res = await fetch(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers,
        body,
    });

    // Si el código es de tipo "fallback", lanzamos un error especial con el código
    if (FALLBACK_ERROR_CODES.has(res.status)) {
        const errorText = await res.text().catch(() => 'Sin cuerpo de error');
        const err = new Error(`Modelo ${modelo} devolvió ${res.status}: ${errorText}`);
        err.statusCode = res.status;
        err.esFallback = true;
        throw err;
    }

    if (!res.ok) {
        const errorText = await res.text().catch(() => 'Sin cuerpo de error');
        throw new Error(`Error de OpenRouter (${res.status}): ${errorText}`);
    }

    const json = await res.json();

    // Extrae el texto de respuesta del formato estándar de OpenAI/OpenRouter
    const contenido = json?.choices?.[0]?.message?.content;
    if (!contenido) {
        throw new Error(`Respuesta vacía o malformada del modelo ${modelo}`);
    }

    return contenido.trim();
}

/**
 * Función principal con Fallback Loop.
 * Intenta obtener respuesta del primer modelo de la lista.
 * Si falla por tokens agotados/rate-limit/cuota, pasa al siguiente
 * automáticamente hasta agotar todos los modelos de la lista.
 *
 * @param {Array<{role: string, content: string}>} mensajes - Historial de mensajes
 * @param {number} [maxTokens=1024] - Límite de tokens de respuesta
 * @returns {Promise<{respuesta: string, modeloUsado: string}>}
 * @throws Error si ningún modelo pudo responder
 */
async function chatConFallback(mensajes, maxTokens = 1024) {
    const modelos = obtenerModelos();
    let ultimoError = null;

    // ─── WHILE FALLBACK LOOP ──────────────────────────────────────────────────
    let indice = 0;
    while (indice < modelos.length) {
        const modelo = modelos[indice];
        try {
            logger.info('OPENROUTER', `Intentando modelo [${indice + 1}/${modelos.length}]: ${modelo}`);
            const respuesta = await llamarModelo(modelo, mensajes, maxTokens);
            logger.info('OPENROUTER', `Respuesta exitosa con modelo: ${modelo}`);
            return { respuesta, modeloUsado: modelo };
        } catch (err) {
            ultimoError = err;
            if (err.esFallback) {
                // Tokens agotados, rate limit o cuota — pasamos al siguiente modelo
                logger.warn(
                    'OPENROUTER',
                    `Modelo ${modelo} sin disponibilidad (código ${err.statusCode}). Rotando al siguiente agente de IA...`,
                    { error: err.message }
                );
            } else {
                // Error no recuperable (ej: respuesta malformada, red caída)
                logger.error('OPENROUTER', `Error no recuperable con modelo ${modelo}`, { error: err.message });
            }
        }
        indice++;
    }
    // ─── FIN WHILE FALLBACK LOOP ──────────────────────────────────────────────

    throw new Error(
        `Todos los modelos de OpenRouter fallaron. Último error: ${ultimoError?.message || 'Desconocido'}`
    );
}

module.exports = { chatConFallback };
