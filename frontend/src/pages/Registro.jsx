import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', telefono: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios/registro', form);
            navigate('/login');
        } catch (err) {
            setError('Error al registrar usuario');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear cuenta</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nombre" placeholder="Nombre"
                        value={form.nombre} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input type="text" name="apellido" placeholder="Apellido"
                        value={form.apellido} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input type="email" name="email" placeholder="Correo electrónico"
                        value={form.email} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input type="password" name="password" placeholder="Contraseña"
                        value={form.password} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input type="text" name="telefono" placeholder="Teléfono"
                        value={form.telefono} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
                    >
                        Registrarse
                    </button>
                </form>
                <p className="text-center text-sm mt-4 text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="text-orange-500 font-semibold hover:underline">
                        Inicia sesión
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Registro;
