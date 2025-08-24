import { useState, useEffect } from "react";
import api from "../api/api";

export default function Kitchen() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api.get("/orders").then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  const markReady = async (id) => {
    await api.put(`/orders/${id}/ready`);
    fetchOrders();
  };

  return (
    <div>
      <h2>Pedidos na Cozinha</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            {o.customerName} - {o.status}
            {o.status === "Pendente" && <button onClick={() => markReady(o.id)}>Pronto</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
