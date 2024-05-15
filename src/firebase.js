// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/storage';
import { getStorage } from "firebase/storage";// pour la base de données


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBeY4x5WY06XTFk2e-SpsXkfQBT4E4LZzg",

  authDomain: "secours-belivemy-projet-3.firebaseapp.com",

  databaseURL: "https://secours-belivemy-projet-3-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "secours-belivemy-projet-3",

  storageBucket: "secours-belivemy-projet-3.appspot.com",

  messagingSenderId: "792699917009",

  appId: "1:792699917009:web:391daf1697493f63e3ebf0"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app) // Est-ce que c'est ça ? La doc ne me demande pas de le rajouter

export const auth =  getAuth(app);
export default app;
// On utilise fireBase auth en passant en référence (app).
// Et app est la configuration utilisée par firebaseConfig initialisée par initializeApp