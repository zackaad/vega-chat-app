import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBYLADILYvjOfznYhjMCaYSArG2rqV1-ug",
  authDomain: "virgo-app-2a0b2.firebaseapp.com",
  projectId: "virgo-app-2a0b2",
  storageBucket: "virgo-app-2a0b2.appspot.com",
  messagingSenderId: "576966639179",
  appId: "1:576966639179:web:794f26e12edc7319ccd7ce"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;