# VedaAI – AI Assessment Creator

An AI-powered assessment creator that allows teachers to create assignments, generate question papers using AI (Groq LLM), and view/download the generated output as PDF.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Express.js, TypeScript, Node.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Queue** | BullMQ + Redis (Upstash) |
| **AI** | Groq Cloud (Llama 3.3 70B) |
| **Real-time** | Socket.io (WebSockets) |
| **PDF** | PDFKit |
| **State** | Zustand |

## Features

- **Create Assignment** – Upload reference material, set due dates, configure question types with count and marks per type
- **AI Question Paper Generation** – Background job processing via BullMQ, real-time progress via WebSockets
- **View Generated Paper** – Structured question paper with sections, difficulty tags, and a professional academic layout
- **Download as PDF** – Professional print-ready PDF export with custom student grid and marks layout
- **Assignment Management** – List, search, filter, and delete assignments with real-time feedback
- **My Library Workspace** – Access all completed assessment papers and view uploaded study references by tab selection
- **Dynamic Notification Badges** – Sidebar counts are synced in real-time with the database and auto-clear when visited
- **Mobile Navigation Drawer** – Responsive header layout with a hamburger-activated slide-over drawer
- **Settings Workspace** – Customize school credentials (logo, avatar, initials, location) stored in localStorage and rendered system-wide
- **Responsive & Premium Layout** – Avoids overflow and text wrapping issues on small mobile screens

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express + Socket.io server entry
│   │   ├── models/
│   │   │   ├── Assignment.ts     # Assignment schema with questionRows
│   │   │   └── QuestionPaper.ts  # Generated paper with sections/questions
│   │   ├── routes/
│   │   │   └── assignmentRoutes.ts  # REST API endpoints
│   │   ├── queues/
│   │   │   ├── queue.ts          # BullMQ queue setup
│   │   │   └── worker.ts         # Background worker for AI generation
│   │   └── services/
│   │       └── aiService.ts      # Groq LLM integration
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout with Sidebar + TopBar
│   │   │   ├── globals.css       # Theme tokens
│   │   │   ├── page.tsx          # Assignments list (empty + populated)
│   │   │   ├── create/page.tsx   # Create assignment form
│   │   │   └── assignment/[id]/page.tsx  # Generated paper output
│   │   ├── components/
│   │   │   ├── Sidebar.tsx       # Left sidebar navigation
│   │   │   ├── TopBar.tsx        # Top navigation bar
│   │   │   └── MobileNav.tsx     # Mobile bottom navigation
│   │   ├── store/
│   │   │   └── assignmentStore.ts  # Zustand state management
│   │   └── hooks/
│   │       └── useSocket.ts      # WebSocket hook for real-time updates
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Redis instance (Upstash recommended)
- Groq API key ([console.groq.com](https://console.groq.com))

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI, Redis URL, and Groq API key in .env
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assignments` | List all assignments |
| `POST` | `/api/assignments` | Create new assignment + enqueue AI generation |
| `GET` | `/api/assignments/:id` | Get assignment details + generated paper |
| `POST` | `/api/assignments/:id/regenerate` | Regenerate question paper |
| `DELETE` | `/api/assignments/:id` | Delete assignment and its paper |
| `GET` | `/api/assignments/:id/pdf` | Download question paper as PDF |
| `GET` | `/health` | Health check |

## Architecture

```
User → Frontend (Next.js) → REST API (Express) → MongoDB
                                    ↓
                              BullMQ Queue → Worker → Groq AI
                                    ↓
                              Socket.io → Real-time Progress → Frontend
```

1. Teacher creates an assignment via the form
2. Backend saves to MongoDB and enqueues a BullMQ job
3. Worker picks up the job, calls Groq AI with structured prompts
4. Progress updates are emitted via Socket.io in real-time
5. Generated paper is saved to MongoDB and displayed on the frontend
