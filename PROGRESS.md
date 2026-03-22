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
**Fase 1 — Fondasi | Hari 8-9**
> Siap memulai: Setup Supabase (buat tabel users, konfigurasi Auth Email, isi src/lib/supabase.js)

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
- [x] Update `src/index.css` — global styles + landing page styles
- [x] Buat semua page stubs di `src/pages/`
- [x] Buat `src/pages/LandingPage.jsx` — landing page lengkap dengan semua section

---

## 🗂️ Struktur Folder Project

```
taxvoice/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Sidebar.jsx      ← navigasi sidebar fixed, NavLink aktif
│   │   └── Layout.jsx       ← wrapper: Sidebar + Outlet
│   ├── lib/
│   │   └── supabase.js      ← BELUM DIISI (next step)
│   ├── pages/
│   │   ├── LandingPage.jsx         ← selesai, lengkap
│   │   ├── LoginPage.jsx           ← stub kosong
│   │   ├── RegisterPage.jsx        ← stub kosong
│   │   ├── PayTaxesPage.jsx        ← stub kosong
│   │   ├── SimulatorPage.jsx       ← stub kosong
│   │   ├── KnowledgePage.jsx       ← stub kosong
│   │   ├── KnowledgeDetailPage.jsx ← stub kosong
│   │   ├── CommunityPage.jsx       ← stub kosong
│   │   ├── CommunityDetailPage.jsx ← stub kosong
│   │   ├── ImpactPage.jsx          ← stub kosong
│   │   ├── ProfilePage.jsx         ← stub kosong
│   │   └── NotFoundPage.jsx        ← selesai
│   ├── App.jsx              ← routing lengkap
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

Authenticated (dengan sidebar via Layout):
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

---

## 🗄️ Skema Database Supabase (Rencana)

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Sama dengan Supabase Auth UID |
| full_name | TEXT | Nama lengkap |
| email | TEXT UNIQUE | Sinkron dari Auth |
| occupation | TEXT | Pekerjaan (opsional) |
| annual_income_dummy | BIGINT | Penghasilan dummy untuk simulasi |
| created_at | TIMESTAMPTZ | Default now() |

### Tabel `preferences`
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

### Tabel `articles`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| title | TEXT | Judul artikel |
| content | TEXT | Konten (Markdown) |
| category | TEXT | pajak/APBN/transparansi/dll |
| thumbnail_url | TEXT | URL dari Supabase Storage |
| read_time_min | INTEGER | Estimasi menit baca |
| created_at | TIMESTAMPTZ | Default now() |

### Tabel `forum_posts`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| user_id | UUID FK | → users |
| title | TEXT | Judul diskusi |
| content | TEXT | Isi diskusi |
| likes_count | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | Default now() |

### Tabel `forum_replies`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| post_id | UUID FK | → forum_posts |
| user_id | UUID FK | → users |
| content | TEXT | Isi balasan |
| created_at | TIMESTAMPTZ | Default now() |

---

## 📅 Timeline MVP (73 Hari)

### Fase 1: Fondasi (Hari 1-14 | 18 Mar – 1 Apr)
- [x] Hari 1-4: Environment setup, boilerplate
- [x] Hari 5-7: Navbar/Sidebar, Footer, Layout dasar
- [ ] **Hari 8-9: Setup Supabase + tabel users + Auth Email** ← SEKARANG
- [ ] Hari 10-11: Halaman Register & Login
- [ ] Hari 12-14: Routing final + deploy Vercel

### Fase 2: Knowledge Hub & Dashboard (Hari 15-28 | 2-15 Apr)
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

Sudah ada di `.gitignore`? Pastikan baris ini ada:
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

---

## 📝 Keputusan Desain

- **Sidebar** pakai `position: fixed` — tetap terlihat saat scroll
- **Main content** pakai `margin-left: 220px` untuk kompensasi sidebar fixed
- **Landing page** tidak pakai sidebar — route publik berdiri sendiri
- **Tombol "Get Started"** scroll ke `#features` di halaman yang sama (bukan ke /register)
- **Ilustrasi hero** menggunakan SVG custom (bukan gambar AI) — lebih ringan & scalable
- **CSS custom** ditulis di `index.css` dengan class naming BEM (`block__element--modifier`)

---

## 💬 Cara Pakai File Ini di Chat Baru

1. Buka chat baru dengan Claude
2. Tulis: *"Ini progress project TaxVoice saya:"*
3. Paste seluruh isi file PROGRESS.md ini
4. Lanjutkan dengan pertanyaan atau task yang ingin dikerjakan

Claude akan langsung memahami konteks penuh tanpa perlu dijelaskan dari awal.