# Kisan Mitra AI 🌾
**Premium Full-Stack Agricultural AI Assistant & Direct Farm-to-Consumer Marketplace**

> *"Smarter Farming. Better Harvests. Direct to Your Customers."*

Kisan Mitra AI is an agricultural technology platform designed for farmers, producers, retailers, and consumers. It unites two capabilities:
1. **Multimodal AI Agricultural Assistant:** Computer-vision crop pathology diagnostics powered by `@google/genai` (Gemini 3.8 Flash) with safe biological guidance, organic formulations, and extension service links.
2. **Direct Farmer Marketplace:** A transparent marketplace connecting verified growers with consumers for fresh heirloom vegetables, fruits, indigenous millets, and pulses with 0% middleman commissions.

---

## Key Capabilities

### 1. AI Agricultural Assistant (Plant Doctor)
- **Visual Plant Diagnostics:** Upload plant photographs (JPG, PNG, WebP) of leaves, fruits, stems, or soil.
- **Multimodal Symptom Analysis:** Accurately identifies probable crop diseases (Early Blight, Late Blight, Wilts, Mildew), pest complexes (Whitefly, Aphids, Fruit Borers), and nutrient deficiencies (Zinc/Iron chlorosis).
- **Safe Next Steps & Integrated Pest Management (IPM):** Formulates organic remedies (Neem oil, Panchagavya, Jeevamrutha, Trichoderma viride) and long-term crop rotation plans.
- **Agricultural Safety Disclaimers:** Clearly distinguishes observations from inferences and guides farmers when to consult local Krishi Vigyan Kendra (KVK) officers.
- **Audio Voice Synthesis:** Listen to prescribed agronomic instructions with built-in voice readback.
- **Conversational Agronomist Chatbot:** Ask questions about soil health, sowing schedules (Kharif, Rabi, Zaid), and government programs (PM-KISAN, Soil Health Card).

### 2. Direct Agricultural Marketplace
- **30+ Authentic Agricultural Listings:** Fresh Desi Tomatoes, Pahari Potatoes, Nashik Red Onions, Sharbati Wheat, Yelakki Bananas, Alphonso Mangoes, Raw Turmeric, and Cold-Pressed Mustard Oil.
- **Grower Verification System:** Badges (✓ Verified Farmer) awarded based on farm location inspections and organic stewardship.
- **Dynamic Search & Filtering:** Live autocomplete, category filters, certified organic toggles, and price sliders.
- **3-Step Safe Checkout:** Delivery address collection, itemized order review, and safe test/demo payments (UPI Demo, Cash on Delivery, Kisan Pay Wallet).
- **End-to-End Fulfillment Lifecycle:** Order Placed → Confirmed → Preparing → Dispatched → Delivered.

### 3. Multi-Persona Experiences
- **Farmer Portal:** Manage inventory, add new produce listings, update fulfillment statuses, and track revenue charts.
- **Consumer Portal:** Browse produce, add to cart, save wishlists, write reviews, and track live delivery timelines.
- **Admin Oversight:** Verify farmer credentials, moderate listings, inspect platform revenue, and track regional plant disease trends.

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js, Express, TSX.
- **AI Engine:** Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` with resilient Agricultural Pathology Knowledge Engine fallback for out-of-the-box demo mode.
- **Database Schema:** MySQL 8.0+ / MariaDB relational architecture (`/database/schema.sql`).

---

## Quick Start Guide

### 1. Prerequisites
- Node.js 20+ installed
- NPM or PNPM

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/kisan-mitra-ai.git
cd kisan-mitra-ai
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate the values in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
DATABASE_URL="mysql://user:password@localhost:3306/kisan_mitra"
JWT_SECRET="kisan_mitra_secret_token_key"

# Supabase Database (Auto-connected)
VITE_SUPABASE_PROJECT_ID="errpumennbqcszbkpaai"
VITE_SUPABASE_URL="https://errpumennbqcszbkpaai.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_whjcU2mE-zp9R3VZqt-HGg_xJCvxrQZ"
```
*Note: Orders and sales listings automatically write to your Supabase project `errpumennbqcszbkpaai`. Run `/database/supabase_setup.sql` in your Supabase SQL Editor to establish `orders`, `sales`, and `products` tables.*

### 4. Running Locally
Start the full-stack development server on port 3000:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## Demo Personas

Switch between personas with one click in the top navigation bar:
- 👨‍🌾 **Ramesh Patel (Organic Farmer):** Producer in Nashik, Maharashtra cultivating heirloom tomatoes, onions, and palak.
- 🛒 **Priya Sharma (Consumer):** Health-conscious buyer in Bengaluru tracking farm orders.
- 🛡️ **Dr. Anand Rao (Administrator):** Agricultural officer overseeing farmer verification and disease trends.

---

## Agricultural Disclaimer

AI recommendations provided by Kisan Mitra AI are for informational and advisory guidance. For epidemic crop damage, rapid wilt spreading through irrigation lines, or regulatory quarantine pests, immediately consult your nearest Krishi Vigyan Kendra (KVK) or the National Kisan Call Centre at **1800-180-1551**.
