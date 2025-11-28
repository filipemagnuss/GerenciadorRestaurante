import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = 'http://localhost:5197'; 

export default function OrdersDisplay() {
  const [readyOrders, setReadyOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const navigate = useNavigate();
  
  const announcedRef = useRef([]);

  const getOrderArrivalTime = (orderId) => {
    const storageKey = `order_ready_time_${orderId}`;
    const storedTime = localStorage.getItem(storageKey);

    if (storedTime) {
      return parseInt(storedTime, 10);
    } else {
      const now = Date.now();
      localStorage.setItem(storageKey, now.toString());
      return now;
    }
  };

  const cleanupOldStorage = () => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('order_ready_time_')) {
        const timestamp = parseInt(localStorage.getItem(key), 10);
        if (now - timestamp > ONE_HOUR) {
          localStorage.removeItem(key);
        }
      }
    }
  };

  const announceOrder = (orderId) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 

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

        const rawReady = allOrders.filter(o => o.status === "Pronto");
        const preparing = allOrders.filter(o => o.status === "Em Preparo");

        const now = Date.now();
        const THREE_MINUTES_MS = 3 * 60 * 1000; 

        const visibleReadyOrders = rawReady.filter(order => {
          const arrivalTime = getOrderArrivalTime(order.id);
          const timeDiff = now - arrivalTime;
          if (timeDiff >= THREE_MINUTES_MS) {
            return false;
          }
          return true;
        });

        setReadyOrders(visibleReadyOrders);
        setPreparingOrders(preparing);

        if (audioEnabled) {
          visibleReadyOrders.forEach(order => {
            const arrivalTime = getOrderArrivalTime(order.id);
            const isRecent = (now - arrivalTime) < 15000; 

            if (!announcedRef.current.includes(order.id) && isRecent) {
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
    cleanupOldStorage();
    fetchOrders(); 
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [audioEnabled]); 

  if (!audioEnabled) {
    return (
      <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center flex-col font-inter">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
            <h1 className="text-3xl font-bold text-[#2C5234] mb-4">Painel de TV</h1>
            <p className="text-gray-500 mb-8">Clique para iniciar o monitoramento.</p>
            <button 
            onClick={() => setAudioEnabled(true)}
            className="w-full py-3 bg-[#588157] text-white rounded-lg text-lg font-bold hover:bg-[#4A724A] transition"
            >
            Iniciar Painel
            </button>
            <button onClick={() => navigate('/')} className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium">
                Voltar
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 font-inter flex flex-col overflow-hidden">
      
      <header className="bg-white shadow-sm h-20 flex items-center justify-center relative shrink-0 z-10">
        <h1 className="text-3xl font-bold text-[#2C5234] uppercase tracking-wide">
            Acompanhe seu Pedido
        </h1>
        <button 
            onClick={() => navigate('/')} 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 font-semibold text-sm"
        >
            Sair
        </button>
      </header>
      <div className="flex-1 flex w-full h-full">
        <div className="w-1/2 bg-[#588157] flex flex-col border-r border-[#4A724A]">
          <div className="p-4 bg-[#4A724A] text-center">
            <h2 className="text-white text-2xl font-bold uppercase tracking-widest">
                Pronto
            </h2>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                {readyOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg h-40 flex flex-col items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Senha</span>
                    <span className="text-6xl font-black text-[#2C5234] leading-none mb-2">{order.id}</span>
                    <span className="text-lg font-semibold text-gray-700 truncate w-full text-center px-2">
                        {order.customerName}
                    </span>
                </div>
                ))}
            </div>

            {readyOrders.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/50">
                    <p className="text-xl">Aguardando pedidos...</p>
                </div>
            )}
          </div>
        </div>
        <div className="w-1/2 bg-gray-100 flex flex-col">
          <div className="p-4 bg-white border-b border-gray-200 text-center">
            <h2 className="text-gray-500 text-2xl font-bold uppercase tracking-widest">
                Preparando
            </h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
             <div className="grid grid-cols-2 gap-4">
                {preparingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg h-40 flex flex-col items-center justify-center shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1">Senha</span>
                    <span className="text-5xl font-bold text-gray-400 leading-none mb-2">{order.id}</span>
                    <span className="text-md font-medium text-gray-500 truncate w-full text-center px-2">
                        {order.customerName}
                    </span>
                </div>
                ))}
            </div>
            {preparingOrders.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p className="text-lg">Cozinha livre</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}