import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import { getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxTTBibnppYxg7Z4LStbCVdf2KSe6Yw3c",
  authDomain: "runforservice-de829.firebaseapp.com",
  projectId: "runforservice-de829",
  storageBucket: "runforservice-de829.firebasestorage.app",
  messagingSenderId: "786133079653",
  appId: "1:786133079653:web:bc9e150cf8ffaa06bbd88c",
  measurementId: "G-4KKG42QVHD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); 

export { auth, firestore, storage };