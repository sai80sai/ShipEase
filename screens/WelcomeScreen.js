import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { themeColors } from '../theme';

export default function WelcomeScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's Get Started!</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/App.png')}
          style={styles.image}
        />
      </View>
      <TouchableOpacity onPress={()=> navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.footerText}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={()=> navigation.navigate('SignIn')} >
          <Text style={styles.linkText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom:'auto',
    paddingTop:25
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: themeColors.button,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    color: 'black',
  },
  linkText: {
    color: themeColors.text,
    fontWeight: 'bold',
  },
});
