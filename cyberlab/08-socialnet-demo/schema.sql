-- SocialNet: schema Supabase
create extension if not exists pgcrypto;

create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 username text unique not null,
 display_name text not null default 'CyberUser',
 bio text not null default '',
 avatar_url text,
 is_private boolean not null default false,
 show_stats boolean not null default true,
 moderation_status text not null default 'active' check(moderation_status in('active','restricted','suspended')),
 role text not null default 'user' check(role in('user','moderator','admin')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.user_stats(
 user_id uuid primary key references auth.users(id) on delete cascade,
 xp integer not null default 0 check(xp>=0),
 level integer not null default 1,
 streak_days integer not null default 0,
 posts_created integer not null default 0,
 quiz_completed integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.posts(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 body text not null check(char_length(body) between 1 and 1200),
 kind text not null default 'text' check(kind in('text','quiz','challenge','poll')),
 visibility text not null default 'public' check(visibility in('public','followers','private')),
 metadata jsonb not null default '{}'::jsonb,
 status text not null default 'visible' check(status in('visible','hidden')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.likes(
 post_id uuid not null references public.posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(post_id,user_id)
);
create table if not exists public.comments(
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(char_length(body) between 1 and 800),
 status text not null default 'visible' check(status in('visible','hidden')),
 created_at timestamptz not null default now()
);
create table if not exists public.follows(
 follower_id uuid not null references auth.users(id) on delete cascade,
 following_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(follower_id,following_id),
 check(follower_id<>following_id)
);
create table if not exists public.blocks(
 blocker_id uuid not null references auth.users(id) on delete cascade,
 blocked_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(blocker_id,blocked_id),
 check(blocker_id<>blocked_id)
);
create table if not exists public.reports(
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references auth.users(id) on delete cascade,
 target_type text not null check(target_type in('post','comment','profile')),
 target_id uuid not null,
 reason text not null,
 details text not null default '',
 status text not null default 'open' check(status in('open','investigating','resolved','dismissed')),
 moderator_id uuid references auth.users(id) on delete set null,
 moderator_note text not null default '',
 created_at timestamptz not null default now(),
 resolved_at timestamptz
);
create table if not exists public.moderators(
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.notifications(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 type text not null,
 payload jsonb not null default '{}'::jsonb,
 is_read boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.specializations(
 slug text primary key,
 family text not null,
 name text not null unique,
 description text not null default ''
);
create table if not exists public.user_specializations(
 user_id uuid not null references auth.users(id) on delete cascade,
 specialization_slug text not null references public.specializations(slug) on delete cascade,
 xp integer not null default 0,
 level integer not null default 1,
 updated_at timestamptz not null default now(),
 primary key(user_id,specialization_slug)
);
create table if not exists public.quiz_attempts(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 quiz_slug text not null,
 score integer not null check(score between 0 and 100),
 correct_count integer not null,
 total_count integer not null,
 specialization_slug text references public.specializations(slug),
 attempt_day date not null default current_date,
 created_at timestamptz not null default now()
);

insert into public.specializations(slug,family,name) values
('blue-team','Défense','Défense opérationnelle'),('soc','Défense','Security Operations Center'),('incident-response','Défense','Réponse aux incidents'),('threat-modeling','Défense','Modélisation des menaces'),('vulnerability-management','Défense','Gestion des vulnérabilités'),('endpoint-security','Défense','Sécurité des terminaux'),('identity-access','Identité','Identité et accès'),('zero-trust','Identité','Zero Trust'),('security-monitoring','Défense','Surveillance de sécurité'),
('crypto-foundations','Crypto','Fondamentaux de la cryptographie'),('symmetric-crypto','Crypto','Cryptographie symétrique'),('asymmetric-crypto','Crypto','Cryptographie asymétrique'),('hashing','Crypto','Hachage'),('digital-signatures','Crypto','Signatures numériques'),('pki','Crypto','PKI'),('key-management','Crypto','Gestion des clés'),
('python','Programmation','Python'),('javascript','Programmation','JavaScript'),('algorithms','Programmation','Algorithmique'),('secure-coding','Programmation','Développement sécurisé'),('testing','Programmation','Tests'),('git-github','Programmation','Git & GitHub'),
('web-security','Web','Sécurité Web'),('auth-security','Web','Sécurité de l’authentification'),('session-security','Web','Sécurité des sessions'),('input-validation','Web','Validation des entrées'),('xss-defense','Web','Défense XSS'),('csrf-defense','Web','Défense CSRF'),('api-security','Web','Sécurité des API'),
('network-fundamentals','Réseaux','Fondamentaux réseau'),('ip-routing','Réseaux','IP & routage'),('dns','Réseaux','DNS'),('http','Réseaux','HTTP'),('tls','Réseaux','TLS'),('wifi-security','Réseaux','Wi-Fi sécurisé'),
('cloud-security','Cloud','Sécurité Cloud'),('containers','Cloud','Conteneurs'),('cicd-security','Cloud','Sécurité CI/CD'),('secrets-management','Cloud','Gestion des secrets'),('iac','Cloud','Infrastructure as Code'),('cloud-logging','Cloud','Journalisation Cloud'),
('osint','OSINT','OSINT'),('source-verification','OSINT','Vérification des sources'),('metadata-privacy','Vie privée','Métadonnées & vie privée'),('digital-footprint','Vie privée','Empreinte numérique'),('phishing-awareness','Vie privée','Sensibilisation au phishing'),('social-engineering-defense','Vie privée','Défense contre l’ingénierie sociale'),
('mobile-security','Mobile','Sécurité mobile'),('android-privacy','Mobile','Vie privée Android'),('secure-mobile-storage','Mobile','Stockage mobile sécurisé'),('device-hardening','Mobile','Durcissement des appareils'),('mobile-network-security','Mobile','Sécurité des réseaux mobiles'),('app-permission-analysis','Mobile','Analyse des permissions'),
('digital-forensics','Forensique','Forensique numérique'),('log-analysis','Forensique','Analyse des logs'),('timeline-analysis','Forensique','Analyse chronologique'),('file-artifact-analysis','Forensique','Artefacts numériques'),
('threat-intelligence','Threat Intel','Renseignement sur les menaces'),('malware-indicators','Threat Intel','Indicateurs de compromission'),('ai-ml-security','IA','IA & Machine Learning'),('anomaly-detection','IA','Détection d’anomalies'),('model-privacy','IA','Vie privée des modèles'),('ai-security-testing','IA','Tests de sécurité IA')
on conflict(slug) do nothing;

create or replace function public.handle_new_user() returns trigger security definer set search_path=public language plpgsql as $$
declare u text;
begin
 u:=lower(regexp_replace(coalesce(split_part(new.email,'@',1),'cyberuser'),'[^a-zA-Z0-9_]+','','g'));
 u:=left(case when char_length(u)<3 then 'user' else u end,20)||'_'||substr(replace(new.id::text,'-',''),1,8);
 insert into public.profiles(id,username,display_name) values(new.id,u,coalesce(split_part(new.email,'@',1),'CyberUser')) on conflict(id) do nothing;
 insert into public.user_stats(user_id) values(new.id) on conflict(user_id) do nothing;
 return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.award_xp(p_user uuid,p_amount integer) returns void security definer set search_path=public language plpgsql as $$
begin
 if p_amount<=0 then return; end if;
 insert into public.user_stats(user_id,xp,level) values(p_user,p_amount,greatest(1,floor(p_amount/100)::int+1))
 on conflict(user_id) do update set xp=public.user_stats.xp+p_amount,level=floor((public.user_stats.xp+p_amount)/100)::int+1,updated_at=now();
end $$;

create or replace function public.post_xp() returns trigger security definer set search_path=public language plpgsql as $$
begin perform public.award_xp(new.user_id,5); update public.user_stats set posts_created=posts_created+1 where user_id=new.user_id; return new; end $$;
drop trigger if exists post_xp on public.posts; create trigger post_xp after insert on public.posts for each row execute function public.post_xp();

create or replace function public.quiz_xp() returns trigger security definer set search_path=public language plpgsql as $$
declare reward int;
begin reward:=greatest(5,round(new.score/10.0)); perform public.award_xp(new.user_id,reward); update public.user_stats set quiz_completed=quiz_completed+1,streak_days=streak_days+1 where user_id=new.user_id; return new; end $$;
drop trigger if exists quiz_xp on public.quiz_attempts; create trigger quiz_xp after insert on public.quiz_attempts for each row execute function public.quiz_xp();

alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.moderators enable row level security;
alter table public.notifications enable row level security;
alter table public.specializations enable row level security;
alter table public.user_specializations enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists profiles_select on public.profiles; create policy profiles_select on public.profiles for select to anon,authenticated using(not is_private or id=auth.uid() or exists(select 1 from public.follows f where f.follower_id=auth.uid() and f.following_id=id));
drop policy if exists profiles_update on public.profiles; create policy profiles_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
drop policy if exists stats_select on public.user_stats; create policy stats_select on public.user_stats for select to authenticated using(user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=user_id and p.show_stats));
drop policy if exists posts_select on public.posts; create policy posts_select on public.posts for select to anon,authenticated using(status='visible' and (visibility='public' or user_id=auth.uid() or (visibility='followers' and exists(select 1 from public.follows f where f.follower_id=auth.uid() and f.following_id=user_id))) and (auth.uid() is null or not exists(select 1 from public.blocks b where b.blocker_id=auth.uid() and b.blocked_id=user_id)));
drop policy if exists posts_insert on public.posts; create policy posts_insert on public.posts for insert to authenticated with check(user_id=auth.uid());
drop policy if exists posts_update on public.posts; create policy posts_update on public.posts for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists posts_delete on public.posts; create policy posts_delete on public.posts for delete to authenticated using(user_id=auth.uid());
drop policy if exists likes_select on public.likes; create policy likes_select on public.likes for select to anon,authenticated using(true);
drop policy if exists likes_insert on public.likes; create policy likes_insert on public.likes for insert to authenticated with check(user_id=auth.uid());
drop policy if exists likes_delete on public.likes; create policy likes_delete on public.likes for delete to authenticated using(user_id=auth.uid());
drop policy if exists comments_select on public.comments; create policy comments_select on public.comments for select to anon,authenticated using(status='visible');
drop policy if exists comments_insert on public.comments; create policy comments_insert on public.comments for insert to authenticated with check(user_id=auth.uid());
drop policy if exists comments_delete on public.comments; create policy comments_delete on public.comments for delete to authenticated using(user_id=auth.uid());
drop policy if exists follows_all on public.follows; create policy follows_all on public.follows for all to authenticated using(follower_id=auth.uid()) with check(follower_id=auth.uid());
drop policy if exists blocks_all on public.blocks; create policy blocks_all on public.blocks for all to authenticated using(blocker_id=auth.uid()) with check(blocker_id=auth.uid());
drop policy if exists reports_insert on public.reports; create policy reports_insert on public.reports for insert to authenticated with check(reporter_id=auth.uid());
drop policy if exists reports_select on public.reports; create policy reports_select on public.reports for select to authenticated using(reporter_id=auth.uid() or exists(select 1 from public.moderators m where m.user_id=auth.uid()));
drop policy if exists notifications_select on public.notifications; create policy notifications_select on public.notifications for select to authenticated using(user_id=auth.uid());
drop policy if exists notifications_update on public.notifications; create policy notifications_update on public.notifications for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists specs_select on public.specializations; create policy specs_select on public.specializations for select to anon,authenticated using(true);
drop policy if exists user_specs_all on public.user_specializations; create policy user_specs_all on public.user_specializations for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists quiz_insert on public.quiz_attempts; create policy quiz_insert on public.quiz_attempts for insert to authenticated with check(user_id=auth.uid());
drop policy if exists quiz_select on public.quiz_attempts; create policy quiz_select on public.quiz_attempts for select to authenticated using(user_id=auth.uid());

create or replace function public.resolve_report(p_report_id uuid,p_status text,p_note text default '') returns void security definer set search_path=public language plpgsql as $$
begin
 if not exists(select 1 from public.moderators where user_id=auth.uid()) then raise exception 'moderator_required'; end if;
 update public.reports set status=p_status,moderator_id=auth.uid(),moderator_note=p_note,resolved_at=case when p_status in('resolved','dismissed') then now() else null end where id=p_report_id;
end $$;
create or replace function public.moderate_post(p_post_id uuid,p_reason text) returns void security definer set search_path=public language plpgsql as $$
begin
 if not exists(select 1 from public.moderators where user_id=auth.uid()) then raise exception 'moderator_required'; end if;
 update public.posts set status='hidden',updated_at=now() where id=p_post_id;
end $$;
grant execute on function public.resolve_report(uuid,text,text) to authenticated;
grant execute on function public.moderate_post(uuid,text) to authenticated;

create index if not exists posts_created_idx on public.posts(created_at desc);
create index if not exists posts_user_idx on public.posts(user_id,created_at desc);
create index if not exists comments_post_idx on public.comments(post_id,created_at desc);
create index if not exists reports_status_idx on public.reports(status,created_at desc);
