# AI Interview Preparation Platform

A full-stack MERN application that generates personalized interview preparation reports using AI.

Upload your resume or provide a short self-description along with a target job description. The application generates a structured interview preparation report containing technical questions, behavioral questions, skill-gap analysis, and a personalized day-by-day preparation plan.

The generated report is based on the user's background and the requirements of the target role.

## Live Demo

- Frontend: https://gen-ai-sepia-nu.vercel.app
- Backend API: https://gen-ai-backend-i7y9.onrender.com

## Why This Project Exists

Most AI-powered applications simply send a prompt to an LLM and display the returned text.

This project focuses on a more practical problem: generating structured, schema-valid AI output that can safely be stored in a database, queried later, and rendered consistently in the frontend.

The AI response follows a defined schema instead of being treated as unstructured text.

## Features

- JWT-based authentication with protected API routes
- Secure password hashing using bcrypt
- Automatic JWT attachment through a centralized Axios API client
- AI-generated personalized interview preparation reports
- Resume PDF upload and server-side text extraction
- Self-description and job-description based analysis
- Schema-constrained AI responses using Zod
- AI output validation before storing data in MongoDB
- Interview report history for each authenticated user
- Fetch individual reports by ID
- Download generated reports as PDF
- Protected frontend routes with session restoration
- Centralized authentication and interview state management

## Upcoming Features

- **AI Mock Interviews**  
  Interactive text-based mock interview sessions where the AI asks questions, evaluates answers, and provides personalized feedback.

- **Adaptive Follow-up Questions**  
  Dynamically generated follow-up questions based on previous answers, strengths, and weaknesses.

- **Resume and Job Description Matching**  
  Analyze how well a resume matches a target job description and identify matched and missing skills.

- **ATS-Style Resume Analysis**  
  Resume scoring, keyword analysis, and actionable suggestions for improving alignment with a target role.

- **Interview Progress Tracking**  
  Track interview scores, weak areas, preparation progress, and performance across multiple sessions.

- **Personalized Preparation Tracking**  
  Turn generated preparation plans into interactive checklists with progress tracking.

- **AI-Powered Answer Evaluation**  
  Evaluate technical and behavioral answers for accuracy, completeness, clarity, and communication.

- **Voice-Based Mock Interviews**  
  Support speech-to-text interview sessions for a more realistic interview experience.

- **Production Improvements**  
  Add automated testing, rate limiting, structured logging, security hardening, caching, Docker support, and CI/CD.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Context API
- Custom Hooks
- SCSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Google Gemini API
- Zod
- zod-to-json-schema
- Multer
- pdf-parse
- cookie-parser
- CORS

## Authentication Flow

The application uses JWT authentication.

After a successful login:

1. The backend generates a JWT.
2. The frontend stores the token locally.
3. The centralized Axios API client automatically attaches the token.
4. Protected requests include the following header:

```text
Authorization: Bearer <token>

GEN-AI/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── middlewears/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── file.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── interview.model.js
│   │   │   └── blacklist.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   │
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── api/
│   │   │   │   ├── context/
│   │   │   │   ├── hooks/
│   │   │   │   └── pages/
│   │   │   │
│   │   │   └── interview/
│   │   │       ├── api/
│   │   │       ├── context/
│   │   │       ├── hooks/
│   │   │       └── pages/
│   │   │
│   │   ├── components/
│   │   ├── app.routes.jsx
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── .env.example
│
└── README.md


Getting Started
Prerequisites

Make sure you have:

Node.js 18 or later
MongoDB database
Google Gemini API key

Sample environment configuration files are included in the project.

Clone the Repository
git clone https://github.com/mohammedmuqtadir41-cmyk/GEN-AI.git
cd GEN-AI
Backend
cd Backend
npm install
npm run dev

The backend runs on:

http://localhost:3000
Frontend

Open another terminal:

cd Frontend
npm install
npm run dev

The frontend runs on:

http://localhost:5173



API Overview
Method	Endpoint	Description	Authentication
POST	/api/auth/register	Create a new user account	Public
POST	/api/auth/login	Authenticate user and generate JWT	Public
POST	/api/auth/logout	Log out the authenticated user	Private
GET	/api/auth/get-me	Get the currently authenticated user	Private
POST	/api/interview	Generate a new interview preparation report	Private
GET	/api/interview	Get all reports for the authenticated user	Private
GET	/api/interview/report/:id	Get a specific interview report	Private
POST	/api/interview/resume/pdf/:id	Generate and download a report PDF	Private
Deployment

The application is deployed using:

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas


Future Improvements

The project currently focuses on the core interview preparation workflow.

Future development will focus on:

Automated testing
Rate limiting
Better error handling
Structured logging
Security improvements
Caching
Docker support
CI/CD pipelines
AI mock interviews
Resume analysis
Progress tracking



Author:
Mohammed Muqthadir Ahmed

GitHub: https://github.com/mohammedmuqtadir41-cmyk
```
