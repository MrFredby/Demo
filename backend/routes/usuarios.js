const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/registro', async (req, res) => {
    const { nombre, apellido, email, password, telefono } = req.body;

    try {
        const passwordEncriptada = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO usuarios (nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, email, passwordEncriptada, telefono],
            (err, resultado) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: resultado.insertId });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login de usuario
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        if (resultados.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const usuario = resultados[0];
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign(
                    { id: usuario.id, email: usuario.email, rol: usuario.rol },
                    process.env.JWT_SECRET,
                    { expiresIn: '8h' }
                );

        res.json({ mensaje: 'Login exitoso', token, usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono
        } 
    });
    });
});

module.exports = router;