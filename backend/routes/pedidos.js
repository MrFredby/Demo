const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, verificarAdmin } = require('../middlewares/auth'); // 👈 agregar

// ✅ Rutas de CLIENTE — necesitan token pero no ser admin
// Un usuario solo debe ver SUS pedidos, no los de otros
router.get('/usuario/:id_usuario', verificarToken, (req, res) => {
    // 🔒 Seguridad extra: el usuario solo puede ver sus propios pedidos
    if (req.usuario.id !== parseInt(req.params.id_usuario) && req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'No puedes ver pedidos de otros usuarios' });
    }

    db.query(
        'SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY created_at DESC',
        [req.params.id_usuario],
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

router.get('/:id', verificarToken, (req, res) => {
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

// ✅ Crear pedido — cliente logueado (no necesita ser admin)
router.post('/', verificarToken, (req, res) => {
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

// ✅ Rutas de ADMIN — ver todos los pedidos y cambiar estatus
// 👇 Faltaban completamente
router.get('/', verificarToken, verificarAdmin, (req, res) => {
    db.query(
        'SELECT * FROM pedidos ORDER BY created_at DESC',
        (err, resultados) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(resultados);
        }
    );
});

router.put('/:id/estatus', verificarToken, verificarAdmin, (req, res) => {
    const { estatus } = req.body;
    const estatusValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

    if (!estatusValidos.includes(estatus)) {
        return res.status(400).json({ mensaje: 'Estatus no válido' });
    }

    db.query(
        'UPDATE pedidos SET estatus = ? WHERE id = ?',
        [estatus, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Estatus actualizado correctamente' });
        }
    );
});

module.exports = router;