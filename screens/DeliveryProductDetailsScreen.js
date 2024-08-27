import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from 'react-native-dotenv';

const ProductDetailsScreen = ({ route }) => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { order_code, metafield_order_type } = route.params;
  const navigation = useNavigation();

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/deliveryscreen/product-details`, {
        params: {
          order_code: order_code,
          metafield_order_type: metafield_order_type,
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching product details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [order_code, metafield_order_type]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProductDetails();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#287238" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {products && products.length > 0 && products.map((product) => (
        <View style={styles.productContainer} key={product.line_item_name + "-" + product.line_item_sku}>
          <Image source={{ uri: product.image1 }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{product.line_item_name}
            </Text>
            <Text style={[styles.text, styles.noMargin]}>
              <Text style={styles.label}>SKU: </Text>{product.line_item_sku}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Quantity: </Text>{product.total_item_quantity}
            </Text>
            <Text style={styles.text}>
              <Text style={[styles.label, product.pickup_status === "Picked" ? styles.pickedStatus : styles.notPickedStatus]}>
                {product.pickup_status}
              </Text>
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    marginBottom: 16,
    padding: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#287238',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 15,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  noMargin: {
    marginBottom: -1, // Ensures no margin between SKU and Quantity
  },
  pickedStatus: {
    color: '#28a745',
  },
  notPickedStatus: {
    color: '#dc3545',
  },
});

export default ProductDetailsScreen;
