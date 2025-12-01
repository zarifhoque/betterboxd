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
