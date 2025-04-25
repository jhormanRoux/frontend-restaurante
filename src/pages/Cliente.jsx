import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cliente = () => {
  const [menu, setMenu] = useState(null);
  const [seleccion, setSeleccion] = useState({
    proteina: '',
    principio: '',
    bebida: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');

  const backendUrl = import.meta.env.VITE_API_URL;  // Asegúrate de que esta URL esté configurada correctamente en tu .env

  // Cargar el menú del día
  useEffect(() => {
    axios.get(`${backendUrl}/api/menu-del-dia`)
      .then((response) => {
        if (response.data.mensaje) {
          setError(response.data.mensaje);  // Si no hay menú, mostramos el mensaje
        } else {
          setMenu(response.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el menú:', error);
        setError('Error al obtener el menú. Asegúrate de que el servidor esté corriendo.');
      });
  }, []);

  // Cargar los pedidos
  useEffect(() => {
    axios.get(`${backendUrl}/api/pedidos`)
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los pedidos:', error);
        setError('Error al obtener los pedidos.');
      });
  }, []);

  const handleSelect = (tipo, opcionId) => {
    setSeleccion((prev) => ({
      ...prev,
      [tipo]: opcionId
    }));
  };

  const handleEnviarPedido = () => {
    if (!seleccion.proteina || !seleccion.principio || !seleccion.bebida) {
      alert('Por favor, selecciona proteína, principio y bebida.');
      return;
    }

    axios.post(`${backendUrl}/api/pedido`, {
      proteinaId: seleccion.proteina,
      principioId: seleccion.principio,
      bebidaId: seleccion.bebida
    })
    .then((response) => {
      alert('Pedido recibido: ' + response.data.mensaje);
    })
    .catch((error) => {
      console.error('Error al enviar el pedido:', error);
      alert('Hubo un problema al procesar tu pedido.');
    });
  };

  if (error) return <div>{error}</div>;
  if (!menu || !menu.opciones) return <div>Cargando menú...</div>;

  return (
    <div>
      <h1>Menú del Día</h1>
      <p>Precio: ${menu.precio}</p>

      {['proteina', 'principio', 'bebida'].map((tipo) => (
        <div key={tipo}>
          <h2>Selecciona tu {tipo}</h2>
          {menu.opciones[tipo].map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => handleSelect(tipo, opcion.id)}
              style={{
                backgroundColor: seleccion[tipo] === opcion.id ? 'green' : 'white',
                color: seleccion[tipo] === opcion.id ? 'white' : 'black',
              }}
            >
              {opcion.nombre}
            </button>
          ))}
        </div>
      ))}

      <div>
        <button onClick={handleEnviarPedido}>Enviar Pedido</button>
      </div>

      <h2>Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              Pedido #{pedido.id} - Proteína: {pedido.proteina_id}, Principio: {pedido.principio_id}, Bebida: {pedido.bebida_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cliente;
