import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
    const token = localStorage.getItem('token');
    const [busqueda, setBusqueda] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        if (busqueda.trim()) {
            window.location.href = `/buscar/${busqueda}`;
        }
    };

    return (
        <header className="bg-orange-500 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
                <Link to="/" className="text-2xl font-bold whitespace-nowrap">Manijauto</Link>
                
                {/* Barra de búsqueda */}
                <form onSubmit={handleBuscar} className="flex-1 max-w-md">
                    <div className="flex">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar productos..."
                            className="w-full px-4 py-1.5 rounded-l-lg text-gray-800 focus:outline-none text-sm"
                        />
                        <button type="submit"
                            className="bg-gray-900 px-4 py-1.5 rounded-r-lg hover:bg-gray-800 transition text-sm">
                            🔍
                        </button>
                    </div>
                </form>

                <nav className="flex gap-4 items-center whitespace-nowrap">
                    <Link to="/carrito" className="hover:underline">🛒</Link>
                    {token ? (
                        <>
                            <Link to="/mis-pedidos" className="hover:underline text-sm">Mis pedidos</Link>
                            <button onClick={handleLogout} className="bg-white text-orange-500 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 text-sm">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline text-sm">Entrar</Link>
                            <Link to="/registro" className="bg-white text-orange-500 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 text-sm">
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;