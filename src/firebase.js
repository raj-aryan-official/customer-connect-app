import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAarDDiSoyBQ9lTNzodhCJhq69b9BegXAo",
  authDomain: "customer-connect-b934f.firebaseapp.com",
  projectId: "customer-connect-b934f",
  storageBucket: "customer-connect-b934f.appspot.com", 
  messagingSenderId: "759025497104",
  appId: "1:759025497104:web:c39e321b300d20dd9e8695",
  measurementId: "G-KKREQF5R2G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export default app;