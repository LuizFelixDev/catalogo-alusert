import React, { useState, useEffect } from 'react';
import type { CatalogoResponse } from '../types';
import { getCatalogo } from '../services/api';
import { Header } from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { CartDrawer } from '../components/CartDrawer';
import { CartFooterBar } from '../components/CartFooterBar';
import { CheckoutModal } from '../components/CheckoutModal';
import { SkeletonCatalog } from '../components/SkeletonCatalog';
import { NotFoundCatalog } from '../components/NotFoundCatalog';

interface CatalogPageProps {
  tokenLink: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ tokenLink }) => {
  const [catalogoData, setCatalogoData] = useState<CatalogoResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const fetchCatalogData = async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const data = await getCatalogo(tokenLink || 'demo');
      setCatalogoData(data);
    } catch (err: any) {
      setErrorState(err.message || 'Este catálogo não está disponível no momento.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, [tokenLink]);

  // Loading State (Skeleton)
  if (isLoading) {
    return <SkeletonCatalog />;
  }

  // Error State (404 or inactive catalog)
  if (errorState || !catalogoData) {
    return (
      <NotFoundCatalog
        mensagem={errorState || undefined}
        onRetry={fetchCatalogData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 sm:pb-12">
      {/* Header with Search and Client Name */}
      <Header
        nomeCatalogo={catalogoData.nome_catalogo}
        nomeCliente={catalogoData.nome_cliente}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Showcase */}
      <main className="container flex-1 py-4">
        
        {/* Top welcome card / Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
              AluSert Catálogo Exclusivo
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {catalogoData.nome_cliente
                ? `Seja bem-vindo, ${catalogoData.nome_cliente}!`
                : (catalogoData.nome_catalogo || 'Produtos de Alta Performance')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium pt-1">
              Confira os produtos com valores atualizados para seu pedido direto. Adicione os itens ao carrinho e confirme com um clique.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          produtos={catalogoData.produtos || []}
          searchQuery={searchQuery}
        />
      </main>

      {/* Side Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Mobile Bottom Floating Cart Bar */}
      <CartFooterBar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Confirmation Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tokenLink={tokenLink || 'demo'}
      />
    </div>
  );
};
