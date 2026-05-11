const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const db = require('../db');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subir imagen de producto
router.post('/producto/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;

        // Subir a Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'manijauto/productos', transformation: [{ width: 800, height: 800, crop: 'limit' }] },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        // Guardar URL en la base de datos
        db.query(
            'UPDATE productos SET imagen = ? WHERE id = ?',
            [result.secure_url, id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ mensaje: 'Imagen subida correctamente', url: result.secure_url });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;