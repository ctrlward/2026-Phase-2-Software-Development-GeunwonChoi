# 📋 Project Charter: Leveling Alone

## 1. Executive Summary
**Leveling Alone** is a **gamification-based productivity and habit-tracking web application** designed for students and developers. 
Users register their daily study, task, and habit goals as "Quests." Upon completing quests, users earn Experience Points (XP), level up, and build streak records, maximizing their sense of achievement. 
The project draws inspiration from the iconic Korean webtoon *<Solo Leveling>*, incorporating quest pop-ups and system windows into the user interface.

---

## 2. Theme Alignment: Gamification
MSA 2026 Phase 2 centers around **Gamification**, which is integrated into the core application mechanics:

- **XP & Leveling System**: Experience points (XP) awarded based on quest difficulty, accompanied by a visual profile level-up progress bar.
- **Streak & Fire Boosters**: Consecutive daily achievements trigger dynamic flame effects with changing colors and XP bonus multipliers.
- **Badges & Achievements**: Unlockable badges earned upon meeting milestones (e.g., "First Quest Completed," "7-Day Streak," "Level 10 Reached").

---

## 3. Scope & Key Features

### 🔹 Basic Requirements
- **Backend (.NET 10 Web API + EF Core)**: 
  - *Rationale*: Selected for reliable business logic processing, database persistence via EF Core, and automated API documentation using Scalar.
  - Full RESTful CRUD APIs for User and Quest entities, Scalar API UI integration (`/scalar`), and xUnit unit tests.
- **Frontend (React + TypeScript)**: 
  - *Rationale*: Chosen for component reusability, strong type safety, and building a responsive Single Page Application (SPA).
  - Responsive SPA layout (Desktop & Mobile), React Router navigation (Dashboard, Badges), and Vitest unit tests.

### 🌟 Advanced Requirements (Selected 3 Features)
1. **Security Measures**
   - *Rationale*: Essential for protecting user credentials, preventing token tampering, and enforcing DTO input validation.
   - BCrypt/PBKDF2 password hashing, JWT-based authentication, Role-Based Access Control (RBAC), and DTO input validation.
2. **Support for Theme Switching (Dark / Light Mode)**
   - *Rationale*: Enhances UI immersion by supporting both a sleek Solo Leveling dark mode and a crisp light mode.
   - Modern Glassmorphism-inspired Dark and Light mode theme switcher.
3. **State Management Library (Zustand)**
   - *Rationale*: Selected to efficiently manage user auth state, theme preferences, and quest data globally without prop drilling.
   - Global state management for authentication, quest list, and theme preferences via Zustand.

---

## 4. Target Audience
- Students seeking motivation for daily study planning and habit management.
- Developers looking to manage their personal goals through an engaging, gamified interface.
