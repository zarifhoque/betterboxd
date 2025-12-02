# Movie Review API

A backend API for managing users and movie stories, with pagination, validation, and consistent responses.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Validation](#validation)
- [Logging](#logging)
- [Error Handling](#error-handling)

---

## Features

- CRUD operations for users and stories
- Pagination support (page/itemsPerPage, offset/limit, startAfter/limit)
- Input validation using [Zod](https://github.com/colinhacks/zod)
- Response transformation with [class-transformer](https://github.com/typestack/class-transformer)
- Centralized error handling
- Request logging middleware
- TypeScript-based, fully typed DTOs and schemas
- Health check endpoint
- Consistent JSON response format

---

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL with TypeORM
- Zod for validation
- class-transformer for DTO serialization
- Winston for logging

---

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd betterboxd
```

2. Install dependencies:

```
npm install
```

3. Configure environment variables:

```
cp .env.example .env
# update DB connection info, PORT, etc.
```

4. Initialize the database:

```
npm run typeorm:sync
```

## Running the Project

```
npm run dev
```

## API Endpoints

### Generic

- GET /api/v1/health

### Users

- GET /api/v1/users — Get all users (supports pagination via query params)

- GET /api/v1/users/:id — Get user by ID

- POST /api/v1/users — Create a new user

- PUT /api/v1/users/:id — Update user

  -DELETE /api/v1/users/:id — Soft delete user

### Stories

- GET /api/v1/stories — Get all stories (supports pagination)

- GET /api/v1/stories/:id — Get story by ID

- POST /api/v1/stories — Create a new story

- PUT /api/v1/stories/:id — Update story

- DELETE /api/v1/stories/:id — Soft delete story

### Pagination Query Parameters:

- page + itemsPerPage

- offset + limit

- startAfter + limit

Only one combination of pagination parameters can be used at a time and it may fail or pick any valid combination otherwise.

## Validation

- Input validation is handled using Zod schemas.

- Query params, body payloads, and URL params are validated via ValidationHandler middleware.

- Pagination parameters are strictly validated for correct combinations.

## Logging

- All requests pass through LoggerHandler middleware.

- Logging configuration is in config/Logger.ts using Winston.

- Supports info and debug logs.

## Error Handling

- Centralized via ErrorHandler middleware.

- Returns consistent JSON format:

```bash
{
  "success": false,
  "message": "Error description",
  "details": {...}
}
```

- Supports 404 for unmatched routes.

kR/tZBeh41cEyujc0cVSDeCROEcbua8TGxWaXE9/LabxjPMViO1CiyNcfGQtJIpqORv+BCmXDUOSacGNwW3i+8gutdoDU0m1zmkMyX3nrSl5r1/MV6tPI106jeJCQINxkhRc5i63I/rtuZlHeIZKWxIPltxpcYX2IzjkmIbeyAbwPjpJj2FJD8cst+Y0fgXmlPMyO6XFDxs+k4hkMuAJFLMLtixhhRCbS4bTiOnBUyvrMgHEEgZYpo0GZ5TEl/HWCbnA63CO7Gn+1u79nCCFzGBwdahxNYo+c5cPwZXyc4co8XCGsrjtyZLA5rEiL5KchdTQMRfAiz7KqL4DGdVnMyn3aNpmSEJDIR/06uOZb/KqqlBNKVK0S1Y2TKnlom6iJwrKCjpDNi3t3usZeIOgtTdfdNyG0DpTo+tQ1tfj4okYgQXO/QgJRd+lDKyoOCdEfiV/J5o3MdJodAkNDfW3BolJIFOohPYrqQPLfA2i23tKn6SBfxSlWAh1uFxcVDXbkYR6Nwhzq9qQhH89piOlXLmafsKglag5ioYwNh0HtPVU9jC762aL0my0h4Y9Z9lwZvE2n3TJ9tFVLqdgT2vBFEUlvvMs44zMvc4pa0zlI7JyZEdFKfuJyb4HhZYi4SOVxcUV8J5Qt1KTf962mMJiMXW8Qn5S9B2dzN6vMfPMp5GeE7u+HEzd/Oqn0eRR0xsnMKlMdQCXrjT42EiGIuGkV4VfPC9sVH8RLtKI9QpYXEhlPFbbVI9CKdci2OajF5dIw7IJco7WtszNkYSctFcKjwTTLeC15TLmp3SJITACnHk7mS61EYUS7CRuojxelm8MkJcDo9sDpKSB4hr30pExK99zo3S/nCOiBLU30sxumPvlhbnZfo3/Q+bF3EZCZxbw+h+DWB3ZLx5+HUvMZLG4JpF+5prOAU9qPMVgMQvDYtL8GG7WpMXkyHedCnZC1d05ndoa0SK4huameB0T70xfYlyKl6YQixyELBD1YL15p0ekPBr+4UvrLib2xIx1ziCY3IffUJYsMPLpXxTH1FRvREFmwpqNEgJyVKm90CdzftmQW67aRHSib9oae28D4USUjGx4RZLdq7dckRKNNM+kFRBqTYSeHyndt+OoC9ELsA4rU0tDZiSXC8Je8bEWaCWMbHymG2rhLM+worzVTWal2EUch56eIje8Nhv6lO2kY8+iFeW/HqwBhv+DwOo/quQaIBaeidSzfZ3o2NcUEjtFdFLjP/BxFc9YYinwqR0I2/e1RtfLKlKkv0dSvENOatuRiN9+8JMNooa0D9V48sE0e4WTQizd7NtxAaSgi7b64Mgu99HcDiflxs0FYlhelesasT7E5jbSKNK8bI6GXFQduIbh9lybp/HnZNh/h4F9odRqEhgv6qZEX0Q0fjMPaVkP
