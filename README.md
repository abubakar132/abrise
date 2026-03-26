# Abrise — AI-Powered Landing Page
**Built by Abu Bakar | Next.js + Gemini AI + Google Sheets + Email**

---

## 🚀 Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys (see below)
npm run dev
# → Open http://localhost:3000
```

---

## 🔑 Environment Variables (`.env.local`)

### 1. Gemini AI (Chatbot)
```
GEMINI_API_KEY=your_key_here
```
- Get free at: https://aistudio.google.com/app/apikey
- Model used: `gemini-1.5-flash` (free tier, fast)

### 2. Email Notifications (Gmail)
```
EMAIL_FROM=yourgmail@gmail.com
EMAIL_TO=abubakar@youremail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```
- Generate App Password: https://myaccount.google.com/apppasswords
- **Do NOT use your Gmail login password**

### 3. Google Sheets (Lead Database)
```
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```
**Setup steps:**
1. Go to Google Cloud Console → New Project
2. Enable Google Sheets API
3. Create Service Account → Download JSON key
4. Paste the entire JSON (as one line) into `GOOGLE_SERVICE_ACCOUNT_KEY`
5. Create a Google Sheet with columns: `Timestamp | Name | Email | Phone | Niche | Situation | Challenge | Budget`
6. Share the sheet with the service account email (Editor access)
7. Copy the Sheet ID from the URL

### 4. Calendly (Booking)
```
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/abubakar-abrise/discovery
```

### 5. WhatsApp Direct Link
```
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
```
Format: country code + number, no spaces, no +

---

## 📁 Project Structure

```
abrise/
├── pages/
│   ├── index.tsx          ← Main landing page
│   ├── _app.tsx
│   ├── _document.tsx
│   └── api/
│       ├── chat.ts        ← Gemini AI chatbot endpoint
│       └── capture-lead.ts← Lead → Google Sheets + Email
├── components/
│   ├── ChatWidget.tsx     ← Floating AI chat bubble
│   └── AuditForm.tsx      ← Lead capture form
├── styles/
│   └── globals.css        ← Full design system
├── .env.local.example     ← Copy to .env.local
└── next.config.js
```

---

## 🌍 Deployment (Vercel — Recommended, Free)

```bash
npm install -g vercel
vercel
```

Then in Vercel dashboard:
- Settings → Environment Variables → add all your `.env.local` keys
- Redeploy

Or connect your GitHub repo to Vercel for auto-deploys.

---

## 📊 Lead Flow Summary

```
Visitor lands → AI Chatbot qualifies → Fills Audit Form
                                              ↓
                              Google Sheets (auto-logged)
                              Email alert to Abu Bakar
                              WhatsApp link shown
                              Calendly booking CTA
```

---

## 🎨 Design System

- **Display font:** Playfair Display (serif, editorial luxury)
- **Body font:** Outfit (clean, modern)
- **Primary color:** #C9A84C (gold)
- **Background:** #09090B (near-black)
- **CSS Variables:** All in `styles/globals.css :root`

---

## 🛠 Customization

| What | Where |
|------|-------|
| Chatbot personality/context | `pages/api/chat.ts` → `SYSTEM_CONTEXT` |
| Lead form fields | `components/AuditForm.tsx` |
| Copy & content | `pages/index.tsx` |
| Colors & fonts | `styles/globals.css :root` |
| Testimonials | `pages/index.tsx` proof section array |
