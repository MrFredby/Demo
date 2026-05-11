import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Producto from './pages/Producto';
import MisPedidos from './pages/MisPedidos';
import AdminLogin from './pages/admin/login';
import Dashboard from './pages/admin/Dashboard';
import AdminProductos from './pages/admin/Productos';
import AdminCategorias from './pages/admin/Categorias';
import AdminPedidos from './pages/admin/Pedidos';
import AdminDescuentos from './pages/admin/Descuentos';
import Buscar from './pages/Buscar';
import PedidoExitoso from './pages/PedidoExitoso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/buscar/:termino" element={<Buscar />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/descuentos" element={<AdminDescuentos />} />
        <Route path="/pedido-exitoso" element={<PedidoExitoso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;