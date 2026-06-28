# 🚀 Proyecto Final - Backend (SGE Core API)

API REST para Sistema de Gestión E-Genealógico.

---

## 📋 Requisitos previos

- **Node.js** (v18+ recomendado)
- **npm** (viene con Node)

---

## ⚡ Instalación

```bash
# 1. Clonar el repo
git clone https://github.com/jrissiotti/proyecto-final-programacion-backend.git
cd proyecto-final-programacion-backend

# 2. Instalar dependencias
npm install
```

---

## 🏃‍♂️ Cómo correr

| Comando | Qué hace | URL |
|---------|----------|-----|
| `npm run dev` | Levanta en modo desarrollo (con ts-node) | http://localhost:3000 |
| `npm run build` | Compila TypeScript a `dist/` | - |
| `npm start` | Levanta la versión compilada (producción) | http://localhost:3000 |

---

## 🧪 Tests

```bash
npm test          # Corre tests con coverage
npm run test:watch    # Modo watch (se re-ejecutan al guardar)
npm run test:ci       # Para CI/CD
```

---

## 📖 Swagger / Documentación

Una vez levantado el servidor, la doc interactiva está en:

**http://localhost:3000/api-docs**

---

## 🔍 Health Check

```bash
curl http://localhost:3000/api/health
```

---

## 📁 Estructura clave

- `src/index.ts` — Punto de entrada
- `src/infrastructure/routes/` — Rutas API (`/api/personas`, `/api/eventos`)
- `src/infrastructure/swagger/` — Config de Swagger

---
