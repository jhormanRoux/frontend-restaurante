// 📁 src/pages/Admin.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css'

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState(1);

  // Cargar pedidos
  const cargarPedidos = () => {
    axios.get(`${API_URL}/api/pedidos`)
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err));
  };

  // Cargar productos
  const cargarProductos = () => {
    axios.get(`${API_URL}/api/productos`)
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarPedidos();
    cargarProductos();
  }, []);

  const completarPedido = (id) => {
    axios.put(`${API_URL}/api/pedidos/${id}`, { estado: 'completado' })
      .then(() => {
        alert('✅ Pedido completado');

        // Actualizar estado local sin recargar desde el servidor
        setPedidos(prev =>
          prev.map(p =>
            p.id === id ? { ...p, estado: 'completado' } : p
          )
        );
      })
      .catch(() => alert('❌ Error al actualizar pedido'));
  };


  const actualizarDisponibilidad = (id, disponible) => {
    axios.put(`${API_URL}/api/productos/${id}/disponibilidad`, { disponible })
      .then(() => {
        alert('✅ Disponibilidad actualizada');
        cargarProductos();
      })
      .catch(() => alert('❌ Error al actualizar disponibilidad'));
  };

  const crearProducto = () => {
    axios.post(`${API_URL}/api/productos`, {
      nombre: nuevoNombre,
      categoria_id: categoriaId
    })
      .then(() => {
        alert('✅ Producto creado');
        setNuevoNombre('');
        cargarProductos();
      })
      .catch(() => alert('❌ Error al crear producto'));
  };

  const eliminarProducto = (id) => {
    axios.delete(`${API_URL}/api/productos/${id}`)
      .then(() => {
        alert('🗑️ Producto eliminado');
        cargarProductos();
      })
      .catch(() => alert('❌ Error al eliminar producto'));
  };

  const eliminarPedidosCompletados = () => {
    if (window.confirm('¿Estás seguro de eliminar todos los pedidos completados?')) {
      axios.delete(`${API_URL}/api/pedidos/completados`)
        .then(() => {
          alert('🗑️ Pedidos completados eliminados');
          cargarPedidos();
        })
        .catch(() => alert('❌ Error al eliminar pedidos completados'));
    }
  };

  // Agrupar pedidos por número de mesa
  const pedidosPorMesa = pedidos.reduce((acc, pedido) => {
    const mesa = pedido.mesa || 1;
    if (!acc[mesa]) acc[mesa] = [];
    acc[mesa].push(pedido);
    return acc;
  }, {});

  return (
    <div className='panel-administracion'>
              

      <div className='panel-one'>

        <h3>Pedidos</h3>

        {Object.entries(pedidosPorMesa).map(([mesa, pedidosMesa]) => (
          <div key={mesa}>
            <h4>Mesa {mesa}</h4>
            <div className='contenedor-cards-pedidos'>
            {pedidosMesa.map(p => (
              <div key={p.id} className={`card-pedido ${p.estado === 'completado' ? 'completado' : ''}`}>
                  <p><strong>ID:</strong> {p.id}</p>
                  <p><strong>Principio:</strong> {p.principio}</p>
                  <p><strong>Proteína:</strong> {p.proteina}</p>
                  <p><strong>Bebida:</strong> {p.bebida}</p>
                  <p><strong>Estado:</strong> {p.estado}</p>
                  {p.estado === 'pendiente' && (
                    <button onClick={() => completarPedido(p.id)}>Marcar como Completado</button>
                  )}
                </div>
            ))}
            </div>
          </div>
        ))}
      </div>


      <div className='panel-two'>
        <h3>Productos</h3>
        <div className='cards-productos'>
          {productos.map(p => (
            <div key={p.id} className='card'>
              <p><strong>{p.nombre}</strong></p>
              <p>Estado: {p.disponible ? '✅ Disponible' : '❌ No disponible'}</p>
              <button onClick={() => actualizarDisponibilidad(p.id, !p.disponible)}>
                {p.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
              </button>
              <br />
              <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
      <div className='panel-three'>

        <button onClick={eliminarPedidosCompletados} style={{ margin: '20px auto', backgroundColor: 'red', color: 'white' }}>
          🗑️ Eliminar Pedidos Completados
        </button>

        <h3>Agregar Producto</h3>
        <input value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} placeholder="Nombre del producto" />
        <select value={categoriaId} onChange={(e) => setCategoriaId(parseInt(e.target.value))}>
          <option value={1}>Principio</option>
          <option value={2}>Proteína</option>
          <option value={3}>Bebida</option>
        </select>
        <button onClick={crearProducto}>Crear</button>

      </div>
    </div>
  );
}

export default Admin;
