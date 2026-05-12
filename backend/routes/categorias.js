const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, verificarAdmin } = require('../middlewares/auth'); // 👈 agregar

// ✅ Públicas
router.get('/', (req, res) => {
    db.query('SELECT * FROM categorias', (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM categorias WHERE id = ?', [id], (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        if (resultados.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(resultados[0]);
    });
});

// ✅ Protegidas — solo admin
router.post('/', verificarToken, verificarAdmin, (req, res) => {
    const { nombre, descripcion, slug, id_categoria_padre } = req.body;
    db.query(
        'INSERT INTO categorias (nombre, descripcion, slug, id_categoria_padre) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, slug, id_categoria_padre || null],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Categoría creada correctamente', id: resultado.insertId });
        }
    );
});

// 👇 Faltaban completamente
router.put('/:id', verificarToken, verificarAdmin, (req, res) => {
    const { nombre, descripcion, slug, id_categoria_padre } = req.body;
    db.query(
        'UPDATE categorias SET nombre = ?, descripcion = ?, slug = ?, id_categoria_padre = ? WHERE id = ?',
        [nombre, descripcion, slug, id_categoria_padre || null, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Categoría actualizada correctamente' });
        }
    );
});

router.delete('/:id', verificarToken, verificarAdmin, (req, res) => {
    db.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Categoría eliminada correctamente' });
    });
});

module.exports = router;