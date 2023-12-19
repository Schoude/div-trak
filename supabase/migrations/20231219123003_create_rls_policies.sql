-- Portfolios
alter table "public"."portfolios" enable row level security;
create policy "Enable access for authenticated users"
on "public"."portfolios"
as permissive
for all
to authenticated
using (true)
with check (true);

-- Orders
alter table "public"."orders" enable row level security;
create policy "Enable access for authenticated users"
on "public"."orders"
as permissive
for all
to authenticated
using (true)
with check (true);

-- Dividends scraped
alter table "public"."dividends_scraped" enable row level security;
create policy "Enable access for authenticated users"
on "public"."dividends_scraped"
as permissive
for all
to authenticated
using (true)
with check (true);
