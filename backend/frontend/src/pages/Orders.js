import { useState, useEffect } from "react";
import api from "../api/api";

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState("");

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => setCart([...cart, product]);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    const productIds = cart.map(p => p.id);
    await api.post("/orders", { productIds, customerName: customer });
    setCart([]); setCustomer("");
    alert("Pedido enviado para a cozinha!");
  };

  return (
    <div>
      <h2>Fazer Pedido</h2>
      <input placeholder="Nome do Cliente" value={customer} onChange={e => setCustomer(e.target.value)} />
      <h3>Produtos</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - R${p.price.toFixed(2)}
            <button onClick={() => addToCart(p)}>Adicionar</button>
          </li>
        ))}
      </ul>

      <h3>Carrinho</h3>
      <ul>
        {cart.map((p, idx) => <li key={idx}>{p.name}</li>)}
      </ul>
      <button onClick={placeOrder}>Enviar Pedido</button>
    </div>
  );
}
