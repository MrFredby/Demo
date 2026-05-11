import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Descuentos() {
    const [descuentos, setDescuentos] = useState([]);
    const [cupones, setCupones] = useState([]);
    const [tab, setTab] = useState('descuentos');
    const [form, setForm] = useState({ nombre: '', tipo: 'porcentaje', valor: '', fecha_inicio: '', fecha_fin: '' });
    const [formCupon, setFormCupon] = useState({ codigo: '', tipo: 'porcentaje', valor: '', uso_maximo: 1, fecha_inicio: '', fecha_fin: '' });
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDescuentos();
        cargarCupones();
    }, []);

    const cargarDescuentos = async () => {
        const res = await api.get('/descuentos');
        setDescuentos(res.data);
    };

    const cargarCupones = async () => {
        const res = await api.get('/cupones');
        setCupones(res.data);
    };

    const guardarDescuento = async () => {
        try {
            await api.post('/descuentos', form);
            setMensaje('Descuento creado correctamente');
            setForm({ nombre: '', tipo: 'porcentaje', valor: '', fecha_inicio: '', fecha_fin: '' });
            cargarDescuentos();
        } catch (err) {
            setMensaje('Error al crear descuento');
        }
    };

    const guardarCupon = async () => {
        try {
            await api.post('/cupones', formCupon);
            setMensaje('Cupón creado correctamente');
            setFormCupon({ codigo: '', tipo: 'porcentaje', valor: '', uso_maximo: 1, fecha_inicio: '', fecha_fin: '' });
            cargarCupones();
        } catch (err) {
            setMensaje('Error al crear cupón');
        }
    };

    const eliminarDescuento = async (id) => {
        await api.delete(`/descuentos/${id}`);
        cargarDescuentos();
    };

    const eliminarCupon = async (id) => {
        await api.delete(`/cupones/${id}`);
        cargarCupones();
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>🏷️ Descuentos y Cupones</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setTab('descuentos')}
                    style={{ padding: '10px 20px', background: tab === 'descuentos' ? '#E95A25' : '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Descuentos por Producto
                </button>
                <button onClick={() => setTab('cupones')}
                    style={{ padding: '10px 20px', background: tab === 'cupones' ? '#E95A25' : '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Cupones
                </button>
            </div>

            {mensaje && <p style={{ color: '#4CAF50', marginBottom: '15px' }}>{mensaje}</p>}

            {tab === 'descuentos' && (
                <div>
                    <div style={{ background: '#1e1e2e', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                        <h3>Nuevo Descuento</h3>
                        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }}>
                            <option value="porcentaje">Porcentaje (%)</option>
                            <option value="fijo">Monto Fijo ($)</option>
                        </select>
                        <input placeholder="Valor" type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <input type="date" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <input type="date" value={form.fecha_fin} onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <button onClick={guardarDescuento}
                            style={{ width: '100%', padding: '12px', background: '#E95A25', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Guardar Descuento
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#2a2a3e' }}>
                                <th style={{ padding: '10px' }}>Nombre</th>
                                <th style={{ padding: '10px' }}>Tipo</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                                <th style={{ padding: '10px' }}>Vigencia</th>
                                <th style={{ padding: '10px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {descuentos.map(d => (
                                <tr key={d.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '10px' }}>{d.nombre}</td>
                                    <td style={{ padding: '10px' }}>{d.tipo}</td>
                                    <td style={{ padding: '10px' }}>{d.tipo === 'porcentaje' ? `${d.valor}%` : `$${d.valor}`}</td>
                                    <td style={{ padding: '10px' }}>{d.fecha_inicio} - {d.fecha_fin}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => eliminarDescuento(d.id)}
                                            style={{ padding: '5px 10px', background: '#e53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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
                <div>
                    <div style={{ background: '#1e1e2e', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                        <h3>Nuevo Cupón</h3>
                        <input placeholder="Código del cupón (ej: DESCUENTO10)" value={formCupon.codigo} onChange={e => setFormCupon({ ...formCupon, codigo: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <select value={formCupon.tipo} onChange={e => setFormCupon({ ...formCupon, tipo: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }}>
                            <option value="porcentaje">Porcentaje (%)</option>
                            <option value="fijo">Monto Fijo ($)</option>
                        </select>
                        <input placeholder="Valor" type="number" value={formCupon.valor} onChange={e => setFormCupon({ ...formCupon, valor: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <input placeholder="Usos máximos" type="number" value={formCupon.uso_maximo} onChange={e => setFormCupon({ ...formCupon, uso_maximo: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <input type="date" value={formCupon.fecha_inicio} onChange={e => setFormCupon({ ...formCupon, fecha_inicio: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <input type="date" value={formCupon.fecha_fin} onChange={e => setFormCupon({ ...formCupon, fecha_fin: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#2a2a3e', color: 'white' }} />
                        <button onClick={guardarCupon}
                            style={{ width: '100%', padding: '12px', background: '#E95A25', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Guardar Cupón
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#2a2a3e' }}>
                                <th style={{ padding: '10px' }}>Código</th>
                                <th style={{ padding: '10px' }}>Tipo</th>
                                <th style={{ padding: '10px' }}>Valor</th>
                                <th style={{ padding: '10px' }}>Usos</th>
                                <th style={{ padding: '10px' }}>Vigencia</th>
                                <th style={{ padding: '10px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cupones.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '10px' }}><strong>{c.codigo}</strong></td>
                                    <td style={{ padding: '10px' }}>{c.tipo}</td>
                                    <td style={{ padding: '10px' }}>{c.tipo === 'porcentaje' ? `${c.valor}%` : `$${c.valor}`}</td>
                                    <td style={{ padding: '10px' }}>{c.usos_actuales}/{c.uso_maximo}</td>
                                    <td style={{ padding: '10px' }}>{c.fecha_inicio} - {c.fecha_fin}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => eliminarCupon(c.id)}
                                            style={{ padding: '5px 10px', background: '#e53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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
    );
}