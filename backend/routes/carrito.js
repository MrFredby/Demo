const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener carrito de un usuario
router.get('/:id_usuario', (req, res) => {
    db.query(
        `SELECT c.id, c.id_producto, c.cantidad, p.nombre, p.precio, p.slug
        FROM carrito c
        JOIN productos p ON c.id_producto = p.id
        WHERE c.id_usuario = ?`,
        [req.params.id_usuario],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

// Agregar producto al carrito
router.post('/', (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;
    db.query(
        'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)',
        [id_usuario, id_producto, cantidad],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Producto agregado al carrito', id: resultado.insertId });
        }
    );
});

// Eliminar producto del carrito
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM carrito WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto eliminado del carrito' });
    });
});

module.exports = router;