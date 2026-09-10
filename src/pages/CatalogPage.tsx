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
    <div className="min-h-screen bg-slate-50/80 flex flex-col pb-24 sm:pb-12">
      {/* Header with Search and Client Name */}
      <Header
        nomeCatalogo={catalogoData.nome_catalogo}
        nomeCliente={catalogoData.nome_cliente}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Showcase */}
      <main className="container flex-1 py-2">
        
        {/* Banner Card matching exact screenshot style */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg my-2 relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-gradient-to-l from-orange-500/15 via-orange-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
              <span className="text-orange-500">✦</span>
              <span>ALUSERT CATÁLOGO EXCLUSIVO</span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              {catalogoData.nome_cliente
                ? `Seja bem-vindo, ${catalogoData.nome_cliente}!`
                : (catalogoData.nome_catalogo || 'Seja bem-vindo!')}
            </h2>

            <p className="text-xs text-slate-300 font-normal leading-relaxed pt-0.5 max-w-xl">
              Confira os produtos com valores atualizados para seu pedido direto. Adicione ao carrinho e confirme em um clique.
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
