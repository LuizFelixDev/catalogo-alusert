export interface Produto {
  id_produto: number | string;
  nome: string;
  descricao?: string;
  imagem?: string;
  preco: number;
  unidade?: string;
  categoria?: string;
}

export interface CatalogoResponse {
  nome_catalogo?: string;
  nome_cliente?: string;
  produtos: Produto[];
}

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

export interface ItemPedidoPayload {
  id_produto: number | string;
  quantidade: number;
}

export interface PedidoRequest {
  itens: ItemPedidoPayload[];
  nome_contato?: string;
  observacoes?: string;
}

export interface PedidoResponse {
  numero_pedido?: string | number;
  erro?: string;
  mensagem?: string;
}
