import React, { useState, useMemo } from 'react';
import { PackageX, Filter, ChevronRight } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-10 my-10 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-3">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">Nenhum produto disponível no momento</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Este catálogo está ativo, mas ainda não possui produtos cadastrados. Entre em contato com a fábrica para mais informações.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      
      {/* Category Header & Filter Row (Matching screenshot exact header) */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <Filter className="w-3.5 h-3.5 text-orange-500" />
            <span>Filtrar por Categoria</span>
          </div>

          {categories.length > 2 && (
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-0.5">
              Arraste para o lado <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Scrollable Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Todos ({produtos.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* No Search Results */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 my-6 text-center bg-white rounded-2xl border border-slate-200/80">
          <PackageX className="w-10 h-10 text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">Nenhum produto encontrado</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Não encontramos nenhum produto que corresponda aos filtros aplicados.
          </p>
        </div>
      ) : (
        /* List / Grid of Horizontal Cards matching screenshot layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredProducts.map((produto) => (
            <ProductCard key={produto.id_produto} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
};
