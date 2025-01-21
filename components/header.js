import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../AuthContext';
import { signOut } from 'firebase/auth';  
import { auth } from '../configs/firebase';
import { themeColors } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header() {
  const { userDetails } = useContext(AuthContext); 

  const handleLogout = async () => {
    try {
      await signOut(auth);  
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error signing out: ', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {userDetails && (
        <View style={styles.header}>
          {userDetails.profilePicture && (
            <Image
              source={{ uri: userDetails.profilePicture }} 
              style={styles.profileImage}
            />
          )}
          <Text style={styles.headerText}>Welcome, {userDetails.username}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: themeColors.bg,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomEndRadius:1,
    borderEndWidth:2,
    borderStartWidth:2,
    borderBottomWidth:1,
    borderBottomEndRadius:40,
    borderBottomStartRadius:40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
    flex: 1, 
    textAlign: 'center', 
  },
  logoutButton: {
    backgroundColor: themeColors.button,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10, 
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, 
  },
});
