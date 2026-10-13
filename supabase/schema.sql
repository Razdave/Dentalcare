create table if not exists public.appointments (
  id text primary key,
  patient_name text not null,
  patient_email text not null,
  patient_phone text not null,
  service_id text not null,
  dentist_id text not null,
  appointment_date date not null,
  time_slot text not null,
  status text not null default 'pending'
    check (status in ('confirmed', 'pending', 'completed', 'cancelled')),
  notes text,
  insurance_provider text,
  created_at timestamptz not null default now(),
  reminders_sent text[] not null default '{}'
);

create unique index if not exists appointments_active_dentist_slot_idx
  on public.appointments (dentist_id, appointment_date, time_slot)
  where status <> 'cancelled';

alter table public.appointments enable row level security;

grant insert on public.appointments to anon, authenticated;

drop policy if exists "Allow clients to submit appointment requests" on public.appointments;
create policy "Allow clients to submit appointment requests"
  on public.appointments
  for insert
  to anon, authenticated
  with check (status = 'pending');

grant select on public.appointments to authenticated;

-- Assign role=staff in app_metadata through a trusted admin workflow.
drop policy if exists "Staff can read appointments" on public.appointments;
create policy "Staff can read appointments"
  on public.appointments
  for select
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'staff');
