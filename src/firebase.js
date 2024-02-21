// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCacqdQws-M1-Ki37tpvjr4soqb1B9x3h8",
  authDomain: "projet-passerelle-3-believemy.firebaseapp.com",
  projectId: "projet-passerelle-3-believemy",
  storageBucket: "projet-passerelle-3-believemy.appspot.com",
  messagingSenderId: "15396772773",
  appId: "1:15396772773:web:a3039a92af85211ce2e64c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth =  getAuth(app);
export default app;
// On utilise fireBase auth en passant en référence (app).
// Et app est la configuration utilisée par firebaseConfig initialisée par initializeApp