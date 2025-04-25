import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/pedidos');
      setPedidos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      setLoading(false);
    }
  };

  const marcarComoEntregado = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/pedidos/${id}/entregar`);
      fetchPedidos();
    } catch (error) {
      console.error('Error al marcar como entregado:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Pedidos Recibidos</h2>
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos aún.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hora</th>
              <th>Proteína</th>
              <th>Principio</th>
              <th>Bebida</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} style={{ backgroundColor: pedido.entregado ? '#d4edda' : 'white' }}>
                <td>{pedido.id}</td>
                <td>{new Date(pedido.created_at).toLocaleTimeString()}</td>
                <td>{pedido.proteina}</td>
                <td>{pedido.principio}</td>
                <td>{pedido.bebida}</td>
                <td>
                  {pedido.entregado ? (
                    '✅ Entregado'
                  ) : (
                    <button onClick={() => marcarComoEntregado(pedido.id)}>
                      Marcar entregado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
