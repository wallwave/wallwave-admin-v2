// Cek status login saat halaman dimuat
function cekLogin() {
  const login = localStorage.getItem('wallwave_login');
  if (login !== 'true') {
    alert('Kamu belum login!');
    window.location.href = 'login.html';
  }
}

// Logout dan hapus session
function logout() {
  localStorage.removeItem('wallwave_login');
  window.location.href = 'login.html';
}

// Ambil dan tampilkan semua kategori dari Firebase
function loadKategori() {
  const dropdowns = [
    document.getElementById('kategoriDropdown'),
    document.getElementById('kategoriHapusDropdown'),
    document.getElementById('kategoriDeleteDropdown')
  ];

  dropdowns.forEach(drop => drop.innerHTML = '');

  db.ref().once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
        const kategori = childSnapshot.key;
        dropdowns.forEach(drop => {
          const option = document.createElement('option');
          option.text = kategori;
          option.value = kategori;
          drop.appendChild(option);
        });
      });
    })
    .catch(error => {
      alert("Gagal load kategori: " + error.message);
    });
}

// Tambah kategori baru ke Firebase (pakai dummy kosong)
function tambahKategoriBaru() {
  const kategori = document.getElementById('kategoriBaru').value.trim();
  if (kategori === '') {
    alert('Kategori tidak boleh kosong!');
    return;
  }

  db.ref(kategori).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        alert('Kategori sudah ada!');
        return;
      }

      // Set dummy [""] biar bisa disimpan
      return db.ref(kategori).set([""]);
    })
    .then(() => {
      return db.ref(kategori).once('value');
    })
    .then(verifySnap => {
      const data = verifySnap.val();
      if (Array.isArray(data) && data.length > 0) {
        alert('Kategori berhasil ditambahkan!');
        document.getElementById('kategoriBaru').value = '';
        loadKategori();
      } else {
        alert('Gagal menambahkan kategori.');
      }
    })
    .catch(err => {
      alert("Terjadi error saat menambahkan kategori: " + err.message);
      console.error(err);
    });
}

// ✅ Tambah wallpaper & hapus dummy otomatis jika ada
function tambahWallpaper() {
  const kategori = document.getElementById('kategoriDropdown').value;
  const url = document.getElementById('wallpaperUrl').value.trim();

  if (url === '') {
    alert('Link wallpaper tidak boleh kosong!');
    return;
  }

  db.ref(kategori).once('value')
    .then(snapshot => {
      let list = snapshot.val() || [];

      // Buang dummy "" atau "dummy.link"
      if (list.length === 1 && (list[0] === "" || list[0].includes("dummy.link"))) {
        list = [];
      }

      list.push(url);
      return db.ref(kategori).set(list);
    })
    .then(() => {
      alert('Wallpaper berhasil ditambahkan!');
      document.getElementById('wallpaperUrl').value = '';
    })
    .catch(error => {
      alert('Gagal menambahkan wallpaper: ' + error.message);
    });
}

// Hapus wallpaper dari kategori berdasarkan index
function hapusWallpaper() {
  const kategori = document.getElementById('kategoriHapusDropdown').value;
  const index = parseInt(document.getElementById('indexHapus').value);

  db.ref(kategori).once('value')
    .then(snapshot => {
      let list = snapshot.val() || [];

      if (isNaN(index) || index < 0 || index >= list.length) {
        alert('Index tidak valid!');
        return;
      }

      list.splice(index, 1);
      return db.ref(kategori).set(list);
    })
    .then(() => {
      alert('Wallpaper berhasil dihapus!');
      document.getElementById('indexHapus').value = '';
    })
    .catch(error => {
      alert('Gagal menghapus wallpaper: ' + error.message);
    });
}

// Hapus seluruh kategori
function hapusKategori() {
  const kategori = document.getElementById('kategoriDeleteDropdown').value;
  const yakin = confirm(`Yakin ingin menghapus kategori "${kategori}"? Semua data di dalamnya juga akan hilang!`);

  if (yakin) {
    db.ref(kategori).remove()
      .then(() => {
        alert('Kategori berhasil dihapus!');
        loadKategori();
      })
      .catch(error => {
        alert('Gagal menghapus kategori: ' + error.message);
      });
  }
}
