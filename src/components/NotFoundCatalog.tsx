import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface NotFoundCatalogProps {
  mensagem?: string;
  onRetry?: () => void;
}

export const NotFoundCatalog: React.FC<NotFoundCatalogProps> = ({
  mensagem = 'Este catálogo não está disponível no momento.',
  onRetry
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-slide-up">
        
        {/* Brand Icon Badge */}
        <div className="relative w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-500 mx-auto shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Catálogo Indisponível
          </h2>
          <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs mx-auto">
            {mensagem}
          </p>
        </div>

        <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
          O link de acesso pode ter expirado ou o catálogo foi desativado pela fábrica de alumínio.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>
        )}
      </div>
    </div>
  );
};
