# Decisions

This document explains the key architectural and technical decisions made in this project.
It focuses on the reasoning behind design choices rather than implementation details.

---

## Project Scope

This application is intentionally designed as a **single-user, local-first Kanban board**.

There is no authentication, backend service, or remote database. All data lives entirely in the browser and is persisted using `localStorage`. This scope was chosen to keep the focus on frontend architecture, state modeling, and TypeScript correctness rather than backend integration or authentication workflows.

The project supports **multiple boards** for a single user. This allows more realistic data relationships and navigation patterns without introducing multi-user complexity.

---

## State Management

The application uses **React reducers** as the primary state engine.

Reducers were chosen because the state shape is non-trivial: boards contain tasks, tasks have statuses and ordering, and multiple interactions (add, edit, delete, drag, reorder) must update state predictably. A reducer-based approach makes all state transitions explicit and easier to reason about.

All actions are defined using **TypeScript discriminated unions**, ensuring:

- Compile-time safety for state updates
- Clear documentation of all allowed state transitions
- Separation of business logic from UI components

No external state management library is used to keep the architecture transparent and focused on core React and TypeScript fundamentals.

---

## Routing & Persistence

Routing is treated as part of the state model.

Each board is accessed via a dynamic route (`/board/[id]`), making the URL the source of truth for the currently active board. This allows direct linking, browser navigation, and refresh without losing context.

Application state is rehydrated from `localStorage` on load. Any state change that affects boards or tasks is persisted, ensuring data survives page reloads without requiring a backend.

Derived data (such as task counts or progress metrics) is calculated at runtime and not stored in state to avoid duplication and inconsistency.

---

## Non-Goals

The following features are intentionally out of scope for this project:

- User authentication or authorization
- Backend APIs or databases
- Real-time collaboration
- Cross-device synchronization

These features were excluded to maintain a clear focus on frontend system design, reducer logic, and type safety. They are considered suitable extensions for a future project rather than this foundation phase.

---
