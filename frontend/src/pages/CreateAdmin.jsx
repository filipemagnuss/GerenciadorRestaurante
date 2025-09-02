import { useNavigate } from "react-router-dom";

export default function CreateAdmin() {
  const navigate = useNavigate();

  const handleCreate = () => {
    console.log("Usuário criado!");
    navigate("/login");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#588157]">
          Criar Conta de Administrador
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
          onClick={handleCreate}
          className="w-full mt-6 px-12 py-3 bg-[#588157] text-white rounded-full font-bold text-lg hover:bg-[#4A724A] transition"
        >
          Criar Admin
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-sm text-[#588157] hover:text-[#4A724A] transition font-semibold"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
}