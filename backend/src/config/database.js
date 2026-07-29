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
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sena',
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
      host: process.env.DB_HOST || 'localhost',
    });
    return;
  }
  logger.info('DB', 'Conexion establecida correctamente', {
    database: process.env.DB_NAME || 'sena',
    host: process.env.DB_HOST || 'localhost',
    ssl: sslConfig ? 'habilitado' : 'deshabilitado',
  });
  connection.release();
});

module.exports = pool.promise();