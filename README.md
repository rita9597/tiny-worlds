# Tiny Worlds 🌙

Aplikasi cerita interaktif bergaya storybook. Masukkan **karakter** dan **dunia/tempat**, lalu Tiny Worlds akan:

1. Menulis adegan pembuka.
2. Membuat ilustrasi adegan.
3. Memberi 3 pilihan jalan cerita.
4. Melanjutkan cerita berdasarkan pilihan atau ide bebas kamu.
5. Menjaga konteks dan penampilan karakter antar-adegan.

## Yang perlu kamu lakukan

Kamu tidak perlu mengubah kode.

### 1. Siapkan API key OpenAI

Buat API key dari halaman API Keys OpenAI, lalu masukkan sebagai environment variable bernama:

`OPENAI_API_KEY`

**Jangan** menaruh API key di `app/page.tsx` atau kode browser. Aplikasi ini sengaja membaca key hanya dari server.

### 2. Jalankan aplikasi

Jika Node.js sudah terpasang:

```bash
npm install
npm run dev
```

Kemudian buka:

`http://localhost:3000`

## Deploy paling mudah

Untuk membuat Tiny Worlds menjadi website yang bisa dibuka lewat internet, upload folder proyek ini ke layanan hosting Next.js seperti Vercel.

Saat diminta Environment Variables, tambahkan:

- `OPENAI_API_KEY` = API key kamu
- `OPENAI_TEXT_MODEL` = model teks yang tersedia di akunmu (opsional; default sudah disiapkan)
- `OPENAI_IMAGE_MODEL` = model gambar yang tersedia di akunmu (opsional; default sudah disiapkan)

Setelah deploy selesai, website bisa dibuka seperti website biasa.

## Struktur penting

- `app/page.tsx` — tampilan storybook dan interaksi pengguna.
- `app/api/story/route.ts` — server-side story generation + image generation.
- `.env.example` — contoh konfigurasi environment variable.

API key **tidak pernah dikirim ke browser**.
