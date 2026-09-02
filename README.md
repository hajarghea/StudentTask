# StudentTask — To-Do List Mahasiswa

To-do list sederhana untuk mahasiswa, dibuat dengan HTML + CSS + JavaScript murni (tanpa framework) dan disimpan otomatis di **localStorage** browser.

## Fitur
- ➕ Tambah tugas (judul, mata kuliah opsional, deadline opsional)
- 📝 Edit tugas langsung di tempat (inline edit)
- 🗑️ Hapus tugas (dengan konfirmasi)
- ✅ Tandai tugas selesai / belum selesai
- 📅 Deadline tugas — otomatis diberi label "Segera" atau "Lewat deadline"
- 🔍 Filter: Semua / Belum Selesai / Selesai, plus kolom pencarian judul & mata kuliah
- 📊 Statistik: total tugas, belum selesai, selesai, dan lewat deadline
- 💾 Data tersimpan otomatis di browser (tidak butuh server/database)
- 📱 Tampilan responsif untuk laptop dan HP

## Cara menjalankan di VS Code
1. Buka folder `StudentTask` ini di VS Code (`File > Open Folder...`).
2. Install extension **Live Server** (opsional tapi disarankan).
3. Klik kanan `index.html` → **Open with Live Server**.
   - Atau, tanpa extension apa pun: klik dua kali `index.html` untuk membukanya langsung di browser.
4. Selesai! Coba tambahkan tugas — data akan tetap ada walau browser ditutup dan dibuka lagi (selama pakai browser & folder profil yang sama).

## Struktur file
```
StudentTask/
├── index.html   → struktur halaman
├── style.css    → tampilan (desain notebook: navy + krem + aksen kuning)
├── script.js    → logika: tambah, edit, hapus, filter, statistik, localStorage
└── README.md    → panduan ini
```

## Catatan pengembangan lanjutan (ide next step)
- Tambah prioritas tugas (rendah/sedang/tinggi)
- Export/import data ke file JSON
- Notifikasi browser saat deadline mendekat
- Sinkronisasi data ke backend (Firebase/Supabase) jika ingin akses multi-device
