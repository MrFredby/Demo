import { useEffect, useState } from 'react';
import api from '../../services/api';

function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', slug: '' });
    const [mostrarForm, setMostrarForm] = useState(false);

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = () => {
        api.get('/categorias').then(res => setCategorias(res.data));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/categorias', form);
        setForm({ nombre: '', descripcion: '', slug: '' });
        setMostrarForm(false);
        cargarCategorias();
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">📁 Categorías</h2>
                        <p className="text-gray-400 text-sm mt-1">{categorias.length} categorías registradas</p>
                    </div>
                    <button onClick={() => setMostrarForm(!mostrarForm)}
                        className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                        {mostrarForm ? 'Cancelar' : '+ Nueva Categoría'}
                    </button>
                </div>

                {mostrarForm && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-white text-lg mb-4">Nueva Categoría</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="nombre" placeholder="Nombre de la categoría" value={form.nombre} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input name="slug" placeholder="Slug (ej: frenos)" value={form.slug} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2" />
                            <button type="submit"
                                className="md:col-span-2 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                                Guardar Categoría
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Nombre</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Slug</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Descripción</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((c, i) => (
                                <tr key={c.id} className={`border-t border-gray-800 hover:bg-gray-800 transition ${i % 2 === 0 ? '' : 'bg-gray-900'}`}>
                                    <td className="px-6 py-4 text-gray-500">#{c.id}</td>
                                    <td className="px-6 py-4 font-semibold text-white">{c.nombre}</td>
                                    <td className="px-6 py-4 text-gray-400">{c.slug}</td>
                                    <td className="px-6 py-4 text-gray-400">{c.descripcion}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${c.activo ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                            {c.activo ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminCategorias;