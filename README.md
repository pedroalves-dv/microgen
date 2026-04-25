# Microgen — SEO Content Brief Generator

This project is a minimal FastAPI backend and Next.js frontend that uses the Google Gemini model (`gemini-2.5-flash`) via the `google-generativeai` Python SDK to generate structured SEO content briefs from a keyword.

Project layout:

- backend/: FastAPI app
- frontend/: Next.js + Tailwind UI

Quick start:

1) Backend

```bash
python3 -m pip install -r backend/requirements.txt
# ensure .env contains GEMINI_API_KEY=your_key (root .env is used)
uvicorn backend.main:app --reload --port 8000
```

cd /home/sang/projects/microgen/backend

## Create and activate the venv

```bash
python3 -m venv venv
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Start the server

### Backend

```bash
uvicorn main:app --reload
```

Next time you come back, you only need to re-activate it (the install step is one-time):

```bash
cd /home/sang/projects/microgen/backend
source venv/bin/activate
uvicorn main:app --reload
```

to deactivate venv in a terminal:

```bash
deactivate
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Notes:

- The backend loads the `GEMINI_API_KEY` from the root `.env` using `python-dotenv`.
- The frontend calls `http://localhost:8000/api/brief` — make sure the backend runs on port 8000.
