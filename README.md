# PrepMate 🎯

### AI-Powered Interview Coach for Students

> Practice. Get brutally honest feedback. Walk into every interview ready.

---

## What is PrepMate?

PrepMate is an AI-powered interview preparation platform built for students who are serious about landing their first role. Instead of rehearsing in front of a mirror or paying for expensive coaching, students get a real-time AI interviewer that asks role-specific questions, evaluates their answers across multiple dimensions, and tracks their improvement over time.

No fluff. No filler. Just the practice that actually prepares you.

---

## The Problem

Most students go into interviews underprepared — not because they lack ability, but because they lack access to quality, repeatable practice. Mock interviews with friends are inconsistent. YouTube videos are passive. Career centers are overbooked.

PrepMate solves this by giving every student an always-available, infinitely patient, ruthlessly honest AI coach.

---

## Features

- **Role-Specific Question Generation** — Choose your target role (Software Engineer, Product Manager, Data Analyst, UX Designer, etc.) and get questions tailored to that track
- **Three Interview Modes** — Behavioral (STAR-method), Technical (concepts & problem-solving), and HR (culture fit & communication)
- **AI Answer Evaluation** — Every answer is scored across Clarity, Confidence, Structure, and Relevance with detailed written feedback
- **Progress Dashboard** — Visual tracking of scores across sessions so improvement is measurable, not imagined
- **Session History** — Review past answers and AI feedback to identify recurring weak spots
- **Streak & Motivation System** — Daily practice streaks to build the habit that compounds into confidence

---

## Tech Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Frontend        | Next.js 14 (App Router) + Tailwind CSS               |
| AI Brain        | GROQ Agentic Ai API (`Agentic Ai-sonnet-4-20250514`) |
| Auth & Database | Supabase (Auth + PostgreSQL)                         |
| Deployment      | Vercel                                               |
| Version Control | GitHub                                               |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- An GROQ API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/prepmate.git
cd prepmate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_GROQ_api_key
MISTRAL_API_KEY=your_MISTRAL_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start practicing.

---

## Project Structure

```
prepmate/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── interview/
│   │   ├── setup/
│   │   └── session/
│   ├── history/
│   └── api/
│       ├── generate-question/
│       └── evaluate-answer/
├── components/
│   ├── ui/
│   ├── interview/
│   └── dashboard/
├── lib/
│   ├── Agentic Ai.ts
│   ├── supabase.ts
│   └── utils.ts
├── types/
└── public/
```

---

## How It Works

1. **User signs up** and sets their target role and experience level
2. **Selects interview mode** — Behavioral, Technical, or HR
3. **AI generates contextual questions** using Agentic Ai, calibrated to role and level
4. **User types or speaks their answer**
5. **Agentic Ai evaluates the answer** and returns a score + detailed written feedback
6. **Scores are saved** to Supabase and visualized on the dashboard
7. **User repeats** until confident, tracking their arc over time

---

## Judging Alignment

| Criterion               | How PrepMate Delivers                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| **Design & Aesthetics** | Clean, modern UI with a professional product feel — not a hackathon demo                           |
| **Creativity**          | Turns a passive study habit into an active, measurable, AI-coached experience                      |
| **Real-World Utility**  | Every student applying for a job needs this. The market is massive and the pain is real            |
| **Scalability**         | Supabase + Vercel scales horizontally; Agentic Ai API handles any load                             |
| **Innovation**          | Goes beyond Q&A — multi-dimensional scoring and progress tracking make it genuinely differentiated |

---

## Team

Built at Nexa Hack 2026 in 72 hours.

---

## License

MIT
