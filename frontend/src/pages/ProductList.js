import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts(token);
    setProducts(data);
  };

  return (
    <div>
      <h2>Cardápio</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - R$ {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
