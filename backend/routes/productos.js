const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos
router.get('/', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Buscar productos por nombre
router.get('/buscar/:termino', (req, res) => {
    db.query(
        'SELECT * FROM productos WHERE nombre LIKE ? AND activo = 1',
        [`%${req.params.termino}%`],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

// Obtener un producto por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        if (resultado.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(resultado[0]);
    });
});

// Crear un producto
router.post('/', (req, res) => {
    const { nombre, descripcion, slug, precio, id_categoria } = req.body;
    db.query(
        'INSERT INTO productos (nombre, descripcion, slug, precio, id_categoria) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, slug, precio, id_categoria],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Producto creado', id: resultado.insertId });
        }
    );
});

router.put('/:id', (req, res) => {
    const { nombre, descripcion, slug, precio, id_categoria } = req.body;
    db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, slug = ?, precio = ?, id_categoria = ? WHERE id = ?',
        [nombre, descripcion, slug, precio, id_categoria, req.params.id],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Producto actualizado correctamente' });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto eliminado correctamente' });
    });
});

module.exports = router;