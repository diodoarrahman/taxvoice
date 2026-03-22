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
- **Bahasa UI & Konten**: English (seluruh web dalam bahasa Inggris)

---

## 📍 Status Saat Ini
**Fase 3 — Preference Input & Simulator | Hari 29**
> Siap memulai: Buat halaman /pay-taxes dengan 5 slider per sektor

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
  react-markdown
```
- [x] Setup Tailwind v4 via `@tailwindcss/vite` plugin (BUKAN tailwind.config.js — ini penting!)

### Hari 5-7 — Komponen Dasar & Layout
- [x] Buat `src/components/Sidebar.jsx` — sidebar navigasi fixed dengan NavLink aktif
- [x] Buat `src/components/Layout.jsx` — wrapper dengan Outlet untuk nested routes
- [x] Update `src/App.jsx` — routing lengkap semua halaman
- [x] Update `src/index.css` — global styles + landing page styles
- [x] Buat semua page stubs di `src/pages/`
- [x] Buat `src/pages/LandingPage.jsx` — landing page lengkap dengan semua section

### Hari 8-12 — Supabase, Auth & Deploy
- [x] Buat Supabase project (region: Southeast Asia - Singapore)
- [x] Ambil API keys → simpan di `.env.local`
- [x] Isi `src/lib/supabase.js` dengan createClient
- [x] Buat tabel `users` di Supabase via SQL Editor
- [x] Nonaktifkan "Confirm email" di Supabase Auth
- [x] Buat trigger otomatis `on_auth_user_created` + function `handle_new_user()`
- [x] Buat `src/pages/LoginPage.jsx` — form login lengkap dengan error handling
- [x] Buat `src/pages/RegisterPage.jsx` — form register lengkap (nama, email, password)
- [x] Buat `src/components/ProtectedRoute.jsx` — proteksi route authenticated
- [x] Update `src/App.jsx` — wrap Layout dengan ProtectedRoute
- [x] Deploy ke Vercel + tambah environment variables di Vercel dashboard
- [x] Test end-to-end: register → login → proteksi route → semua berhasil ✅

### Hari 15-17 — Tabel Articles & Data Dummy
- [x] Buat tabel `articles` di Supabase via SQL Editor
- [x] Aktifkan RLS + buat policy public read pada tabel `articles`
- [x] Input 10 artikel dummy dalam bahasa Inggris dengan kategori:
  - tax, budget, transparency, development, guide, education

### Hari 18-20 — Halaman /knowledge
- [x] Buat `src/pages/KnowledgePage.jsx`:
  - Fetch artikel dari Supabase (hanya kolom yang dibutuhkan, tanpa content)
  - Filter by category (All, tax, budget, transparency, development, guide, education)
  - Search by title (client-side filtering)
  - Card grid responsive dengan ArticleCard component
  - Loading spinner & empty state
- [x] Tambah CSS knowledge page di `src/index.css`

### Hari 21-22 — Halaman /knowledge/:id
- [x] Install `react-markdown`
- [x] Buat `src/pages/KnowledgeDetailPage.jsx`:
  - Fetch artikel by ID dari URL params (`useParams`)
  - Redirect ke /knowledge jika artikel tidak ditemukan
  - Render konten Markdown dengan ReactMarkdown
  - Tombol back ke /knowledge
- [x] Tambah CSS detail page + Markdown styling di `src/index.css`

### Hari 23-25 — Halaman /impact
- [x] Buat `src/pages/ImpactPage.jsx`:
  - 4 Stat Cards: State Budget, Tax Revenue, Tax Ratio, Registered Taxpayers
  - PieChart: State Budget Allocation 2024 by sector
  - BarChart: Tax Ratio by Country (Indonesia di-highlight merah)
  - LineChart: Tax Revenue Target vs Realization 2019-2024
  - Semua chart menggunakan Recharts + ResponsiveContainer
- [x] Tambah CSS impact page di `src/index.css`

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
│   │   ├── ImpactPage.jsx          ← selesai, 4 stat cards + 3 charts
│   │   ├── KnowledgePage.jsx       ← selesai, card grid + search + filter
│   │   ├── KnowledgeDetailPage.jsx ← selesai, detail artikel + markdown
│   │   ├── PayTaxesPage.jsx        ← stub kosong
│   │   ├── SimulatorPage.jsx       ← stub kosong
│   │   ├── CommunityPage.jsx       ← stub kosong
│   │   ├── CommunityDetailPage.jsx ← stub kosong
│   │   ├── ProfilePage.jsx         ← stub kosong
│   │   └── NotFoundPage.jsx        ← selesai
│   ├── App.jsx              ← routing lengkap + ProtectedRoute
│   ├── index.css            ← global styles + semua page CSS
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
| Recharts | 2.x | Charts di /impact, /simulator, /pay-taxes |
| React Hook Form | 7.x | Form management |
| React Markdown | latest | Render konten Markdown di /knowledge/:id |

### ⚠️ Catatan Penting Tailwind v4
- Setup via plugin Vite, bukan `npx tailwindcss init`
- Tidak ada file `tailwind.config.js`
- CSS utilities langsung tersedia tanpa konfigurasi tambahan
- Custom styles ditulis di `src/index.css` dengan CSS biasa (bukan `@apply`)
- **PENTING**: `@import "tailwindcss"` harus di baris pertama `index.css`

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

### Tabel `articles` ✅ SUDAH DIBUAT
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| title | TEXT | Judul artikel (English) |
| content | TEXT | Konten (Markdown, English) |
| category | TEXT | tax/budget/transparency/development/guide/education |
| thumbnail_url | TEXT | URL dari placehold.co |
| read_time_min | INTEGER | Estimasi menit baca |
| created_at | TIMESTAMPTZ | Default now() |

**RLS**: Aktif — policy `articles_public_read` mengizinkan SELECT untuk semua (tanpa login)

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

## 🔐 Cara Kerja Auth

### Alur Register
```
User isi form (nama, email, password) → klik Register
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
User isi form (email, password) → klik Sign In
        ↓
supabase.auth.signInWithPassword({ email, password })
        ↓
Supabase validasi → simpan session ke localStorage otomatis
        ↓
navigate('/impact')
```

### Alur Proteksi Route
```
User buka halaman authenticated
        ↓
ProtectedRoute render — cek session
        ↓
Tidak ada session → redirect /login
Ada session → tampilkan Layout + halaman ✅
```

---

## 📅 Timeline MVP (73 Hari)

### Fase 1: Fondasi (Hari 1-14) ✅ SELESAI
### Fase 2: Knowledge Hub & Dashboard (Hari 15-28) ✅ SELESAI

### Fase 3: Preference Input & Simulator (Hari 29-42) ← SEKARANG
- [ ] Hari 29-31: Halaman /pay-taxes, 5 slider dengan useState
- [ ] Hari 32-33: Validasi total=100%, pie chart preview real-time
- [ ] Hari 34-35: Tabel preferences di Supabase, submit ke DB
- [ ] Hari 36-38: Halaman /simulator, slider alokasi 5 sektor
- [ ] Hari 39-42: Formula dampak dummy, tampilkan skor & chart hasil simulasi

### Fase 4: Community Forum (Hari 43-56)
- [ ] Hari 43-45: Tabel forum_posts & forum_replies, aktifkan RLS
- [ ] Hari 46-48: Halaman /community (list post)
- [ ] Hari 49-51: Form create post, submit ke Supabase
- [ ] Hari 52-54: Halaman /community/:id (thread + replies)
- [ ] Hari 55-56: Fitur like, proteksi route login

### Fase 5: Polish & Presentasi (Hari 57-73)
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

- **Bahasa**: Seluruh UI dan konten dalam bahasa Inggris
- **Sidebar** pakai `position: fixed` — tetap terlihat saat scroll
- **Main content** pakai `margin-left: 220px` untuk kompensasi sidebar fixed
- **Landing page** tidak pakai sidebar — route publik berdiri sendiri
- **Ilustrasi hero** menggunakan SVG custom — lebih ringan & scalable
- **CSS custom** ditulis di `src/index.css` dengan class naming BEM
- **Confirm email dimatikan** saat development — aktifkan sebelum launch
- **UI polish ditunda** ke Fase 5 — fokus dulu ke fungsionalitas
- **Artikel** disimpan dalam format Markdown di kolom `content`
- **Chart data** masih dummy — akan diganti data real di Fase 5
- **RLS** diaktifkan di semua tabel — articles: public read, tabel lain: authenticated only

---

## 💬 Cara Pakai File Ini di Chat Baru

1. Buka chat baru dengan Claude
2. Tulis: *"Ini progress project TaxVoice saya:"*
3. Paste seluruh isi file PROGRESS.md ini
4. Lanjutkan dengan: *"Lanjut ke Fase 3 ya"*

Claude akan langsung memahami konteks penuh tanpa perlu dijelaskan dari awal.