
(Project overview)
 
This is a Complaint Management Portal built as part of a take-home assessment.
It allows authenticated users to create, view, search, edit, and escalate complaints.
The application follows a production-ready structure with modular code, proper error handling,
and optional testing.

(Business logic)

1. Escalation Rule — A complaint is auto-escalated if:
  o priority === HIGH and
  o status === NEW after 3 working days (exclude Saturdays and Sundays)
  from createdAt.

2. Rate Limit — A customer can submit max 5 complaints per rolling week (7
  calendar days). If exceeded, the API returns HTTP 429 with message: "Rate limit
  exceeded: max 5 complaints per customer per week".

4. Auto-High Priority — If title contains the word "urgent" (case-insensitive), server
  sets priority = HIGH regardless of the request body.

6. Validation —
  o title minimum length: 10 characters
  o description minimum length: 30 characters


(Database rules)

PostgreSQL used as DB.

Prisma as ORM.

Schema:

User → can have many complaints

Complaint → linked to one status & one priority

Status → NEW, ESCALATED, etc.

Priority → LOW, MEDIUM, HIGH


(Project Db Schema)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String      @id @default(uuid())
  name         String
  email        String      @unique
  passwordHash String      @map("password_hash")
  complaints   Complaint[]
}

model Complaint {
  id          String   @id @default(uuid())
  title       String
  description String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  userId String
  user   User   @relation(fields: [userId], references: [id])

  statusId String
  status   Status @relation(fields: [statusId], references: [id])

  priorityId String
  priority   Priority @relation(fields: [priorityId], references: [id])
}

model Status {
  id         String      @id @default(uuid())
  name       String      @unique
  complaints Complaint[]
}

model Priority {
  id         String      @id @default(uuid())
  name       String      @unique
  complaints Complaint[]
}

Backend Architecture Overview

This backend is a Complaint Management Portal.
It lets authenticated users create, view, update, search, and escalate complaints.
The app is built with Node.js, Express, TypeScript, and Prisma (PostgreSQL).

The code is modular, easy to maintain, and follows a clean structure:

Routes → define endpoints

Controllers → handle HTTP requests/responses

Services → contain business logic

Models → talk to the database

Middleware → authentication, error handling

Enums & Interfaces → type safety and consistency

src/
 ├── server.ts                 # Main entrypoint (Express server setup)
 ├── routes/                   # Route definitions
 │    ├── route.authenticate.ts
 │    ├── route.complaint.ts
 │    └── route.meta.ts
 ├── controllers/              # Handle HTTP requests/responses
 │    ├── controller.authenticate.ts
 │    └── controller.complaint.ts
 ├── models/                   # Database queries (Prisma)
 │    ├── model.authenticate.ts
 │    └── model.complaint.ts
 ├── services/                 # Business logic & rules
 │    ├── service.authenticate.ts
 │    └── service.complaints.ts
 ├── middleware/               # Middlewares
 │    ├── middleware.errorHandler.ts
 │    └── middleware.authenticate.jwt.ts
 ├── enums/                    # Constant values (status, priority, http codes)
 ├── interfaces/               # TypeScript interfaces
 ├── utils/                    # Helpers (error handling, date calc, etc.)


ORequest Flow)

Client sends a request (e.g., create a complaint).

1. Route matches the request path.

2. Middleware runs (auth check, validation, error handling).

3. Controller handles request and calls the service/model.

4. Service applies business rules (rate limit, validations, auto-priority, escalation).

5. Model queries the database using Prisma.

6. Response is returned to client.


Authentication

1. Uses JWT tokens (access + refresh).

2. Refresh token is stored in HttpOnly cookie.

3. Middleware middlewareJwtAuthenticator checks if user is logged in.

(Endpoints)

POST /api/v1/auth/login → login

GET /api/v1/refresh-token → refresh access token

DELETE /api/v1/logout → logout



(Error Handling)

Centralized with middlewareApiErrorHandler.
Errors return a JSON object with statusCode and message.

Example:

{
  "statusCode": 400,
  "message": "All fields are required"
}


Background Jobs

Function autoEscalateComplaints checks complaints that need escalation.

This can run:
On login, or As a cron job (scheduled task).


  
