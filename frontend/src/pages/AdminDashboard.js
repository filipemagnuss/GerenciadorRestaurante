import React, { useState, useEffect } from 'react';
import { getProducts, addProduct } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts(token);
    setProducts(data);
  };

  const handleAdd = async () => {
    await addProduct(token, { name, price: parseFloat(price) });
    setName('');
    setPrice('');
    fetchProducts();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <input placeholder="Nome do Produto" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={handleAdd}>Adicionar Produto</button>
      </div>
      <h3>Produtos</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - R$ {p.price}</li>
        ))}
      </ul>
    </div>
  );
}