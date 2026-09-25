import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import Clientes from './components/Clientes';
import Productos from './components/Productos';
import Ventas from './components/Ventas';

function Inicio() {

    return (
        <div className="container mt-4">

            <h1>Sistema de Ventas</h1>

            <p>
                Bienvenido al sistema de gestión de clientes,
                productos y ventas.
            </p>

        </div>
    );
}

function App() {

    return (

        <BrowserRouter>

            <Menu />

            <Routes>

                <Route path="/" element={<Inicio />} />

                <Route
                    path="/clientes"
                    element={<Clientes />}
                />

                <Route
                    path="/productos"
                    element={<Productos />}
                />

                <Route
                    path="/ventas"
                    element={<Ventas />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;