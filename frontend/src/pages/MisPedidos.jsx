import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        if (usuario) {
            api.get(`/pedidos/usuario/${usuario.id}`)
                .then(res => setPedidos(res.data))
                .catch(err => console.error(err));
        }
    }, []);

    if (!usuario) return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 text-center">
                <p className="text-gray-600">Debes iniciar sesión para ver tus pedidos.</p>
                <a href="/login" className="text-orange-500 font-semibold hover:underline">Iniciar sesión</a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">📦 Mis Pedidos</h2>
                {pedidos.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <p className="text-gray-500">No tienes pedidos aún</p>
                        <a href="/" className="text-orange-500 font-semibold hover:underline mt-2 block">
                            Ver productos
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="bg-white rounded-xl shadow p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-800">Pedido #{pedido.id}</p>
                                        <p className="text-gray-500 text-sm">{new Date(pedido.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-orange-500 font-bold">${pedido.total}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                            pedido.estado === 'entregado' ? 'bg-green-100 text-green-600' :
                                            pedido.estado === 'cancelado' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {pedido.estado}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MisPedidos;