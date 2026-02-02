const firebaseConfig = {
    apiKey: "AIzaSyAmvSb1d7vysxaiO1BiuIMMudPbxYNgEm4",
    authDomain: "web-pgsd-25b.firebaseapp.com",
    projectId: "web-pgsd-25b",
    storageBucket: "web-pgsd-25b.firebasestorage.app",
    messagingSenderId: "968783885316",
    appId: "1:968783885316:web:ae83ae59471be166c7b151"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 1. Ambil Data Artikel
function muatArtikel() {
    db.collection("artikel").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        const wrapper = document.querySelector('.artikel-wrapper');
        if(!wrapper) return;
        wrapper.innerHTML = "";
        snapshot.forEach((doc) => {
            const art = doc.data();
            wrapper.innerHTML += `
                <div class="artikel-item" onclick="openArtCloud('${art.title}', '${art.img}', \`${art.content}\`)">
                    <img src="${art.img}" onerror="this.src='milad.jpeg'">
                    <h4>${art.title}</h4>
                    <p>${art.content.substring(0, 100)}...</p>
                </div>`;
        });
    });
}

// 2. Ambil Data Galeri
function muatGaleri() {
    db.collection("galeri").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        const galContainer = document.querySelector('.galeri-container');
        if(!galContainer) return;
        galContainer.innerHTML = "";
        snapshot.forEach((doc) => {
            const gal = doc.data();
            galContainer.innerHTML += `
                <div class="galeri-item">
                    <img src="${gal.img}" onerror="this.src='pembuka.jpg'">
                    <div class="galeri-caption">${gal.caption}</div>
                </div>`;
        });
    });
}

function openArtCloud(judul, foto, isi) {
    document.getElementById('artFoto').src = foto;
    document.getElementById('artJudul').innerText = judul;
    document.getElementById('artIsi').innerText = isi;
    document.getElementById('popupArtikel').style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Jalankan saat load
muatArtikel();
muatGaleri();
// Hubungkan ke ID Sambutan
db.collection("settings").doc("sambutan").onSnapshot((doc) => {
    if (doc.exists) {
        document.getElementById('load-nama-ketua').innerText = doc.data().nama;
        document.getElementById('load-isi-sambutan').innerHTML = `<p>${doc.data().teks}</p>`;
    }
});

// Hubungkan ke ID Jadwal
db.collection("jadwal").orderBy("createdAt", "asc").onSnapshot((snapshot) => {
    let html = "";
    snapshot.forEach((doc) => {
        const d = doc.data();
        html += `<tr><td>${d.hari}</td><td>${d.matkul}</td><td colspan="2">${d.info}</td></tr>`;
    });
    document.getElementById('load-jadwal-cloud').innerHTML = html;
});

// KONEKSI PENGUMUMAN DARI ADMIN KE INDEX
db.collection("settings").doc("pengumuman").onSnapshot((doc) => {
    const box = document.getElementById('box-pengumuman');
    const noInfo = document.getElementById('no-info');
    const teksElemen = document.getElementById('isi-pengumuman-cloud');

    if (doc.exists && doc.data().teks) {
        // Jika ada data di Firebase, tampilkan box kuning
        box.style.display = "flex";
        noInfo.style.display = "none";
        teksElemen.innerText = doc.data().teks;
    } else {
        // Jika kosong, tampilkan pesan "Belum ada pengumuman"
        box.style.display = "none";
        noInfo.style.display = "block";
    }
});
// Mengambil data dua pengumuman sekaligus
db.collection("settings").doc("pengumuman").onSnapshot((doc) => {
    if (doc.exists) {
        const data = doc.data();
        // Update teks Informasi Terkini
        document.getElementById('teks-info-admin').innerText = data.info || "Tidak ada informasi terkini.";
        // Update teks Agenda Mendatang
        document.getElementById('teks-agenda-admin').innerText = data.agenda || "Belum ada agenda.";
    }
});