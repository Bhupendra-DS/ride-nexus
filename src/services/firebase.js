import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCL7qLEejppwYUfI71hvuDmsyJEv1sz7rI",
  authDomain: "ridenexus-a8241.firebaseapp.com",
  projectId: "ridenexus-a8241",
  storageBucket: "ridenexus-a8241.firebasestorage.app",
  messagingSenderId: "159172755431",
  appId: "1:159172755431:web:049312e46fc26267d98742"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;