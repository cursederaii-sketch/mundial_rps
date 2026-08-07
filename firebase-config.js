const firebaseConfig = {
  apiKey: "AIzaSyCQ2aO3hRycP75Av86-ul9pTUDpSgJCFtE",
  authDomain: "mundial-rps.firebaseapp.com",
  databaseURL: "https://mundial-rps-default-rtdb.firebaseio.com",
  projectId: "mundial-rps",
  storageBucket: "mundial-rps.firebasestorage.app",
  messagingSenderId: "495714808594",
  appId: "1:495714808594:web:83f5ecb00a6b3d21dbf9cb",
  measurementId: "G-3LPQQNGQH2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* GIPHY API key — pegá la tuya acá */
const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";