# 📸 Bop Photobooth | Magical Studio Experience

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gesture_Trigger-00F2FF?style=for-the-badge&logo=tensorflow)](https://tensorflow.org/)

> **Elevate your memories with a touch of magic.** Bop Photobooth is a next-generation AI-powered studio experience that brings the famous Korean 4-cut photostrip style directly to your browser.

---

## ✨ Magic Key Features

### 🖐️ AI Gesture Control (Sequence: Wave → Fist)
No remote needed. Use your hands to command the studio.
- **Step 1:** Wave your open hand to prime the "Magic Ready" state.
- **Step 2:** Clench your fist (or pinch) to trigger the 3s starting countdown.
- **Safety First:** Prevents accidental captures by requiring the 2-step sequence.

### 📸 Automated Studio Session
- **Sequential Capture:** 4 shots taken automatically.
- **Smart Pacing:** 3s initial prep followed by 8s intervals between shots to change your pose.
- **Pro Flash:** High-intensity 1s white flash effect for that professional studio vibe.

### 🎨 K-Style Post-Production
- **Cinematic Filters:** Choose from *Natural, K-Retro, Beauty, Noir,* and *Magic*.
- **Custom Frames:** White Classic, Midnight Black, or Magical Violet themes.
- **Visual Fine-tuning:** Real-time brightness adjustment for the perfect glow.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine:** [MediaPipe Hands](https://mediapipe.dev/) + [TensorFlow.js](https://www.tensorflow.org/js)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **PWA:** Fully installable mobile experience.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (Supabase or Neon recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Coang2623/ptb.git
   cd ptb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Add your `DATABASE_URL`.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000/studio`.

---

## 📱 PWA Support

Bop Photobooth is designed as a **Progressive Web App**. For the best experience:
1. Open the production URL on your mobile browser.
2. Select "Add to Home Screen".
3. Enjoy a full-screen, app-like studio experience.

---

## 📜 Metadata & Branding

The final photostrip is optimized for high-quality printing and social sharing at a **720x1280 (Master PNG)** resolution.

Designed with ❤️ for the **BOP Magical Studio Experience**.

---
*© 2026 Antigravity AI Deployment Engine*
