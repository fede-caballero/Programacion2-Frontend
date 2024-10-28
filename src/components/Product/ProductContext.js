import React, { createContext, useContext, useState, useCallback } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const triggerRefresh = useCallback(() => {
    setShouldRefresh(prev => !prev);
  }, []);

  return (
    <ProductContext.Provider value={{
      shouldRefresh,
      triggerRefresh,
      selectedProduct,
      setSelectedProduct,
      isEditModalVisible,
      setIsEditModalVisible,
      isDeleteModalVisible,
      setIsDeleteModalVisible
    }}>
      {children}
    </ProductContext.Provider>
  );
}
export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export function useProductRefresh() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductRefresh must be used within a ProductProvider');
  }
  return {
    shouldRefresh: context.shouldRefresh,
    triggerRefresh: context.triggerRefresh
  };
}

export default ProductContext;