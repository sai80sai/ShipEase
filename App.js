import React from 'react';
import { AuthProvider } from './AuthContext';
import Navigation from './navigation'; // Your navigation setup

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
