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

# 4. Install dependencies (runs prisma generate automatically)
npm install

# 5. Run database migrations
npx prisma migrate dev

# 6. (Optional) Seed the database
# npx prisma db seed

# 7. Start the development server
npm run dev
# Server will start on: http://localhost:3000
