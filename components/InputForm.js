import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../theme';

export default function InputForm({ formData, handleInputChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    const formattedDate = currentDate.toISOString().split('T')[0];
    handleInputChange('ownerDob', formattedDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="UserName"
        value={formData.userName}
        onChangeText={(text) => handleInputChange('userName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="OwnerName"
        value={formData.ownerName}
        onChangeText={(text) => handleInputChange('ownerName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={formData.shopName}
        onChangeText={(text) => handleInputChange('shopName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        keyboardType="phone-pad"
        value={formData.contact}
        onChangeText={(text) => handleInputChange('contact', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Alternate Contact"
        keyboardType="phone-pad"
        value={formData.alternateContact}
        onChangeText={(text) => handleInputChange('alternateContact', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Shop Anniversary"
        value={formData.shopAnniversary}
        onChangeText={(text) => handleInputChange('shopAnniversary', text)}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Owner DOB:</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={24} color="black" style={styles.icon} />
          <Text style={styles.dateText}>
            {formData.ownerDob || 'Select Date'}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="GST Number"
        value={formData.GSTnum}
        onChangeText={(text) => handleInputChange('GSTnum', text)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={formData.ownerDob ? new Date(formData.ownerDob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: themeColors.bg,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: themeColors.input,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: themeColors.input,
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});
