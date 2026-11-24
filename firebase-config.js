import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHfdYHz3_yYSPRJWSaqiYkXplG6LkJF0",
  authDomain: "airpods-tracker.firebaseapp.com",
  projectId: "airpods-tracker",
  storageBucket: "airpods-tracker.firebasestorage.app",
  messagingSenderId: "910732658978",
  appId: "1:910732658978:web:61ff98224971414505fd7b",
  measurementId: "G-0MRBSTEDJ4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);