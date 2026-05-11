const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las categorías
router.get('/', (req, res) => {
    db.query('SELECT * FROM categorias', (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados);
    });
});

// Obtener una categoría por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM categorias WHERE id = ?', [id], (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        if (resultados.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(resultados[0]);
    });
});

//Crear una nueva categoría
router.post('/', (req, res) => {
    const { nombre, descripcion, slug, id_categoria_padre} = req.body;
    db.query(
        'INSERT INTO categorias (nombre, descripcion, slug, id_categoria_padre) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, slug, id_categoria_padre || null],
        (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Categoría creada correctamente', id: resultado.insertId });
        }
    );
});

module.exports = router;