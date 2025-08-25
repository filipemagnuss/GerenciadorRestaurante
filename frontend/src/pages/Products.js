import { useState, useEffect } from "react";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const addProduct = async () => {
    if (!name || !price) return;
    await api.post("/products", { name, description: "", price: parseFloat(price), category: "Geral", isPromotion: false });
    setName(""); setPrice("");
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h2>Cardápio</h2>
      <div>
        <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Preço" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={addProduct}>Adicionar</button>
      </div>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - R${p.price.toFixed(2)}
            <button onClick={() => deleteProduct(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
