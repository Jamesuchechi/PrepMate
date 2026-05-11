# PrepMate — Build Phases & Task Tracker

### Nexa Hack 2026 | 72-Hour Sprint

> This is our single source of truth. Every task lives here.
> Mark done with [x]. No task is too small to track — small tasks missed = demo broken.

---

## 🔴 PHASE 0 — Project Setup (Day 1, Hour 0-2)

The foundation. Nothing else starts until this is done.

- [x] Create GitHub repository (`prepmate`)
- [x] Initialize Next.js 14 project with TypeScript
  ```bash
  npx create-next-app@latest prepmate --typescript --tailwind --app
  ```
- [x] Install core dependencies
  ```bash
  npm install @supabase/supabase-js @supabase/ssr @GROQ-ai/sdk
  npm install recharts lucide-react clsx tailwind-merge
  ```
- [x] Set up `.env.local` with all required keys
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GROQ_API_KEY`
  - `MISTRAL_API_KEY`
- [x] Create `.env.example` (no real keys — safe to commit)
- [x] Set up Supabase project (free tier)
- [x] Run database migrations (schema from DOCUMENTATION.md)
  - [x] `profiles` table
  - [x] `sessions` table
  - [x] `answers` table
  - [x] Enable Row Level Security on all tables
  - [x] Add RLS policies
- [x] Connect repo to Vercel — auto-deploy on push to `main`
- [x] Confirm live URL is working (even if just a placeholder page)
- [x] Set environment variables in Vercel dashboard

**Phase 0 checkpoint: Live URL exists. Database tables exist. Keys are wired.**

---

## 🟠 PHASE 1 — Authentication (Day 1, Hour 2-4)

Users must be able to sign up and log in before anything else matters.

- [x] Create Supabase auth client utility (`lib/supabase.ts`)
- [x] Create Next.js middleware for session refresh (`middleware.ts`)
- [x] Build `/login` page (Integrated into Landing Page)
- [x] Build `/signup` page (Integrated into Landing Page)
- [x] Build `/onboarding` page
  - [x] "What role are you targeting?" dropdown
  - [x] "What's your experience level?" selector
  - [x] Submit creates `profiles` record in Supabase
  - [x] Redirect to `/dashboard`
- [x] Add logout functionality (button in nav)
- [x] Protect all `/dashboard`, `/interview`, `/history` routes — redirect to `/` if not authenticated

**Phase 1 checkpoint: Can sign up, log in, complete onboarding, and log out.**

---

## 🟡 PHASE 2 — AI Engine (Day 1, Hour 4-7)

The brain. Build and test this before touching the interview UI.

- [ ] Create GROQ client utility (`lib/Agentic Ai.ts`)
- [ ] Build `POST /api/generate-question` route
  - [ ] Accept `role`, `experience_level`, `interview_type`, `asked_questions[]`
  - [ ] Construct Agentic AI prompt (see DOCUMENTATION.md)
  - [ ] Return `{ question: string }`
  - [ ] Handle Agentic AI errors gracefully (return 500 with message)
- [ ] Build `POST /api/evaluate-answer` route
  - [ ] Accept `question`, `answer`, `role`, `experience_level`, `interview_type`
  - [ ] Construct Agentic AI prompt (see DOCUMENTATION.md)
  - [ ] Parse JSON response from Agentic Ai (strip any accidental markdown fences)
  - [ ] Return structured scores + feedback + improvement_tip
  - [ ] Handle parse errors (if Agentic Ai returns malformed JSON, retry once)
- [ ] **TEST BOTH ENDPOINTS with Postman or curl before moving on**
  - [ ] Test generate-question for 3 different roles
  - [ ] Test evaluate-answer with a weak answer and a strong answer — confirm scores differ meaningfully
  - [ ] Test evaluate-answer with an empty string — confirm graceful error

**Phase 2 checkpoint: Both API routes return correct data. Tested. Reliable.**

---

## 🟢 PHASE 3 — Core Interview Flow (Day 1, Hour 7-12)

The main event. This is what judges will actually use.

- [ ] Build `/interview/setup` page
  - [ ] Interview Type selector: Behavioral | Technical | HR (styled cards, not a dropdown)
  - [ ] Role input (pre-filled from profile, editable)
  - [ ] Experience level (pre-filled from profile, editable)
  - [ ] Number of questions: 5 | 10 | 15 (button group)
  - [ ] "Start Interview" button → creates session record in Supabase → navigates to `/interview/session/[id]`
- [ ] Build `/interview/session/[id]` page
  - [ ] On mount: fetch session details, generate first question via API
  - [ ] Display question in a prominent card
  - [ ] Large textarea for answer (min-height: 200px)
  - [ ] Word count indicator below textarea (target: 150-300 words)
  - [ ] "Submit Answer" button
    - [ ] Loading state while Agentic Ai evaluates (spinner + "Analyzing your answer...")
    - [ ] On response: animate scores in one by one (use CSS transitions)
    - [ ] Show Clarity, Confidence, Structure, Relevance scores as progress bars
    - [ ] Show Overall score large and centered
    - [ ] Show feedback paragraph below scores
    - [ ] Show improvement tip in a distinct callout box
    - [ ] Save answer + scores to `answers` table in Supabase
    - [ ] Update session's `total_score` (running average)
  - [ ] "Next Question" button (appears after feedback is shown)
    - [ ] Generates next question (passes previously asked questions to avoid repeats)
    - [ ] Increments question counter
    - [ ] Clears textarea and scores
  - [ ] Progress indicator: "Question 3 of 10"
  - [ ] When final question is answered:
    - [ ] Mark session as `completed: true` in Supabase
    - [ ] Show session summary screen (overall score, best answer, biggest weakness)
    - [ ] "View Dashboard" and "Practice Again" buttons
- [ ] Handle edge cases:
  - [ ] User refreshes mid-session → reload state from Supabase
  - [ ] Agentic Ai API fails → show retry button, don't lose the answer

**Phase 3 checkpoint: Full interview can be completed end-to-end. Data saves correctly.**

---

## 🔵 PHASE 4 — Dashboard (Day 2, Hour 0-4)

This is what makes PrepMate a _product_, not a demo. The judges need to see progress tracking.

- [x] Build `/dashboard` page
  - [x] Header: "Welcome back, [name]" + current streak counter
  - [x] "Start New Interview" CTA button (prominent, above the fold)
  - [x] Create authenticated shell with Sidebar and Topbar
  - [ ] **Score Trend Chart** (Recharts LineChart)
    - [ ] X-axis: Last 10 sessions (date labels)
    - [ ] Y-axis: Overall score (0-100)
    - [ ] Tooltip showing session details on hover
  - [ ] **Dimension Breakdown** (Recharts RadarChart)
    - [ ] 4 axes: Clarity, Confidence, Structure, Relevance
    - [ ] Shows average across all-time sessions
  - [x] **Stats Row**
    - [x] Total sessions completed
    - [x] Average overall score
    - [x] Best score ever
    - [x] Current streak (days)
  - [x] **Weakest Area Callout**
    - [x] Identify lowest average dimension
    - [x] "Your weakest area is Confidence. Practice a focused HR session to improve."
  - [x] **Recent Sessions** list (last 5)
    - [x] Date, role, type, score, link to full review
- [ ] Fetch all data in a single Supabase query on page load (join sessions + answers)
- [ ] Handle empty state (new user with no sessions) — show encouraging onboarding CTA

**Phase 4 checkpoint: Dashboard shows real data. Charts render. Empty state looks good.**

---

## 🟣 PHASE 5 — Session History (Day 2, Hour 4-6)

Judges will want to drill into past sessions to validate the product depth.

- [ ] Build `/history` page
  - [ ] List all sessions, newest first
  - [ ] Each session row: date, role, interview type, score badge, expand button
  - [ ] Expandable section per session: shows all Q&A pairs with scores and feedback
  - [ ] Filter by interview type (All | Behavioral | Technical | HR)
  - [ ] Filter by date range (This Week | This Month | All Time)
- [ ] Build `/history/[session_id]` page (full session review)
  - [ ] Session summary at top
  - [ ] Each answer displayed as a card:
    - [ ] Question
    - [ ] User's answer
    - [ ] Score breakdown (4 bars)
    - [ ] Feedback
    - [ ] Improvement tip

**Phase 5 checkpoint: All past sessions browsable. Drill-down works.**

---

## ⚪ PHASE 6 — Polish & Design (Day 2, Hour 6-12)

This is where good becomes great. Judges score on Design & Aesthetics. Don't skip this.

- [ ] **Global Design System**
  - [ ] Define color palette in `tailwind.config.ts` (dark navy + electric accent)
  - [ ] Typography: Import a distinctive font pair from Google Fonts
  - [ ] Consistent border radius, shadow, and spacing tokens
- [ ] **Landing Page** (`/`)
  - [ ] Hero section: headline, subheadline, "Start Free" CTA
  - [ ] Feature highlights (3 columns: Practice, Feedback, Track)
  - [ ] Social proof placeholder ("Built for students who are serious")
  - [ ] Footer with GitHub link
- [ ] **Navigation**
  - [ ] Clean top nav with logo, links, and user avatar dropdown
  - [ ] Mobile hamburger menu
  - [ ] Active link highlighting
- [ ] **Loading States**
  - [ ] Skeleton loaders for dashboard charts while data fetches
  - [ ] Spinner + message during AI evaluation
  - [ ] Optimistic UI where possible
- [ ] **Score Animations**
  - [ ] Scores count up from 0 to final value (CSS counter animation)
  - [ ] Progress bars animate width on reveal
  - [ ] Stagger the four dimension scores (50ms delay each)
- [ ] **Micro-interactions**
  - [ ] Button hover states
  - [ ] Card hover lift effect
  - [ ] Smooth page transitions
- [ ] **Mobile Responsiveness**
  - [ ] Test on 375px (iPhone SE)
  - [ ] Test on 768px (tablet)
  - [ ] Fix any layout breaks
- [ ] **Dark/Light mode** (if time permits — dark looks better in demos)

**Phase 6 checkpoint: Product looks like something a real company shipped.**

---

## 🔴 PHASE 7 — Pre-Submission QA (Day 3, Hour 0-6)

Break it before the judges do.

- [ ] **Full End-to-End Test**
  - [ ] Sign up as a brand new user
  - [ ] Complete onboarding
  - [ ] Run a full 5-question behavioral interview
  - [ ] Check all 5 answers saved correctly in Supabase
  - [ ] Check dashboard shows correct scores and charts
  - [ ] View session in history
  - [ ] Log out and log back in
- [ ] **Edge Case Tests**
  - [ ] Submit a 1-word answer — does Agentic Ai still return valid JSON?
  - [ ] Submit a very long answer (500+ words) — does it work?
  - [ ] Refresh mid-interview — does state restore?
  - [ ] Open on mobile — is anything broken?
- [ ] **Performance Check**
  - [ ] Lighthouse score > 80 on performance
  - [ ] No console errors in production
- [ ] **Content Review**
  - [ ] Check all copy for typos
  - [ ] Ensure all empty states have helpful messages
  - [ ] Ensure error messages are human-readable

**Phase 7 checkpoint: Zero known bugs. Product is stable.**

---

## 🎬 PHASE 8 — Submission (Day 3, Hour 6-11)

Execute like this is a product launch. Because it is.

- [ ] **Demo Video** (target: 2-3 minutes)
  - [ ] Script it before recording — no rambling
  - [ ] Show: landing page → sign up → setup interview → complete 3 questions → dashboard with scores
  - [ ] Narrate the problem first (30 seconds), then the solution
  - [ ] Record with OBS or Loom
  - [ ] Upload to YouTube (unlisted) or Loom
- [ ] **Final README review**
  - [ ] Confirm all install instructions are accurate
  - [ ] Confirm env variable names match actual `.env.local`
  - [ ] Add live demo URL
  - [ ] Add demo video link
- [ ] **Devpost Submission**
  - [ ] Project name: PrepMate
  - [ ] Tagline: "AI-Powered Interview Coach for Students"
  - [ ] Description: paste from README
  - [ ] Add demo video URL
  - [ ] Add GitHub repo link
  - [ ] Add live demo URL
  - [ ] Select categories: Education & Learning Platforms, Artificial Intelligence
  - [ ] Upload 3-4 screenshots (dashboard, interview screen, feedback screen, landing page)
  - [ ] Submit **at least 1 hour before deadline** — never in the last 5 minutes

**⏰ HARD DEADLINE: May 14, 2026 @ 11:00pm GMT+2**
**Our target submission: May 14 @ 9:00pm GMT+2 — 2-hour buffer**

---

## 🏆 WIN CONDITIONS

We win if we nail all of these:

1. **The demo video is compelling** — judges watch it and immediately understand the value
2. **The live product works** — judges can sign up and run an interview without hitting a bug
3. **The design looks professional** — it doesn't look like it was built in 3 days
4. **The AI feedback is genuinely good** — judges test it and the feedback surprises them with quality
5. **The documentation is thorough** — shows we think like engineers, not just hackers

---

_Stay focused. Ship the core. Polish the visible. Win._
