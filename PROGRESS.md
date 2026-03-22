# TaxVoice — Project Progress Log
> Paste file ini di awal setiap chat baru supaya Claude langsung paham konteks project.

---

## 🧭 Identitas Project
- **Nama**: TaxVoice — Civic-Fiscal Engagement Platform
- **Tujuan**: Platform digital untuk meningkatkan moral pajak melalui edukasi, partisipasi, dan transparansi
- **Tim**: Muhammad Abdul Daffa (leader), Diodo Arrahman, Anastasya
- **Universitas**: Universitas Bengkulu
- **Deadline MVP**: 30 Mei 2026
- **Mulai**: 18 Maret 2026
- **Konteks**: Project lomba IYS (International Youth Summit) 5th edition

---

## 📍 Status Saat Ini
**Fase 2 — Knowledge Hub & Dashboard | Hari 15**
> Siap memulai: Buat tabel `articles` di Supabase, input 10 artikel dummy, buat halaman /knowledge

---

## ✅ Yang Sudah Selesai

### Hari 1-4 — Environment & Boilerplate
- [x] Install Node.js, VS Code, ekstensi (ESLint, Prettier, Tailwind IntelliSense, ES7+ Snippets)
- [x] Buat akun GitHub, Supabase, Vercel
- [x] Buat project React dengan Vite: `npm create vite@latest taxvoice -- --template react`
- [x] Install dependencies:
  ```
  @supabase/supabase-js
  react-router-dom
  recharts
  react-hook-form
  ```
- [x] Setup Tailwind v4 via `@tailwindcss/vite` plugin (BUKAN tailwind.config.js — ini penting!)

### Hari 5-7 — Komponen Dasar & Layout
- [x] Buat `src/components/Sidebar.jsx` — sidebar navigasi fixed dengan NavLink aktif
- [x] Buat `src/components/Layout.jsx` — wrapper dengan Outlet untuk nested routes
- [x] Update `src/App.jsx` — routing lengkap semua halaman
- [x] Update `src/index.css` — global styles + landing page styles (fix: @import tailwindcss harus di baris pertama)
- [x] Buat semua page stubs di `src/pages/`
- [x] Buat `src/pages/LandingPage.jsx` — landing page lengkap dengan semua section

### Hari 8-12 — Supabase, Auth & Deploy
- [x] Buat Supabase project (region: Southeast Asia - Singapore)
- [x] Ambil API keys → simpan di `.env.local`
- [x] Isi `src/lib/supabase.js` dengan createClient
- [x] Buat tabel `users` di Supabase via SQL Editor
- [x] Nonaktifkan "Confirm email" di Supabase Auth (untuk kemudahan development)
- [x] Buat trigger otomatis `on_auth_user_created` + function `handle_new_user()`:
  - Setiap user register → data (id, email, full_name) otomatis disalin ke tabel `users`
  - `full_name` diambil dari `raw_user_meta_data` yang dikirim saat `signUp`
- [x] Test koneksi Supabase dari React (via `supabase.from('users').select('*')`)
- [x] Buat `src/pages/LoginPage.jsx` — form login lengkap dengan error handling
- [x] Buat `src/pages/RegisterPage.jsx` — form register lengkap (nama, email, password)
- [x] Buat `src/components/ProtectedRoute.jsx` — proteksi route authenticated
- [x] Update `src/App.jsx` — wrap Layout dengan ProtectedRoute
- [x] Deploy ke Vercel + tambah environment variables di Vercel dashboard
- [x] Test end-to-end: register → login → proteksi route → semua berhasil ✅

---

## 🗂️ Struktur Folder Project

```
taxvoice/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Sidebar.jsx         ← navigasi sidebar fixed, NavLink aktif
│   │   ├── Layout.jsx          ← wrapper: Sidebar + Outlet
│   │   └── ProtectedRoute.jsx  ← proteksi route, cek session Supabase
│   ├── lib/
│   │   └── supabase.js         ← createClient dengan env variables
│   ├── pages/
│   │   ├── LandingPage.jsx         ← selesai, lengkap
│   │   ├── LoginPage.jsx           ← selesai, form login + error handling
│   │   ├── RegisterPage.jsx        ← selesai, form register + error handling
│   │   ├── PayTaxesPage.jsx        ← stub kosong
│   │   ├── SimulatorPage.jsx       ← stub kosong
│   │   ├── KnowledgePage.jsx       ← stub kosong
│   │   ├── KnowledgeDetailPage.jsx ← stub kosong
│   │   ├── CommunityPage.jsx       ← stub kosong
│   │   ├── CommunityDetailPage.jsx ← stub kosong
│   │   ├── ImpactPage.jsx          ← stub kosong
│   │   ├── ProfilePage.jsx         ← stub kosong
│   │   └── NotFoundPage.jsx        ← selesai
│   ├── App.jsx              ← routing lengkap + ProtectedRoute
│   ├── index.css            ← global styles + landing page CSS
│   └── main.jsx             ← entry point
├── .env.local               ← JANGAN DI-PUSH ke GitHub
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛣️ Routing (App.jsx)

```
Public (tanpa sidebar):
  /           → LandingPage
  /login      → LoginPage
  /register   → RegisterPage

Authenticated (dengan sidebar via Layout, dilindungi ProtectedRoute):
  /pay-taxes          → PayTaxesPage
  /simulator          → SimulatorPage
  /knowledge          → KnowledgePage
  /knowledge/:id      → KnowledgeDetailPage
  /community          → CommunityPage
  /community/:id      → CommunityDetailPage
  /impact             → ImpactPage
  /profile            → ProfilePage
  *                   → NotFoundPage
```

---

## 🧰 Tech Stack

| Teknologi | Versi | Catatan |
|-----------|-------|---------|
| React | 18.x | UI Framework |
| Vite | 8.x | Build tool (bukan CRA) |
| Tailwind CSS | v4 | Via `@tailwindcss/vite` plugin — TANPA tailwind.config.js |
| React Router | v6 | Nested routes untuk Layout |
| Supabase JS | latest | BaaS — Auth + DB + Storage |
| Recharts | 2.x | Untuk chart di simulator & dashboard |
| React Hook Form | 7.x | Form management |

### ⚠️ Catatan Penting Tailwind v4
- Setup via plugin Vite, bukan `npx tailwindcss init`
- Tidak ada file `tailwind.config.js`
- CSS utilities langsung tersedia tanpa konfigurasi tambahan
- Custom styles ditulis di `src/index.css` dengan CSS biasa (bukan `@apply`)
- **PENTING**: `@import "tailwindcss"` harus di baris pertama `index.css` — kalau tidak, Tailwind tidak terbaca

---

## 🗄️ Skema Database Supabase

### Tabel `users` ✅ SUDAH DIBUAT
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | REFERENCES auth.users(id) ON DELETE CASCADE |
| full_name | TEXT | Diambil dari raw_user_meta_data saat register |
| email | TEXT UNIQUE | Sinkron dari Auth |
| occupation | TEXT | Pekerjaan (opsional) |
| annual_income_dummy | BIGINT | Default 0, untuk simulasi |
| created_at | TIMESTAMPTZ | Default now() |

### Trigger & Function ✅ SUDAH DIBUAT
- **Function**: `public.handle_new_user()` — menyalin data dari Auth ke tabel users
- **Trigger**: `on_auth_user_created` — jalan otomatis AFTER INSERT ON auth.users

### Tabel `preferences` (Belum dibuat — Fase 3)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| user_id | UUID FK | → users |
| education_pct | INTEGER | 0-100 |
| health_pct | INTEGER | 0-100 |
| infrastructure_pct | INTEGER | 0-100 |
| defense_pct | INTEGER | 0-100 |
| social_pct | INTEGER | 0-100 |
| created_at | TIMESTAMPTZ | Default now() |

### Tabel `articles` (Belum dibuat — Fase 2, next step)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| title | TEXT | Judul artikel |
| content | TEXT | Konten (Markdown) |
| category | TEXT | pajak/APBN/transparansi/dll |
| thumbnail_url | TEXT | URL dari Supabase Storage |
| read_time_min | INTEGER | Estimasi menit baca |
| created_at | TIMESTAMPTZ | Default now() |

### Tabel `forum_posts` (Belum dibuat — Fase 4)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| user_id | UUID FK | → users |
| title | TEXT | Judul diskusi |
| content | TEXT | Isi diskusi |
| likes_count | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | Default now() |

### Tabel `forum_replies` (Belum dibuat — Fase 4)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| post_id | UUID FK | → forum_posts |
| user_id | UUID FK | → users |
| content | TEXT | Isi balasan |
| created_at | TIMESTAMPTZ | Default now() |

---

## 🔐 Cara Kerja Auth (Penting untuk dipahami)

### Alur Register
```
User isi form (nama, email, password) → klik Daftar
        ↓
supabase.auth.signUp({ email, password, options: { data: { full_name } } })
        ↓
Supabase simpan ke auth.users + session ke localStorage
        ↓
Trigger on_auth_user_created aktif otomatis
        ↓
handle_new_user() salin (id, email, full_name) ke tabel users
        ↓
navigate('/login')
```

### Alur Login
```
User isi form (email, password) → klik Masuk
        ↓
supabase.auth.signInWithPassword({ email, password })
        ↓
Supabase validasi → simpan session ke localStorage otomatis
        ↓
navigate('/impact')
```

### Alur Proteksi Route (ProtectedRoute.jsx)
```
User buka halaman authenticated (misal /impact)
        ↓
ProtectedRoute render — session = undefined (belum tahu)
        ↓
return null — layar kosong sebentar
        ↓
getSession() cek localStorage browser
        ↓
Tidak ada session → redirect /login
Ada session → tampilkan Layout + halaman tujuan ✅
```

### Kenapa session bisa persist?
- Supabase menyimpan session token di **localStorage** browser
- localStorage tidak hilang saat browser ditutup
- Key-nya: `sb-xxxxxx-auth-token`
- `getSession()` membaca dari localStorage ini

---

## 📅 Timeline MVP (73 Hari)

### Fase 1: Fondasi (Hari 1-14 | 18 Mar – 1 Apr) ✅ SELESAI
- [x] Hari 1-4: Environment setup, boilerplate
- [x] Hari 5-7: Navbar/Sidebar, Footer, Layout dasar
- [x] Hari 8-10: Setup Supabase + tabel users + Auth Email + trigger
- [x] Hari 11: Halaman Register & Login + ProtectedRoute
- [x] Hari 12: Deploy Vercel + test end-to-end

### Fase 2: Knowledge Hub & Dashboard (Hari 15-28 | 2-15 Apr) ← SEKARANG
- [ ] Hari 15-17: Buat tabel articles, input 10 artikel dummy
- [ ] Hari 18-20: Halaman /knowledge (card grid dari Supabase)
- [ ] Hari 21-22: Halaman /knowledge/:id (detail artikel)
- [ ] Hari 23-25: Install Recharts, buat PieChart & BarChart dummy
- [ ] Hari 26-28: Halaman /impact dengan 3 visualisasi dummy

### Fase 3: Preference Input & Simulator (Hari 29-42 | 16-29 Apr)
- [ ] Hari 29-31: Halaman /pay-taxes, 5 slider dengan useState
- [ ] Hari 32-33: Validasi total=100%, pie chart preview real-time
- [ ] Hari 34-35: Tabel preferences di Supabase, submit ke DB
- [ ] Hari 36-38: Halaman /simulator, slider alokasi 5 sektor
- [ ] Hari 39-42: Formula dampak dummy, tampilkan skor & chart

### Fase 4: Community Forum (Hari 43-56 | 30 Apr – 13 Mei)
- [ ] Hari 43-45: Tabel forum_posts & forum_replies, aktifkan RLS
- [ ] Hari 46-48: Halaman /community (list post)
- [ ] Hari 49-51: Form create post, submit ke Supabase
- [ ] Hari 52-54: Halaman /community/:id (thread + replies)
- [ ] Hari 55-56: Fitur like, proteksi route login

### Fase 5: Polish & Presentasi (Hari 57-73 | 14-30 Mei)
- [ ] Hari 57-59: Landing Page lengkap & menarik
- [ ] Hari 60-62: Audit UI seluruh halaman
- [ ] Hari 63-65: Isi semua data dummy lengkap
- [ ] Hari 66-68: Testing menyeluruh & fix bugs
- [ ] Hari 69-71: Persiapkan skrip demo
- [ ] Hari 72-73: Buffer, final deploy, rehearsal

---

## 🔐 Environment Variables

File `.env.local` (jangan di-push ke GitHub!):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Sudah ditambahkan juga di **Vercel dashboard** → Project Settings → Environment Variables.

Sudah ada di `.gitignore`:
```
.env.local
node_modules/
dist/
```

---

## 🐛 Bug & Solusi yang Pernah Ditemui

| Bug | Penyebab | Solusi |
|-----|----------|--------|
| `Failed to resolve import ".../CommunityPage.jsx/index.js"` | Import path salah di App.jsx | Hapus `.jsx/index.js`, pakai `'./pages/CommunityPage'` |
| `@import must precede all other statements` | `@import` Google Fonts tidak di baris pertama CSS | Pindahkan `@import` ke baris paling atas index.css |
| Landing page kosong | `export function` bukan `export default function` | Tambahkan kata `default` |
| Ilustrasi SVG tidak muncul | viewBox lama tidak diganti setelah update SVG | Sesuaikan viewBox dengan ukuran SVG baru |
| Tailwind tidak terbaca di LoginPage | `@import "tailwindcss"` belum ada di index.css | Tambahkan `@import "tailwindcss"` di baris pertama index.css |

---

## 📝 Keputusan Desain

- **Sidebar** pakai `position: fixed` — tetap terlihat saat scroll
- **Main content** pakai `margin-left: 220px` untuk kompensasi sidebar fixed
- **Landing page** tidak pakai sidebar — route publik berdiri sendiri
- **Tombol "Get Started"** scroll ke `#features` di halaman yang sama (bukan ke /register)
- **Ilustrasi hero** menggunakan SVG custom (bukan gambar AI) — lebih ringan & scalable
- **CSS custom** ditulis di `index.css` dengan class naming BEM (`block__element--modifier`)
- **Confirm email dimatikan** saat development — aktifkan kembali sebelum launch
- **UI polish ditunda** ke Fase 5 (hari 60-62) — fokus dulu ke fungsionalitas

---

## 💬 Cara Pakai File Ini di Chat Baru

1. Buka chat baru dengan Claude
2. Tulis: *"Ini progress project TaxVoice saya:"*
3. Paste seluruh isi file PROGRESS.md ini
4. Lanjutkan dengan: *"Lanjut ke Fase 2 ya"*

Claude akan langsung memahami konteks penuh tanpa perlu dijelaskan dari awal.