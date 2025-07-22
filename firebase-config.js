// firebase-config.js

// ✅ WAJIB: Load Firebase App & Database module kalau belum diload dari HTML
// (Kalau udah diload dari <script> di index.html, ini gak perlu)

const firebaseConfig = {
  databaseURL: "https://wallwave-wallpaper-v1-default-rtdb.firebaseio.com"
};

// ✅ Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Buat object database-nya
const db = firebase.database();
