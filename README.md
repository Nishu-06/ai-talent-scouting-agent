# AI-Powered Talent Scouting & Engagement Agent

An AI-assisted recruitment workflow that turns a raw job description into a ranked shortlist. The app parses the JD, finds strong-fit candidates from a seeded database, simulates outreach to measure interest, and produces an explainable ranking based on Match Score and Interest Score.

## Features

- JD parsing for role, required skills, experience range, and location hints
- Explainable candidate matching with skill overlap and experience scoring
- Simulated recruiter-to-candidate conversations with interest assessment
- Final recruiter dashboard with ranked shortlist and talent tags
- OpenAI-backed flows with deterministic fallback logic for offline/demo use
- Clean React + Tailwind UI with loading states and recruiter-focused layouts

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express
- Data: JSON-backed seeded dataset
- AI: OpenAI API with graceful rule-based fallback

## Project Structure

```text
.
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- tailwind.config.js
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- data/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- index.js
|   `-- package.json
|-- docs/
|   |-- architecture.md
|   `-- sample-io.md
`-- README.md
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `server/.env` from `server/.env.example`.

```env
PORT=5000
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4.1-mini
CLIENT_URL=http://localhost:5173
```

The app still works without `OPENAI_API_KEY`. It will automatically switch to rule-based parsing and simulated responses for demo reliability.

### 3. Run locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### 4. Production build

```bash
npm run build
npm run start
```

## API

### `POST /api/jd/parse`

Input:

```json
{
  "jobDescription": "Senior React engineer with Node.js and AWS, 4+ years..."
}
```

Output:

```json
{
  "role": "Senior React Engineer",
  "skills": ["React", "Node.js", "AWS"],
  "experience": {
    "min": 4,
    "max": 7
  },
  "location": "Remote"
}
```

### `POST /api/match`

Input:

```json
{
  "jobDescription": "JD text..."
}
```

Returns parsed JD plus candidate matches with explanations.

### `POST /api/chat`

Input:

```json
{
  "candidateId": "cand-001",
  "jobDescription": "JD text..."
}
```

Returns simulated conversation, interest score, and updated ranking.

### `GET /api/results`

Returns latest ranked shortlist generated in the current session.

## Scoring Logic

- `matchScore = 0.7 * skillScore + 0.3 * experienceScore`
- `interestScore` is derived from openness, notice period, salary flexibility, and response sentiment
- `finalScore = 0.7 * matchScore + 0.3 * interestScore`

See [docs/architecture.md](/C:/Users/asus/Documents/New%20project/docs/architecture.md) for details.

## Demo Flow

1. Paste a JD on the home page.
2. Review extracted requirements and explainable matches.
3. Run interest assessment for candidates in the chat page.
4. Review the ranked shortlist in the dashboard.

## Screenshots

- Home page screenshot placeholder
- Candidate matching screenshot placeholder
- Chat simulation screenshot placeholder
- Final dashboard screenshot placeholder

## Deliverables Checklist

- Working prototype: local setup included above
- Public source repo: push this project to GitHub
- Demo video: record a 3 to 5 minute walkthrough
- Architecture diagram: included in `docs/architecture.md`
- Sample inputs/outputs: included in `docs/sample-io.md`

## Repo Access

Share repository access with:

- [hackathon-deccan-ai](https://github.com/hackathon-deccan-ai)

