import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F0]">
      <div className="w-1/3 flex flex-col items-center justify-center p-8 bg-[#8CBF89] text-[#2C5234] rounded-r-lg shadow-lg">
        <div className="text-center">
          <img
            src="src/images/logo.png"
            alt="Logo"
            className="w-80 h-80 mx-auto"
          />
        </div>
      </div>

      <div className="w-2/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#588157]">
            Acesse a sua conta
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome de usuário"
              className="w-full px-6 py-4 rounded-full border-2 border-[#B8D8B8] text-gray-700 placeholder-[#99B299] focus:outline-none focus:ring-2 focus:ring-[#588157]"
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-6 py-4 rounded-full border-2 border-[#B8D8B8] text-gray-700 placeholder-[#99B299] focus:outline-none focus:ring-2 focus:ring-[#588157]"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full mt-6 px-12 py-3 bg-[#588157] text-white rounded-full font-bold text-lg hover:bg-[#4A724A] transition"
          >
            Entrar
          </button>
          <div className="mt-4 text-center">
            <button
              onClick={handleRegister}
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