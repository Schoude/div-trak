drop trigger if exists "updated_at_trigger" on "public"."sessions";

create trigger updated_at_trigger
before update on sessions
for each row
when (old.* is distinct from new.*)
execute function update_updated_at();
