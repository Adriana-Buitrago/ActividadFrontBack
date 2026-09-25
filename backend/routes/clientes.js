const express = require('express');
const router = express.Router();

const db = require('../db');

// ==========================================
// GET - LISTAR TODOS LOS CLIENTES
// ==========================================

router.get('/', (req, res) => {

    const sql = `
        SELECT
            id_cliente,
            nomCliente,
            contacto,
            departamento,
            ciudad
        FROM clientes
    `;

    db.query(sql, (error, resultados) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'Error al obtener los clientes'
            });
        }

        res.json(resultados);
    });
});


// ==========================================
// GET - OBTENER UN CLIENTE POR ID
// ==========================================

router.get('/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            id_cliente,
            nomCliente,
            contacto,
            departamento,
            ciudad
        FROM clientes
        WHERE id_cliente = ?
    `;

    db.query(sql, [id], (error, resultados) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'Error al obtener el cliente'
            });
        }

        if (resultados.length === 0) {

            return res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }

        res.json(resultados[0]);
    });
});


// ==========================================
// POST - CREAR CLIENTE
// ==========================================

router.post('/', (req, res) => {

    const {
        nomCliente,
        contacto,
        departamento,
        ciudad
    } = req.body;

    if (!nomCliente) {

        return res.status(400).json({
            error: 'El nombre del cliente es obligatorio'
        });
    }

    const sql = `
        INSERT INTO clientes
        (nomCliente, contacto, departamento, ciudad)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nomCliente,
            contacto,
            departamento,
            ciudad
        ],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al crear el cliente'
                });
            }

            res.status(201).json({
                mensaje: 'Cliente creado correctamente',
                id_cliente: resultado.insertId
            });
        }
    );
});


// ==========================================
// PUT - ACTUALIZAR CLIENTE
// ==========================================

router.put('/:id', (req, res) => {

    const id = req.params.id;

    const {
        nomCliente,
        contacto,
        departamento,
        ciudad
    } = req.body;

    const sql = `
        UPDATE clientes
        SET
            nomCliente = ?,
            contacto = ?,
            departamento = ?,
            ciudad = ?
        WHERE id_cliente = ?
    `;

    db.query(
        sql,
        [
            nomCliente,
            contacto,
            departamento,
            ciudad,
            id
        ],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: 'Error al actualizar el cliente'
                });
            }

            if (resultado.affectedRows === 0) {

                return res.status(404).json({
                    error: 'Cliente no encontrado'
                });
            }

            res.json({
                mensaje: 'Cliente actualizado correctamente'
            });
        }
    );
});


// ==========================================
// DELETE - ELIMINAR CLIENTE
// ==========================================

router.delete('/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM clientes
        WHERE id_cliente = ?
    `;

    db.query(sql, [id], (error, resultado) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                error: 'No se puede eliminar el cliente. Puede tener ventas asociadas.'
            });
        }

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }

        res.json({
            mensaje: 'Cliente eliminado correctamente'
        });
    });
});


module.exports = router;