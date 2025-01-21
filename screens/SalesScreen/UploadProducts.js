import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, KeyboardAvoidingView, Platform } from 'react-native';
import InputForm from '../../components/InputForm';
import UploadButton from '../../components/UploadButton';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import { themeColors } from '../../theme';
import Header from '../../components/header';

export default function UploadProducts() {
  const [formData, setFormData] = useState({
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

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <View style={styles.screen}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <InputForm formData={formData} handleInputChange={handleInputChange} />

          <ImagePickerComponent images={images} setImages={setImages} />

          {uploading ? (
            <ActivityIndicator size="large" color={themeColors.button} />
          ) : (
            <UploadButton
              formData={formData}
              images={images}
              setImages={setImages}
              setUploading={setUploading}
              setFormData={setFormData}
            />
          )}
          <Text style={styles.note}>
            Please make sure all fields are filled before submitting.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  note: {
    marginTop: 20,
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
  },
});
