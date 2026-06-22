// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfZ4XidNqsP3JHTlSVLRLdfkHANF9Hc4A",
    authDomain: "my-website-3a4e1.firebaseapp.com",
    projectId: "my-website-3a4e1",
    storageBucket: "my-website-3a4e1.firebasestorage.app",
    messagingSenderId: "31872057967",
    appId: "1:31872057967:web:5868addbc783eb0921039a",
    measurementId: "G-S8S6P2BD0Z"
};

// Initialize Firebase using the Compat SDK
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Make db accessible globally
window.db = db;

// Initialize Firebase Authentication
window.auth = firebase.auth();
