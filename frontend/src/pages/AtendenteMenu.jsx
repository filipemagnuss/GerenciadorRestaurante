import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5197';

export default function AtendenteMenu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/Categories`),
          fetch(`${BASE_URL}/api/Products`)
        ]);

        if (categoriesRes.ok && productsRes.ok) {
          const categoriesData = await categoriesRes.json();
          const productsData = await productsRes.json();
          setCategories(categoriesData.$values || categoriesData);
          setProducts(productsData.$values || productsData);
        } else {
          setError("Erro ao carregar dados do cardápio");
        }
      } catch (err) {
        setError("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []); 


  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });

    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (!isCartOpen) setIsCartOpen(true);
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) return prevCart.filter(item => item.id !== productId);
      return prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleFinalizeOrder = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      showNotification("Por favor, insira o nome do cliente.", "error");
      return;
    }
    
    const orderItems = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));
    
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/Orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Items: orderItems, CustomerName: customerName })
      });
      
      if (response.ok) {

        showNotification("Pedido realizado com sucesso!", "success");
        setCart([]);
        setCustomerName('');
        setIsCartOpen(false);
      } else {
        const errorData = await response.text();
        showNotification(`Erro ao finalizar: ${errorData}`, "error");
      }
    } catch (err) {
      showNotification("Erro de rede ao finalizar o pedido.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center"><p className="text-xl text-[#588157]">Carregando cardápio...</p></div>;
  if (error) return <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center"><p className="text-xl text-red-500">{error}</p></div>;

  return (
    <div className="flex min-h-screen bg-[#F0F5F0] font-inter relative">
      
      <div 
        className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
          notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        } ${notification.type === 'success' ? 'bg-[#588157]' : 'bg-red-500'}`}
      >
        {notification.message}
      </div>

      <div className={`flex-1 transition-all duration-300 ease-in-out ${isCartOpen ? 'mr-80' : 'mr-0'}`}>
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-4">
            <button onClick={() => navigate('/')} className="flex items-center text-[#588157] font-semibold hover:text-[#4A724A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Voltar para Home
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-12 text-[#588157]">Cardápio</h1>
          
          {categories.map(category => {
            const categoryProducts = products.filter(p => p.category?.id === category.id);
            if (categoryProducts.length === 0) return null;
            return (
              <div key={category.id} className="mb-12">
                <h2 className="text-3xl font-bold text-[#588157] mb-6 border-b-2 border-[#B8D8B8] pb-2">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg border-2 border-[#B8D8B8] p-6 hover:shadow-xl transition-shadow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#2C5234] mb-2">{product.name}</h3>
                        {product.description && <p className="text-gray-600 mb-4">{product.description}</p>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#588157]">R$ {product.price.toFixed(2)}</span>
                        <button onClick={() => handleAddToCart(product)} className="px-4 py-2 bg-[#588157] text-white rounded-full hover:bg-[#4A724A] transition">Adicionar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className={`fixed right-0 top-0 h-full bg-white shadow-xl transition-all duration-300 ease-in-out z-20 ${isCartOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-[#588157]">Pedido</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-[#2C5234] hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="bg-[#D9F2D9] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2C5234]">{item.name}</h3>
                    <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                      <input type="number" value={item.quantity} onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))} min="1" className="w-12 text-center rounded-md border p-1 text-gray-700"/>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))
            ) : <p className="text-center text-gray-500 mt-4">Nenhum item no pedido.</p>}
          </div>

          {cart.length > 0 && (
            <div className="border-t-2 border-[#B8D8B8] pt-4 mt-auto">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#2C5234] mb-1">Nome do Cliente</label>
                <input type="text" placeholder="Digite o nome..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-2 rounded-lg border border-[#B8D8B8] focus:outline-none focus:ring-2 focus:ring-[#588157] text-gray-700"/>
              </div>
              <div className="flex justify-between font-bold text-xl text-[#2C5234] mb-4">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
              <button onClick={handleFinalizeOrder} disabled={loading} className={`w-full rounded-full px-4 py-3 font-bold text-white transition duration-300 ${loading ? 'cursor-not-allowed bg-gray-400' : 'bg-[#588157] hover:bg-[#4A724A]'}`}>
                {loading ? 'Enviando...' : 'Finalizar Pedido'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <button onClick={() => setIsCartOpen(!isCartOpen)} className={`fixed bottom-4 right-4 p-4 rounded-full bg-[#588157] text-white shadow-lg transition-transform hover:scale-110 z-30 ${isCartOpen ? 'hidden' : 'block'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </button>
    </div>
  );
}