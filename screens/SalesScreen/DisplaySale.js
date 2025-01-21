import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput } from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../configs/firebase'; 
import Header from '../../components/header';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DisplaySale() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigation = useNavigation();

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    // Filter the sales list whenever the search term changes
    if (searchTerm) {
      const filtered = sales.filter(sale => sale.userName.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  }, [searchTerm, sales]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'sales'));
      const salesList = [];
      querySnapshot.forEach((doc) => {
        salesList.push({ id: doc.id, ...doc.data() });
      });
      setSales(salesList);
      setFilteredSales(salesList); // Set filtered sales to all sales initially
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSales();
    setRefreshing(false);
  };

  const deleteSale = async (saleId) => {
    try {
      const saleDocRef = doc(firestore, 'sales', saleId);
      await deleteDoc(saleDocRef);
      fetchSales(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredSales}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.saleCard}
            onPress={() => navigation.navigate('SaleDetails', { sale: item })}
          >
            {item.images && item.images.length > 0 && (
              <Image source={{ uri: item.images[0] }} style={styles.saleImage} />
            )}
            <View style={styles.detailContainer}>
              <Text style={styles.saleText}>{item.ownerName}</Text>
              <Text style={styles.detail}>Uploaded By: {item.userName}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteSale(item.id)} style={styles.deleteButton}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    margin:10,
    backgroundColor: themeColors.card,
    borderRadius: 15,
    shadowColor: themeColors.button,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  saleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
  },
  saleImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  detailContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  detail: {
    fontSize: 14,
    color: 'black',
    marginTop: 4,
    marginLeft: 10,
  },
  deleteButton: {
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.input,
    borderRadius: 30,
    padding: 5,
    marginTop: 10,
    marginBottom:10
  },
  searchIcon: {
    marginRight: 10,
    marginLeft:10,
  },
  searchBar: {
   flex:1,
  },
});
