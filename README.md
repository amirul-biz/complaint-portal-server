# Complaint Escalation Portal

## Description
This is a **Complaint Management Portal** built as part of a take-home assessment.  
It allows **authenticated users** to create, view, search, edit, and escalate complaints.  
The application follows a production-ready structure with modular code, proper error handling,  
and optional testing.

**Tech Stack**
- **Frontend:** Angular
- **Backend:** Node.js, TypeScript, Express, Prisma
- **Database:** PostgreSQL

## Features
- User authentication
- Create, view, search, and edit complaints
- Escalate complaints
- Modular code structure
- Business rules & validations as per requirements

## Deliverables
- Private Git repository with incremental commits
- `README.md` with setup/run instructions
- `ARCHITECTURE.md` explaining design choices and data model
- Optional unit/integration tests

---

## Getting Started

Follow these steps to set up and run the backend locally:

```bash
# 1. Clone the repository
git clone https://github.com/amirul-biz/complaint-portal-server.git

# 2. Enter the project folder
cd complaint-portal-server

# 3. Create an .env file (edit values after creation)
 "DATABASE_URL=\nJWT_SECRET=" > .env

DATABASE_URL="postgresql://postgres:somekey.supabase.co:5432/postgres"

JWT_SECRET="supersecretkey123"

PORT = '3000'

# 4. Install dependencies (runs prisma generate automatically)
npm install

# 5. Run database migrations
npx prisma migrate dev

# 6.  Seed the database to see see the credentials
# npx prisma db seed


Note that src\contants\constant.priority.enum.ts and Note that src\contants\contant.status.enum.ts
should be updated accordingly after seeding based on database row id

 sample

src\contants\constant.priority.enum.ts

export enum PriorityEnum {
  LOW = "057b3b69-0adc-4a8d-adf3-879f2ecea7de",
  MEDIUM = "d3995e7c-8563-4f56-ae7b-16f67cdc65ab",
  HIGH = "26597acd-df44-4278-8abe-6087dbc804f1",
}

Note that src\contants\contant.status.enum.ts

export enum StatusEnum {
  NEW = "0d01ca6a-2b5c-4b99-a666-4fad7431c501",
  IN_REVIEW = "5da5cf18-55a4-4606-bf1e-6cc3c1986477",
  ESCALATED = "cccae2de-ab00-42b2-8ca3-7c8e88d63d62",
  CLOSED = "e2f62db6-a77e-4923-b1c9-3d84055c1181",
}


# 7. Start the development server
npm run dev
# Server will start on: http://localhost:3000
