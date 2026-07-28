const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');


let sslConfig = undefined;
const caPath = path.join(__dirname, '../../certs/ca.pem');

if (fs.existsSync(caPath)) {
  sslConfig = { ca: fs.readFileSync(caPath).toString() };
} else if (process.env.DB_SSL_CA) {
  sslConfig = { ca: Buffer.from(process.env.DB_SSL_CA, 'base64').toString('utf8') };
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
    console.error('❌ Error al conectar a la base de datos:', err.message);
    console.error('   Código:', err.code);
    return;
  }
  console.log('✅ Conectado a la base de datos:', process.env.DB_NAME || 'sena');
  console.log('   Host:', process.env.DB_HOST || 'localhost');
  console.log('   SSL:', sslConfig ? 'habilitado' : 'deshabilitado');
  connection.release();
});

module.exports = pool.promise();