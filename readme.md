# Nuxt-frontend-template

This is a template for a Nuxt-based frontend / admin UI.

## Features

- :busts_in_silhouette: User management
- :closed_lock_with_key: Login
- :sparkles: Profile
- :scroll: Activity
- :clipboard: Profile settings
- :unlock: Password reset flow
- :hammer: Settings
- :rocket: Live-status via websockets

## API

To build an API for this frontend, your api needs to fulfill the api-schema defined in [api-schema.md](https://git.aaa-soft.net/Triple-A/nuxt-frontend-template/src/branch/main/api-schema.md).

## Dev-environment

### Prerequisites

This template uses Bun as a package manager, Caddy as a proxy to proxy api requests to your backend, including websockets and Node.js as a runtime while in development.

- [Bun](https://bun.sh/)
- [Caddy](https://caddyserver.com/)
- [Node.js](https://nodejs.org/en/)

### Dev-server

To start the dev-server, follow these steps:

1. Start your backend on port 3000
2. Start the Nuxt frontend with `bun run dev`
3. Start Caddy locally with `caddy start`

You should now be able to go to [http://localhost:8080](http://localhost:8080) and see the Nuxt frontend.
