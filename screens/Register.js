import React, { useContext, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../configs/firebase';
import { themeColors } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { sendEmailVerification } from 'firebase/auth';


export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('delivery');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: 'image/jpeg',
      name: "profile_picture.jpg",
    });
    formData.append("upload_preset", "service");
    formData.append("cloud_name", "dhnjxgafv");

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dhnjxgafv/image/upload', formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (email && password && username && contact && role) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        await sendEmailVerification(user);
  
        let imageUrl = null;
        if (imageUri) {
          imageUrl = await uploadImageToCloudinary(imageUri);
        }
  
        await setDoc(doc(firestore, 'users', user.uid), {
          email: email,
          username: username,
          contact: contact,
          role: role,
          profilePicture: imageUrl || null,
          isVerified: false,
        });
  
        alert('Registration successful! Please check your email to verify your account.');
        await auth.signOut();
        
      } catch (err) {
        console.log('Error:', err.message);
      }
    } else {
      alert('Please fill all the fields!');
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Join us Today</Text>
      <Text style={styles.subTitle}>Just a few details and you're in!</Text>

      <TouchableOpacity onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>Pick an Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput 
        placeholder="Name" 
        value={username} 
        onChangeText={setName} 
        style={styles.input}
      />
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        style={styles.input}
        autoCapitalize='none'
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input}
      />
      <TextInput 
        placeholder="Contact" 
        value={contact} 
        onChangeText={setContact} 
        keyboardType="phone-pad" 
        style={styles.input}
      />
      
      <Text style={styles.role}>Choose a Role</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity style={styles.Button1} onPress={() => setRole('delivery')}>
          <Text style={role === 'delivery' ? styles.selectedRole : styles.unselectedRole}>
            Delivery Boy {role === 'delivery' }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button1} onPress={() => setRole('salesman')}>
          <Text style={role === 'salesman' ? styles.selectedRole : styles.unselectedRole}>
            Salesman {role === 'salesman'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: themeColors.bg,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.text,
    paddingTop: 40,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 30,
  },
  input: {
    backgroundColor: themeColors.input,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignItems:'center'
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 20,
  },
  profileImageText: {
    color: '#fff',
  },
  role: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  roleContainer: {
    marginBottom: 20,
  },
  Button1: {
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedRole: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: themeColors.role,
    fontWeight: 'bold',
    color:'white'
  },
  unselectedRole: {
    color: 'black',
    fontWeight: 'condensedBold',
  },
  button: {
    backgroundColor: themeColors.button,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  footerText: {
    color: 'black',
    fontSize: 14,
  },
  linkText: {
    color: themeColors.text,
    fontWeight: 'bold',
  },
});
