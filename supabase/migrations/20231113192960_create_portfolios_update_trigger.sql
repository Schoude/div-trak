drop trigger if exists "updated_at_trigger" on "public"."portfolios";

create trigger updated_at_trigger
before update on portfolios
for each row
when (old.* is distinct from new.*)
execute function update_updated_at();
