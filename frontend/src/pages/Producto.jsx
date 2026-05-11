import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Producto() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        api.get(`/productos/${id}`)
            .then(res => setProducto(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const agregarAlCarrito = () => {
        if (!usuario) {
            window.location.href = '/login';
            return;
        }
        api.post('/carrito', { id_usuario: usuario.id, id_producto: producto.id, cantidad: 1 })
            .then(() => alert('Producto agregado al carrito'))
            .catch(err => console.error(err));
    };

    if (!producto) return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-gray-500">Cargando producto...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <a href="/" className="text-orange-500 hover:underline text-sm mb-4 block">
                    ← Volver al inicio
                </a>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                            <p className="text-gray-400">Sin imagen</p>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>
                            <p className="text-gray-500 mt-2">{producto.descripcion}</p>
                            <p className="text-orange-500 font-bold text-3xl mt-4">${producto.precio}</p>
                            {producto.precio_descuento && (
                                <p className="text-gray-400 line-through">${producto.precio_descuento}</p>
                            )}
                            <button
                                onClick={agregarAlCarrito}
                                className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                                🛒 Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Producto;