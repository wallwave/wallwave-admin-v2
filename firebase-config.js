// firebase-config.js

// ✅ WAJIB: Load Firebase App & Database module kalau belum diload dari HTML
// (Kalau udah diload dari <script> di index.html, ini gak perlu)

const firebaseConfig = {
  databaseURL: "https://wallwave-4k-wallpaper-4ed6f-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// ✅ Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Buat object database-nya
const db = firebase.database();
