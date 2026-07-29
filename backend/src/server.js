require("dotenv").config();
const logger = require("./utils/logger");
const app = require("./app");

const PORT = process.env.PORT || 3001;

logger.info('SERVER', 'Iniciando SENA-GDF Backend...');

app.listen(PORT, () => {
  logger.info('SERVER', `Servidor escuchando en puerto ${PORT}`, { port: PORT, env: process.env.NODE_ENV || 'development' });
});

