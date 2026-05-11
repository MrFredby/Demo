import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminDescuentos() {
    const [descuentos, setDescuentos] = useState([]);
    const [cupones, setCupones] = useState([]);
    const [tab, setTab] = useState('descuentos');
    const [form, setForm] = useState({ nombre: '', tipo: 'porcentaje', valor: '', fecha_inicio: '', fecha_fin: '' });
    const [formCupon, setFormCupon] = useState({ codigo: '', tipo: 'porcentaje', valor: '', uso_maximo: 1, fecha_inicio: '', fecha_fin: '' });
    const [mostrarForm, setMostrarForm] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDescuentos();
        cargarCupones();
    }, []);

    const cargarDescuentos = () => api.get('/descuentos').then(res => setDescuentos(res.data));
    const cargarCupones = () => api.get('/cupones').then(res => setCupones(res.data));

    const guardarDescuento = async () => {
        try {
            await api.post('/descuentos', form);
            setMensaje('✅ Descuento creado correctamente');
            setForm({ nombre: '', tipo: 'porcentaje', valor: '', fecha_inicio: '', fecha_fin: '' });
            setMostrarForm(false);
            cargarDescuentos();
        } catch { setMensaje('❌ Error al crear descuento'); }
    };

    const guardarCupon = async () => {
        try {
            await api.post('/cupones', formCupon);
            setMensaje('✅ Cupón creado correctamente');
            setFormCupon({ codigo: '', tipo: 'porcentaje', valor: '', uso_maximo: 1, fecha_inicio: '', fecha_fin: '' });
            setMostrarForm(false);
            cargarCupones();
        } catch { setMensaje('❌ Error al crear cupón'); }
    };

    const eliminarDescuento = async (id) => {
        if (confirm('¿Eliminar este descuento?')) {
            await api.delete(`/descuentos/${id}`);
            cargarDescuentos();
        }
    };

    const eliminarCupon = async (id) => {
        if (confirm('¿Eliminar este cupón?')) {
            await api.delete(`/cupones/${id}`);
            cargarCupones();
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">🏷️ Descuentos y Cupones</h2>
                    <button onClick={() => setMostrarForm(!mostrarForm)}
                        className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                        {mostrarForm ? 'Cancelar' : '+ Nuevo'}
                    </button>
                </div>

                <div className="flex gap-3 mb-6">
                    <button onClick={() => { setTab('descuentos'); setMostrarForm(false); }}
                        className={`px-5 py-2 rounded-xl font-semibold transition ${tab === 'descuentos' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                        Descuentos por Producto
                    </button>
                    <button onClick={() => { setTab('cupones'); setMostrarForm(false); }}
                        className={`px-5 py-2 rounded-xl font-semibold transition ${tab === 'cupones' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                        Cupones
                    </button>
                </div>

                {mensaje && <p className="mb-4 text-green-400 font-semibold">{mensaje}</p>}

                {mostrarForm && tab === 'descuentos' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-lg mb-4">Nuevo Descuento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Nombre del descuento" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="porcentaje">Porcentaje (%)</option>
                                <option value="fijo">Monto Fijo ($)</option>
                            </select>
                            <input placeholder="Valor" type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="date" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="date" value={form.fecha_fin} onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <button onClick={guardarDescuento}
                                className="md:col-span-2 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                                Guardar Descuento
                            </button>
                        </div>
                    </div>
                )}

                {mostrarForm && tab === 'cupones' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-lg mb-4">Nuevo Cupón</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Código (ej: DESCUENTO10)" value={formCupon.codigo} onChange={e => setFormCupon({ ...formCupon, codigo: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <select value={formCupon.tipo} onChange={e => setFormCupon({ ...formCupon, tipo: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="porcentaje">Porcentaje (%)</option>
                                <option value="fijo">Monto Fijo ($)</option>
                            </select>
                            <input placeholder="Valor" type="number" value={formCupon.valor} onChange={e => setFormCupon({ ...formCupon, valor: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input placeholder="Usos máximos" type="number" value={formCupon.uso_maximo} onChange={e => setFormCupon({ ...formCupon, uso_maximo: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="date" value={formCupon.fecha_inicio} onChange={e => setFormCupon({ ...formCupon, fecha_inicio: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input type="date" value={formCupon.fecha_fin} onChange={e => setFormCupon({ ...formCupon, fecha_fin: e.target.value })}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <button onClick={guardarCupon}
                                className="md:col-span-2 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                                Guardar Cupón
                            </button>
                        </div>
                    </div>
                )}

                {tab === 'descuentos' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Nombre</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Tipo</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Valor</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Vigencia</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {descuentos.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay descuentos registrados</td></tr>
                                )}
                                {descuentos.map(d => (
                                    <tr key={d.id} className="border-t border-gray-800 hover:bg-gray-800 transition">
                                        <td className="px-6 py-4 font-semibold">{d.nombre}</td>
                                        <td className="px-6 py-4 text-gray-400">{d.tipo}</td>
                                        <td className="px-6 py-4 text-orange-400 font-bold">{d.tipo === 'porcentaje' ? `${d.valor}%` : `$${d.valor}`}</td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{d.fecha_inicio} → {d.fecha_fin}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => eliminarDescuento(d.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'cupones' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Código</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Tipo</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Valor</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Usos</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Vigencia</th>
                                    <th className="px-6 py-4 text-left text-gray-400 text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cupones.length === 0 && (
                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay cupones registrados</td></tr>
                                )}
                                {cupones.map(c => (
                                    <tr key={c.id} className="border-t border-gray-800 hover:bg-gray-800 transition">
                                        <td className="px-6 py-4 font-bold text-orange-400">{c.codigo}</td>
                                        <td className="px-6 py-4 text-gray-400">{c.tipo}</td>
                                        <td className="px-6 py-4 text-orange-400 font-bold">{c.tipo === 'porcentaje' ? `${c.valor}%` : `$${c.valor}`}</td>
                                        <td className="px-6 py-4 text-gray-400">{c.usos_actuales}/{c.uso_maximo}</td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{c.fecha_inicio} → {c.fecha_fin}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => eliminarCupon(c.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}