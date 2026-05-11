import { useEffect, useState } from 'react';
import api from '../../services/api';

function Dashboard() {
    const [stats, setStats] = useState({ productos: 0, categorias: 0 });
    const adminUsuario = JSON.parse(localStorage.getItem('adminUsuario') || 'null');

    useEffect(() => {
        const admin = localStorage.getItem('adminUsuario');
        if (!admin) {
            window.location.href = '/admin/login';
            return;
        }
        api.get('/productos').then(res => setStats(s => ({ ...s, productos: res.data.length })));
        api.get('/categorias').then(res => setStats(s => ({ ...s, categorias: res.data.length })));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsuario');
        window.location.href = '/admin/login';
    };

    const menuItems = [
        { href: '/admin/productos', icon: '📦', label: 'Productos', desc: 'Agregar, editar y eliminar productos' },
        { href: '/admin/categorias', icon: '📁', label: 'Categorías', desc: 'Gestionar categorías del catálogo' },
        { href: '/admin/pedidos', icon: '🛒', label: 'Pedidos', desc: 'Ver y gestionar pedidos de clientes' },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <header className="bg-gray-900 border-b border-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-orange-500 text-2xl">🔧</span>
                        <h1 className="text-xl font-bold text-white">Admin <span className="text-orange-500">Manijauto</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">👤 {adminUsuario?.nombre} {adminUsuario?.apellido}</span>
                        <button onClick={handleLogout}
                            className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition text-sm font-semibold">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Bienvenida */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-white">Bienvenido, <span className="text-orange-500">{adminUsuario?.nombre}</span> 👋</h2>
                    <p className="text-gray-400 mt-1">Panel de control de Manijauto</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Productos', value: stats.productos, icon: '📦', color: 'from-orange-500 to-orange-700' },
                        { label: 'Categorías', value: stats.categorias, icon: '📁', color: 'from-blue-500 to-blue-700' },
                        { label: 'Pedidos', value: 0, icon: '🛒', color: 'from-green-500 to-green-700' },
                        { label: 'Usuarios', value: 0, icon: '👤', color: 'from-purple-500 to-purple-700' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-lg`}>
                            <p className="text-3xl mb-2">{stat.icon}</p>
                            <p className="text-4xl font-extrabold">{stat.value}</p>
                            <p className="text-white/80 mt-1 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Menu */}
                <h3 className="text-xl font-bold text-gray-300 mb-4">Accesos rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {menuItems.map((item, i) => (
                        <a key={i} href={item.href}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500 hover:shadow-orange-900 hover:shadow-lg transition group">
                            <p className="text-4xl mb-3">{item.icon}</p>
                            <h4 className="font-bold text-white text-lg group-hover:text-orange-500 transition">{item.label}</h4>
                            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;