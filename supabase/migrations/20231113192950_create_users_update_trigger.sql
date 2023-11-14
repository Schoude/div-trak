drop trigger if exists "updated_at_trigger" on "public"."users";

create trigger updated_at_trigger
before update on users
for each row
when (old.* is distinct from new.*)
execute function update_updated_at();
