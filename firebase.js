// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfja5c543IGZn3XmGiTPBtQ6oOno0iP8Y",
  authDomain: "inventory-management-adaee.firebaseapp.com",
  projectId: "inventory-management-adaee",
  storageBucket: "inventory-management-adaee.appspot.com",
  messagingSenderId: "567655962639",
  appId: "1:567655962639:web:21aa8837cdf0456fe32b7a",
  measurementId: "G-88XRPDD6V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore}