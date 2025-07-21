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

  db.ref().once('value', snapshot => {
    snapshot.forEach(childSnapshot => {
      const kategori = childSnapshot.key;
      dropdowns.forEach(drop => {
        const option = document.createElement('option');
        option.text = kategori;
        option.value = kategori;
        drop.appendChild(option);
      });
    });
  });
}

// Tambah kategori baru ke Firebase
function tambahKategoriBaru() {
  const kategori = document.getElementById('kategoriBaru').value.trim();
  if (kategori === '') {
    alert('Kategori tidak boleh kosong!');
    return;
  }

  db.ref(kategori).once('value', snapshot => {
    if (snapshot.exists()) {
      alert('Kategori sudah ada!');
    } else {
      db.ref(kategori).set([]);
      alert('Kategori berhasil ditambahkan!');
      document.getElementById('kategoriBaru').value = '';
      loadKategori();
    }
  });
}

// Tambah wallpaper ke kategori tertentu
function tambahWallpaper() {
  const kategori = document.getElementById('kategoriDropdown').value;
  const url = document.getElementById('wallpaperUrl').value.trim();

  if (url === '') {
    alert('Link wallpaper tidak boleh kosong!');
    return;
  }

  db.ref(kategori).once('value', snapshot => {
    let list = snapshot.val() || [];
    list.push(url);
    db.ref(kategori).set(list, error => {
      if (error) {
        alert('Gagal menambahkan wallpaper.');
      } else {
        alert('Wallpaper berhasil ditambahkan!');
        document.getElementById('wallpaperUrl').value = '';
      }
    });
  });
}

// Hapus wallpaper dari kategori berdasarkan index
function hapusWallpaper() {
  const kategori = document.getElementById('kategoriHapusDropdown').value;
  const index = parseInt(document.getElementById('indexHapus').value);

  db.ref(kategori).once('value', snapshot => {
    let list = snapshot.val() || [];

    if (isNaN(index) || index < 0 || index >= list.length) {
      alert('Index tidak valid!');
      return;
    }

    list.splice(index, 1);
    db.ref(kategori).set(list, error => {
      if (error) {
        alert('Gagal menghapus wallpaper.');
      } else {
        alert('Wallpaper berhasil dihapus!');
        document.getElementById('indexHapus').value = '';
      }
    });
  });
}

// Hapus seluruh kategori
function hapusKategori() {
  const kategori = document.getElementById('kategoriDeleteDropdown').value;
  const yakin = confirm(`Yakin ingin menghapus kategori "${kategori}"? Semua data di dalamnya juga akan hilang!`);

  if (yakin) {
    db.ref(kategori).remove(error => {
      if (error) {
        alert('Gagal menghapus kategori.');
      } else {
        alert('Kategori berhasil dihapus!');
        loadKategori();
      }
    });
  }
}
