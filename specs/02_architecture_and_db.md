# System Architecture & Database Schema: Leveling Alone

## 1. System Architecture
Leveling Alone adopts a modern Layered Architecture with separate client and server responsibilities:

- Frontend Layer: React + TypeScript (Vite), React Router, Zustand State Management, Vitest Unit Tests
- Backend Layer: C# .NET 10 Web API, RESTful Controllers, Service Layer, EF Core DbContext, Scalar API UI (`/scalar`)
- Database Layer: Relational Database (SQLite/PostgreSQL) with Entity Framework Core ORM
- Security & Auth Layer: JWT Authentication, BCrypt/PBKDF2 Password Hashing, Role-Based Access Control (RBAC)

---

## 2. Database Schema

### Users Table
- Id (GUID / PK): Unique user identifier
- Username (string, Unique): User account name
- Email (string, Unique): User email address
- PasswordHash (string): Encrypted password
- Role (string): User role (User, Admin)
- Level (int): Current user level (Default: 1)
- CurrentXP (int): Current experience points
- RequiredXP (int): Experience points needed for next level up
- StreakCount (int): Current consecutive active days
- LastActiveDate (DateTime?): Date of last completed quest or activity
- CreatedAt (DateTime): Account creation timestamp

### Quests Table
- Id (GUID / PK): Unique quest identifier
- UserId (GUID / FK): Owner user ID
- Title (string): Quest title (e.g., "Solve 1 Algorithm Problem")
- Description (string?): Quest detailed description
- XPReward (int): Experience points awarded upon completion (Default: 50)
- Difficulty (string): Difficulty level (Easy, Medium, Hard)
- IsCompleted (bool): Completion status
- DueDate (DateTime?): Due timestamp
- CompletedAt (DateTime?): Completion timestamp
- CreatedAt (DateTime): Quest creation timestamp

### Badges Table
- Id (GUID / PK): Unique badge identifier
- Name (string): Badge name
- Description (string): Unlock criteria description
- IconUrl (string): Badge icon image path
- RequiredType (string): Unlock criteria type (Streak, Level, QuestCount)
- RequiredValue (int): Threshold value required for unlock

### UserBadges Table
- Id (GUID / PK): Mapping unique ID
- UserId (GUID / FK): User ID
- BadgeId (GUID / FK): Badge ID
- UnlockedAt (DateTime): Unlock timestamp

---

## 3. Detailed Badge Unlock Criteria

| Badge Name | Required Type | Required Value | Description |
|---|---|---|---|
| First Quest | QuestCount | 1 | Complete your very first quest |
| Quest Hunter | QuestCount | 10 | Complete 10 quests |
| Veteran Hunter | QuestCount | 50 | Complete 50 quests |
| E-Rank Awakening | Level | 2 | Reach Level 2 |
| S-Rank Monarch | Level | 10 | Reach Level 10 |
| Spark of Persistence | Streak | 3 | Maintain a 3-day streak |
| On Fire | Streak | 7 | Maintain a 7-day streak |
| Unstoppable Flame | Streak | 30 | Maintain a 30-day streak |

---

## 4. Data Flow & Mechanics

1. Quest Completion:
   - When a user completes a quest (`POST /api/quests/{id}/complete`), `IsCompleted` is set to true on the backend.
2. XP Award & Streak Calculation:
   - Checks `LastActiveDate`. If active on the consecutive day, `StreakCount` increases by 1.
   - Applies an XP bonus multiplier based on `StreakCount` (e.g., 1.5x XP for 7-day streak).
3. Level-Up Evaluation:
   - If `CurrentXP >= RequiredXP`, increments `Level`, carries over excess XP, and recalculates `RequiredXP`.
4. Badge Evaluation:
   - Automatically unlocks eligible badges in `UserBadges` matching the user's `Level`, `StreakCount`, or completed quest count.
