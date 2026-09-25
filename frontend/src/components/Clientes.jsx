import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

function Clientes() {
    const [clientes, setClientes] = useState([]);

    const [nomCliente, setNomCliente] = useState('');
    const [contacto, setContacto] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [ciudad, setCiudad] = useState('');

    const [idEditar, setIdEditar] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // CARGAR CLIENTES
    const cargarClientes = useCallback(async () => {
        try {
            setCargando(true);

            const respuesta = await api.get('/clientes');

            setClientes(respuesta.data);
            setError('');
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setError('No se pudieron cargar los clientes');
        } finally {
            setCargando(false);
        }
    }, []);

    // CARGAR CLIENTES AL ENTRAR A LA PÁGINA
    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    // LIMPIAR FORMULARIO
    const limpiarFormulario = () => {
        setNomCliente('');
        setContacto('');
        setDepartamento('');
        setCiudad('');
        setIdEditar(null);
    };

    // CREAR O ACTUALIZAR CLIENTE
    const guardarCliente = async (e) => {
        e.preventDefault();

        if (!nomCliente.trim()) {
            alert('El nombre del cliente es obligatorio');
            return;
        }

        try {
            if (idEditar === null) {
                await api.post('/clientes', {
                    nomCliente: nomCliente,
                    contacto: contacto,
                    departamento: departamento,
                    ciudad: ciudad
                });

                alert('Cliente creado correctamente');
            } else {
                await api.put(`/clientes/${idEditar}`, {
                    nomCliente: nomCliente,
                    contacto: contacto,
                    departamento: departamento,
                    ciudad: ciudad
                });

                alert('Cliente actualizado correctamente');
            }

            limpiarFormulario();
            await cargarClientes();

        } catch (error) {
            console.error('Error al guardar cliente:', error);
            alert('Ocurrió un error al guardar el cliente');
        }
    };

    // EDITAR CLIENTE
    const editarCliente = (cliente) => {
        setIdEditar(cliente.id_cliente);
        setNomCliente(cliente.nomCliente || '');
        setContacto(cliente.contacto || '');
        setDepartamento(cliente.departamento || '');
        setCiudad(cliente.ciudad || '');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // ELIMINAR CLIENTE
    const eliminarCliente = async (id) => {
        const confirmar = window.confirm(
            '¿Está seguro de que desea eliminar este cliente?'
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(`/clientes/${id}`);

            alert('Cliente eliminado correctamente');

            await cargarClientes();

        } catch (error) {
            console.error('Error al eliminar cliente:', error);

            alert(
                'No se pudo eliminar el cliente. Puede tener ventas asociadas.'
            );
        }
    };

    // CARGANDO
    if (cargando) {
        return (
            <div className="container mt-4">
                <p>Cargando clientes...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Gestión de Clientes
            </h2>

            {/* FORMULARIO */}
            <div className="card mb-4">

                <div className="card-header">
                    <h4>
                        {idEditar === null
                            ? 'Agregar Cliente'
                            : 'Editar Cliente'}
                    </h4>
                </div>

                <div className="card-body">

                    <form onSubmit={guardarCliente}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nombre del cliente
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={nomCliente}
                                    onChange={(e) =>
                                        setNomCliente(e.target.value)
                                    }
                                    placeholder="Ingrese el nombre"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Contacto
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={contacto}
                                    onChange={(e) =>
                                        setContacto(e.target.value)
                                    }
                                    placeholder="Ingrese el contacto"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Departamento
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={departamento}
                                    onChange={(e) =>
                                        setDepartamento(e.target.value)
                                    }
                                    placeholder="Ingrese el departamento"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Ciudad
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={ciudad}
                                    onChange={(e) =>
                                        setCiudad(e.target.value)
                                    }
                                    placeholder="Ingrese la ciudad"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >
                            {idEditar === null
                                ? 'Guardar Cliente'
                                : 'Actualizar Cliente'}
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
                        Lista de Clientes
                    </h4>
                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-striped">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Contacto</th>
                                    <th>Departamento</th>
                                    <th>Ciudad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {clientes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center"
                                        >
                                            No hay clientes registrados
                                        </td>
                                    </tr>
                                ) : (
                                    clientes.map((cliente) => (
                                        <tr key={cliente.id_cliente}>

                                            <td>
                                                {cliente.id_cliente}
                                            </td>

                                            <td>
                                                {cliente.nomCliente}
                                            </td>

                                            <td>
                                                {cliente.contacto}
                                            </td>

                                            <td>
                                                {cliente.departamento}
                                            </td>

                                            <td>
                                                {cliente.ciudad}
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        editarCliente(cliente)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminarCliente(
                                                            cliente.id_cliente
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

export default Clientes;