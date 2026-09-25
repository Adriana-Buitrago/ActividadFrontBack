import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [idCliente, setIdCliente] = useState('');
    const [fechaVenta, setFechaVenta] = useState('');
    const [total, setTotal] = useState('');
    const [estado, setEstado] = useState('Pendiente');

    const [idEditar, setIdEditar] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // CARGAR VENTAS
    const cargarVentas = useCallback(async () => {
        try {
            setCargando(true);

            const respuesta = await api.get('/ventas');

            setVentas(respuesta.data);
            setError('');
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            setError('No se pudieron cargar las ventas');
        } finally {
            setCargando(false);
        }
    }, []);

    // CARGAR CLIENTES
    const cargarClientes = useCallback(async () => {
        try {
            const respuesta = await api.get('/clientes');
            setClientes(respuesta.data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    }, []);

    // CARGAR INFORMACIÓN AL ABRIR
    useEffect(() => {
        cargarVentas();
        cargarClientes();
    }, [cargarVentas, cargarClientes]);

    // LIMPIAR FORMULARIO
    const limpiarFormulario = () => {
        setIdCliente('');
        setFechaVenta('');
        setTotal('');
        setEstado('Pendiente');
        setIdEditar(null);
    };

    // CREAR O ACTUALIZAR
    const guardarVenta = async (e) => {
        e.preventDefault();

        if (!idCliente || !fechaVenta || total === '') {
            alert('Cliente, fecha y total son obligatorios');
            return;
        }

        try {
            const datos = {
                id_cliente: Number(idCliente),
                fecha_venta: fechaVenta,
                total: Number(total),
                estado: estado
            };

            if (idEditar === null) {
                await api.post('/ventas', datos);

                alert('Venta creada correctamente');
            } else {
                await api.put(`/ventas/${idEditar}`, datos);

                alert('Venta actualizada correctamente');
            }

            limpiarFormulario();
            await cargarVentas();

        } catch (error) {
            console.error('Error al guardar venta:', error);
            alert('Ocurrió un error al guardar la venta');
        }
    };

    // EDITAR
    const editarVenta = (venta) => {
        setIdEditar(venta.id_venta);
        setIdCliente(venta.id_cliente);
        setFechaVenta(
            venta.fecha_venta
                ? String(venta.fecha_venta).substring(0, 10)
                : ''
        );
        setTotal(venta.total);
        setEstado(venta.estado || 'Pendiente');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // ELIMINAR
    const eliminarVenta = async (id) => {
        const confirmar = window.confirm(
            '¿Está seguro de que desea eliminar esta venta?'
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(`/ventas/${id}`);

            alert('Venta eliminada correctamente');

            await cargarVentas();

        } catch (error) {
            console.error('Error al eliminar venta:', error);
            alert('No se pudo eliminar la venta');
        }
    };

    // CARGANDO
    if (cargando) {
        return (
            <div className="container mt-4">
                <p>Cargando ventas...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Gestión de Ventas
            </h2>

            {/* FORMULARIO */}

            <div className="card mb-4">

                <div className="card-header">
                    <h4>
                        {idEditar === null
                            ? 'Agregar Venta'
                            : 'Editar Venta'}
                    </h4>
                </div>

                <div className="card-body">

                    <form onSubmit={guardarVenta}>

                        <div className="row">

                            {/* CLIENTE */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Cliente
                                </label>

                                <select
                                    className="form-select"
                                    value={idCliente}
                                    onChange={(e) =>
                                        setIdCliente(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Seleccione un cliente
                                    </option>

                                    {clientes.map((cliente) => (
                                        <option
                                            key={cliente.id_cliente}
                                            value={cliente.id_cliente}
                                        >
                                            {cliente.nomCliente}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            {/* FECHA */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Fecha de venta
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaVenta}
                                    onChange={(e) =>
                                        setFechaVenta(e.target.value)
                                    }
                                />

                            </div>

                            {/* TOTAL */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Total
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={total}
                                    onChange={(e) =>
                                        setTotal(e.target.value)
                                    }
                                    placeholder="Ingrese el total"
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                            {/* ESTADO */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Estado
                                </label>

                                <select
                                    className="form-select"
                                    value={estado}
                                    onChange={(e) =>
                                        setEstado(e.target.value)
                                    }
                                >

                                    <option value="Pendiente">
                                        Pendiente
                                    </option>

                                    <option value="Pagada">
                                        Pagada
                                    </option>

                                    <option value="Cancelada">
                                        Cancelada
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* BOTONES */}

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >
                            {idEditar === null
                                ? 'Guardar Venta'
                                : 'Actualizar Venta'}
                        </button>

                        {idEditar !== null && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>
                        )}

                    </form>

                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* TABLA */}

            <div className="card">

                <div className="card-header">
                    <h4>
                        Lista de Ventas
                    </h4>
                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-striped">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {ventas.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center"
                                        >
                                            No hay ventas registradas
                                        </td>
                                    </tr>

                                ) : (

                                    ventas.map((venta) => (

                                        <tr key={venta.id_venta}>

                                            <td>
                                                {venta.id_venta}
                                            </td>

                                            <td>
                                                {venta.nomCliente}
                                            </td>

                                            <td>
                                                {String(
                                                    venta.fecha_venta
                                                ).substring(0, 10)}
                                            </td>

                                            <td>
                                                $
                                                {Number(
                                                    venta.total
                                                ).toLocaleString('es-CO')}
                                            </td>

                                            <td>
                                                {venta.estado}
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        editarVenta(venta)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminarVenta(
                                                            venta.id_venta
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Ventas;