const mysql = require('mysql2');
require('dotenv').config();

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

conexion.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos establecida con éxito.');
});

module.exports = conexion;