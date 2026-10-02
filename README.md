# ⚡ AeroSaaS (Vue 3 Edition) — Modern Project & Team Collaboration Platform

> **The Official Real-World Showcase & Starter Kit for [AeroJS](https://github.com/atifsoftware/AeroJS) with Vue 3 & Inertia.js**  
> Built with zero-dependency native SQLite, layered Full-Stack MVC, Active Record ORM, Vue 3 Composition API, and Tailwind CSS.

---

## ✨ Highlights & Architecture

- **Core Engine**: [AeroJS](https://github.com/atifsoftware/AeroJS) (ESM, zero external runtime dependencies)
- **Database**: Native Node.js SQLite (`node:sqlite` in Node.js >= 22.5.0) — zero native compile binaries
- **Presentation**: Single Page Application (SPA) powered by **Inertia.js + Vue 3**, **Tailwind CSS**, and **Vite**
- **Reactivity Model**: Vue 3 `<script setup lang="ts">` with fine-grained reactivity and optimistic UI updates
- **Active Record ORM**: Built-in AeroJS models (`User`, `Workspace`, `Project`, `Task`, `ActivityLog`, `Invitation`)
- **Security & Authorization**:
  - Scrypt-powered memory-hard password hashing (`Hash.make`, `Hash.verify`)
  - Cryptographic HMAC-signed Invitation URLs (`UrlSigner.sign`)
  - Multi-tenant workspace data scoping
- **Developer Experience**:
  - Interactive OpenAPI 3.0 / Swagger UI documentation at `/docs`
  - In-memory database migrations & seeders (`npm run seed`)

---

## 📸 Features & Views

| View | Description |
| :--- | :--- |
| **Authentication** | Dark-mode glassmorphic login and registration cards with 1-click demo auto-fill. |
| **Executive Dashboard** | Real-time project velocity metrics, priority workload breakdown, and team activity timeline. |
| **Projects Directory** | Multi-project cards with custom color themes, status badges, and dynamic progress bars. |
| **Sprint Kanban Board** | 5-column board (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`) with optimistic task status transitions. |
| **Global Tasks View** | Instant client-side search and multi-criteria filtering across all workspace initiatives. |
| **Team & Access Control** | Workspace members list with HMAC-signed expiring invitation link generator. |
| **Account Settings** | Profile management, display name customization, password changes, and 2FA status indicator. |

---

## ⚡ Quick Start

### 1. Requirements
- Node.js >= 22.5.0 (Recommended: Node 22 LTS or Node 24)

### 2. Setup & Database Initialization
```bash
# Clone and enter directory
cd AeroSaaS-Vue

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Run database migrations and seed realistic demo data
npm run seed
```

### 3. Start Development Server
```bash
# Starts both the AeroJS server (Port 3001) and Vite dev server:
npm run dev
```

### 4. Or Build & Run in Production Mode
```bash
npm run build
$env:APP_ENV="production"; npm run server
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Workspace Admin** | `alex@aerosaas.dev` | `secret123` |

---

## 📚 API Documentation

AeroSaaS Vue automatically publishes interactive Swagger OpenAPI documentation:
- **Swagger UI**: [http://localhost:3001/docs](http://localhost:3001/docs)
- **OpenAPI Specification**: [http://localhost:3001/openapi.json](http://localhost:3001/openapi.json)

---

## 📄 License

Open-source licensed under the [MIT License](LICENSE). Built with ❤️ for the **[AeroJS](https://github.com/atifsoftware/AeroJS)** ecosystem.
