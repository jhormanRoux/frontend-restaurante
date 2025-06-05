import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';


function Cliente() {


  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({
    principio_id: null,
    proteina_id: null,
    bebida_id: null,
  });

  const [searchParams] = useSearchParams();
const mesa = parseInt(searchParams.get('mesa')) || 1;



  useEffect(() => {
    axios.get('http://localhost:3000/api/productos?disponible=true')

      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  const seleccionar = (tipo, id) => {
    setPedido(prev => ({ ...prev, [`${tipo}_id`]: id }));
  };



  const enviarPedido = () => {
    if (pedido.principio_id && pedido.proteina_id && pedido.bebida_id) {
      axios.post('http://localhost:3000/api/pedidos', {
        ...pedido,
        mesa
      })

        .then(() => alert('✅ Pedido enviado!'))
        .catch(() => alert('❌ Error al enviar pedido'));
    } else {
      alert('Selecciona principio, proteína y bebida');
    }
  };

  const filtrarPorCategoria = (catId) =>
    productos.filter(p => p.categoria_id === catId);



  return (
    <div style={{ width: '90%', textAlign: 'center', margin: '0 auto' }}>
      <h2>Menú del Día</h2>

      <div>
        <h3>Principios</h3>
        {filtrarPorCategoria(1).map(p => (
          <button
            key={p.id}
            onClick={() => seleccionar('principio', p.id)}
            style={{ background: pedido.principio_id === p.id ? 'lightgreen' : '', margin: '5px' }}
          >
            {p.nombre}
          </button>
        ))}
      </div>

      <div>
        <h3>Proteínas</h3>
        {filtrarPorCategoria(2).map(p => (
          <button
            key={p.id}
            onClick={() => seleccionar('proteina', p.id)}
            style={{ background: pedido.proteina_id === p.id ? 'lightgreen' : '' }}
          >
            {p.nombre}
          </button>
        ))}
      </div>

      <div>
        <h3>Bebidas</h3>
        {filtrarPorCategoria(3).map(p => (
          <button
            key={p.id}
            onClick={() => seleccionar('bebida', p.id)}
            style={{ background: pedido.bebida_id === p.id ? 'lightgreen' : '' }}
          >
            {p.nombre}
          </button>
        ))}
      </div>

      <br />
      <button onClick={enviarPedido}>Hacer Pedido</button>
    </div>
  );
}

export default Cliente;
