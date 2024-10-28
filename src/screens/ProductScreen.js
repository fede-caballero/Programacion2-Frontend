import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Modal, Portal, Card, useTheme, Text, Avatar, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductList from '../components/Product/ProductList';
import AddProductForm from '../components/Product/AddProductForm';
import EditProductForm from '../components/Product/EditProductForm';
import DeleteProductModal from '../components/Product/DeleteProductModal';
import { ProductProvider, useProduct } from '../components/Product/ProductContext';
import { AuthContext } from '../context/AuthContext';

const ProductScreenContent = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { 
    selectedProduct,
    isEditModalVisible,
    setIsEditModalVisible,
    isDeleteModalVisible,
    setIsDeleteModalVisible
  } = useProduct();

  useEffect(() => {
    const getShopData = async () => {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem('userData');
        console.log('UserData from storage:', userData);
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed user data:', parsedUser);
          
          if (parsedUser.role === 'COMMERCE' && parsedUser.shop) {
            setShopData({
              shopId: parsedUser.shop.shopId,
              shopName: parsedUser.shop.shopName,
              shopLocation: parsedUser.shop.location
            });
          }
        }
      } catch (error) {
        console.error('Error getting shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    getShopData();
  }, []);

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <Avatar.Icon 
              size={60} 
              icon="store" 
              style={[styles.headerIcon, { backgroundColor: theme.colors.primary }]}
              color={theme.colors.surface}
            />
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
                {shopData?.shopName || 'Mi Tienda'}
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.placeholder }]}>
                {shopData?.shopLocation || 'Gestiona tu inventario'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Cargando información de la tienda...</Text>
      </View>
    );
  }

  if (!shopData?.shopId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró información de la tienda.</Text>
        <Text style={styles.errorSubtext}>Esta sección solo está disponible para comercios.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductList
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        shopId={shopData.shopId}
      />

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        color={theme.colors.surface}
        onPress={() => setAddModalVisible(true)}
      />

      <Portal>
        {/* Modal para agregar producto */}
        <Modal
          visible={isAddModalVisible}
          onDismiss={() => setAddModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <Avatar.Icon 
                  size={48} 
                  icon="package-variant"
                  style={[styles.modalIcon, { backgroundColor: theme.colors.primary }]}
                  color={theme.colors.surface}
                />
                <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
                  Agregar Producto
                </Text>
              </View>
              <AddProductForm 
                closeModal={() => setAddModalVisible(false)}
                shopId={shopData.shopId}
                shopLocation={shopData.shopLocation}
              />
            </Card.Content>
          </Card>
        </Modal>

        {/* Modal para editar producto */}
        <Modal
          visible={isEditModalVisible}
          onDismiss={() => setIsEditModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <Avatar.Icon 
                  size={48} 
                  icon="pencil"
                  style={[styles.modalIcon, { backgroundColor: theme.colors.primary }]}
                  color={theme.colors.surface}
                />
                <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
                  Editar Producto
                </Text>
              </View>
              {selectedProduct && (
                <EditProductForm 
                  product={selectedProduct}
                  closeModal={() => setIsEditModalVisible(false)}
                  shopId={shopData.shopId}
                  shopLocation={shopData.shopLocation}
                />
              )}
            </Card.Content>
          </Card>
        </Modal>

        {/* Modal para eliminar producto */}
        <Modal
          visible={isDeleteModalVisible}
          onDismiss={() => setIsDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <Avatar.Icon 
                  size={48} 
                  icon="delete"
                  style={[styles.modalIcon, { backgroundColor: theme.colors.error }]}
                  color={theme.colors.surface}
                />
                <Text style={[styles.modalTitle, { color: theme.colors.error }]}>
                  Eliminar Producto
                </Text>
              </View>
              {selectedProduct && (
                <DeleteProductModal 
                  product={selectedProduct}
                  closeModal={() => setIsDeleteModalVisible(false)}
                />
              )}
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
};

// Componente principal que provee el contexto
const ProductScreen = () => {
  return (
    <ProductProvider>
      <ProductScreenContent />
    </ProductProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    elevation: 4,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    padding: 20,
  },
  modalCard: {
    borderRadius: 12,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProductScreen;