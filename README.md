# SLICE STORM 🍉

### Slice. Combo. Survive.

SLICE STORM is a browser-based fruit-slicing arcade game combining
responsive swipe gameplay, Canvas rendering, multiple game modes, and
persistent player progression.

> **Status:** Active development\
> **Type:** Full-stack web game\
> **Frontend:** React, TypeScript, Redux Toolkit, Canvas API\
> **Backend:** Node.js, Express, MongoDB, Mongoose

## Table of Contents

-   [Overview](#overview)
-   [Game Modes](#game-modes)
-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [System Architecture](#system-architecture)
-   [End-to-End Flow](#end-to-end-flow)
-   [Game Engine Flow](#game-engine-flow)
-   [Authentication Flow](#authentication-flow)
-   [Session and Result Flow](#session-and-result-flow)
-   [Leaderboards and Dashboard](#leaderboards-and-dashboard)
-   [Frontend Routes](#frontend-routes)
-   [Backend API](#backend-api)
-   [Project Structure](#project-structure)
-   [Data Model](#data-model)
-   [Validation and Security](#validation-and-security)
-   [Environment Variables](#environment-variables)
-   [Local Development](#local-development)
-   [Deployment](#deployment)
-   [Engineering Notes](#engineering-notes)
-   [Roadmap](#roadmap)



## Overview

SLICE STORM pairs an arcade-style frontend with a backend for player
accounts and persistent game records. React and TypeScript power the UI,
while the Canvas API handles frame-by-frame gameplay. Redux Toolkit is
intended for shared application state; fast-changing fruit positions,
particles, and blade points should remain inside the game engine rather
than being dispatched through Redux on every frame.

The Express API is organized into routes, controllers, services,
validators, middleware, and Mongoose models. Authenticated endpoints
handle player-specific operations. In the supplied route configuration,
leaderboard endpoints do not apply `authMiddleware`.

### Goals

-   Responsive mouse and touch slicing.
-   Separate Canvas gameplay from ordinary React UI updates.
-   Offer Classic, Arcade, and Zen modes with distinct rules.
-   Persist completed results and player progression.
-   Provide global and mode-specific leaderboard views.
-   Support responsive desktop and mobile layouts.

## Game Modes

  -----------------------------------------------------------------------
  Mode                    Experience              Rules
  ----------------------- ----------------------- -----------------------
  **Classic**             Survival arcade         Score points, manage
                                                  lives, avoid bombs, and
                                                  avoid missing too many
                                                  fruits.

  **Arcade**              Fast timed gameplay     Aim for the highest
                                                  score before the
                                                  countdown ends.

  **Zen**                 Relaxed slicing         90-second timer, no
                                                  lives, no score, no
                                                  bombs, and no
                                                  missed-fruit penalty.
                                                  The result is the total
                                                  fruits sliced.
  -----------------------------------------------------------------------

Keep mode-specific rules in configuration instead of scattering mode
checks throughout rendering and physics code. Exact scoring, spawn
rates, and difficulty curves should match the actual game configuration.


## Features

### Gameplay

-   Mouse and touch swipe controls.
-   Canvas-based fruit rendering and movement.
-   Fruit slicing, split-half effects, and multi-fruit slicing.
-   Blade trail, particles, combo feedback, and sound effects.
-   Mode-specific timers, lives, penalties, and end conditions.
-   Pause/resume and end-of-session flow where supported by the current
    UI.

### Player experience

-   Registration, login, logout, and token refresh endpoints.
-   Protected player pages.
-   Dashboard summary and player statistics.
-   Completed-game history.
-   Global and mode-specific leaderboards.
-   Audio and gameplay settings UI.

### Engineering

-   Lazy-loaded pages for code splitting.
-   Redux Toolkit for shared client state.
-   Feature-oriented frontend organization.
-   Express route/controller/service separation.
-   Zod request validation middleware.
-   Mongoose persistence and centralized error-handling utilities.

## Technology Stack

### Frontend

  -----------------------------------------------------------------------
  Technology                          Responsibility
  ----------------------------------- -----------------------------------
  React                               UI and components

  TypeScript                          Static typing

  Redux Toolkit                       Shared client/application state

  React Router                        Routing and route guards

  Canvas API                          Real-time gameplay rendering

  GSAP                                UI animations where used

  Tailwind CSS / CSS                  Styling and responsive layout

  Axios                               HTTP client through configured API
                                      instance

  TanStack Query                      Use where configured for
                                      server-state fetching and caching;
                                      verify current hooks before
                                      assuming all features use it
  -----------------------------------------------------------------------

  ### Backend

  -----------------------------------------------------------------------
  Technology                          Responsibility
  ----------------------------------- -----------------------------------
  Node.js                             Runtime

  Express.js                          HTTP API

  MongoDB                             Persistent storage

  Mongoose                            Models and database queries

  TypeScript                          Backend type safety

  Zod                                 Request validation

  JWT / cookie utilities              Authentication support, according
                                      to the current implementation

  Shared middleware                   Authentication, validation, async
                                      handling, and errors
  -----------------------------------------------------------------------

  ## System Architecture

``` mermaid
flowchart TB
    Player["Player"]
    subgraph Client["React + TypeScript Client"]
        Router["React Router"]
        Guards["PublicRoute / ProtectedRoute"]
        Layouts["AuthLayout / GameLayout"]
        Pages["Landing, Auth, Arcade, Dashboard, History, Leaderboard"]
        State["Redux Toolkit: shared client state"]
        Hooks["Feature hooks and API modules"]
        Engine["Canvas Game Engine"]
        Render["Rendering: fruits, blade, particles"]
        Systems["Physics, collision, spawning, audio"]
    end
    subgraph Server["Express + TypeScript API"]
        Routes["API Routes"]
        Auth["Authentication Middleware"]
        Validate["Zod Validation Middleware"]
        Controllers["Controllers"]
        Services["Services"]
        Models["Mongoose Models"]
        Errors["Async Handler / Error Middleware"]
    end
    DB[("MongoDB")]
    Player --> Router --> Guards --> Layouts --> Pages
    Pages <--> State
    Pages --> Hooks
    Pages --> Engine
    Engine --> Render
    Engine --> Systems
    Hooks --> Routes
    Routes --> Auth
    Routes --> Validate
    Auth --> Controllers
    Validate --> Controllers
    Controllers --> Services --> Models
    Models <--> DB
    Controllers -. errors .-> Errors
```

### Architecture boundaries

1.  **UI:** pages, forms, overlays, HUD, and reusable components.
2.  **Feature API layer:** HTTP calls grouped by feature.
3.  **Feature hooks:** fetching, mutations, loading/error state, and
    cache invalidation where implemented.
4.  **Redux Toolkit:** shared client state, not per-frame physics
    objects.
5.  **Game engine:** timing, fruit/bomb objects, movement, collision,
    slicing, and particles.
6.  **Controllers:** translate HTTP requests into service calls and
    responses.
7.  **Services:** application/business logic.
8.  **Models/database:** persist users, sessions, and finalized game
    records.

## End-to-End Flow

``` mermaid
flowchart TD
    Start["Open SLICE STORM"] --> Landing["Landing page"] --> Auth{"Authenticated?"}
    Auth -- No --> Login["Login / Register"]
    Login --> Protected["Protected game area"]
    Auth -- Yes --> Protected
    Protected --> Select["Choose mode"]
    Select --> Session["Create game session"]
    Session --> Play["Run Canvas gameplay"]
    Play --> Finish["Game ends or timer expires"]
    Finish --> Submit["Submit result"]
    Submit --> Validate["Backend validates request and session"]
    Validate --> Save["Save game result and update player data"]
    Save --> Result["Show result / return to dashboard"]
    Result --> History["View history"]
    Result --> Leaderboard["View global or mode leaderboard"]
```

This is the intended product flow. Confirm exact request timing and
result-screen behavior against the current page and service
implementation.

## Game Engine Flow

``` mermaid
flowchart TD
    Input["Mouse / touch input"] --> Track["Track pointer positions"]
    Track --> Loop["requestAnimationFrame loop"]
    Loop --> Delta["Calculate frame delta"]
    Delta --> Spawn["Spawn objects from mode config"]
    Spawn --> Physics["Update position, velocity, gravity, rotation"]
    Physics --> Collision["Test swipe segment against active objects"]
    Collision --> Sliced{"Fruit sliced?"}
    Sliced -- Yes --> Split["Create two sliced halves"]
    Split --> Effects["Particles, blade feedback, sound, combo"]
    Sliced -- No --> Cleanup["Clean expired/off-screen objects"]
    Effects --> Cleanup
    Cleanup --> Render["Render background, fruit, effects, blade, HUD"]
    Render --> State{"Paused or session finished?"}
    State -- No --> Loop
    State -- Yes --> Stop["Stop or suspend active loop"]
```

### Engine responsibilities

-   **Spawner:** creates fruit according to mode and difficulty.
-   **Physics:** updates position using delta time, velocity, gravity,
    and rotation.
-   **Collision:** tests the line segment between previous and current
    pointer positions.
-   **Slicing:** marks the original fruit as sliced once, creates
    halves, and applies separation velocity.
-   **Particles:** creates and removes effects without retaining expired
    objects.
-   **Audio:** respects user settings and browser autoplay restrictions.
-   **Renderer:** clips drawing to canvas bounds and scales on viewport
    changes.
-   **Cleanup:** removes objects that have permanently left the play
    area and prevents sliced halves from reappearing as whole fruits.

## Authentication Flow

The supplied user router exposes registration, login, logout, token
refresh, and profile endpoints.

``` mermaid
sequenceDiagram
    actor Player
    participant UI as React Auth UI
    participant API as User API
    participant Auth as Auth Middleware
    participant Service as Controller / Service
    participant DB as MongoDB
    Player->>UI: Submit registration or login
    UI->>API: POST /api/users/register or /api/users/login
    API->>Service: Validate and process credentials
    Service->>DB: Read or create user
    DB-->>Service: User record
    Service-->>UI: Authentication response
    UI->>API: GET /api/users/profile
    API->>Auth: Authenticate request
    Auth->>Service: Continue authenticated request
    Service-->>UI: Profile response
```

**Security note:** this is a high-level flow. Token storage, refresh
rotation, cookie flags, password hashing, and response payloads depend
on the actual implementation. The diagram alone does not prove every
control is implemented.

## Session and Result Flow

``` mermaid
sequenceDiagram
    actor Player
    participant UI as Arcade UI
    participant Sessions as Game Session API
    participant Games as Game API
    participant DB as MongoDB
    Player->>UI: Choose mode and start
    UI->>Sessions: POST /api/game-sessions
    Sessions->>DB: Create session
    DB-->>Sessions: Session data
    Sessions-->>UI: Session identifier and data
    UI->>UI: Run Canvas gameplay
    Player->>UI: Finish game
    UI->>Games: POST /api/games with result
    Games->>DB: Persist completed game
    DB-->>Games: Saved game
    Games-->>UI: Result response
```

The supplied routes do **not** expose a separate `POST /complete`
endpoint. Result submission is represented by `POST /api/games`.


### Session endpoints

  ----------------------------------------------------------------------------------------------
  Method            Endpoint                                 Access            Purpose
  ----------------- ---------------------------------------- ----------------- -----------------
  `POST`            `/api/game-sessions`                     Authenticated     Create a game
                                                                               session

  `PATCH`           `/api/game-sessions/:sessionId/status`   Authenticated     Update session
                                                                               status, subject
                                                                               to validator
                                                                               rules
  ----------------------------------------------------------------------------------------------

### Game endpoints

  ----------------------------------------------------------------------------
  Method            Endpoint               Access            Purpose
  ----------------- ---------------------- ----------------- -----------------
  `POST`            `/api/games`           Authenticated     Save a game
                                                             result

  `GET`             `/api/games/history`   Authenticated     Retrieve the
                                                             current player's
                                                             history
  ----------------------------------------------------------------------------

For trustworthy records, the backend should verify session ownership,
allowed status transitions, duration, mode, plausible values, and
duplicate submissions. Confirm which checks are implemented in the
current service.

## Leaderboards and Dashboard

``` mermaid
flowchart LR
    Games[("Completed game records")]
    Users[("User records")]
    Global["Global leaderboard service"]
    Mode["Mode leaderboard service"]
    Dashboard["Dashboard summary service"]
    History["Game history service"]
    Global --> GlobalUI["Leaderboard page"]
    Mode --> GlobalUI
    Dashboard --> DashboardUI["Dashboard page"]
    History --> HistoryUI["History page"]
    Games --> Global
    Games --> Mode
    Games --> Dashboard
    Games --> History
    Users --> Global
    Users --> Mode
    Users --> Dashboard
```

### Leaderboard endpoints

  ----------------------------------------------------------------------------------
  Method            Endpoint                     Access in         Purpose
                                                 supplied router   
  ----------------- ---------------------------- ----------------- -----------------
  `GET`             `/api/leaderboards/global`   Public            Global
                                                                   leaderboard

  `GET`             `/api/leaderboards/:mode`    Public            Mode-specific
                                                                   leaderboard
  ----------------------------------------------------------------------------------

Global and mode-specific rankings can be queried from completed game
records; they do not inherently require separate highest-score fields
for each mode on the user document. Personal bests by mode can be
calculated from game records or stored as derived data with a defined
update strategy.

### Dashboard endpoint

  --------------------------------------------------------------------------------
  Method            Endpoint                   Access            Purpose
  ----------------- -------------------------- ----------------- -----------------
  `GET`             `/api/dashboard/summary`   Authenticated     Current player's
                                                                 dashboard summary

  --------------------------------------------------------------------------------

The exact summary fields are defined by `dashboard.service.ts` and the
dashboard controller.

## Frontend Routes

These routes are taken from the supplied React Router configuration.

  Route            Access      Layout         Page
  ---------------- ----------- -------------- ------------------
  `/`              Public      No wrapper     Landing
  `/login`         Public      `AuthLayout`   Login
  `/register`      Public      `AuthLayout`   Register
  `/terms`         Public      `GameLayout`   Terms of Service
  `/privacy`       Public      `GameLayout`   Privacy Policy
  `/safety`        Public      `GameLayout`   Arcade Safety
  `/support`       Public      `GameLayout`   Customer Support
  `/arcade`        Protected   `GameLayout`   Game
  `/dashboard`     Protected   `GameLayout`   Dashboard
  `/leaderboard`   Protected   `GameLayout`   Leaderboard
  `/history`       Protected   `GameLayout`   History
  `*`              Fallback    Error page     Not found

``` mermaid
flowchart TD
    Router["Browser Router"] --> Public["PublicRoute"]
    Public --> Landing["/"]
    Public --> Auth["AuthLayout"]
    Auth --> Login["/login"]
    Auth --> Register["/register"]
    Router --> Legal["GameLayout: public information"]
    Legal --> Terms["/terms"]
    Legal --> Privacy["/privacy"]
    Legal --> Safety["/safety"]
    Legal --> Support["/support"]
    Router --> Guard["ProtectedRoute"]
    Guard --> Protected["GameLayout"]
    Protected --> Arcade["/arcade"]
    Protected --> Dashboard["/dashboard"]
    Protected --> Leaderboard["/leaderboard"]
    Protected --> History["/history"]
    Router --> NotFound["* Error page"]
```

## Backend API

Assuming routers are mounted under `/api`, the supplied Express route
files expose these paths.

  ------------------------------------------------------------------------------------------------------
  Method            Endpoint                                 Auth                      Purpose
  ----------------- ---------------------------------------- ------------------------- -----------------
  `GET`             `/api/dashboard/summary`                 Required                  Dashboard summary

  `POST`            `/api/games`                             Required                  Save a game
                                                                                       result

  `GET`             `/api/games/history`                     Required                  Game history

  `POST`            `/api/game-sessions`                     Required                  Create session

  `PATCH`           `/api/game-sessions/:sessionId/status`   Required                  Update session
                                                                                       status

  `GET`             `/api/leaderboards/global`               Not applied in supplied   Global
                                                             router                    leaderboard

  `GET`             `/api/leaderboards/:mode`                Not applied in supplied   Mode leaderboard
                                                             router                    

  `POST`            `/api/users/register`                    Not required              Register

  `POST`            `/api/users/login`                       Not required              Login

  `POST`            `/api/users/logout`                      Required                  Logout

  `POST`            `/api/users/refresh-token`               Token handling is         Refresh access
                                                             implementation-specific   authentication

  `GET`             `/api/users/profile`                     Required                  Current player
                                                                                       profile
  ------------------------------------------------------------------------------------------------------

**Prefix note:** Express routers do not define their full URL prefix
themselves. Check `server.ts` or `app.ts` and update the paths if the
mount prefixes differ.

## Project Structure

This is a simplified representation based on the supplied VS Code
screenshots. Some nested files are omitted.

``` text
SLICE-STORM/
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── layout/
│       │   ├── routes/
│       │   │   ├── protectedRoutes.tsx
│       │   │   ├── publicRoutes.tsx
│       │   │   └── routes.tsx
│       │   ├── App.tsx
│       │   └── store.ts
│       ├── config/
│       │   └── axiosInstance.ts
│       ├── features/
│       │   ├── auth/
│       │   │   ├── api/
│       │   │   ├── hooks/
│       │   │   ├── state/
│       │   │   ├── ui/
│       │   │   └── validators/
│       │   ├── dashboard/
│       │   │   ├── api/
│       │   │   ├── hooks/
│       │   │   ├── state/
│       │   │   └── ui/
│       │   ├── games/
│       │   │   ├── apis/
│       │   │   ├── config/
│       │   │   ├── engine/
│       │   │   ├── hooks/
│       │   │   ├── rendering/
│       │   │   ├── systems/
│       │   │   └── ui/
│       │   ├── history/
│       │   ├── landing/
│       │   └── leaderboard/
│       ├── shared/
│       │   ├── components/
│       │   └── utils/
│       └── main.tsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   ├── public/
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

Treat the actual repository as the definitive source for exact filenames
and nesting.


## Data Model

The screenshots show Mongoose models for users, game sessions, and game
results. Confirm exact fields in the model files.

``` mermaid
erDiagram
    USER ||--o{ GAME_SESSION : starts
    USER ||--o{ GAME : records
    USER {
        ObjectId _id
        string name
        string email
        string avatar
        number highestScore
        number totalGames
        number totalFruitsSliced
        number highestCombo
        number averageScore
    }
    GAME_SESSION {
        ObjectId _id
        string sessionId
        ObjectId userId
        string mode
        date startedAt
        date expiresAt
        string status
    }
    GAME {
        ObjectId _id
        ObjectId userId
        string sessionId
        string mode
        number score
        number fruitsSliced
        number fruitsMissed
        number bombsHit
        number maxCombo
        number accuracy
        number duration
        date createdAt
    }
```

-   **User:** player identity and persistent profile/statistics.
-   **GameSession:** an individual attempt and its lifecycle.
-   **Game:** finalized result used by history, dashboard, and
    leaderboard queries.

A separate leaderboard collection is not required when rankings can be
queried from completed game records. Choose indexes based on real query
patterns and verify them with query plans.