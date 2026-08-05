# Leveling Alone - Gamified Productivity & Habit Tracker

> **MSA 2026 Phase 2 — Software Development Stream Assessment Submission**

---

## 📌 Project Overview

**Leveling Alone** is a gamification-based productivity and habit-tracking web application designed for students and developers. Inspired by the iconic webtoon *Solo Leveling*, the application turns daily tasks and habit goals into "Quests." When users complete quests, they earn Experience Points (XP), level up their profile, unlock achievement badges, and build daily active streak records with visual flame effects.

---

## 🎮 Relation to Theme: Gamification

This project directly aligns with the MSA 2026 assessment theme **Gamification** by integrating Human-Computer Interaction (HCI) game mechanics into personal productivity management:

- **XP & Leveling System**: Experience Points awarded upon completing quests, accompanied by an animated XP progress bar and dynamic Hunter Rank Tiers (`E-Rank` to `National-Level`).
- **Streak & Fire Boosters**: Daily active streaks trigger visual flame animations (Red, Blue, Purple, White) and apply XP reward multipliers (up to 2.0x).
- **Badge Vault & Achievements**: 8 unlockable badges automatically granted when meeting quest count, level, or streak milestones.

---

## ⭐ Advanced Requirements Checklist (Top 3 Features)

> [!IMPORTANT]
> This application implements the following 3 explicitly selected Advanced Requirements for marking:

### 1. 🔒 Security Measures
- **Password Hashing**: Passwords stored using `BCrypt.Net-Next` with standard work factor salt hashing.
- **JWT Authentication**: Secure stateless Bearer token authentication for all private API routes.
- **Role-Based Access Control (RBAC)**: User role claims embedded in JWT tokens.
- **DTO Data Validation**: Strict input sanitization and validation using DataAnnotations (`[Required]`, `[EmailAddress]`, `[StringLength]`).

### 2. 🌙 Support for Theme Switching (Light / Dark Mode)
- **Glassmorphism Design System**: Modern translucent glass panels with glow effects.
- **Dark Mode**: Electric Blue and Purple Solo Leveling System HUD theme.
- **Light Mode**: Crisp slate and royal cyan theme.
- **Persistence**: Theme selection persists in `localStorage` and toggles root HTML document classes smoothly.

### 3. 📦 State Management Library (Zustand)
- **Global Auth Store (`useAuthStore`)**: Manages user authentication, token storage, and profile state.
- **Global Theme Store (`useThemeStore`)**: Controls theme switching and DOM class toggling.
- **Global Quest Store (`useQuestStore`)**: Manages quest CRUD, completion events, and reward popup triggers without prop drilling.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: C# .NET 8 Web API, Entity Framework Core, SQLite Database (`leveling_alone.db`), **Scalar API UI** (`/scalar`).
- **Frontend**: React 18, TypeScript, Vite, React Router, Zustand, Lucide-React, Custom Glassmorphism CSS.
- **Testing**: xUnit (.NET Unit Tests), Vitest (React Component & Store Unit Tests).

---

## 🚀 Getting Started & Local Running

### Prerequisites
- .NET 8 SDK
- Node.js (v18+) & npm

### Running Backend API
```bash
cd software/backend
dotnet run
```
- Access API Documentation (Scalar UI): `http://localhost:5000/scalar`

### Running Frontend Application
```bash
cd software/frontend
npm install
npm run dev
```
- Access Frontend Application: `http://localhost:5173`

### Executing Unit Tests
```bash
# Backend Tests (xUnit)
cd software/backend.tests
dotnet test

# Frontend Tests (Vitest)
cd software/frontend
npm test
```

---

## 🤖 AI Usage Statement

AI assistance (DeepMind Antigravity AI Agent) was used throughout the project lifecycle to support:
- Architecture planning and database schema design (`/specs`).
- Scaffolding .NET Web API controllers, EF Core data contexts, and Zustand state stores.
- Generating glassmorphism CSS design system tokens and unit test suites.
- All AI-generated outputs were critically evaluated, debugged, tested via automated test suites (`xUnit` and `Vitest`), and documented in `specs/03_ai_prompts_log.md`.

---

## 💡 Self-Reflection

If undertaking this project again in a future iteration:
- I would implement real-time WebSockets (SignalR) to push instant notifications when friends or leaderboard competitors complete quests.
- I would add custom sound effects for quest completion and level-up events to further enhance HCI immersion.