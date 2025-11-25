import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = 'http://localhost:5197'; 

export default function OrdersDisplay() {
  const [readyOrders, setReadyOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [lastAnnouncedIds, setLastAnnouncedIds] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const navigate = useNavigate();
  

  const announcedRef = useRef([]);

  const announceOrder = (orderId) => {
    if (!window.speechSynthesis) return;

    const text = `Pedido número ${orderId} pronto.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR'; 
    utterance.rate = 0.9; 
    
    window.speechSynthesis.speak(utterance);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Orders`);
      if (response.ok) {
        const data = await response.json();
        const allOrders = data.$values || data;

        const ready = allOrders.filter(o => o.status === "Pronto");
        const preparing = allOrders.filter(o => o.status === "Em Preparo");

        setReadyOrders(ready);
        setPreparingOrders(preparing);

        
        if (audioEnabled) {
          ready.forEach(order => {
            
            if (!announcedRef.current.includes(order.id)) {
              announceOrder(order.id);
              
              
              announcedRef.current = [...announcedRef.current, order.id];
            }
          });
        }
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  
  useEffect(() => {
    fetchOrders(); 
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [audioEnabled]); 

  if (!audioEnabled) {
    return (
      <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center flex-col">
        <h1 className="text-3xl font-bold text-[#588157] mb-8">Painel de Chamadas</h1>
        <button 
          onClick={() => setAudioEnabled(true)}
          className="px-8 py-4 bg-[#588157] text-white rounded-full text-xl font-bold hover:scale-105 transition shadow-lg"
        >
          🔊 Ativar Painel e Voz
        </button>
        <p className="mt-4 text-gray-500">Clique para permitir que o sistema anuncie os pedidos.</p>
        <button onClick={() => navigate('/')} className="mt-8 text-gray-500 hover:underline">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F0] p-4 font-inter flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <img src="/logo.png" alt="Logo" className="h-16 w-16" />
        <h1 className="text-4xl font-bold text-[#2C5234]">Acompanhe seu Pedido</h1>
        <button onClick={() => navigate('/')} className="px-4 py-2 text-[#588157] border border-[#588157] rounded hover:bg-[#D9F2D9]">
          Sair
        </button>
      </div>

      <div className="flex flex-1 gap-8">
        <div className="w-1/2 bg-[#588157] rounded-3xl p-6 flex flex-col shadow-xl">
          <h2 className="text-white text-3xl font-bold text-center mb-6 border-b border-white/30 pb-4">
            PRONTO
          </h2>
          <div className="grid grid-cols-2 gap-4 content-start overflow-y-auto max-h-[70vh]">
            {readyOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 flex flex-col items-center justify-center animate-pulse">
                <span className="text-6xl font-black text-[#2C5234]">{order.id}</span>
                <span className="text-lg text-gray-600 truncate max-w-full">{order.customerName}</span>
              </div>
            ))}
            {readyOrders.length === 0 && (
              <div className="col-span-2 text-center text-white/70 mt-10 text-xl">
                Nenhum pedido pronto no momento.
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 bg-white border-4 border-[#B8D8B8] rounded-3xl p-6 flex flex-col shadow-lg">
          <h2 className="text-[#588157] text-3xl font-bold text-center mb-6 border-b border-[#B8D8B8] pb-4">
            EM PREPARO
          </h2>
          <div className="grid grid-cols-2 gap-4 content-start overflow-y-auto max-h-[70vh]">
            {preparingOrders.map(order => (
              <div key={order.id} className="bg-[#F0F5F0] rounded-xl p-4 flex flex-col items-center justify-center opacity-80">
                <span className="text-4xl font-bold text-gray-500">{order.id}</span>
                <span className="text-md text-gray-400">{order.customerName}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}