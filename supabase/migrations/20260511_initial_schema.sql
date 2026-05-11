-- Profiles table (extends Supabase Auth)
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

-- Sessions table
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

-- Answers table
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

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table answers enable row level security;

create policy "Users own their profile"
  on profiles for all using (auth.uid() = id);

create policy "Users own their sessions"
  on sessions for all using (auth.uid() = user_id);

create policy "Users own their answers"
  on answers for all using (auth.uid() = user_id);
