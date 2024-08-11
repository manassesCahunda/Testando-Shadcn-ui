
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBYzkNk0kvYZ9-TiYY-fuII8p6IrvZr6UI",
  authDomain: "bumba-420113.firebaseapp.com",
  projectId: "bumba-420113",
  storageBucket: "bumba-420113.appspot.com",
  messagingSenderId: "872675022661",
  appId: "1:872675022661:web:a75fa75ec012a45db3d02c",
  measurementId: "G-01E3S1NHBR"
};

export const app = initializeApp(firebaseConfig);