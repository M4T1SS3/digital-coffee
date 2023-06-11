import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB3vKW_DZaAlh7xShEjCnSkHHIeKAK-1mE",
  authDomain: "digital-coffee-5df2f.firebaseapp.com",
  projectId: "digital-coffee-5df2f",
  storageBucket: "digital-coffee-5df2f.appspot.com",
  messagingSenderId: "429781724175",
  appId: "1:429781724175:web:a08e678e47b827596b477a",
  measurementId: "G-J0LKZ25T73"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
