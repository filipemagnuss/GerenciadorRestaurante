import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdmin } from '../api/api';


export default function CreateAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await createAdmin(username, password);
      alert('Administrador criado com sucesso!');
      navigate('/');
    } catch (err) {
      alert('Erro ao criar administrador');
    }
  };

  return (
    <div>
      <h2>Criar Administrador</h2>
      <input
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleCreate}>Criar</button>
    </div>
  );
}