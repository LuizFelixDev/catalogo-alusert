import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Loader2, Send, User, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { enviarPedido } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenLink: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, tokenLink }) => {
  const { cart, totalAmount, clearCart } = useCart();
  const [nomeContato, setNomeContato] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNumeroPedido, setSuccessNumeroPedido] = useState<string | number | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Format payload as required: { itens: [{ id_produto, quantidade }] }
    const payload = {
      itens: cart.map((item) => ({
        id_produto: item.produto.id_produto,
        quantidade: item.quantidade
      })),
      nome_contato: nomeContato.trim() || undefined,
      observacoes: observacoes.trim() || undefined
    };

    try {
      const response = await enviarPedido(tokenLink, payload);

      if (response.numero_pedido) {
        setSuccessNumeroPedido(response.numero_pedido);
        clearCart();
      } else {
        throw new Error('Não foi possível obter o número do pedido.');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao enviar o pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    // Reset state on close
    setSuccessNumeroPedido(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={isSubmitting ? undefined : handleCloseModal}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-up border border-slate-100">
        
        {/* SUCCESS STATE */}
        {successNumeroPedido ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Pedido Confirmado!</h3>
              <p className="text-sm font-medium text-slate-600">
                Seu pedido foi enviado com sucesso para a fábrica.
              </p>
            </div>

            {/* Order Number Badge */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl max-w-xs mx-auto my-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">Número do Pedido</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {successNumeroPedido}
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Nossa equipe entrará em contato em breve para confirmar a entrega e detalhes do pagamento.
            </p>

            <button
              onClick={handleCloseModal}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all active:scale-95 shadow-md mt-4"
            >
              Concluir e Voltar ao Catálogo
            </button>
          </div>
        ) : (
          /* FORM / SUMMARY STATE */
          <form onSubmit={handleSubmitOrder} className="flex flex-col">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Finalizar Pedido</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Confirme seus dados para enviar a solicitação à fábrica
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Error Alert if API failed */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-semibold animate-fade-in">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-rose-900">Não foi possível enviar</p>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Order Summary Mini Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                  <span>Itens selecionados:</span>
                  <span className="font-bold text-slate-900">{cart.length} produto(s)</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200/60">
                  <span>Total estimado:</span>
                  <span className="text-orange-600 font-black">
                    R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Contact Name Input (Optional/Recommended) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span>Seu Nome ou Razão Social <span className="text-slate-400 font-normal">(Opcional)</span></span>
                </label>
                <input
                  type="text"
                  value={nomeContato}
                  onChange={(e) => setNomeContato(e.target.value)}
                  placeholder="Ex: Jorge Silva / Esquadrias Silva"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-medium text-slate-900 outline-none transition-all focus:ring-4 focus:ring-orange-500/15"
                />
              </div>

              {/* Observacoes Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  <span>Observações ou Instruções <span className="text-slate-400 font-normal">(Opcional)</span></span>
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={2}
                  placeholder="Ex: Entregar no galpão 2 ou avisar antes de despachar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-medium text-slate-900 outline-none transition-all focus:ring-4 focus:ring-orange-500/15 resize-none"
                />
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Voltar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar Pedido</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
