import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const triggerRefresh = () => {
    setShouldRefresh(prev => !prev);
  };

  return (
    <ProductContext.Provider value={{ shouldRefresh, triggerRefresh }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductRefresh = () => useContext(ProductContext);