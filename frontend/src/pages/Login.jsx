import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BASE_URL = 'http://localhost:5197';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        console.log('Login bem-sucedido. Token JWT recebido.');
        navigate("/admin");
      } else {
        let errorData;
        try {
            errorData = await response.json();
            setErrorMessage(errorData.message || 'Falha no login. Verifique suas credenciais.');
        } catch (jsonError) {
            const errorText = await response.text();
            setErrorMessage(errorText || 'Erro inesperado na resposta da API.');
        }
      }
    } catch (error) {
      setErrorMessage("Erro de rede: O servidor não pode ser alcançado. Verifique se o backend está em execução.");
      console.error("Erro na requisição:", error);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F0]">
      <div className="w-1/3 flex flex-col items-center justify-center p-8 bg-[#8CBF89] text-[#2C5234] rounded-r-lg shadow-lg">
        <div className="text-center">
          <img
            src="/src/images/logo.png"
            alt="Logo"
            className="w-80 h-80 mx-auto rounded-full"
          />
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#588157]">Acesse a sua conta</h1>
          <form onSubmit={handleLogin}>
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
            {errorMessage && (
              <p className="text-red-500 text-center mt-4 text-sm font-semibold">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full mt-6 px-12 py-3 bg-[#588157] text-white rounded-full font-bold text-lg hover:bg-[#4A724A] transition"
            >
              Entrar
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={handleGoToRegister}
              className="text-sm text-[#588157] hover:text-[#4A724A] transition font-semibold"
            >
              Não tem um Usuário? Crie um aqui.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
