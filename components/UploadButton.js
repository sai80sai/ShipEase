import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { themeColors } from '../theme';

export default function UploadButton({ formData, images, setImages, setUploading, setFormData }) {
  const handleFormSubmit = async () => {
    if (images.length === 0 || !formData.userName || !formData.shopName || !formData.contact || !formData.address || !formData.shopAnniversary || !formData.ownerDob || !formData.GSTnum) {
      Alert.alert('Missing Information', 'Please fill all required fields and upload at least one image.');
      return;
    }

    setUploading(true);
    const uploadedImageUrls = [];

    try {
      console.log('Uploading images to Cloudinary...');
      for (const image of images) {
        const data = new FormData();
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];

        data.append('file', {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });

        data.append('upload_preset', 'service');
        data.append('cloud_name', 'dhnjxgafv');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dhnjxgafv/image/upload`,
          { method: 'POST', body: data }
        );

        const result = await response.json();
        if (!response.ok || !result.secure_url) {
          console.error('Cloudinary upload failed:', result);
          Alert.alert('Error', 'Image upload failed. Please try again.');
          return;
        }

        uploadedImageUrls.push(result.secure_url);
        console.log('Image uploaded successfully:', result.secure_url);
      }

      console.log('All images uploaded successfully:', uploadedImageUrls);

      const firestore = getFirestore();
      try {
        console.log('Uploading data to Firestore...');
        await addDoc(collection(firestore, 'sales'), {
          ...formData, // Include all the form data in the sales record
          images: uploadedImageUrls, // Save the array of image URLs
          createdAt: new Date(),
        });
        Alert.alert('Success', 'Data uploaded successfully!');
        console.log('Data uploaded successfully to Firestore!');

        setImages([]);
        setFormData({
          userName: '',
          ownerName: '',
          shopName: '',
          contact: '',
          alternateContact: '',
          address: '',
          shopAnniversary: '',
          ownerDob: '',
          GSTnum:'',
        });
      } catch (error) {
        console.error('Error saving data to Firestore:', error);
        Alert.alert('Error', 'Failed to save data. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload images.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
      <Text style={styles.buttonText}>Upload Data</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: themeColors.button,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
