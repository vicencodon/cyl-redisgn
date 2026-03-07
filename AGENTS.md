# AGENTS.md

## Project overview

This repository contains the frontend redesign of the website:
https://cylcomplementos.com/

Current goal:
Create the initial frontend structure for a redesign proposal focused on:
- simplifying navigation
- reducing redundant submenus
- improving category browsing
- preparing better product filtering in future iterations

This is an early-stage prototype project.
Do not implement backend, authentication, database, payments, or deployment logic yet.

## Current scope

At this stage, work only on:
- project structure
- base frontend architecture
- reusable component organization
- initial page scaffolding
- documentation helpful for collaboration

Do not work on:
- database design
- domain migration
- hosting
- e-commerce backend
- payment systems
- real product integrations

## Tech stack

Use:
- React
- Vite
- Tailwind CSS

## Branching rules

- Never work directly on `main`
- Base branch for collaboration is `develop`
- Current working branch is `feature/initial-structure`
- Keep changes small, clear, and modular

## Code organization

Use a structure similar to:

- `src/components/`
- `src/pages/`
- `src/assets/`
- `src/styles/`
- `src/data/`
- `docs/`

Create reusable components whenever possible.

## Design direction

The redesign should aim for:
- cleaner navigation
- fewer nested menus
- clearer visual hierarchy
- modern and lightweight layout
- scalable structure for category and product pages later

Avoid:
- overly complex navigation
- unnecessary dependencies
- excessive placeholder logic
- backend assumptions

## Documentation rules

If you create files, prefer also updating documentation when helpful.
Keep README and docs aligned with the actual project structure.

## Task behavior

For early tasks:
- prioritize planning and structure over polishing
- use mock data only if needed
- keep naming clear and predictable
- do not overengineer

## First task context

The first task should focus on setting up the initial frontend structure for the redesign proposal, using the existing website only as a reference:
https://cylcomplementos.com/
