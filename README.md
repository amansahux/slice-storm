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