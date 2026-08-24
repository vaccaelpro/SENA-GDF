const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');


let sslConfig = undefined;
const caPath = path.join(__dirname, '../../certs/ca.pem');

if (fs.existsSync(caPath)) {
  sslConfig = { ca: fs.readFileSync(caPath).toString() };
  logger.info('DB', 'Certificado SSL cargado desde archivo local (ca.pem)');
} else if (process.env.DB_SSL_CA) {
  sslConfig = { ca: Buffer.from(process.env.DB_SSL_CA, 'base64').toString('utf8') };
  logger.info('DB', 'Certificado SSL cargado desde variable de entorno DB_SSL_CA');
} else {
  logger.warn('DB', 'SSL no configurado. Conexion sin cifrado.');
}


const poolConfig = {
  host: process.env.DB_HOST || process.env.DB_HOST_LOCAL,
  user: process.env.DB_USER || process.env.DB_USER_LOCAL,
  port: parseInt(process.env.DB_PORT) || process.env.DB_PORT_LOCAL,
  password: process.env.DB_PASSWORD || process.env.DB_PASSWORD_LOCAL,
  database: process.env.DB_NAME || process.env.DB_NAME_LOCAL,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 30000,
};

if (sslConfig) {
  poolConfig.ssl = sslConfig;
}

const pool = mysql.createPool(poolConfig);

pool.getConnection((err, connection) => {
  if (err) {
    logger.error('DB', 'Error al conectar a la base de datos', {
      code: err.code,
      message: err.message,
      host: process.env.DB_HOST || process.env.DB_HOST_LOCAL,
    });
    return;
  }
  logger.info('DB', 'Conexion establecida correctamente', {
    database: process.env.DB_NAME || process.env.DB_NAME_LOCAL,
    host: process.env.DB_HOST || process.env.DB_HOST_LOCAL,
    ssl: sslConfig ? 'habilitado' : 'deshabilitado',
  });
  connection.release();
});

module.exports = pool.promise();