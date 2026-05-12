const jwt = require('jsonwebtoken');

// Verifica que el usuario esté logueado
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
};

// Verifica que el usuario sea admin
const verificarAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};

module.exports = { verificarToken, verificarAdmin };