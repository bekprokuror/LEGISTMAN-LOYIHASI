# LEGISTMAN — O'rnatish qo'llanmasi

## Kerakli narsalar (barchasi bepul)
- GitHub hisob: github.com
- Vercel hisob: vercel.com
- Supabase: allaqachon sozlangan ✓
- Telegram Bot: allaqachon yaratilgan ✓

---

## 1-QADAM: Supabase da jadval yarating

1. https://supabase.com ga kiring
2. Loyihangizni oching
3. Chap menuda "SQL Editor" ni bosing
4. Quyidagi kodni joylashtiring va "Run" bosing:

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  telegram_id text unique not null,
  full_name text,
  username text,
  phone text,
  purpose text,
  status text default 'pending',
  created_at timestamp default now()
);
```

---

## 2-QADAM: GitHub ga yuklash

1. github.com ga kiring → "New repository" bosing
2. Nom: `legistman`
3. "Create repository" bosing
4. Kompyuterda terminal/cmd oching:

```bash
cd legistman-papka
git init
git add .
git commit -m "LEGISTMAN birinchi versiya"
git remote add origin https://github.com/SIZNING_USERNAME/legistman.git
git push -u origin main
```

---

## 3-QADAM: Vercel ga deploy qilish

1. vercel.com ga kiring → GitHub bilan kiring
2. "New Project" → GitHub repo ni tanlang
3. "Environment Variables" bo'limiga quyidagilarni kiriting:

```
NEXT_PUBLIC_SUPABASE_URL = https://heokfdrfvrtwwumfqzke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_j_BTbZTycu-VUfSln7z8lg_aFjuGZl9
TELEGRAM_BOT_TOKEN = 8694445554:AAG0QdaNfy_HoC6wXeImTGUkPGuatT7HY80
TELEGRAM_ADMIN_ID = 7869342062
```

4. "Deploy" bosing → 2-3 daqiqa kutasiz
5. Sizga link beriladi: `legistman.vercel.app`

---

## 4-QADAM: Telegram Webhook ni ulash

Sayt tayyor bo'lgach, brauzerda quyidagi linkni oching
(SIZNING_DOMEN ni o'zgartiring):

```
https://api.telegram.org/bot8694445554:AAG0QdaNfy_HoC6wXeImTGUkPGuatT7HY80/setWebhook?url=https://SIZNING_DOMEN.vercel.app/api/webhook
```

Javob: `{"ok":true}` chiqsa — tayyor!

---

## Sayt sahifalari

| Sahifa | Link |
|--------|------|
| Bosh sahifa | legistman.vercel.app |
| Ro'yxatdan o'tish | legistman.vercel.app/register |
| Kirish | legistman.vercel.app/login |
| Kurslar | legistman.vercel.app/dashboard |
| Admin panel | legistman.vercel.app/admin |

## Admin panelga kirish
- legistman.vercel.app/admin ga boring
- Parol: sizning Telegram ID — `7869342062`
