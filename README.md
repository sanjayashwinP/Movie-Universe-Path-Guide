# CineVerse — Ultimate Cinematic Universe Watch Tracker & Canon Explorer

> *"Your Complete Guide to Connected Cinematic Universes"*

**CineVerse** is an entertainment-grade web application engineered for discovering, understanding, and tracking movies, TV series, limited series, special presentations, animated projects, and upcoming releases across interconnected cinematic universes.

---

## 1. Architectural Philosophy: The Generic Canon Hierarchy

To strictly satisfy the core requirement that **no franchise-specific logic is hardcoded**, CineVerse uses an open, multi-franchise entity hierarchy:

```
Franchise
   └── Universe
         └── Timeline (Sacred, Branch, or Alternate)
               └── Saga (e.g. Infinity Saga, Multiverse Saga, Skywalker Saga)
                     └── Phase (e.g. Phase 1 - Phase 6)
                           └── Content (Movie, Series, Special Presentation, One-Shot)
```

- **Marvel (MCU)** is the primary featured universe with full Sacred Timeline, TVA 2012 branches, and Multiverse incursions.
- **Star Wars** and **DC Universe** are pre-seeded in the database to prove that adding a new universe is **purely a data operation**, requiring **zero code modifications**.
- **Graph-Based Canon Relationships**: Universes are interconnected graphs rather than simple linear lists (`PREREQUISITE`, `NEXT_WATCH`, `SPIN_OFF`, `CROSSOVER`, `ALTERNATE_VERSION`, `CONNECTED`).

---

## 2. Core Features & User Journeys

### "Where Does This Fit?"
Every project features an authoritative continuum breakdown:
- Franchise, Universe, Timeline designation (e.g., Earth-616 vs Earth-10005)
- Saga & Phase grouping
- Chronological Order #, Release Order #, and Timeline Order #
- Plain-English story explanation of where the project sits in the continuity

### Tailored Watch Journeys
Users can switch dynamically between 5 distinct viewing orders:
1. **Story Chronological Order**: Follows in-universe narrative timeline (starting with Captain America in 1942).
2. **Theatrical Release Order**: Experience the universe in the exact sequence it premiered in cinemas.
3. **Sacred Timeline Strict Order**: Excludes branch universes, focusing strictly on core continuity.
4. **Multiverse & Branches Order**: Visualizes branching timelines and variant dimensions.
5. **Saga by Saga Order**: Organizes viewing by overarching eras (Infinity Saga, Multiverse Saga).

### Personal Tracking & Series Progress
- **Instant Watch Status**: Mark movies, series, and specials as watched.
- **Episode & Season Tracker**: Check off individual episodes and seasons with percentage progress.
- **Smart Next Watch Recommendations**: Dynamically calculates what you should watch next based on your watch history and selected order mode.
- **Personal Watchlist**: Organize into *Want to Watch*, *Currently Watching*, *Completed*, and *Dropped* with personal ratings (1-10) and notes.

### Spoiler Protection & Official Streaming
- **Spoiler Shields**: Post-credit scenes, incursion teasers, and major plot reveals are blurred with one-click reveal protection.
- **Legal OTT Links Only**: Direct redirects to official streaming platforms (Disney+, Netflix, Max) with video quality badges (4K UHD, Dolby Vision, IMAX Enhanced). CineVerse never hosts copyrighted video.

### Administrative Governance & Data Sync
- **Role-Based Access Control (RBAC)**: Strict segregation between `ROLE_USER` and `ROLE_ADMIN` enforced via Spring Security and JWT.
- **Zero-Code Content Addition**: Administrators can create new movies, series, sagas, timelines, or entirely new franchises through an intuitive UI modal.
- **External Source Sync Layer**: Human-in-the-loop review pipeline for release date shifts and official studio announcements.
- **Immutable Audit Trail**: Tracks who changed what, previous vs. new values, and timestamps.

---

## 3. Technology Stack

### Backend
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 3.4.0
- **Security**: Spring Security 6 with JJWT (`io.jsonwebtoken 0.12.6`), stateless Bearer token authentication
- **Data Access**: Spring Data JPA with Hibernate ORM 6.6
- **Database**: H2 in-memory (development/test) / PostgreSQL (production)
- **Validation**: Jakarta Bean Validation (`hibernate-validator`)
- **Documentation**: Springdoc OpenAPI / Swagger (`jakarta-annotations 2.2.21`)

### Frontend
- **Framework**: React 18 + Vite 8
- **Routing**: React Router v6
- **HTTP Client**: Axios with automatic JWT injection interceptors
- **Icons**: Lucide React
- **Styling**: **Pure Vanilla CSS** design system (No Tailwind CSS)
  - Dark cinematic palette (`#07080c` core, `#0d0f18` surfaces)
  - Custom typography (`Cinzel`, `Outfit`, `JetBrains Mono`)
  - Glassmorphism, smooth micro-interactions, responsive timeline pins, loading skeletons, and toasts

---

## 4. Quick Start & Local Execution

### Prerequisites
- Java 21 JDK installed (`java -version`)
- Maven installed (`mvn -version`)
- Node.js 18+ and npm installed (`npm -version`)

### Step 1: Run the Spring Boot Backend

```bash
cd backend
mvn -o spring-boot:run
```

*The backend will automatically start at **`http://localhost:8080`**, initialize the schema, and seed the complete database.*

### Step 2: Run the Vite React Frontend

```bash
cd frontend
npm run dev
```

*The frontend dev server will start at **`http://localhost:5173`** with an automated proxy forwarding `/api` requests to `http://localhost:8080`.*

---

## 5. Pre-Seeded Demo Accounts

CineVerse provides **1-Click Demo Logins** directly inside the **Sign In** modal:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full Admin Dashboard, Content CRUD, Sync Approvals, Audit Logs |
| **Marvel Fan** | `marvel_fan` | `password123` | Personal Watchlist, Episode Tracker, Viewing Analytics |

---

## 6. Key REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT |
| `POST` | `/api/auth/register` | Register new user account |
| `GET` | `/api/franchises` | List all franchises and nested universes |
| `GET` | `/api/content` | Filter content by universe, timeline, saga, type, status |
| `GET` | `/api/content/{id}` | Content details, "Where Does This Fit", "Before & After" |
| `GET` | `/api/content/search?q={query}` | Global search across titles, actors, characters |
| `GET` | `/api/watch-orders/chronological`| Story chronological watch list |
| `GET` | `/api/watch-orders/release` | Theatrical release watch list |
| `GET` | `/api/watch-orders/main-timeline`| Sacred Timeline unbranched order |
| `POST` | `/api/user/watch/{contentId}` | Toggle watched state for a movie/series |
| `POST` | `/api/user/episodes/{id}/toggle`| Toggle episode watch state |
| `GET` | `/api/user/progress` | User personal watch statistics & hours |
| `GET` | `/api/user/recommendations` | Smart next-watch recommendation |
| `GET` | `/api/stats/overview` | Platform-wide content counts & universe breakdown |
| `POST` | `/api/admin/content` | Create new canonical project *(Admin only)* |
| `PUT` | `/api/admin/content/{id}` | Update project metadata with audit trail *(Admin only)* |
| `DELETE`| `/api/admin/content/{id}` | Archive/delete project *(Admin only)* |
| `GET` | `/api/admin/sync/pending` | Review pending external source updates *(Admin only)* |
| `POST` | `/api/admin/sync/approve/{id}`| Approve and publish external update *(Admin only)* |
| `GET` | `/api/admin/audit-logs` | Retrieve chronological audit history *(Admin only)* |

---

## 7. How to Add New Franchises Without Code Changes

To add a new franchise (e.g. *Harry Potter / Wizarding World*, *Lord of the Rings*):

1. Log in with the **Admin** account (`admin` / `admin123`).
2. Navigate to the **Admin Dashboard** (`/admin`).
3. Click **"Add New Project"**:
   - Enter title (e.g. *Fantastic Beasts and Where to Find Them*).
   - Select Franchise: *Wizarding World*.
   - Select Universe: *Wizarding World Canon*.
   - Select Timeline & Era.
   - Enter Chronological, Release, and Timeline order positions.
   - Attach official streaming platforms (e.g. *Max*).
4. Click **"Publish to Canon"**.

The project immediately becomes available on **Home**, **Explore**, **Watch Orders**, **Timelines**, and **Search** across the entire application without recompiling any code!

---

## 8. License & Copyright Notice

CineVerse is an informational discovery and canon tracking system. All trademarks, characters, artwork, posters, and production metadata remain the property of their respective copyright holders (Marvel Studios, The Walt Disney Company, Lucasfilm Ltd., DC Studios, Warner Bros. Discovery). CineVerse does not host or distribute copyrighted video media.
