import type { CatalogoResponse, PedidoRequest, PedidoResponse } from '../types';

// Read API base URL from environment or default to relative root
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock catalog for fallback/demo purposes
const DEMO_CATALOG: CatalogoResponse = {
  nome_catalogo: 'Catálogo de Perfis e Acessórios AluSert',
  nome_cliente: 'Cliente Preferencial',
  produtos: [
    {
      id_produto: 101,
      nome: 'Perfil Tubo Quadrado 50x50mm',
      descricao: 'Perfil tubular de alumínio estrutural, acabamento anodizado natural.',
      imagem: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      preco: 89.90,
      unidade: 'Barra 6m',
      categoria: 'Tubos e Estruturas'
    },
    {
      id_produto: 102,
      nome: 'Cantoneira Alumínio 1" x 1/8"',
      descricao: 'Cantoneira de abas iguais liga 6063 T5, altíssima durabilidade e resistência.',
      imagem: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
      preco: 34.50,
      unidade: 'Barra 6m',
      categoria: 'Cantoneiras'
    },
    {
      id_produto: 103,
      nome: 'Perfil U Alumínio 1/2" Aba Igual',
      descricao: 'Canal U reforçado para acabamento de portões, esquadrias e painéis.',
      imagem: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80',
      preco: 28.70,
      unidade: 'Barra 6m',
      categoria: 'Perfis U'
    },
    {
      id_produto: 104,
      nome: 'Trilho Superior para Portão Alumínio',
      descricao: 'Trilho reforçado para roldanas e sistemas deslizantes residenciais.',
      imagem: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      preco: 112.00,
      unidade: 'Barra 6m',
      categoria: 'Trilhos'
    },
    {
      id_produto: 105,
      nome: 'Chapa de Alumínio Xadrez 1.2x2.0m',
      descricao: 'Chapa lavrada antiderrapante em alumínio liga 3003 H14.',
      imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      preco: 245.00,
      unidade: 'Unidade',
      categoria: 'Chapas'
    },
    {
      id_produto: 106,
      nome: 'Perfil Linha 25 Tubolar Guia',
      descricao: 'Perfil específico para portas e janelas de esquadrias de alumínio.',
      imagem: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      preco: 67.80,
      unidade: 'Barra 6m',
      categoria: 'Esquadrias'
    }
  ]
};

/**
 * Busca o catálogo pelo token_link
 * GET /catalogo/:token_link
 */
export async function getCatalogo(token_link: string): Promise<CatalogoResponse> {
  // If demo token or empty token, return mock catalog for testing
  if (token_link === 'demo' || token_link === 'exemplo') {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate latency
    return DEMO_CATALOG;
  }

  const url = `${API_BASE_URL}/catalogo/${encodeURIComponent(token_link)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.erro || 'Catálogo não encontrado ou inativo');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.erro || `Erro ao carregar catálogo (${response.status})`);
    }

    const data: any = await response.json();
    return {
      nome_cliente: data.nome_cliente,
      nome_catalogo: data.nome_catalogo || (data.nome_cliente ? `Catálogo - ${data.nome_cliente}` : 'Catálogo AluSert'),
      produtos: Array.isArray(data.produtos) ? data.produtos.map((p: any) => ({
        ...p,
        unidade: p.unidade || p.unidade_medida || 'un'
      })) : []
    };
  } catch (error: any) {
    // If backend is not running locally during development, provide friendly fallback if token starts with 'dev'
    if (import.meta.env.DEV && (error.message.includes('Failed to fetch') || error.name === 'TypeError')) {
      console.warn('Backend API não encontrada no ambiente de dev, usando dados de demonstração AluSert.');
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...DEMO_CATALOG,
        nome_cliente: token_link ? `Cliente (${token_link})` : DEMO_CATALOG.nome_cliente
      };
    }

    throw error;
  }
}

/**
 * Envia o pedido com os itens do carrinho
 * POST /catalogo/:token_link/pedido
 */
export async function enviarPedido(
  token_link: string,
  payload: PedidoRequest
): Promise<PedidoResponse> {
  // Demo mode mock response
  if (token_link === 'demo' || token_link === 'exemplo') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return {
      numero_pedido: `PED-${randomNum}`
    };
  }

  const url = `${API_BASE_URL}/catalogo/${encodeURIComponent(token_link)}/pedido`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const mensageErro = data.error || data.erro || data.mensagem || data.message || 'Erro ao processar seu pedido. Tente novamente.';
      throw new Error(mensageErro);
    }

    return {
      numero_pedido: data.numero_pedido || (data.id_pedido ? `#${data.id_pedido}` : `PED-${Math.floor(10000 + Math.random() * 90000)}`)
    };
  } catch (error: any) {
    // Fallback for dev testing if server isn't running
    if (import.meta.env.DEV && (error.message.includes('Failed to fetch') || error.name === 'TypeError')) {
      console.warn('Backend API não encontrada em dev. Simulando sucesso do pedido.');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        numero_pedido: `PED-DEV-${Math.floor(10000 + Math.random() * 90000)}`
      };
    }

    throw error;
  }
}
