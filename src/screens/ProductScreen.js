import React, { useState } from 'react';
import { Modal, View, StyleSheet, Button } from 'react-native';
import { FAB } from 'react-native-paper';
import ProductList from '../components/Product/ProductList';
import AddProductForm from '../components/Product/AddProductForm'; // Crear este componente con el formulario


const ProductScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <ProductList />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={toggleModal}
      />
      
      {/* Modal para agregar productos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          <AddProductForm closeModal={toggleModal} />
          <Button title="Cerrar" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
});

export default ProductScreen;