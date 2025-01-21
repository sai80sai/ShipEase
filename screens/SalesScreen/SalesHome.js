import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UploadProducts from './UploadProducts';
import DisplaySale from './DisplaySale';
import { themeColors } from '../../theme';

const Tab = createBottomTabNavigator();

export default function SalesHome() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'UploadProducts') {
            iconName = 'cloud-upload-outline';
          } else if (route.name === 'DisplaySale') {
            iconName = 'file-tray-stacked-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.text,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      
      <Tab.Screen name="DisplaySale" component={DisplaySale} />
      <Tab.Screen name="UploadProducts" component={UploadProducts} />
    </Tab.Navigator>
  );
}
