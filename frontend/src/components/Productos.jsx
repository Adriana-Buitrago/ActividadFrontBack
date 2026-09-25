import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

function Productos() {
    const [productos, setProductos] = useState([]);

    const [nomProducto, setNomProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');

    const [idEditar, setIdEditar] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // CARGAR PRODUCTOS
    const cargarProductos = useCallback(async () => {
        try {
            setCargando(true);

            const respuesta = await api.get('/productos');

            setProductos(respuesta.data);
            setError('');
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('No se pudieron cargar los productos');
        } finally {
            setCargando(false);
        }
    }, []);

    // CARGAR AL ENTRAR A LA PÁGINA
    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    // LIMPIAR FORMULARIO
    const limpiarFormulario = () => {
        setNomProducto('');
        setCantidad('');
        setPrecio('');
        setIdEditar(null);
    };

    // CREAR O ACTUALIZAR PRODUCTO
    const guardarProducto = async (e) => {
        e.preventDefault();

        if (!nomProducto.trim()) {
            alert('El nombre del producto es obligatorio');
            return;
        }

        if (cantidad === '' || precio === '') {
            alert('La cantidad y el precio son obligatorios');
            return;
        }

        try {
            if (idEditar === null) {
                // CREAR
                await api.post('/productos', {
                    nomProducto: nomProducto,
                    cantidad: Number(cantidad),
                    precio: Number(precio)
                });

                alert('Producto creado correctamente');
            } else {
                // ACTUALIZAR
                await api.put(`/productos/${idEditar}`, {
                    nomProducto: nomProducto,
                    cantidad: Number(cantidad),
                    precio: Number(precio)
                });

                alert('Producto actualizado correctamente');
            }

            limpiarFormulario();
            await cargarProductos();

        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert('Ocurrió un error al guardar el producto');
        }
    };

    // EDITAR PRODUCTO
    const editarProducto = (producto) => {
        setIdEditar(producto.id_producto);
        setNomProducto(producto.nomProducto || '');
        setCantidad(producto.cantidad ?? '');
        setPrecio(producto.precio ?? '');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // ELIMINAR PRODUCTO
    const eliminarProducto = async (id) => {
        const confirmar = window.confirm(
            '¿Está seguro de que desea eliminar este producto?'
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(`/productos/${id}`);

            alert('Producto eliminado correctamente');

            await cargarProductos();

        } catch (error) {
            console.error('Error al eliminar producto:', error);

            alert(
                'No se pudo eliminar el producto. Puede tener ventas asociadas.'
            );
        }
    };

    // CARGANDO
    if (cargando) {
        return (
            <div className="container mt-4">
                <p>Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Gestión de Productos
            </h2>

            {/* FORMULARIO */}

            <div className="card mb-4">

                <div className="card-header">
                    <h4>
                        {idEditar === null
                            ? 'Agregar Producto'
                            : 'Editar Producto'}
                    </h4>
                </div>

                <div className="card-body">

                    <form onSubmit={guardarProducto}>

                        <div className="row">

                            {/* NOMBRE */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Nombre del producto
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={nomProducto}
                                    onChange={(e) =>
                                        setNomProducto(e.target.value)
                                    }
                                    placeholder="Ingrese el producto"
                                />

                            </div>

                            {/* CANTIDAD */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Cantidad
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={cantidad}
                                    onChange={(e) =>
                                        setCantidad(e.target.value)
                                    }
                                    placeholder="Ingrese la cantidad"
                                    min="0"
                                />

                            </div>

                            {/* PRECIO */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={precio}
                                    onChange={(e) =>
                                        setPrecio(e.target.value)
                                    }
                                    placeholder="Ingrese el precio"
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                        </div>

                        {/* BOTONES */}

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >
                            {idEditar === null
                                ? 'Guardar Producto'
                                : 'Actualizar Producto'}
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
                        Lista de Productos
                    </h4>
                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-striped">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>

                            </thead>

                            <tbody>

                                {productos.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No hay productos registrados
                                        </td>
                                    </tr>

                                ) : (

                                    productos.map((producto) => (

                                        <tr key={producto.id_producto}>

                                            <td>
                                                {producto.id_producto}
                                            </td>

                                            <td>
                                                {producto.nomProducto}
                                            </td>

                                            <td>
                                                {producto.cantidad}
                                            </td>

                                            <td>
                                                ${Number(producto.precio).toLocaleString('es-CO')}
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        editarProducto(producto)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminarProducto(
                                                            producto.id_producto
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

export default Productos;