# PrepMate TODO

## ✅ PHASE 1 — Project Foundation (Completed)
- [x] Initial Next.js setup (App Router, Tailwind CSS, TypeScript)
- [x] Supabase integration (Auth, Database, Storage)
- [x] Layout design (Mobile-first, JamesOS aesthetic)

## ✅ PHASE 2 — Core Interview Engine (Completed)
- [x] Interview setup flow (Role, Experience, Count)
- [x] AI Question Generation (Mistral/Groq integration)
- [x] Real-time answer evaluation and feedback
- [x] Session persistence and state management

## ✅ PHASE 3 — Results & History (Completed)
- [x] Session summary screen with animations
- [x] Detailed history view with answer breakdown
- [x] Performance metrics and improvement tips

## ✅ PHASE 4 — Dashboard & Stats (Completed)
- [x] Dynamic dashboard with Recharts integration
- [x] Skill matrix (Radar Chart) and Trend analysis
- [x] Streak calculation and profile integration

## ✅ PHASE 5 — Navigation & Polish (Completed)
- [x] Sidebar with active state detection
- [x] Topbar with profile avatar and theme toggle
- [x] Skeleton loaders and page transitions
- [x] Confetti celebrations and score count-ups

## ✅ PHASE 6 — Advanced Design & Themes (Completed)
- [x] Full Dark/Light mode support (next-themes + Tailwind v4)
- [x] Readability audit and Light mode contrast fixes
- [x] Mobile responsiveness and independent scrolling
- [x] Settings page and Notifications center

---

## ✅ PHASE 7 — Natural Interaction (Completed)
*Turn PrepMate into a truly immersive coach.*

- [x] **Voice-to-Text (STT) Integration**
  - [x] Add "Record Answer" button using Web Speech API or OpenAI Whisper
  - [x] Implement real-time transcript preview in the answer box
  - [x] Add "Auto-Stop" when user finishes speaking
- [x] **AI Voice Coach (TTS)**
  - [x] Integrate ElevenLabs for high-quality professional voices
  - [x] Add "Speak Feedback" button on result cards
  - [x] Implement "Interactive Mode" where the AI speaks the questions automatically
- [x] **Natural Flow Enhancements**
  - [x] Add "Thinking..." animations while AI evaluates answers
  - [x] Implement "Interrupt Detection" (AI stops speaking if user starts)

## ✅ PHASE 8 — Personalization & Resumes (Completed)
*Tailor every session to the user's specific background.*

- [x] **Resume Engine**
  - [x] Create Resume Upload component (PDF/DOCX)
  - [x] Implement AI parsing to extract projects, skills, and experience
  - [x] Store parsed resume data in `profiles` table
- [x] **Customized Question Logic**
  - [x] Update AI prompts to ask questions specifically about the user's resume projects
  - [x] "Resume Roast": Add a specific notification/report about resume weak points
- [x] **Coach Personalities**
  - [x] Create "The Mentor" (Soft, encouraging)
  - [x] Create "The Technical Lead" (Strict, detail-oriented)
  - [x] Create "The HR Manager" (Focus on cultural fit)

## 🟢 PHASE 9 — Monetization & Pro Features
*The path to a sustainable product.*

- [ ] **Stripe SaaS Integration**
  - [ ] Create "Billing" page in settings
  - [ ] Implement Free vs. Pro tier logic (e.g. 3 free sessions, then Pro)
  - [ ] "Pro" badge in Topbar and Profile
- [ ] **Shareable Performance Reports**
  - [ ] Generate unique public URLs for session results
  - [ ] Create a "Recruiter View" optimized for external reading
  - [ ] PDF Export for session summaries
- [ ] **Advanced Analytics**
  - [ ] Comparison vs. "Average User" for specific roles
  - [ ] Detailed "Grammar & Pacing" analysis in feedback

## 🔴 PHASE 10 — Company Battle Paths
*The final frontier: Land the dream job.*

- [ ] **The "Google/FAANG" Track**
  - [ ] Specialized question bank for top-tier tech companies
  - [ ] Focus on specific "Leadership Principles" (Amazon style)
- [ ] **Interview Readiness Certificate**
  - [ ] Generate a "Ready for Interview" certificate after hitting 90% average
- [ ] **Interview Warm-up (PWA)**
  - [ ] Add offline-first "Flashcards" for quick technical review

## 🟡 PHASE 11 — The Career Suite (AI Resume Builder)
*Go from practiced candidate to hired professional.*

- [ ] **AI-Powered Resume Architect**
  - [ ] **STAR Bullet Refiner**: Auto-convert raw points into high-impact impact-driven metrics
  - [ ] **Resume-to-Interview Bridge**: Auto-suggest interview questions based on newly added resume projects
  - [ ] **Skill Validation**: "Verified by PrepMate" badges for skills demonstrated in top-scoring sessions
- [ ] **Template Gallery**
  - [ ] **The "Silicon Valley"**: Minimalist, high-readability tech template
  - [ ] **The "Executive"**: Bold, authoritative design for senior roles
  - [ ] **The "Creative"**: Dynamic, multi-column layout for designers/marketers
  - [ ] **The "Academic"**: Detailed, CV-style layout for research/education
- [ ] **Export & Optimization**
  - [ ] **Real-time PDF Generator**: High-fidelity export with CSS-to-PDF logic
  - [ ] **ATS Compatibility Scanner**: Real-time "Parseability Score"
  - [ ] **Job Description Tailoring**: Paste a job URL to auto-reorder bullets for maximum relevance
