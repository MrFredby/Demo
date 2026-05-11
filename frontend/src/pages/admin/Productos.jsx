import { useEffect, useState } from 'react';
import api from '../../services/api';

function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', slug: '', precio: '', id_categoria: '' });
    const [categorias, setCategorias] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        cargarProductos();
        api.get('/categorias').then(res => setCategorias(res.data));
    }, []);

    const cargarProductos = () => {
        api.get('/productos').then(res => setProductos(res.data));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando) {
            await api.put(`/productos/${editando}`, form);
            setEditando(null);
        } else {
            await api.post('/productos', form);
        }
        setForm({ nombre: '', descripcion: '', slug: '', precio: '', id_categoria: '' });
        setMostrarForm(false);
        cargarProductos();
    };

    const handleEditar = (producto) => {
        setForm({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            slug: producto.slug,
            precio: producto.precio,
            id_categoria: producto.id_categoria
        });
        setEditando(producto.id);
        setMostrarForm(true);
    };

    const handleEliminar = async (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            await api.delete(`/productos/${id}`);
            cargarProductos();
        }
    };

    const handleImagenChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleSubirImagen = async (id) => {
        if (!imagen) return;
        setSubiendoImagen(true);
        setProductoSeleccionado(id);
        try {
            const formData = new FormData();
            formData.append('imagen', imagen);
            await api.post(`/imagenes/producto/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImagen(null);
            setProductoSeleccionado(null);
            cargarProductos();
            alert('✅ Imagen subida correctamente');
        } catch {
            alert('❌ Error al subir imagen');
        }
        setSubiendoImagen(false);
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
                        <h2 className="text-3xl font-bold text-white">📦 Productos</h2>
                        <p className="text-gray-400 text-sm mt-1">{productos.length} productos registrados</p>
                    </div>
                    <button onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', descripcion: '', slug: '', precio: '', id_categoria: '' }); }}
                        className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                        {mostrarForm ? 'Cancelar' : '+ Nuevo Producto'}
                    </button>
                </div>

                {mostrarForm && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-white text-lg mb-4">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="nombre" placeholder="Nombre del producto" value={form.nombre} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input name="slug" placeholder="Slug (ej: pastillas-freno)" value={form.slug} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <input name="precio" placeholder="Precio" type="number" value={form.precio} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            <select name="id_categoria" value={form.id_categoria} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="">Seleccionar categoría</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                            <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange}
                                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2" />
                            <button type="submit"
                                className="md:col-span-2 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition font-semibold">
                                {editando ? 'Actualizar Producto' : 'Guardar Producto'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Imagen</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Nombre</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Precio</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Categoría</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Estado</th>
                                <th className="px-6 py-4 text-left text-gray-400 text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p, i) => (
                                <tr key={p.id} className={`border-t border-gray-800 hover:bg-gray-800 transition ${i % 2 === 0 ? '' : 'bg-gray-900'}`}>
                                    <td className="px-6 py-4 text-gray-500">#{p.id}</td>
                                    <td className="px-6 py-4">
                                        {p.imagen
                                            ? <img src={p.imagen} alt={p.nombre} className="w-14 h-14 object-cover rounded-lg" />
                                            : <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">📦</div>
                                        }
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-white">{p.nombre}</td>
                                    <td className="px-6 py-4 text-orange-400 font-bold">${p.precio}</td>
                                    <td className="px-6 py-4 text-gray-400">{p.id_categoria}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${p.activo ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditar(p)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition">
                                                    Editar
                                                </button>
                                                <button onClick={() => handleEliminar(p.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition">
                                                    Eliminar
                                                </button>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <input type="file" accept="image/*" onChange={handleImagenChange}
                                                    className="text-xs text-gray-400 w-32" />
                                                <button onClick={() => handleSubirImagen(p.id)}
                                                    disabled={subiendoImagen && productoSeleccionado === p.id}
                                                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-50">
                                                    {subiendoImagen && productoSeleccionado === p.id ? '...' : '📷 Subir'}
                                                </button>
                                            </div>
                                        </div>
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

export default AdminProductos;