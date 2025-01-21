import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { themeColors } from '../theme';

export default function SalesDetails({ route }) {
  const { sale } = route.params;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sale.images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === sale.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [sale.images.length]);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  useEffect(() => {
    if (flatListRef.current && sale.images.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex, sale.images.length]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{sale.ownerName}</Text>

      <FlatList
        data={sale.images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.productImage} />
          </View>
        )}
        ref={flatListRef}
        contentContainerStyle={styles.imageList}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Uploaded By:</Text>
        <Text style={styles.detailsValue}>{sale.userName}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Shop Name:</Text>
        <Text style={styles.detailsValue}>{sale.shopName}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Address:</Text>
        <Text style={styles.detailsValue}>{sale.address}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Contact:</Text>
        <Text style={styles.detailsValue}>{sale.contact}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Alternative Contact:</Text>
        <Text style={styles.detailsValue}>{sale.alternateContact}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Owner Date of Birth:</Text>
        <Text style={styles.detailsValue}>{sale.ownerDob}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Shop Anniversary:</Text>
        <Text style={styles.detailsValue}>{sale.shopAnniversary}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>GST Number:</Text>
        <Text style={styles.detailsValue}>{sale.GSTnum}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: themeColors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  imageList: {
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    padding:15,
    borderColor: '#e0e0e0',
  },
  productImage: {
    width: 300, 
    height: 220,
    resizeMode: 'cover',
    padding:20
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: themeColors.card,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.input,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    textAlign: 'right',
  },
});
