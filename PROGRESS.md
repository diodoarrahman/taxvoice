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
**Fase 5 — Polish & Presentasi | Hari 57**
> Siap memulai: Landing Page lengkap & menarik

---

## ✅ Yang Sudah Selesai

### Fase 1: Fondasi (Hari 1-14) ✅ SELESAI
- [x] Install Node.js, VS Code, ekstensi (ESLint, Prettier, Tailwind IntelliSense, ES7+ Snippets)
- [x] Buat akun GitHub, Supabase, Vercel
- [x] Buat project React dengan Vite: `npm create vite@latest taxvoice -- --template react`
- [x] Install dependencies: `@supabase/supabase-js`, `react-router-dom`, `recharts`, `react-hook-form`, `react-markdown`
- [x] Setup Tailwind v4 via `@tailwindcss/vite` plugin (BUKAN tailwind.config.js — ini penting!)
- [x] Buat `src/components/Sidebar.jsx` — sidebar navigasi fixed dengan NavLink aktif
- [x] Buat `src/components/Layout.jsx` — wrapper dengan Outlet untuk nested routes
- [x] Buat `src/components/ProtectedRoute.jsx` — proteksi route, cek session Supabase
- [x] Update `src/App.jsx` — routing lengkap semua halaman
- [x] Update `src/index.css` — global styles + semua page CSS
- [x] Buat semua page stubs di `src/pages/`
- [x] Buat `src/pages/LandingPage.jsx` — landing page lengkap dengan semua section
- [x] Buat `src/pages/LoginPage.jsx` — form login lengkap dengan error handling
- [x] Buat `src/pages/RegisterPage.jsx` — form register lengkap (nama, email, password)
- [x] Buat Supabase project (region: Southeast Asia - Singapore)
- [x] Ambil API keys → simpan di `.env.local`
- [x] Isi `src/lib/supabase.js` dengan createClient
- [x] Buat tabel `users` di Supabase via SQL Editor
- [x] Nonaktifkan "Confirm email" di Supabase Auth
- [x] Buat trigger otomatis `on_auth_user_created` + function `handle_new_user()`
- [x] Deploy ke Vercel + tambah environment variables di Vercel dashboard
- [x] Test end-to-end: register → login → proteksi route → semua berhasil ✅

### Fase 2: Knowledge Hub & Dashboard (Hari 15-28) ✅ SELESAI
- [x] Buat tabel `articles` di Supabase via SQL Editor
- [x] Aktifkan RLS + buat policy `articles_public_read` (SELECT for all)
- [x] Input 10 artikel dummy dalam bahasa Inggris dengan kategori:
      tax, budget, transparency, development, guide, education
- [x] Buat `src/pages/KnowledgePage.jsx`:
      - Fetch artikel dari Supabase (tanpa kolom content)
      - Filter by category: All, tax, budget, transparency, development, guide, education
      - Search by title (client-side filtering)
      - Card grid responsive dengan komponen ArticleCard
      - Loading spinner & empty state
- [x] Buat `src/pages/KnowledgeDetailPage.jsx`:
      - Fetch artikel by ID dari URL params (useParams)
      - Redirect ke /knowledge jika artikel tidak ditemukan
      - Render konten Markdown dengan ReactMarkdown
      - Tombol back ke /knowledge
- [x] Buat `src/pages/ImpactPage.jsx`:
      - 4 Stat Cards: State Budget, Tax Revenue, Tax Ratio, Registered Taxpayers
      - PieChart: State Budget Allocation 2024 by sector
      - BarChart: Tax Ratio by Country (Indonesia di-highlight merah)
      - LineChart: Tax Revenue Target vs Realization 2019-2024
      - Semua chart menggunakan Recharts + ResponsiveContainer
- [x] Fix bug: `activeCategory` default value `'Semua'` → `'All'`
- [x] Fix bug: `categoryColors` key diupdate dari bahasa Indonesia ke Inggris
- [x] Fix bug: label `menit baca` → `min read`

### Fase 3: Preference Input & Simulator (Hari 29-42) ✅ SELESAI
- [x] Buat `src/pages/PayTaxesPage.jsx`:
      - 5 slider alokasi anggaran per sektor
      - Slider terkunci: total tidak bisa melebihi 100%
      - max slider selalu 100 (posisi visual konsisten 0-100)
      - Sektor lain TIDAK bergerak saat satu sektor digeser
      - Feedback "Max reached — reduce another sector first" muncul saat remaining = 0
      - Real-time pie chart preview alokasi
      - Submit preferensi ke Supabase dengan upsert (onConflict: 'user_id')
      - State saved/error handling
- [x] Buat tabel `preferences` di Supabase:
      - Kolom: id, user_id (UNIQUE FK), education_pct, health_pct,
        infrastructure_pct, defense_pct, social_pct, created_at
      - RLS aktif — policy "Users can manage own preferences" (ALL, auth.uid() = user_id)
- [x] Buat `src/pages/SimulatorPage.jsx`:
      - Slider alokasi 5 sektor (mekanisme sama dengan PayTaxesPage)
      - Tombol "Run Simulation" — trigger kalkulasi
      - Formula scoring optimal point:
        score = max(0, 100 - |alokasi - ideal| × penalty)
        penalty: ×2 jika deviasi ≤5% | ×3.5 jika ≤10% | ×5 jika >10%
      - Overall score = weighted average semua sektor
        bobot: Education 25% | Health 20% | Infrastructure 20% | Defense 15% | Social 20%
      - Grade A/B/C/D/F per sektor berdasarkan skor
      - Penjelasan dinamis per sektor (low/ideal/high), threshold ±7% dari ideal
      - Tab system: Overview, Charts, Analysis, References
      - Overview: card per sektor dengan grade + insight text
      - Charts: Radar chart, Bar chart (alokasi vs ideal), Line chart tren
      - Line chart tren hanya muncul setelah run ≥2 kali
      - Analysis: formula penjelasan + tabel breakdown per sektor
      - References: 8 sumber ilmiah (UNESCO, WHO, IMF, World Bank, SIPRI, ADB, BPS, dll)
      - Riwayat simulasi disimpan di state (max 5 run terakhir)

### Fase 4: Community Forum (Hari 43-56) ✅ SELESAI
- [x] Buat tabel `forum_posts` di Supabase:
      - Kolom: id, user_id (FK → users), title, content, created_at
      - Kolom `likes_count` sempat dibuat lalu DIHAPUS — diganti sistem post_likes
      - RLS aktif: SELECT (authenticated), INSERT/UPDATE/DELETE (owner only)
- [x] Buat tabel `forum_replies` di Supabase:
      - Kolom: id, post_id (FK → forum_posts), user_id (FK → users), content, created_at
      - RLS aktif: SELECT (authenticated), INSERT/DELETE (owner only)
- [x] Buat tabel `post_likes` di Supabase:
      - Kolom: id, post_id (FK → forum_posts), user_id (FK → users)
      - UNIQUE(post_id, user_id) — mencegah double like
      - RLS aktif: SELECT (authenticated), INSERT/DELETE (owner only)
- [x] Tambah RLS policy `users_public_read` di tabel `users`:
      - SELECT for authenticated — diperlukan agar join ke users berhasil
- [x] Buat `src/pages/CommunityPage.jsx`:
      - Fetch semua forum_posts + join users (author name) + join post_likes (count)
      - Search client-side by title/content/author
      - Card list dengan excerpt, avatar inisial, waktu relatif (timeAgo)
      - Tombol "+ New Post" → navigate ke /community/new
      - Loading, error, dan empty state
- [x] Buat `src/pages/CreatePostPage.jsx`:
      - Form: title (min 10 char, max 120) + content (min 20 char, max 2000)
      - Character counter real-time
      - Validasi sebelum submit
      - Insert ke forum_posts dengan user_id dari supabase.auth.getUser()
      - Redirect ke /community setelah berhasil
      - Tombol Cancel → back ke /community
- [x] Buat `src/pages/CommunityDetailPage.jsx`:
      - Fetch 1 post by ID (useParams) + join users
      - Fetch semua replies by post_id + join users
      - Fetch like status & total likes dari tabel post_likes (bukan cached count)
      - Render thread: post lengkap + daftar replies
      - Avatar inisial + nama author + waktu relatif
      - Tombol Delete post — hanya muncul jika currentUser.id === post.user_id
      - Tombol Delete reply — hanya muncul jika currentUser.id === reply.user_id
      - Delete post → redirect ke /community
      - Form reply: textarea + character counter + validasi + submit
      - Replies refresh otomatis setelah submit tanpa reload halaman
      - Fitur Like/Unlike:
        * Status like per-user diambil dari post_likes
        * Toggle like/unlike — insert/delete dari post_likes
        * Count dihitung real-time dari COUNT(post_likes) bukan kolom cache
        * Tombol like berubah warna merah saat active
- [x] Buat `src/pages/ProfilePage.jsx`:
      - Fetch profil user dari tabel users (full_name, email, created_at)
      - Fetch jumlah posts & replies user dari forum_posts & forum_replies
      - Avatar inisial besar + nama + email + tanggal bergabung
      - Stat cards: total Posts & Replies
      - Tombol Go to Community Forum
      - Tombol Sign Out → supabase.auth.signOut() → redirect /login
- [x] Tambah route `/community/new` di App.jsx (SEBELUM `/community/:id`)
- [x] Buat `vercel.json` di root project untuk fix 404 saat refresh di production:
      { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
- [x] Fix bug: nama author Anonymous → tambah RLS policy users_public_read
- [x] Fix bug: likes antar akun saling terhubung → hitung dari post_likes bukan likes_count
- [x] Fix bug: post tidak bisa diklik setelah drop kolom likes_count → hapus likes_count dari select di CommunityDetailPage fetchPost()
- [x] Drop kolom likes_count dari forum_posts (tidak terpakai setelah sistem post_likes)

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
│   │   ├── LandingPage.jsx         ← selesai, lengkap (perlu polish di Fase 5)
│   │   ├── LoginPage.jsx           ← selesai, form login + error handling
│   │   ├── RegisterPage.jsx        ← selesai, form register + error handling
│   │   ├── ImpactPage.jsx          ← selesai, 4 stat cards + 3 charts
│   │   ├── KnowledgePage.jsx       ← selesai, card grid + search + filter
│   │   ├── KnowledgeDetailPage.jsx ← selesai, detail artikel + markdown
│   │   ├── PayTaxesPage.jsx        ← selesai, 5 slider + pie chart + upsert Supabase
│   │   ├── SimulatorPage.jsx       ← selesai, scoring + 4 visualisasi + references
│   │   ├── CommunityPage.jsx       ← selesai, list post + search + likes count
│   │   ├── CommunityDetailPage.jsx ← selesai, thread + replies + like/unlike + delete
│   │   ├── CreatePostPage.jsx      ← selesai, form create post + validasi
│   │   ├── ProfilePage.jsx         ← selesai, profil + stats + logout
│   │   └── NotFoundPage.jsx        ← selesai
│   ├── App.jsx              ← routing lengkap + ProtectedRoute
│   ├── index.css            ← global styles + semua page CSS
│   └── main.jsx             ← entry point
├── vercel.json              ← fix 404 refresh di production
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
  /pay-taxes          → PayTaxesPage         ✅ selesai
  /simulator          → SimulatorPage        ✅ selesai
  /knowledge          → KnowledgePage        ✅ selesai
  /knowledge/:id      → KnowledgeDetailPage  ✅ selesai
  /community          → CommunityPage        ✅ selesai
  /community/new      → CreatePostPage       ✅ selesai (harus SEBELUM /:id)
  /community/:id      → CommunityDetailPage  ✅ selesai
  /impact             → ImpactPage           ✅ selesai
  /profile            → ProfilePage          ✅ selesai
  *                   → NotFoundPage         ✅ selesai
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

### Tabel `users` ✅
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | REFERENCES auth.users(id) ON DELETE CASCADE |
| full_name | TEXT | Diambil dari raw_user_meta_data saat register |
| email | TEXT UNIQUE | Sinkron dari Auth |
| occupation | TEXT | Pekerjaan (opsional) |
| annual_income_dummy | BIGINT | Default 0, untuk simulasi |
| created_at | TIMESTAMPTZ | Default now() |

**RLS**: Aktif — policy `users_public_read` (SELECT for authenticated)

### Tabel `articles` ✅
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

### Tabel `preferences` ✅
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| user_id | UUID UNIQUE FK | → users, ON DELETE CASCADE |
| education_pct | INTEGER | Default 0 |
| health_pct | INTEGER | Default 0 |
| infrastructure_pct | INTEGER | Default 0 |
| defense_pct | INTEGER | Default 0 |
| social_pct | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | Default now() |

**RLS**: Aktif — policy "Users can manage own preferences" (ALL operations, auth.uid() = user_id)

### Tabel `forum_posts` ✅
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| user_id | UUID FK | → users, ON DELETE CASCADE |
| title | TEXT | Judul diskusi |
| content | TEXT | Isi diskusi |
| created_at | TIMESTAMPTZ | Default now() |

**RLS**: Aktif — SELECT (authenticated), INSERT/UPDATE/DELETE (auth.uid() = user_id)
**Catatan**: Kolom `likes_count` sudah di-DROP — likes dihitung dari tabel `post_likes`

### Tabel `forum_replies` ✅
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| post_id | UUID FK | → forum_posts, ON DELETE CASCADE |
| user_id | UUID FK | → users, ON DELETE CASCADE |
| content | TEXT | Isi balasan |
| created_at | TIMESTAMPTZ | Default now() |

**RLS**: Aktif — SELECT (authenticated), INSERT/DELETE (auth.uid() = user_id)

### Tabel `post_likes` ✅
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | Auto-generated |
| post_id | UUID FK | → forum_posts, ON DELETE CASCADE |
| user_id | UUID FK | → users, ON DELETE CASCADE |
| — | UNIQUE | UNIQUE(post_id, user_id) — cegah double like |

**RLS**: Aktif — SELECT (authenticated), INSERT/DELETE (auth.uid() = user_id)

### Trigger & Function ✅
- **Function**: `public.handle_new_user()` — menyalin data dari Auth ke tabel users
- **Trigger**: `on_auth_user_created` — jalan otomatis AFTER INSERT ON auth.users

---

## 💡 Keputusan Desain

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
- **Slider alokasi** max selalu 100 (posisi visual konsisten), sektor lain tidak bergerak saat digeser, nilai di-clamp di handleSlider
- **Upsert preferences** pakai `onConflict: 'user_id'` — satu user hanya boleh punya satu baris preferensi
- **Simulator history** disimpan di state lokal (bukan DB) — max 5 run, hanya untuk line chart tren dalam sesi aktif
- **Forum tidak anonymous** — nama user selalu ditampilkan, sesuai nilai transparansi TaxVoice
- **Likes dihitung dari tabel post_likes** — bukan cached column, agar akurat dan tidak race condition
- **Route /community/new** harus didefinisikan SEBELUM /community/:id di App.jsx
- **vercel.json** wajib ada untuk SPA — redirect semua URL ke index.html agar refresh tidak 404

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
### Fase 3: Preference Input & Simulator (Hari 29-42) ✅ SELESAI
### Fase 4: Community Forum (Hari 43-56) ✅ SELESAI

### Fase 5: Polish & Presentasi (Hari 57-73) ← SEKARANG
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
| Artikel tidak muncul di /knowledge | `activeCategory` default masih `'Semua'` bukan `'All'` | Ganti `useState('Semua')` → `useState('All')` |
| Badge warna artikel semua abu-abu | Key `categoryColors` masih bahasa Indonesia | Update key ke: tax, budget, transparency, development, guide, education |
| Label durasi masih Indonesia | `menit baca` tidak diupdate | Ganti ke `min read` |
| Slider sektor lain ikut bergerak | `max` slider dinamis menggeser track sektor lain | Ganti `max` jadi tetap 100, clamp nilai di `handleSlider` |
| Nama author Anonymous di /community | Tabel users tidak punya RLS policy SELECT | Tambah policy `users_public_read` (SELECT for authenticated) |
| Likes antar akun saling terhubung | `likesCount` diambil dari stale `post.likes_count` | Hitung COUNT langsung dari tabel `post_likes` di `fetchLikeStatus()` |
| Post tidak bisa diklik setelah drop kolom likes_count | `fetchPost()` di CommunityDetailPage masih select `likes_count` | Hapus `likes_count` dari select query di fetchPost() |
| 404 saat refresh halaman di production (Vercel) | Vercel cari file fisik sesuai URL, tidak ada → 404 | Buat `vercel.json` dengan rewrite semua URL ke index.html |
| `CreatePostPage is not defined` | Komponen dipakai di App.jsx sebelum dibuat filenya | Buat stub dulu `CreatePostPage.jsx` lalu import di App.jsx |

---

## 💬 Cara Pakai File Ini di Chat Baru

1. Buka chat baru dengan Claude
2. Tulis: *"Ini progress project TaxVoice saya:"*
3. Paste seluruh isi file PROGRESS.md ini
4. Lanjutkan dengan pertanyaan atau instruksi

Claude akan langsung memahami konteks penuh tanpa perlu dijelaskan dari awal.