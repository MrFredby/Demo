import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import BuscadorVehiculo from '../components/BuscadorVehiculo';
import Toast from '../components/Toast';

function Inicio() {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [toast, setToast] = useState({ visible: false, mensaje: '' });
    const [categorias, setCategorias] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState(null);
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        api.get('/productos').then(res => setProductos(res.data)).catch(err => console.error(err));
        api.get('/categorias').then(res => setCategorias(res.data));
    }, []);

    const handleResultados = (resultados) => {
        setProductosFiltrados(resultados);
        setBuscando(true);
    };

    const mostrarToast = (nombre) => {
        setToast({ visible: true, mensaje: nombre });
        setTimeout(() => setToast({ visible: false, mensaje: '' }), 3000);
    };

    const agregarAlCarrito = (id_producto, nombre) => {
        if (!usuario) { window.location.href = '/login'; return; }
        api.post('/carrito', { id_usuario: usuario.id, id_producto, cantidad: 1 })
            .then(() => mostrarToast(nombre))
            .catch(err => console.error(err));
    };

    const productosAMostrar = buscando
        ? productosFiltrados
        : categoriaActiva
            ? productos.filter(p => p.id_categoria === categoriaActiva)
            : productos;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toast visible={toast.visible} mensaje={toast.mensaje} />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 text-white py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm mb-3">Tu tienda de autopartes</p>
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        Las mejores partes <br /> para tu vehículo
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                        Encuentra autopartes de calidad para cualquier marca y modelo. Envíos rápidos y garantía en todos nuestros productos.
                    </p>
                    <a href="#productos" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition shadow-lg">
                        Ver productos
                    </a>
                </div>
            </section>

            {/* Características */}
            <section className="bg-white py-10 border-b">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 text-center">
                    <div className="p-4">
                        <p className="text-3xl mb-2">🚚</p>
                        <h3 className="font-bold text-gray-800">Envío rápido</h3>
                        <p className="text-gray-500 text-sm mt-1">Recibe tu pedido en 24-48 horas</p>
                    </div>
                    <div className="p-4">
                        <p className="text-3xl mb-2">🔧</p>
                        <h3 className="font-bold text-gray-800">Calidad garantizada</h3>
                        <p className="text-gray-500 text-sm mt-1">Productos originales y de calidad</p>
                    </div>
                    <div className="p-4">
                        <p className="text-3xl mb-2">💳</p>
                        <h3 className="font-bold text-gray-800">Pago seguro</h3>
                        <p className="text-gray-500 text-sm mt-1">Transacciones 100% seguras</p>
                    </div>
                </div>
            </section>

            {/* Buscador */}
            <section className="max-w-6xl mx-auto px-6 py-10">
                <BuscadorVehiculo onResultados={handleResultados} />
            </section>

            {/* Filtros por categoría */}
            <section className="max-w-6xl mx-auto px-6 pb-4">
                <div className="flex gap-3 flex-wrap">
                    <button onClick={() => { setCategoriaActiva(null); setBuscando(false); }}
                        className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
                            categoriaActiva === null && !buscando ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50 shadow'
                        }`}>
                        Todos
                    </button>
                    {categorias.map(cat => (
                        <button key={cat.id} onClick={() => { setCategoriaActiva(cat.id); setBuscando(false); }}
                            className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
                                categoriaActiva === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50 shadow'
                            }`}>
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </section>

            {/* Productos */}
            <section id="productos" className="max-w-6xl mx-auto px-6 pb-16 pt-6">
                {buscando && (
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600">{productosFiltrados.length} producto(s) encontrado(s)</p>
                        <button onClick={() => setBuscando(false)} className="text-orange-500 hover:underline text-sm">
                            Ver todos los productos
                        </button>
                    </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    {buscando ? '🔍 Resultados' : '🛒 Productos destacados'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {productosAMostrar.length === 0 ? (
                        <p className="text-gray-500">No hay productos disponibles</p>
                    ) : (
                        productosAMostrar.map(producto => (
                            <div key={producto.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">
                                <div className="bg-gray-100 h-48 flex items-center justify-center group-hover:bg-orange-50 transition">
                                    <p className="text-6xl">🔩</p>
                                </div>
                                <div className="p-5">
                                    <a href={`/producto/${producto.id}`}>
                                        <h3 className="text-lg font-bold text-gray-800 hover:text-orange-500 transition">{producto.nombre}</h3>
                                    </a>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{producto.descripcion}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-orange-500 font-bold text-2xl">${producto.precio}</p>
                                        <button onClick={() => agregarAlCarrito(producto.id, producto.nombre)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition text-sm font-semibold">
                                            + Carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center">
                <p className="font-bold text-white text-lg mb-1">Manijauto</p>
                <p className="text-sm">© 2026 Todos los derechos reservados</p>
            </footer>
        </div>
    );
}

export default Inicio;