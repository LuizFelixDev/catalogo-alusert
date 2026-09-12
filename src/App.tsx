import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { CatalogPage } from './pages/CatalogPage';

export const App: React.FC = () => {
  const [tokenLink, setTokenLink] = useState<string>('geral');

  useEffect(() => {
    // Extract token_link from URL
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check if pathname matches /c/:token_link
    const cMatch = pathname.match(/^\/c\/([^/]+)/);
    
    if (cMatch && cMatch[1]) {
      setTokenLink(cMatch[1]);
    } else if (pathname.length > 1 && !pathname.startsWith('/src')) {
      const token = pathname.replace(/^\//, '');
      if (token) setTokenLink(token);
    } else {
      const queryToken = searchParams.get('token') || searchParams.get('link');
      if (queryToken) {
        setTokenLink(queryToken);
      } else {
        setTokenLink('geral');
      }
    }
  }, []);

  return (
    <CartProvider>
      <CatalogPage tokenLink={tokenLink} />
    </CartProvider>
  );
};

export default App;
