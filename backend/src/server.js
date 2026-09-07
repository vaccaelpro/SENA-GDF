require("dotenv").config();
const logger = require("./utils/logger");
const app = require("./app");

const PORT = process.env.PORT || 3001;

logger.info('SERVER', 'Iniciando SENA-GDF Backend...');

process.on('unhandledRejection', (reason) => {
  logger.error('SERVER', 'Promesa rechazada no manejada:', { reason: reason?.message || reason });
});

process.on('uncaughtException', (err) => {
  logger.error('SERVER', 'Excepción no capturada en servidor:', { error: err?.message, stack: err?.stack });
});

app.listen(PORT, () => {
  logger.info('SERVER', `Servidor escuchando en puerto ${PORT}`, { port: PORT, env: process.env.NODE_ENV || 'development' });
});


