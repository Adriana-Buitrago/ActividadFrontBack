const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - LISTAR PRODUCTOS
router.get('/', (req, res) => {
    const sql = `
        SELECT
            id_producto,
            nomProducto,
            cantidad,
            precio
        FROM productos
    `;

    db.query(sql, (error, resultados) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Error al obtener los productos'
            });
        }

        res.json(resultados);
    });
});

// GET - OBTENER UN PRODUCTO
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT
            id_producto,
            nomProducto,
            cantidad,
            precio
        FROM productos
        WHERE id_producto = ?
    `;

    db.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Error al obtener el producto'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json(resultados[0]);
    });
});

// POST - CREAR PRODUCTO
router.post('/', (req, res) => {
    const {
        nomProducto,
        cantidad,
        precio
    } = req.body;

    if (!nomProducto || cantidad === undefined || precio === undefined) {
        return res.status(400).json({
            error: 'Todos los campos son obligatorios'
        });
    }

    const sql = `
        INSERT INTO productos
        (nomProducto, cantidad, precio)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [nomProducto, cantidad, precio],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al crear el producto'
                });
            }

            res.status(201).json({
                mensaje: 'Producto creado correctamente',
                id_producto: resultado.insertId
            });
        }
    );
});

// PUT - ACTUALIZAR PRODUCTO
router.put('/:id', (req, res) => {
    const id = req.params.id;

    const {
        nomProducto,
        cantidad,
        precio
    } = req.body;

    const sql = `
        UPDATE productos
        SET
            nomProducto = ?,
            cantidad = ?,
            precio = ?
        WHERE id_producto = ?
    `;

    db.query(
        sql,
        [nomProducto, cantidad, precio, id],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al actualizar el producto'
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }

            res.json({
                mensaje: 'Producto actualizado correctamente'
            });
        }
    );
});

// DELETE - ELIMINAR PRODUCTO
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        DELETE FROM productos
        WHERE id_producto = ?
    `;

    db.query(sql, [id], (error, resultado) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'No se puede eliminar el producto. Puede tener ventas asociadas.'
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente'
        });
    });
});

module.exports = router;