import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5197';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center">
        <p className="text-xl text-[#588157]">Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#F0F5F0] items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F0] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin')} 
            className="flex items-center text-[#588157] font-semibold hover:text-[#4A724A] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar 
          </button>
        </div>
        <h1 className="text-4xl font-bold text-center mb-12 text-[#588157]">
          Cardápio
        </h1>
        {categories.map(category => {
          const categoryProducts = products.filter(p => p.category?.id === category.id);
          
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-12">
              <h2 className="text-3xl font-bold text-[#588157] mb-6 border-b-2 border-[#B8D8B8] pb-2">
                {category.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg border-2 border-[#B8D8B8] p-6 hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-bold text-[#2C5234] mb-2">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 mb-4">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#588157]">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {categories.length === 0 && !loading && ( 
          <div className="text-center">
            <p className="text-xl text-gray-500">Nenhuma categoria encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}