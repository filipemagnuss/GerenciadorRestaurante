import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // produto em edição
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
    if (!name || !price) return alert('Preencha nome e preço');
    await addProduct(token, { name, price: parseFloat(price) });
    setName('');
    setPrice('');
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;
    await deleteProduct(token, id);
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleEditSave = async () => {
    if (!editingProduct.name || !editingProduct.price) return alert('Preencha nome e preço');
    await updateProduct(token, editingProduct.id, {
      name: editingProduct.name,
      price: parseFloat(editingProduct.price)
    });
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div>
        <input
          placeholder="Nome do Produto"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Preço"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar Produto</button>
      </div>

      <h3>Produtos</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - R$ {p.price}
            <button onClick={() => handleEditClick(p)} style={{ marginLeft: '10px', color: 'blue' }}>
              Editar
            </button>
            <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Deletar
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de edição */}
      {editingProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h3>Editar Produto</h3>
            <input
              value={editingProduct.name}
              onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />
            <input
              value={editingProduct.price}
              onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleEditSave}>Salvar</button>
              <button onClick={handleEditCancel} style={{ marginLeft: '10px' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
