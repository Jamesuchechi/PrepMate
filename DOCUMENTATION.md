# PrepMate — Technical Documentation

**Version:** 1.0.0
**Event:** Nexa Hack 2026
**Category:** Education & Learning Platforms / Artificial Intelligence & Autonomous Systems

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Reference](#api-reference)
4. [AI Integration](#ai-integration)
5. [Authentication Flow](#authentication-flow)
6. [Feature Breakdown](#feature-breakdown)
7. [Development Methodology](#development-methodology)
8. [Scalability Design](#scalability-design)
9. [Real-World Applications](#real-world-applications)
10. [Future Roadmap](#future-roadmap)

---

## Architecture Overview

PrepMate is built on a modern JAMstack architecture optimized for speed of development, performance, and scalability.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│              Next.js 14 App Router + Tailwind        │
└────────────────────────┬────────────────────────────┘
                         │ HTTP / WebSocket
┌────────────────────────▼────────────────────────────┐
│                  NEXT.JS API ROUTES                  │
│         /api/generate-question                       │
│         /api/evaluate-answer                         │
└───────────┬─────────────────────────┬───────────────┘
            │                         │
┌───────────▼──────────┐  ┌───────────▼──────────────┐
│   GROQ & MISTRAL     │  │        SUPABASE           │
│                      │  │  PostgreSQL + Auth + RLS  │
│   (Question Gen +    │  │  (Users, Sessions,        │
│    Answer Eval)      │  │   Answers, Scores)        │
└──────────────────────┘  └──────────────────────────┘
```

**Why this stack:**

- **Next.js API routes** keep the GROQ API key server-side — never exposed to the client
- **Supabase Row Level Security (RLS)** ensures users can only ever access their own data
- **Vercel deployment** gives us zero-config CI/CD with automatic preview deployments on every push
- **Agentic Ai API** does the heavy cognitive lifting so we ship fast without sacrificing intelligence

---

## Database Schema

### `users` (managed by Supabase Auth)

Extended with a `profiles` table:

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  target_role text,          -- e.g. "Software Engineer"
  experience_level text,     -- "entry", "mid", "senior"
  current_streak integer default 0,
  longest_streak integer default 0,
  last_session_date date,
  created_at timestamp with time zone default now()
);
```

### `sessions`

One record per interview session:

```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  interview_type text,       -- "behavioral", "technical", "hr"
  role text,
  experience_level text,
  total_score numeric,       -- average across all answers in session
  question_count integer,
  duration_seconds integer,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
```

### `answers`

One record per question-answer pair within a session:

```sql
create table answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  question text not null,
  answer text not null,
  score_clarity integer,         -- 0-100
  score_confidence integer,      -- 0-100
  score_structure integer,       -- 0-100
  score_relevance integer,       -- 0-100
  overall_score integer,         -- weighted average
  feedback text,                 -- Agentic Ai's written feedback
  improvement_tip text,          -- single actionable tip from Agentic Ai
  created_at timestamp with time zone default now()
);
```

### Row Level Security Policies

```sql
-- Users can only read/write their own data
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table answers enable row level security;

create policy "Users own their profile"
  on profiles for all using (auth.uid() = id);

create policy "Users own their sessions"
  on sessions for all using (auth.uid() = user_id);

create policy "Users own their answers"
  on answers for all using (auth.uid() = user_id);
```

---

## API Reference

### `POST /api/generate-question`

Generates a contextual interview question using Agentic Ai.

**Request Body:**

```json
{
  "role": "Software Engineer",
  "experience_level": "entry",
  "interview_type": "behavioral",
  "asked_questions": [
    "Tell me about yourself",
    "What's your greatest weakness?"
  ]
}
```

**Response:**

```json
{
  "question": "Describe a time when you had to learn a new technology quickly under deadline pressure. What was your approach and what was the outcome?"
}
```

**Internal Agentic Ai Prompt:**

```
You are a senior hiring manager conducting a {interview_type} interview
for a {experience_level}-level {role} position.

Generate ONE interview question that:
- Is appropriate for the experience level
- Has NOT been asked before (avoid: {asked_questions})
- Follows best practices for {interview_type} interviews
- Is specific, realistic, and evaluable

Return ONLY the question. No preamble, no numbering.
```

---

### `POST /api/evaluate-answer`

Evaluates a candidate's answer using Agentic Ai and returns structured scores + feedback.

**Request Body:**

```json
{
  "question": "Describe a time when you had to learn a new technology quickly...",
  "answer": "During my internship, we had to migrate to React in two weeks...",
  "role": "Software Engineer",
  "experience_level": "entry",
  "interview_type": "behavioral"
}
```

**Response:**

```json
{
  "scores": {
    "clarity": 78,
    "confidence": 65,
    "structure": 82,
    "relevance": 90,
    "overall": 79
  },
  "feedback": "Your answer demonstrates strong relevance to the question and good use of the STAR framework. The situation and task were well-defined. The action section could be more specific — instead of 'I learned React', describe the actual steps: tutorials used, projects built, how you tested your knowledge. Your result was concrete and quantified which is excellent.",
  "improvement_tip": "Next time, add one specific metric or outcome number to your result — e.g., 'reduced load time by 30%' or 'shipped 3 days ahead of schedule'."
}
```

**Internal Agentic Ai Prompt:**

```
You are an expert interview coach evaluating a candidate's answer.

Role: {role}
Experience Level: {experience_level}
Interview Type: {interview_type}
Question: {question}
Answer: {answer}

Score this answer from 0-100 across four dimensions:
- Clarity: How clearly and concisely the answer communicates
- Confidence: How assured and decisive the language is
- Structure: How logically organized the response is (STAR method for behavioral)
- Relevance: How directly the answer addresses the question

Return ONLY valid JSON in this exact format:
{
  "scores": {
    "clarity": number,
    "confidence": number,
    "structure": number,
    "relevance": number,
    "overall": number
  },
  "feedback": "2-4 sentence detailed feedback string",
  "improvement_tip": "One specific, actionable improvement"
}
```

---

## AI Integration

### Model Choice

We use `Agentic Ai-sonnet-4-20250514` for both endpoints. It hits the right balance of intelligence and response speed for a real-time interview experience. Users should not wait more than 2-3 seconds for feedback.

### Prompt Engineering Decisions

**Question Generation:**

- We pass previously asked questions to prevent repetition within a session
- Role and experience level are injected directly to ensure calibration
- We instruct Agentic Ai to return _only_ the question — no formatting, no numbering — making parsing trivial

**Answer Evaluation:**

- We instruct Agentic Ai to return _only_ valid JSON — no markdown fences, no preamble
- Scores are integers 0-100 for clean visualization on the frontend
- The `improvement_tip` field is separated from `feedback` intentionally — one is analytical, one is immediately actionable
- We pass role and experience level so the bar Agentic Ai holds answers to is appropriate (an entry-level answer isn't held to a senior standard)

### Error Handling

All Agentic Ai API calls are wrapped in try/catch. On failure, the UI shows a graceful retry state rather than crashing the session. Partial sessions (incomplete due to errors) are still saved to the database so the user doesn't lose progress.

---

## Authentication Flow

```
User lands on /
        │
        ▼
   Supabase Auth
  (Email + Password)
        │
   ┌────┴────┐
   │         │
New User  Returning User
   │         │
   ▼         ▼
Profile   Dashboard
 Setup    (redirect)
   │
   ▼
Set Target Role +
Experience Level
   │
   ▼
Dashboard
```

Sessions are managed by Supabase's built-in session handling. JWT tokens are stored in httpOnly cookies via Next.js middleware for security.

---

## Feature Breakdown

### Interview Setup Screen

- User selects: Interview Type (Behavioral / Technical / HR), Target Role (dropdown with 20+ options), Experience Level (Entry / Mid / Senior), Number of Questions (5 / 10 / 15)
- All selections stored in session state and passed to API calls

### Live Interview Screen

- Question displayed prominently
- Large text area for answer input
- Word count indicator (encourages 150-300 word answers)
- "Submit Answer" triggers evaluation
- Scores animate in one at a time (Clarity → Confidence → Structure → Relevance → Overall)
- Feedback and improvement tip appear below scores
- "Next Question" generates a fresh question, avoiding repeats

### Progress Dashboard

- Line chart: Overall score trend across last 10 sessions
- Radar chart: Average breakdown across 4 dimensions (Clarity, Confidence, Structure, Relevance)
- Streak counter with calendar heatmap
- "Weakest Area" callout with a direct link to practice that dimension

### Session History

- List of all past sessions with date, role, type, score
- Expandable to review every Q&A pair with the original AI feedback
- Filter by interview type or date range

---

## Development Methodology

PrepMate was built in 72 hours using a feature-first, ship-first methodology:

1. **Core loop first** — The question → answer → feedback loop was built and working within the first 8 hours. Everything else is enhancement.
2. **API routes before UI** — Both Agentic Ai endpoints were tested via Postman before any frontend was built, ensuring the intelligence layer was solid.
3. **Mobile-first layout** — Tailwind breakpoints start small and scale up. The interview screen works on a phone.
4. **No premature optimization** — We used Supabase's client library directly rather than building abstraction layers. Speed of iteration over architectural purity.
5. **Continuous deployment** — Every commit to `main` auto-deployed to Vercel, giving us a live URL to test and share throughout the build.

---

## Scalability Design

| Concern                  | Our Approach                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| **API Rate Limits**      | Agentic Ai API calls are server-side only; we can implement per-user rate limiting via Redis if needed |
| **Database Load**        | Supabase PostgreSQL scales vertically with one click; RLS handles multi-tenancy natively               |
| **Frontend Performance** | Next.js static generation for marketing pages; dynamic routes only for authenticated app               |
| **Cost at Scale**        | Agentic Ai API costs ~$0.003 per evaluation; at 10,000 sessions/month that's ~$30 — negligible         |
| **Global Latency**       | Vercel's edge network serves the frontend from the nearest region automatically                        |

---

## Real-World Applications

**For Students:**

- Practice before internship and new-grad applications
- Build confidence through measurable, tracked improvement
- Access quality coaching regardless of university resources or geography

**For Universities:**

- White-label version for career centers to offer students
- Analytics dashboard for advisors to see which students need help
- Integration with job placement tracking

**For Bootcamps & Training Programs:**

- Built into curriculum as a graduation requirement
- Cohort-level analytics to identify common weaknesses
- Certification of interview readiness

**For Emerging Markets:**

- Students in regions without strong career infrastructure (e.g., Nigeria, India, Southeast Asia) get access to the same quality of interview prep as students at elite Western universities
- The gap between opportunity and preparation shrinks

---

## Future Roadmap

### v1.1 — Voice Mode

- Web Speech API integration for spoken answers
- Real-time transcription before evaluation
- Filler word detection ("um", "like", "you know") as an additional metric

### v1.2 — Company-Specific Prep

- "Practice for Google", "Practice for McKinsey" modes
- Company-calibrated question banks informed by public interview reports
- Culture fit questions tailored to each company's stated values

### v1.3 — Peer Mock Interviews

- Match two users for a live mock interview session
- One plays interviewer, one plays candidate
- Both get AI feedback at the end

### v2.0 — Full Career OS

- Resume analyzer that identifies likely interview questions
- Job description parser that generates a targeted prep plan
- Offer negotiation simulator

---

_Built with intention at Nexa Hack 2026._
