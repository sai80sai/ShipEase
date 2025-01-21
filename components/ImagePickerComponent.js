import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../theme';

export default function ImagePickerComponent({ images, setImages }) {
  const addImage = async () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        { text: 'Gallery', onPress: () => handleImageSelection('gallery') },
        { text: 'Camera', onPress: () => handleImageSelection('camera') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleImageSelection = async (source) => {
    const permissions =
      source === 'gallery'
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();

    if (permissions.status !== 'granted') {
      alert(`Permission to access the ${source} is required!`);
      return;
    }

    const result =
      source === 'gallery'
        ? await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          })
        : await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
          });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (imageUri) => {
    setImages(images.filter(uri => uri !== imageUri)); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={addImage}>
        <Ionicons name="camera-outline" size={40} color={themeColors.button} />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(imageUri)}
            >
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: themeColors.bg,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageWrapper: {
    margin: 5,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
