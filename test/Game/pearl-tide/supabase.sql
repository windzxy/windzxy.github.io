-- Pearl Tide optional cloud backend. Run in Supabase SQL editor.
-- Enable Email OTP in Authentication > Providers; configure Site URL and redirect allow-list.
-- Publish ONLY the publishable / anon key in the client; NEVER expose service_role.
create table if not exists public.pearl_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  constraint save_object check (jsonb_typeof(state) = 'object'),
  constraint save_size check (octet_length(state::text) <= 500000)
);
alter table public.pearl_saves enable row level security;
revoke all on public.pearl_saves from anon;
grant select, insert, update on public.pearl_saves to authenticated;
drop policy if exists "save_select_self" on public.pearl_saves;
create policy "save_select_self" on public.pearl_saves for select to authenticated using (auth.uid() = user_id);
drop policy if exists "save_insert_self" on public.pearl_saves;
create policy "save_insert_self" on public.pearl_saves for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "save_update_self" on public.pearl_saves;
create policy "save_update_self" on public.pearl_saves for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.pearl_scores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 18),
  score bigint not null check (score between 0 and 1000000000000),
  day integer not null check (day between 1 and 1000000),
  updated_at timestamptz not null default now()
);
alter table public.pearl_scores enable row level security;
revoke all on public.pearl_scores from anon;
grant select on public.pearl_scores to anon, authenticated;
grant insert, update on public.pearl_scores to authenticated;
drop policy if exists "score_public_read" on public.pearl_scores;
create policy "score_public_read" on public.pearl_scores for select to anon, authenticated using (true);
drop policy if exists "score_insert_self" on public.pearl_scores;
create policy "score_insert_self" on public.pearl_scores for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "score_update_self" on public.pearl_scores;
create policy "score_update_self" on public.pearl_scores for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Security limitation: the browser computes cash and scores. RLS enforces account ownership
-- and protects other people's saves, but it CANNOT verify gameplay or prevent cheating.
-- Before offering competitive/prize rankings, implement server-authoritative game actions
-- (purchase, random draw, crafting, sale) in Edge Functions or transactional SQL RPC;
-- prohibit client-side score writes and derive rankings from validated server events.
