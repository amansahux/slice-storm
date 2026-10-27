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