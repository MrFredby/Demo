import Navbar from '../components/Navbar';

function PedidoExitoso() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto px-6 py-16 text-center">
                <div className="bg-white rounded-3xl shadow-lg p-10">
                    {/* Ícono de éxito */}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">✅</span>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">¡Pedido realizado!</h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Tu pedido ha sido procesado correctamente. Te notificaremos cuando esté en camino.
                    </p>

                    {/* Pasos */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                <span className="text-2xl">📦</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Pedido recibido</p>
                            <p className="text-xs text-gray-400 mt-1">Estamos preparando tu pedido</p>
                        </div>
                        <div className="flex flex-col items-center opacity-40">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                <span className="text-2xl">🚚</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">En camino</p>
                            <p className="text-xs text-gray-400 mt-1">Tu pedido será enviado pronto</p>
                        </div>
                        <div className="flex flex-col items-center opacity-40">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                <span className="text-2xl">🏠</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Entregado</p>
                            <p className="text-xs text-gray-400 mt-1">Recibirás tu pedido pronto</p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/mis-pedidos"
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                            Ver mis pedidos
                        </a>
                        <a href="/"
                            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                            Seguir comprando
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PedidoExitoso;
