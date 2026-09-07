const fetch = require('node-fetch');
const logger = require('./logger');

// Municipios del Área Metropolitana del Valle de Aburrá cubiertos por el Metro
const MUNICIPIOS_VALLE_ABURRA = [
  'medellin', 'medellín',
  'bello',
  'itagui', 'itagüí',
  'envigado',
  'sabaneta',
  'la estrella',
  'caldas',
  'copacabana',
  'girardota',
  'barbosa'
];

// Mapeo general de barrios conocidos a su municipio en el Valle de Aburrá
const BARRIOS_MUNICIPIO = {
  // Medellín (Comunas populares y barrios)
  'popular': 'medellin', 'santa cruz': 'medellin', 'manrique': 'medellin',
  'aranjuez': 'medellin', 'castilla': 'medellin', 'doce de octubre': 'medellin',
  'robledo': 'medellin', 'villa hermosa': 'medellin', 'buenos aires': 'medellin',
  'la candelaria': 'medellin', 'centro': 'medellin', 'laureles': 'medellin',
  'estadio': 'medellin', 'la america': 'medellin', 'san javier': 'medellin',
  'el poblado': 'medellin', 'guayabal': 'medellin', 'belen': 'medellin', 'belén': 'medellin',
  'boston': 'medellin', 'prado': 'medellin', 'campo valdes': 'medellin',
  'florencia': 'medellin', 'pedregal': 'medellin', 'moravia': 'medellin',
  'san antonio de prado': 'medellin', 'san cristobal': 'medellin', 'santa elena': 'medellin',
  'san sebastian de palmitas': 'medellin', 'altavista': 'medellin',

  // Bello
  'niquia': 'bello', 'niquía': 'bello', 'cabañas': 'bello', 'paris': 'bello', 'parís': 'bello',
  'santa ana': 'bello', 'rincon santo': 'bello', 'el trapiche': 'bello', 'cumbre': 'bello',
  'bellavista': 'bello', 'madera': 'bello', 'sucre': 'bello', 'mirador': 'bello',

  // Itagüí
  'santa maria': 'itagui', 'santa maría': 'itagui', 'san fernando': 'itagui',
  'calatrava': 'itagui', 'la gloria': 'itagui', 'el rosario': 'itagui',
  'ditaires': 'itagui', 'pilsen': 'itagui', 'san gabriel': 'itagui',

  // Envigado
  'el dorado': 'envigado', 'la paz': 'envigado', 'alcala': 'envigado', 'alcalá': 'envigado',
  'senorial': 'envigado', 'señorial': 'envigado', 'san marcos': 'envigado',
  'las vegas': 'envigado', 'el portal': 'envigado',

  // Sabaneta
  'las lomitas': 'sabaneta', 'betania': 'sabaneta', 'la barquereña': 'sabaneta',
  'calle del banco': 'sabaneta', 'san joaquin': 'sabaneta'
};

/**
 * Normaliza cadenas de texto (minúsculas, sin tildes ni caracteres extraños)
 */
function normalizar(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Valida la estructura básica de una dirección urbana colombiana
 */
function validarFormatoDireccion(direccion) {
  if (!direccion || direccion.trim().length < 5) return false;
  const regexNomenclatura = /^(cl|calle|cra|cr|carrera|dg|diag|diagonal|tv|trans|transversal|av|avenida|cir|circular|mz|manzana|auto|autopista)\b/i;
  return regexNomenclatura.test(direccion.trim()) || /\d+[\s]*#|no|n°|numero/i.test(direccion);
}

/**
 * Valida y georreferencia dirección, barrio y municipio
 * @param {Object} params
 * @param {string} params.direccion - ej: "Calle 50 # 45-20"
 * @param {string} params.barrio - ej: "Boston"
 * @param {string} params.municipio - ej: "Medellín"
 * @returns {Promise<Object>} Resultado de validación geográfica
 */
async function validarUbicacion({ direccion, barrio, municipio }) {
  const normMun = normalizar(municipio);
  const normBarrio = normalizar(barrio);
  const esValleAburra = MUNICIPIOS_VALLE_ABURRA.some(m => normalizar(m) === normMun);
  const tieneFormatoValido = validarFormatoDireccion(direccion);

  const resultado = {
    esValleAburra,
    formatoDireccionValido: tieneFormatoValido,
    coherente: false,
    detalles: [],
    geocodificado: null,
  };

  if (!esValleAburra) {
    resultado.detalles.push(
      `El municipio '${municipio || 'No especificado'}' no parece pertenecer al Área Metropolitana del Valle de Aburrá (Medellín, Bello, Itagüí, Envigado, Sabaneta, etc.).`
    );
  }

  if (!tieneFormatoValido) {
    resultado.detalles.push(
      `La dirección '${direccion || ''}' no parece tener una nomenclatura válida (ej: Calle, Carrera, Transversal, Diagonal seguido de numeración con #).`
    );
  }

  // Verificación heurística del barrio si está en nuestro catálogo
  if (normBarrio && BARRIOS_MUNICIPIO[normBarrio]) {
    const munEsperado = BARRIOS_MUNICIPIO[normBarrio];
    if (normMun && normMun !== munEsperado) {
      resultado.detalles.push(
        `Posible discrepancia: El barrio '${barrio}' suele ubicarse en el municipio de '${munEsperado.toUpperCase()}', pero indicaste '${municipio}'.`
      );
    }
  }

  // Consulta opcional y gratuita a OpenStreetMap Nominatim
  try {
    const query = `${direccion || ''}, ${barrio || ''}, ${municipio || 'Medellín'}, Antioquia, Colombia`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout max

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SENA-GDF-ValidadorMetro/1.0 (soporte.senagdf@gmail.com)',
        'Accept-Language': 'es-CO,es;q=0.9',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        resultado.geocodificado = {
          lat: data[0].lat,
          lon: data[0].lon,
          displayName: data[0].display_name,
        };
      }
    }
  } catch (err) {
    logger.warn('GEO_VALIDATION', 'Nominatim no respondió a tiempo o error de red (no bloqueante)', { error: err.message });
  }

  // Se considera coherente si está en el Valle de Aburrá y tiene formato de vía válido
  resultado.coherente = esValleAburra && tieneFormatoValido && resultado.detalles.length === 0;

  return resultado;
}

module.exports = {
  validarUbicacion,
  validarFormatoDireccion,
  normalizar,
  MUNICIPIOS_VALLE_ABURRA,
};
