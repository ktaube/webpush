# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack web push notification system with VAPID-based push notifications. The application consists of:
- Backend: Bun server with SQLite database and web-push library
- Frontend: React 19 PWA with Vite bundler and TypeScript
- **Important**: Application only works when installed as a PWA for service worker registration

## Development Commands

### Initial Setup
```bash
# Install dependencies
bun install

# Generate VAPID keys (first time only)
npx web-push generate-vapid-keys

# Setup environment variables
cp env.examples .env
# Add your VAPID keys to .env file
```

### Build and Run
```bash
# Build frontend
bun run build

# Run development server (starts backend on port 8080 and frontend preview)
bun run dev

# Run backend only
cd backend && bun run start

# Run frontend development server
cd frontend && bun run dev

# Lint frontend code
cd frontend && bun run lint
```

## Architecture

### Backend Structure (`/backend`)
- **Entry point**: `index.ts` - Bun server on port 8080 with API routes
- **Database**: SQLite via `bun:sqlite` (located at `backend/db.sqlite`)
- **API Routes**:
  - `/api/subscribe` - Handle push subscription
  - `/api/subscribers` - Get all subscribers
  - `/api/message` - Send push notifications
  - `/api/user` - User management
  - `/api/user/:username` - User operations by username
- **Services**: Separated into `users/` and `subscriptions/` modules with routes and services
- **CORS**: Configured in `cors.ts`
- **VAPID**: Configuration in `lib/vapid.ts`

### Frontend Structure (`/frontend`)
- **Framework**: React 19 with TypeScript
- **Build tool**: Vite with PWA plugin
- **Service Worker**: Custom implementation in `src/sw.ts`
- **API Client**: Located in `src/api/`
- **Components**: In `src/components/`
- **Hooks**: Custom hooks in `src/hooks/`

### Database Schema
- **users**: `id`, `username`
- **subscriptions**: `id`, `username`, `endpoint`, `keys`, `created_at`, `updated_at`

## Important Conventions

### Bun Usage (from Cursor rules)
- Use `bun` instead of `node`, `npm`, `yarn`, or `pnpm`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`
- Use `bun test` instead of `jest` or `vitest`
- Bun automatically loads `.env` files (no need for dotenv)
- Use built-in Bun APIs:
  - `Bun.serve()` for HTTP server
  - `bun:sqlite` for SQLite
  - `Bun.file()` for file operations

### TypeScript Configuration
- Backend uses ESNext target with bundler module resolution
- Frontend uses Vite's TypeScript configuration
- Strict mode is enabled
- Allow importing `.ts` extensions

### Frontend Build Configuration
- PWA with manual service worker registration
- Base path set to `./` for relative URLs
- ESLint configured for React and TypeScript
- Service worker uses inject manifest strategy

## Environment Variables
- `VITE_VAPID_PUBLIC_KEY` - Public VAPID key (frontend)
- `VAPID_PRIVATE_KEY` - Private VAPID key (backend)

## Deployment
- Currently deployed via ngrok
- Frontend assets built to `frontend/dist/`
- Backend runs directly from TypeScript files with Bun