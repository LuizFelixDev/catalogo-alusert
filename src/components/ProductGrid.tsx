import React, { useState, useMemo } from 'react';
import { PackageX, Filter } from 'lucide-react';
import type { Produto } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  produtos: Produto[];
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ produtos, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    produtos.forEach((p) => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
  }, [produtos]);

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return produtos.filter((p) => {
      const matchesSearch =
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.descricao && p.descricao.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.categoria && p.categoria.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'todos' || p.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [produtos, searchQuery, selectedCategory]);

  // Empty State when catalog has no products at all
  if (!produtos || produtos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 my-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-4">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Nenhum produto disponível no momento</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          Este catálogo está ativo, mas ainda não possui produtos cadastrados. Entre em contato com a fábrica para mais informações.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      
      {/* Category Pills (if categories exist) */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider pr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </div>
          
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'todos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todos ({produtos.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* No Search Results */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 my-8 text-center bg-white rounded-2xl border border-slate-200">
          <PackageX className="w-10 h-10 text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-800 text-base">Nenhum produto encontrado</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Não encontramos nenhum produto que corresponda aos filtros aplicados.
          </p>
        </div>
      ) : (
        /* Responsive Product Grid (2 columns on mobile, 3-4 on desktop) */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((produto) => (
            <ProductCard key={produto.id_produto} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
};
