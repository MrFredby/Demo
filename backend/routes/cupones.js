const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, verificarAdmin } = require('../middlewares/auth'); // 👈 agregar

// ✅ Pública — clientes validan su cupón al comprar
router.post('/validar', (req, res) => {
    const { codigo } = req.body;
    db.query(
        'SELECT * FROM cupones WHERE codigo = ? AND activo = 1 AND (fecha_fin IS NULL OR fecha_fin >= CURDATE()) AND usos_actuales < uso_maximo',
        [codigo],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Cupón inválido o expirado' });
            res.json(results[0]);
        }
    );
});

// ✅ Protegidas — solo admin
router.get('/', verificarToken, verificarAdmin, (req, res) => {
    db.query('SELECT * FROM cupones', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', verificarToken, verificarAdmin, (req, res) => {
    const { codigo, tipo, valor, uso_maximo, fecha_inicio, fecha_fin } = req.body;
    db.query(
        'INSERT INTO cupones (codigo, tipo, valor, uso_maximo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?)',
        [codigo, tipo, valor, uso_maximo, fecha_inicio, fecha_fin],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Cupón creado', id: result.insertId });
        }
    );
});

// 👇 Faltaba PUT para editar cupones
router.put('/:id', verificarToken, verificarAdmin, (req, res) => {
    const { codigo, tipo, valor, uso_maximo, fecha_inicio, fecha_fin, activo } = req.body;
    db.query(
        'UPDATE cupones SET codigo = ?, tipo = ?, valor = ?, uso_maximo = ?, fecha_inicio = ?, fecha_fin = ?, activo = ? WHERE id = ?',
        [codigo, tipo, valor, uso_maximo, fecha_inicio, fecha_fin, activo, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Cupón actualizado correctamente' });
        }
    );
});

router.delete('/:id', verificarToken, verificarAdmin, (req, res) => {
    db.query('DELETE FROM cupones WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Cupón eliminado' });
    });
});

module.exports = router;