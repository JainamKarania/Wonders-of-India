alter table bookings enable row level security;

create policy "Users can view their own bookings"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

alter table travelers enable row level security;

-- Travelers don't have a user_id column directly — ownership is via
-- their parent booking, so the policy checks through that relationship.
create policy "Users can view travelers on their own bookings"
  on travelers for select
  using (
    exists (
      select 1 from bookings
      where bookings.id = travelers.booking_id
      and bookings.user_id = auth.uid()
    )
  );

create policy "Users can insert travelers on their own bookings"
  on travelers for insert
  with check (
    exists (
      select 1 from bookings
      where bookings.id = travelers.booking_id
      and bookings.user_id = auth.uid()
    )
  );