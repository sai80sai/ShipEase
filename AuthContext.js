import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from './configs/firebase'; // Import Firebase auth and Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInEmail, setLoggedInEmail] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedInEmail(user.email);

        // Fetch user details from Firestore
        try {
          const q = query(
            collection(firestore, 'users'),
            where('email', '==', user.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data(); // Get first document
            setUserDetails(userData);
          } else {
            console.log('No user details found in Firestore.');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        setLoggedInEmail(null);
        setUserDetails(null); // Reset user details when signed out
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInEmail, setLoggedInEmail, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
