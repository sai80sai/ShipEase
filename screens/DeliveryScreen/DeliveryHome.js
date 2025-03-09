import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../configs/firebase';
import Header from '../../components/header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { themeColors } from '../../theme';

const DeliveryHome = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'products'));
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const navigateToMapPlan = () => {
    navigation.navigate('MapPlan', { selectedProducts });
  };

  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photo }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.ownername}</Text>
      </View>
      <TouchableOpacity onPress={() => handleSelectProduct(item)} style={styles.iconContainer}>
        {selectedProducts.some((prod) => prod.id === item.id) ? (
          <Icon name="checkbox-blank-circle" size={24} color="#EC5800" /> 
        ) : (
          <Icon name="checkbox-blank-circle-outline" size={24} color="#EC5800" /> 
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header/>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderProductCard}
        contentContainerStyle={styles.listContainer}
      />
      {selectedProducts.length > 0 && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.proceedButton} onPress={navigateToMapPlan}>
            <Text style={styles.proceedButtonText}>Ready to Dispatch</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  listContainer: {
    paddingBottom: 20,
    padding:10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: themeColors.card, 
    borderRadius: 25,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
  },
  iconContainer: {
    marginLeft: 10,
  },
  actionButtonsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: themeColors.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeliveryHome;
