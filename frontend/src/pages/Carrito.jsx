import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Carrito() {
    const [carrito, setCarrito] = useState([]);
    const [procesando, setProcesando] = useState(false);
    const [cupon, setCupon] = useState('');
    const [descuento, setDescuento] = useState(null);
    const [mensajeCupon, setMensajeCupon] = useState('');
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    useEffect(() => {
        if (usuario) {
            api.get(`/carrito/${usuario.id}`)
                .then(res => setCarrito(res.data))
                .catch(err => console.error(err));
        }
    }, []);

    const eliminarProducto = (id) => {
        api.delete(`/carrito/${id}`)
            .then(() => setCarrito(carrito.filter(item => item.id !== id)))
            .catch(err => console.error(err));
    };

    const validarCupon = async () => {
        try {
            const res = await api.post('/cupones/validar', { codigo: cupon });
            setDescuento(res.data);
            setMensajeCupon(`✅ Cupón aplicado: ${res.data.tipo === 'porcentaje' ? `${res.data.valor}% de descuento` : `$${res.data.valor} de descuento`}`);
        } catch {
            setDescuento(null);
            setMensajeCupon('❌ Cupón inválido o expirado');
        }
    };

    const subtotal = carrito.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0);
    const descuentoValor = descuento
        ? descuento.tipo === 'porcentaje'
            ? subtotal * (descuento.valor / 100)
            : parseFloat(descuento.valor)
        : 0;
    const subtotalConDescuento = subtotal - descuentoValor;
    const impuestos = subtotalConDescuento * 0.16;
    const total = subtotalConDescuento + impuestos;

    const handlePago = async () => {
        if (!usuario) { window.location.href = '/login'; return; }
        if (carrito.length === 0) { alert('Tu carrito está vacío'); return; }
        setProcesando(true);
        try {
            const detalles = carrito.map(item => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: parseFloat(item.precio),
                subtotal: parseFloat(item.precio) * item.cantidad
            }));
            await api.post('/pedidos', {
                id_usuario: usuario.id,
                id_direccion: 1,
                id_almacen: 1,
                subtotal,
                impuestos,
                total,
                descuento: descuentoValor,
                id_cupon: descuento?.id,
                detalles
            });
            for (const item of carrito) {
                await api.delete(`/carrito/${item.id}`);
            }
            setCarrito([]);
            window.location.href = '/pedido-exitoso';
        } catch (err) {
            console.error(err);
            alert('Error al procesar el pedido');
        }
        setProcesando(false);
    };

    if (!usuario) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 text-center">
                <p className="text-gray-600 text-lg">Debes iniciar sesión para ver tu carrito.</p>
                <a href="/login" className="text-orange-500 font-semibold hover:underline">Iniciar sesión</a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🛒 Mi Carrito</h2>
                {carrito.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-10 text-center">
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                        <a href="/" className="text-orange-500 font-semibold hover:underline mt-2 block">Ver productos</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            {carrito.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-orange-50 rounded-xl p-3 text-3xl">🔩</div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{item.nombre}</h3>
                                            <p className="text-gray-500 text-sm">Cantidad: {item.cantidad}</p>
                                            <p className="text-orange-500 font-bold">${item.precio}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => eliminarProducto(item.id)}
                                        className="text-red-400 hover:text-red-600 transition font-semibold text-sm">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl shadow p-6 h-fit space-y-4">
                            <h3 className="font-bold text-gray-800 text-lg">Resumen del pedido</h3>

                            {/* Cupón */}
                            <div>
                                <p className="text-sm text-gray-600 mb-1 font-semibold">¿Tienes un cupón?</p>
                                <div className="flex gap-2">
                                    <input
                                        value={cupon}
                                        onChange={e => setCupon(e.target.value.toUpperCase())}
                                        placeholder="Ej: MANIJAUTO10"
                                        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                    <button onClick={validarCupon}
                                        className="bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
                                        Aplicar
                                    </button>
                                </div>
                                {mensajeCupon && <p className={`text-xs mt-1 ${descuento ? 'text-green-600' : 'text-red-500'}`}>{mensajeCupon}</p>}
                            </div>

                            <div className="space-y-2 text-sm border-t pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {descuento && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>Descuento</span>
                                        <span>-${descuentoValor.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>IVA (16%)</span>
                                    <span>${impuestos.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-gray-800 text-lg">
                                    <span>Total</span>
                                    <span className="text-orange-500">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={handlePago} disabled={procesando}
                                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50">
                                {procesando ? 'Procesando...' : '✅ Proceder al pago'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Carrito;