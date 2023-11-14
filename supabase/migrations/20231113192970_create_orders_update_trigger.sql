drop trigger if exists "updated_at_trigger" on "public"."orders";

create trigger updated_at_trigger
before update on orders
for each row
when (old.* is distinct from new.*)
execute function update_updated_at();
