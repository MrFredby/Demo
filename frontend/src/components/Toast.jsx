import { useEffect, useState } from 'react';

function Toast({ mensaje, visible }) {
    const [mostrar, setMostrar] = useState(false);

    useEffect(() => {
        if (visible) {
            setMostrar(true);
        } else {
            const timer = setTimeout(() => setMostrar(false), 300);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!mostrar) return null;

    return (
        <>
            <style>{`
                @keyframes brinco {
                    0%   { transform: translateY(100px); opacity: 0; }
                    40%  { transform: translateY(-20px); opacity: 1; }
                    60%  { transform: translateY(10px); }
                    80%  { transform: translateY(-8px); }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes salida {
                    0%   { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(100px); opacity: 0; }
                }
                .toast-enter {
                    animation: brinco 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
                }
                .toast-exit {
                    animation: salida 0.3s ease forwards;
                }
                @keyframes progreso {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
                .barra-progreso {
                    animation: progreso 3s linear forwards;
                }
            `}</style>
            <div className={`fixed bottom-8 right-8 bg-gray-900 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 z-50 overflow-hidden ${visible ? 'toast-enter' : 'toast-exit'}`}>
                <div className="bg-orange-500 rounded-xl p-3">
                    <span className="text-3xl">🛒</span>
                </div>
                <div>
                    <p className="font-bold text-base">¡Agregado al carrito!</p>
                    <p className="text-gray-400 text-sm mt-0.5">{mensaje}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-orange-500 rounded-b-2xl barra-progreso"></div>
            </div>
        </>
    );
}

export default Toast;