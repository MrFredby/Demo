import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Buscar() {
    const { termino } = useParams();
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        setCargando(true);
        api.get(`/productos/buscar/${termino}`)
            .then(res => {
                setProductos(res.data);
                setCargando(false);
            })
            .catch(err => {
                console.error(err);
                setCargando(false);
            });
    }, [termino]);

    const agregarAlCarrito = (id_producto) => {
        if (!usuario) {
            window.location.href = '/login';
            return;
        }
        api.post('/carrito', { id_usuario: usuario.id, id_producto, cantidad: 1 })
            .then(() => alert('Producto agregado al carrito'))
            .catch(err => console.error(err));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    🔍 Resultados para: <span className="text-orange-500">"{termino}"</span>
                </h2>
                <p className="text-gray-500 text-sm mb-8">{productos.length} producto(s) encontrado(s)</p>

                {cargando ? (
                    <p className="text-gray-500">Buscando...</p>
                ) : productos.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-10 text-center">
                        <p className="text-5xl mb-4">😕</p>
                        <p className="text-gray-600 text-lg">No encontramos productos para "{termino}"</p>
                        <a href="/" className="text-orange-500 hover:underline mt-4 block">Ver todos los productos</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {productos.map(producto => (
                            <div key={producto.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">
                                <div className="bg-gray-100 h-48 flex items-center justify-center group-hover:bg-orange-50 transition">
                                    <p className="text-6xl">🔩</p>
                                </div>
                                <div className="p-5">
                                    <a href={`/producto/${producto.id}`}>
                                        <h3 className="text-lg font-bold text-gray-800 hover:text-orange-500 transition">{producto.nombre}</h3>
                                    </a>
                                    <p className="text-gray-500 text-sm mt-1">{producto.descripcion}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-orange-500 font-bold text-2xl">${producto.precio}</p>
                                        <button
                                            onClick={() => agregarAlCarrito(producto.id)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition text-sm font-semibold">
                                            + Carrito
                                        </button>
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

export default Buscar;