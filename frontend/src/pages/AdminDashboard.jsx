import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const mockOrdersCount = 3;
  const mockTopSellers = {
    bebidas: { nome: 'Suco de Laranja', vendidos: 120 },
    lanches: { nome: 'Hambúrguer Clássico', vendidos: 95 },
    refeicoes: { nome: 'Salmão Grelhado', vendidos: 78 },
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    console.log("Logout bem-sucedido. Redirecionando para a página inicial.");
    navigate('/');
  };

  const handleCreateMenu = () => {
    navigate('/admin/create-product');
  };
  
  const handleViewMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F0] overflow-hidden font-inter">
      <div
        className={`fixed top-0 left-0 h-full bg-[#8CBF89] text-[#2C5234] transition-all duration-300 ease-in-out z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hover:w-64`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="flex items-center justify-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#2C5234]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </div>
        <nav className="flex flex-col space-y-4 p-4">
          <button
            onClick={handleCreateMenu}
            className={`flex items-center p-3 rounded-full text-lg font-semibold hover:bg-[#D9F2D9] hover:text-[#2C5234] transition-colors w-full text-left ${
              isSidebarOpen ? 'justify-start space-x-4' : 'justify-center'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1zm0 0V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7m-13 4h10m-10 4h10"></path></svg>
            <span className={`transition-opacity duration-150 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 absolute left-24'}`}>
              Criar Cardápio
            </span>
          </button>
          <button
            onClick={handleViewMenu}
            className={`flex items-center p-3 rounded-full text-lg font-semibold hover:bg-[#D9F2D9] hover:text-[#2C5234] transition-colors w-full text-left ${
              isSidebarOpen ? 'justify-start space-x-4' : 'justify-center'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-9.95 9h-2.05a12 12 0 1 1 12 12V2z"></path></svg>
            <span className={`transition-opacity duration-150 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 absolute left-24'}`}>
              Visualizar Cardápio
            </span>
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className={`absolute bottom-4 flex items-center p-3 rounded-full w-[80%] text-lg font-semibold text-white bg-[#588157] hover:bg-[#4A724A] transition ${
            isSidebarOpen ? 'left-1/2 -translate-x-1/2 justify-start space-x-4' : 'justify-center'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <span className={`transition-opacity duration-150 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 absolute left-24'}`}>
            Sair
          </span>
        </button>
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          <h1 className="text-4xl font-bold text-[#588157] mb-8">Painel do Administrador</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card de Pedidos em Andamento */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#2C5234] mb-2">Pedidos em Andamento</h2>
                <p className="text-4xl font-bold text-[#588157]">{mockOrdersCount}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#99B299]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6M8 12h8M8 16h8"></path></svg>
            </div>

            {/* Card de Faturamento */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#2C5234] mb-2">Faturamento de hoje</h2>
                <p className="text-4xl font-bold text-[#588157]">R$ 350,00</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#99B299]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            
            {/* Card de Itens Vendidos */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#2C5234] mb-2">Itens vendidos</h2>
                <p className="text-4xl font-bold text-[#588157]">45</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#99B299]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8l4 4-4 4M8 12h8"></path></svg>
            </div>
          </div>

          {/*itens*/}
          <h2 className="text-2xl font-bold text-[#588157] mt-8 mb-6">Itens mais vendidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bebidas Mais Vendidas */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#2C5234] mb-2">Bebidas</h3>
                <p className="text-2xl font-bold text-[#588157]">{mockTopSellers.bebidas.nome}</p>
                <p className="text-md text-gray-500">{mockTopSellers.bebidas.vendidos} vendidos</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#99B299]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10c0 4.418 3.582 8 8 8s8-3.582 8-8v-8H6v8z"></path><path d="M12 18a8 8 0 0 0 8-8"></path><path d="M14 11V3"></path><path d="M10 11V3"></path></svg>
            </div>
            
            {/* Lanches Mais Vendidos */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#2C5234] mb-2">Lanches</h3>
                <p className="text-2xl font-bold text-[#588157]">{mockTopSellers.lanches.nome}</p>
                <p className="text-md text-gray-500">{mockTopSellers.lanches.vendidos} vendidos</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#99B299]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path></svg>
            </div>
            
            {/* Refeições Mais Vendidas */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#2C5234] mb-2">Refeições</h3>
                <p className="text-2xl font-bold text-[#588157]">{mockTopSellers.refeicoes.nome}</p>
                <p className="text-md text-gray-500">{mockTopSellers.refeicoes.vendidos} vendidos</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#99B299]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6M8 12h8M8 16h8"></path></svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
