# AI Interview Preparation Platform

A full-stack MERN application that generates personalized interview preparation reports using AI. Upload a resume (or write a quick self-description) alongside a target job description, and get a structured report with technical questions, behavioral questions, skill-gap analysis, and a day-by-day preparation plan — grounded entirely in your own background and the role you're targeting.

## Why this project exists

Most "AI wrapper" projects are a single prompt bolted onto a text box. This one is built around a harder problem: getting an LLM to reliably return **structured, schema-valid data** that a real application can persist, query, and render — not just display as raw text.

## Features

- **Cookie-based authentication** — JWT stored in an httpOnly cookie, with a server-side token blacklist so logout actually invalidates the session instead of just deleting a client-side token.
- **AI-generated interview reports** — resume PDF (parsed server-side) + self-description + job description are combined into a single Gemini API call.
- **Schema-constrained AI output** — the LLM's JSON schema is generated directly from a Zod schema (`zod-to-json-schema`), passed to the model as `responseJsonSchema`, and the raw response is re-validated against that same Zod schema before it's ever written to MongoDB. If the model returns something malformed, it's rejected before it reaches the database.
- **Report history** — every generated report is persisted per-user and retrievable by ID or listed chronologically.
- **Downloadable resume PDF** — generate a PDF export of a stored report.
- **Protected routes** — the frontend gates authenticated pages behind a route guard that restores session state via a `/get-me` check on load.

## Upcoming Features

* **AI Mock Interviews** — interactive, text-based mock interview sessions where the AI asks questions, evaluates candidate answers, and provides scores and personalized feedback.
* **Adaptive Follow-up Questions** — dynamically adjust follow-up questions based on the candidate's previous answers, strengths, and weaknesses.
* **Resume & Job Description Matching** — analyze the resume against a target job description to identify matched skills, missing skills, and relevant evidence from the candidate's background.
* **ATS-Style Resume Analysis** — provide resume scoring, missing keywords, and actionable suggestions for improving alignment with a target role.
* **Interview Progress Tracking** — track interview scores, weak areas, preparation progress, and performance across multiple interview sessions.
* **Personalized Preparation Tracking** — turn the generated preparation plan into an interactive checklist with task completion and progress tracking.
* **AI-Powered Answer Evaluation** — evaluate technical and behavioral answers for accuracy, completeness, clarity, and communication.
* **Voice-Based Mock Interviews** — support speech-to-text interview sessions for a more realistic interview experience.
* **Production Improvements** — add automated testing, rate limiting, structured logging, security hardening, caching, Docker deployment, and CI/CD.


## Tech stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs` for auth
- Google Gemini (`@google/genai`) for report generation
- Zod + `zod-to-json-schema` for request/response schema validation
- `multer` for resume file uploads, `pdf-parse` for text extraction
- `cookie-parser`, `cors`

**Frontend**
- React 19 + Vite
- React Router 7
- Axios (cookie-credentialed requests)
- Context API + custom hooks (`useAuth`, `useInterview`) for state management
- SCSS

## Project structure

```
Backend/
  src/
    app.js                  # Express app, middleware, route mounting
    config/database.js      # MongoDB connection
    controllers/            # auth.controller.js, interview.controller.js
    middlewears/             # auth.middleware.js, file.middlewear.js
    models/                  # user, interview report, token blacklist
    routes/                  # auth.routes.js, interview.routes.js
    services/ai.service.js   # Gemini call + Zod schema + prompt
  server.js

Frontend/
  src/
    features/
      auth/                  # context, hooks, pages, api service
      interview/              # context, hooks, pages, api service
    app.routes.jsx
    App.jsx
```

## Getting started

### Prerequisites
- Node.js ≥ 18
- A MongoDB connection string
- A Google Gemini API key

### Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

The API runs on `http://localhost:3000`.

### Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## API overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | Public |
| POST | `/api/auth/login` | Log in, sets httpOnly cookie | Public |
| GET | `/api/auth/logout` | Log out, blacklists the token | Public |
| GET | `/api/auth/get-me` | Restore session from cookie | Private |
| POST | `/api/interview` | Generate a new interview report (multipart: resume + fields) | Private |
| GET | `/api/interview` | List all reports for the logged-in user | Private |
| GET | `/api/interview/report/:id` | Fetch a single report | Private |
| POST | `/api/interview/resume/pdf/:id` | Generate a downloadable PDF for a report | Private |

