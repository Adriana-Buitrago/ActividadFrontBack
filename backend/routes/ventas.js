const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - LISTAR VENTAS
router.get('/', (req, res) => {
    const sql = `
        SELECT
            v.id_venta,
            v.id_cliente,
            c.nomCliente,
            v.fecha_venta,
            v.total,
            v.estado
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        ORDER BY v.id_venta DESC
    `;

    db.query(sql, (error, resultados) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'Error al obtener las ventas'
            });
        }

        res.json(resultados);
    });
});

// GET - OBTENER UNA VENTA
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT
            v.id_venta,
            v.id_cliente,
            c.nomCliente,
            v.fecha_venta,
            v.total,
            v.estado
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        WHERE v.id_venta = ?
    `;

    db.query(sql, [id], (error, resultados) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'Error al obtener la venta'
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                error: 'Venta no encontrada'
            });
        }

        res.json(resultados[0]);
    });
});

// POST - CREAR VENTA
router.post('/', (req, res) => {
    const {
        id_cliente,
        fecha_venta,
        total,
        estado
    } = req.body;

    if (!id_cliente || !fecha_venta || total === undefined || !estado) {
        return res.status(400).json({
            error: 'Todos los campos son obligatorios'
        });
    }

    const sql = `
        INSERT INTO ventas
        (id_cliente, fecha_venta, total, estado)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [id_cliente, fecha_venta, total, estado],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al crear la venta'
                });
            }

            res.status(201).json({
                mensaje: 'Venta creada correctamente',
                id_venta: resultado.insertId
            });
        }
    );
});

// PUT - ACTUALIZAR VENTA
router.put('/:id', (req, res) => {
    const id = req.params.id;

    const {
        id_cliente,
        fecha_venta,
        total,
        estado
    } = req.body;

    const sql = `
        UPDATE ventas
        SET
            id_cliente = ?,
            fecha_venta = ?,
            total = ?,
            estado = ?
        WHERE id_venta = ?
    `;

    db.query(
        sql,
        [id_cliente, fecha_venta, total, estado, id],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al actualizar la venta'
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Venta no encontrada'
                });
            }

            res.json({
                mensaje: 'Venta actualizada correctamente'
            });
        }
    );
});

// DELETE - ELIMINAR VENTA
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    // Primero eliminamos los detalles relacionados
    const sqlDetalle = `
        DELETE FROM detalle_venta
        WHERE id_venta = ?
    `;

    db.query(sqlDetalle, [id], (error) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'Error al eliminar los detalles de la venta'
            });
        }

        // Después eliminamos la venta
        const sqlVenta = `
            DELETE FROM ventas
            WHERE id_venta = ?
        `;

        db.query(sqlVenta, [id], (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al eliminar la venta'
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Venta no encontrada'
                });
            }

            res.json({
                mensaje: 'Venta eliminada correctamente'
            });
        });
    });
});

module.exports = router;