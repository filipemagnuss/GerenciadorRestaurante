import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F0]">
      <div className="w-1/3 flex flex-col items-center justify-center p-8 bg-[#8CBF89] text-[#2C5234] rounded-r-lg shadow-lg">
        <div className="text-center">
          <img
            src="src/images/logo.png" 
            alt="Logo"
            className="w-80 h-80 mx-auto mb-4"
          />
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold mb-8 text-[#588157]">
            Gerenciador de Restaurante
          </h1>
          <h2 className="text-2xl font-semibold mb-2">Acesse sua conta</h2>
          <p className="text-sm text-gray-600 mb-6">
            Entre para gerenciar seu restaurante ou crie um novo Administrador.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleLogin}
              className="px-8 py-3 bg-[#D9F2D9] text-[#2C5234] rounded-full border-2 border-[#588157] font-bold text-lg hover:bg-[#C9E8C9] transition"
            >
              Entrar
            </button>
            <button
              onClick={handleRegister}
              className="px-8 py-3 bg-[#D9F2D9] text-[#2C5234] rounded-full border-2 border-[#588157] font-bold text-lg hover:bg-[#C9E8C9] transition"
            >
              Criar Administrador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}