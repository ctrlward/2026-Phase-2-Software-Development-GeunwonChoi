# AI Prompts & Development Log

## 1. Overview of Human-AI Collaboration & Role Division

- **Human Developer Role**:
  - Concept Definition: Defined the gamification productivity application concept inspired by the *Solo Leveling* webtoon system.
  - Requirement & Design Directions: Specified the Solo Leveling Glassmorphism System HUD theme (Electric Blue & Purple), Hunter Rank tiers, Quest/Badge mechanisms, custom login HUD title formatting, floating key button placement for quick admin auto-fill, and Admin Badge Vault auto-unlocking.
  - Final Verification & Governance: Directed architectural choices, performed runtime debugging, evaluated build and test suite results (xUnit & Vitest), and authorized incremental Git commits.
- **AI Agent Role (DeepMind Antigravity AI Agent)**:
  - Technical Architecture Proposals: Recommended tech stack choices with technical rationales.
  - Code Scaffolding: Generated C# .NET 8 Web API infrastructure, Entity Framework Core models, JWT authentication, React TypeScript components, Zustand state stores, and test suites.
  - Iterative Refinement & Debugging: Refactored UI layouts, adjusted backend business logic, and updated seed data based on human developer feedback.

---

## 2. Technical Recommendations & Rationales

| Component | Technology & AI Rationale | Human Developer Decision & Verification |
|---|---|---|
| **Backend API** | **C# .NET 8 Web API + EF Core (SQLite)**<br>Strong static typing, robust EF Core ORM entity mapping, and simplified local database file management. | **Approved** (Verified compliance with assessment specs) |
| **API Documentation** | **Scalar API UI (`/scalar`)**<br>Modern, interactive, and visually appealing API documentation interface replacing standard Swagger UI. | **Approved** (Verified at `http://localhost:5000/scalar`) |
| **Security & Auth** | **BCrypt + JWT Bearer + RBAC**<br>One-way salted password hashing, stateless Bearer token authorization, and role claims (`User` vs `Admin`) for strict endpoint protection. | **Approved** (Added DataAnnotations DTO input validation) |
| **State Management** | **Zustand (`useAuthStore`, `useThemeStore`, `useQuestStore`)**<br>Minimal boilerplate, zero prop drilling, instant reactivity, and seamless `localStorage` persistence. | **Approved** (Selected as Top 3 Advanced Feature) |
| **Testing Suite** | **xUnit (Backend) & Vitest (Frontend)**<br>Fast in-memory execution and isolated unit testing for backend services, controllers, React components, and state stores. | **Approved** (Achieved 100% test pass rate across 12 tests) |

---

## 3. Stage-by-Stage Prompt Log & Refinements

### Phase 1: Planning, Project Charter & Theme Integration
- **Human Developer Prompt**:
  > "Create a project charter and specification document for 'Leveling Alone', a gamified productivity web application inspired by Solo Leveling, inside the specs folder."
- **AI Agent Execution**: Generated `specs/01_project_charter.md` defining XP, Leveling, Daily Streaks, 8 Badge Vault achievements, and Top 3 Advanced Features.
- **Human Review**: Verified explicit alignment with MSA 2026 Phase 2 assessment criteria.

### Phase 2: System Architecture & Database Schema Design
- **Human Developer Prompt**:
  > "Document the system architecture and relational ERD database schema for Users, Quests, Badges, and UserBadges in specs/02_architecture_and_db.md."
- **AI Agent Execution**: Generated `specs/02_architecture_and_db.md` detailing foreign key relationships, unlock criteria (`QuestCount`, `Level`, `Streak`), and Hunter Rank tiers (`E-Rank` to `National-Level`).
- **Human Review**: Approved table structures and EF Core cascade delete constraints.

### Phase 3: Backend API, Security & Gamification Engine
- **Human Developer Prompt**:
  > "Scaffold a C# .NET 8 Web API with EF Core SQLite, BCrypt password hashing, JWT Bearer authentication, RBAC authorization, and Scalar API UI (/scalar)."
- **AI Agent Execution**: Built `AppDbContext.cs`, `AuthService`, `GamificationService`, `QuestService`, DTOs, controllers, and `Program.cs`.
- **Human Review**: Built project with `dotnet build`, validated JWT authentication endpoints, and checked Scalar UI.

### Phase 4: Frontend UI & Zustand State Management
- **Human Developer Prompt**:
  > "Build a React 18 + TypeScript + Vite SPA with Zustand stores for Auth, Theme, and Quests, a Glassmorphism Solo Leveling HUD theme, LevelUpModal animations, Dashboard, Badges, and Admin overseer pages."
- **AI Agent Execution**: Implemented Zustand stores (`useAuthStore`, `useThemeStore`, `useQuestStore`), custom HUD CSS (`index.css`), component suite, and page routes.
- **Human Review**: Executed `npm run dev` and verified desktop/mobile responsiveness and level-up modal animations.

### Phase 5: Automated Testing Suite
- **Human Developer Prompt**:
  > "Create backend xUnit test suites and frontend Vitest component and store unit test suites."
- **AI Agent Execution**: Created `software/backend.tests` (6 xUnit tests) and `software/frontend/src` (6 Vitest tests).
- **Human Review**: Verified 100% test execution via `dotnet test` (6/6 Passed) and `npm test` (6/6 Passed).

### Phase 6: Human Developer Design & Functional Refinements
- **Human Feedback 1 (Login Header Styling)**:
  > *Feedback*: "Change the main cyan neon heading on the login page to 'Access Leveling Alone System' and the subtext to 'system Authentication'."
  > *Execution*: Updated `LoginPage.tsx` with Orbitron HUD font styling and cyan glow text.
- **Human Feedback 2 (Floating Key Auto-fill Button)**:
  > *Feedback*: "Remove the inline admin auto-fill hint box from inside the login form and place a floating gold key icon button at the bottom-right corner of the page."
  > *Execution*: Removed inline container and implemented a fixed floating `<KeyRound />` button at `bottom: 1.5rem; right: 1.5rem;`.
- **Human Feedback 3 (Admin Badge Vault Unlocking & Navbar Formatting)**:
  > *Feedback*: "Ensure the Admin account has all 8 badges unlocked in the Badge Vault, and remove the (0) number indicator next to the Badges link in the top Navbar."
  > *Execution*: Added admin badge seed records in `AppDbContext.cs`, updated `GamificationService.cs` admin badge query logic, and cleaned up `Navbar.tsx` labels.

---

## 4. Critical Evaluation & Human Verification

- **Runtime Execution Verification**: Identified process file lock issues during C# recompilation, terminated active `Backend.exe` instances, performed clean builds with `dotnet build`, and restarted the server.
- **Automated Regression Prevention**: Re-ran Vitest (6/6 passed) and xUnit (6/6 passed) test suites after every code refactoring step to ensure zero regression errors.
- **Input Sanitization & Data Validation**: Inspected DTO models to ensure DataAnnotations (`[Required]`, `[EmailAddress]`, `[StringLength]`) prevent malicious payload injections.

---

## 5. Responsible AI Usage & Copyright Compliance

- **Open Source Licensing**: All icons (Lucide-React), fonts (Google Fonts Orbitron and Inter), and CSS design tokens utilize royalty-free, open-source licenses.
- **Academic Integrity**: All AI outputs were critically evaluated, debugged, tested, and documented in compliance with MSA 2026 Phase 2 guidelines.

---

## 6. Video Presentation Script Outline (6-Minute Submission Video)

- **Part 1: AI Usage & Collaboration (0:00 - 3:00)**
  - Introduce the DeepMind Antigravity AI Agent setup.
  - Explain how architectural recommendations (C# .NET 8, EF Core, Scalar UI, Zustand) were evaluated and accepted based on technical rationales.
  - Demonstrate prompt iteration logs and human feedback loops (UI refactoring, floating key button, admin badge vault).
- **Part 2: Design Decisions & Live Demonstration (3:00 - 6:00)**
  - Showcase the Glassmorphism Solo Leveling HUD theme (Dark & Light mode switcher).
  - Demonstrate quest creation, completion, streak multiplier calculation, level-up splash modal, and admin overseer panel.
