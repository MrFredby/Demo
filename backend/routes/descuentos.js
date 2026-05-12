const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, verificarAdmin } = require('../middlewares/auth'); // 👈 agregar

// ✅ Pública — los clientes necesitan ver los descuentos activos
router.get('/', (req, res) => {
    db.query('SELECT * FROM descuentos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Protegidas — solo admin
router.post('/', verificarToken, verificarAdmin, (req, res) => {
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

// 👇 Faltaba PUT
router.put('/:id', verificarToken, verificarAdmin, (req, res) => {
    const { nombre, tipo, valor, fecha_inicio, fecha_fin, activo } = req.body;
    db.query(
        'UPDATE descuentos SET nombre = ?, tipo = ?, valor = ?, fecha_inicio = ?, fecha_fin = ?, activo = ? WHERE id = ?',
        [nombre, tipo, valor, fecha_inicio, fecha_fin, activo, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Descuento actualizado correctamente' });
        }
    );
});

router.delete('/:id', verificarToken, verificarAdmin, (req, res) => {
    db.query('DELETE FROM descuentos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Descuento eliminado' });
    });
});

module.exports = router;