import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BASE_URL = 'http://localhost:5197';

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const registerResponse = await fetch(`${BASE_URL}/api/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (registerResponse.ok) {
        const loginResponse = await fetch(`${BASE_URL}/api/Auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem('authToken', loginData.token);
          console.log('Registro bem-sucedido. Login automático realizado.');
          navigate("/admin");
        } else {
          setSuccessMessage("Conta criada com sucesso! Faça login para continuar.");
          navigate("/login");
        }
      } else {
        let errorText;
        try {
          const errorData = await registerResponse.json();
          errorText = errorData.message || 'Erro ao criar o administrador!';
        } catch (jsonError) {
          errorText = await registerResponse.text();
          errorText = errorText || 'Erro ao criar o administrador!';
        }
        setErrorMessage(errorText);
      }
    } catch (err) {
      setErrorMessage("Erro de conexão!");
      console.error("Erro na requisição:", err);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#588157]">
          Criar Conta de Administrador
        </h1>
        {successMessage && (
          <div className="text-center mb-4 text-green-600 font-bold">
            <p>{successMessage}</p>
            <button onClick={handleGoToLogin} className="text-[#588157] underline mt-2">
              Ir para Login
            </button>
          </div>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <input
              type="text" 
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-[#B8D8B8] text-gray-700 placeholder-[#99B299] focus:outline-none focus:ring-2 focus:ring-[#588157]"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-[#B8D8B8] text-gray-700 placeholder-[#99B299] focus:outline-none focus:ring-2 focus:ring-[#588157]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 px-12 py-3 bg-[#588157] text-white rounded-full font-bold text-lg hover:bg-[#4A724A] transition"
          >
            Criar Admin
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoToLogin}
            className="text-sm text-[#588157] hover:text-[#4A724A] transition font-semibold"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
}
