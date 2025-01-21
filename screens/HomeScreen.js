import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRoleAndNavigate = async () => {
      const user = auth.currentUser;

    
      if (!user.emailVerified) {
        await auth.signOut();
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));

        if (userDoc.exists()) {
          const { role } = userDoc.data();

          if (role === 'delivery') {
            navigation.replace('DeliveryHome');
          } else if (role === 'salesman') {
            navigation.replace('SalesHome');
          } else {
            alert('Role not recognized. Please contact support.');
          }
        } else {
          alert('User data not found. Please contact support.');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    fetchRoleAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
