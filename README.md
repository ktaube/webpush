# WebPush Demo Application

A full-stack web push notification system built with React, TypeScript, and Bun using the `web-push` library for VAPID-based notifications.

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) runtime

### Installation

1. Install dependencies:
```bash
bun install
cd backend && bun install
cd frontend && bun install
```

2. Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

3. Set up environment variables:
```bash
cp env.examples .env
```

Add your generated VAPID keys to `.env`:
```
VITE_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### Running the Application

```bash
bun run build
```

```bash
bun run dev
```

## Deployment

Currently deployed at: https://current-adapted-adder.ngrok-free.app/

## Important: PWA Installation Required

⚠️ **This application only works when installed as a Progressive Web App (PWA).**

1. Visit the deployed URL
2. Install the PWA using your browser's install prompt
3. Open the installed app to access push notifications

The PWA requirement is necessary for service worker registration and background notification handling.

## Architecture

- **Backend**: Bun + TypeScript + `web-push` library
- **Frontend**: React 19 + TypeScript + Vite + PWA
- **Database**: SQLite
- **Push Service**: VAPID-based web push notifications
