import { useEffect, useState } from 'react';
import api from '../../services/api';

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = () => {
        api.get('/pedidos/usuario/1').then(res => setPedidos(res.data));
    };

    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'entregado': return 'bg-green-900 text-green-400';
            case 'cancelado': return 'bg-red-900 text-red-400';
            case 'enviado': return 'bg-blue-900 text-blue-400';
            case 'confirmado': return 'bg-purple-900 text-purple-400';
            default: return 'bg-yellow-900 text-yellow-400';
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="bg-gray-900 border-b border-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-orange-500 text-2xl">🔧</span>
                        <h1 className="text-xl font-bold">Admin <span className="text-orange-500">Manijauto</span></h1>
                    </div>
                    <a href="/admin" className="text-gray-400 hover:text-orange-500 transition text-sm">← Dashboard</a>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">🛒 Pedidos</h2>
                    <p className="text-gray-400 text-sm mt-1">{pedidos.length} pedidos registrados</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Usuario</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Total</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Estado</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <p className="text-4xl mb-3">📭</p>
                                        <p>No hay pedidos registrados</p>
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((p, i) => (
                                    <tr key={p.id} className={`border-t border-gray-800 hover:bg-gray-800 transition ${i % 2 === 0 ? '' : 'bg-gray-900'}`}>
                                        <td className="px-6 py-4 text-gray-500">#{p.id}</td>
                                        <td className="px-6 py-4 text-white">{p.id_usuario}</td>
                                        <td className="px-6 py-4 text-orange-400 font-bold">${p.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getEstadoColor(p.estado)}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminPedidos;