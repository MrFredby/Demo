const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los descuentos
router.get('/', (req, res) => {
    db.query('SELECT * FROM descuentos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear descuento
router.post('/', (req, res) => {
    const { nombre, tipo, valor, fecha_inicio, fecha_fin } = req.body;
    db.query(
        'INSERT INTO descuentos (nombre, tipo, valor, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)',
        [nombre, tipo, valor, fecha_inicio, fecha_fin],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Descuento creado', id: result.insertId });
        }
    );
});

// Eliminar descuento
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM descuentos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Descuento eliminado' });
    });
});

module.exports = router;