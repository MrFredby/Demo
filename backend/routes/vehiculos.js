const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las marcas
router.get('/marcas', (req, res) => {
    db.query('SELECT * FROM marcas_vehiculo WHERE activo = 1', (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados);
    });
});

// Obtener modelos por marca
router.get('/modelos/:id_marca', (req, res) => {
    db.query(
        'SELECT * FROM modelos_vehiculo WHERE id_marca = ? AND activo = 1',
        [req.params.id_marca],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

// Obtener versiones por modelo
router.get('/versiones/:id_modelo', (req, res) => {
    db.query(
        'SELECT * FROM versiones_vehiculo WHERE id_modelo = ? AND activo = 1',
        [req.params.id_modelo],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

// Obtener productos compatibles con una version
router.get('/compatibles/:id_version', (req, res) => {
    db.query(
        `SELECT p.* FROM productos p
         JOIN compatibilidad_producto cp ON p.id = cp.id_producto
         WHERE cp.id_version = ? AND p.activo = 1`,
        [req.params.id_version],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

module.exports = router;