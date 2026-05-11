import { useEffect, useState } from 'react';
import api from '../services/api';

function BuscadorVehiculo({ onResultados }) {
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [versiones, setVersiones] = useState([]);
    const [marcaId, setMarcaId] = useState('');
    const [modeloId, setModeloId] = useState('');
    const [versionId, setVersionId] = useState('');

    useEffect(() => {
        api.get('/vehiculos/marcas').then(res => setMarcas(res.data));
    }, []);

    const handleMarca = (e) => {
        setMarcaId(e.target.value);
        setModelos([]);
        setVersiones([]);
        setModeloId('');
        setVersionId('');
        if (e.target.value) {
            api.get(`/vehiculos/modelos/${e.target.value}`).then(res => setModelos(res.data));
        }
    };

    const handleModelo = (e) => {
        setModeloId(e.target.value);
        setVersiones([]);
        setVersionId('');
        if (e.target.value) {
            api.get(`/vehiculos/versiones/${e.target.value}`).then(res => setVersiones(res.data));
        }
    };

    const handleVersion = (e) => {
        setVersionId(e.target.value);
    };

    const handleBuscar = () => {
        if (versionId) {
            api.get(`/vehiculos/compatibles/${versionId}`).then(res => onResultados(res.data));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">🔍 Buscar por mi vehículo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <select onChange={handleMarca} value={marcaId}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Marca</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
                <select onChange={handleModelo} value={modeloId} disabled={!marcaId}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50">
                    <option value="">Modelo</option>
                    {modelos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
                <select onChange={handleVersion} value={versionId} disabled={!modeloId}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50">
                    <option value="">Año / Motor</option>
                    {versiones.map(v => <option key={v.id} value={v.id}>{v.anio} - {v.motor}</option>)}
                </select>
                <button onClick={handleBuscar} disabled={!versionId}
                    className="bg-orange-500 text-white rounded-lg py-2 font-semibold hover:bg-orange-600 transition disabled:opacity-50">
                    Buscar
                </button>
            </div>
        </div>
    );
}

export default BuscadorVehiculo;