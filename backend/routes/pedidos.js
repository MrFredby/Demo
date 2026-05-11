const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener pedidos de un usuario
router.get('/usuario/:id_usuario', (req, res) => {
    db.query(
        'SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY created_at DESC',
        [req.params.id_usuario],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

// Obtener detalle de un pedido
router.get('/:id', (req, res) => {
    db.query(
        `SELECT pd.*, p.nombre, p.slug
        FROM pedido_detalles pd
        JOIN productos p ON pd.id_producto = p.id
        WHERE pd.id_pedido = ?`,
        [req.params.id],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

// Crear un pedido
router.post('/', (req, res) => {
    const { id_usuario, id_direccion, id_almacen, subtotal, impuestos, total, detalles } = req.body;

    db.query(
        'INSERT INTO pedidos (id_usuario, id_direccion, id_almacen, subtotal, impuestos, total) VALUES (?, ?, ?, ?, ?, ?)',
        [id_usuario, id_direccion, id_almacen, subtotal, impuestos, total],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });

            const id_pedido = resultado.insertId;
            const detallesValues = detalles.map(d => [id_pedido, d.id_producto, d.cantidad, d.precio_unitario, d.subtotal]);

            db.query(
                'INSERT INTO pedido_detalles (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES ?',
                [detallesValues],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2.message });
                    res.status(201).json({ mensaje: 'Pedido creado correctamente', id: id_pedido });
                }
            );
        }
    );
});

module.exports = router;