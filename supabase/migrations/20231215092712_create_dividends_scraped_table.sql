create table "public"."dividends_scraped" (
    "id" bigint generated by default as identity not null,
    "isin" text not null,
    "payment_date" text not null,
    "record_date" text,
    "ex_date" text not null,
    "amount" double precision not null,
    "type" text,
    "information" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX dividends_scraped_pkey ON public.dividends_scraped USING btree (id);

alter table "public"."dividends_scraped" add constraint "dividends_scraped_pkey" PRIMARY KEY using index "dividends_scraped_pkey";

grant delete on table "public"."dividends_scraped" to "anon";

grant insert on table "public"."dividends_scraped" to "anon";

grant references on table "public"."dividends_scraped" to "anon";

grant select on table "public"."dividends_scraped" to "anon";

grant trigger on table "public"."dividends_scraped" to "anon";

grant truncate on table "public"."dividends_scraped" to "anon";

grant update on table "public"."dividends_scraped" to "anon";

grant delete on table "public"."dividends_scraped" to "authenticated";

grant insert on table "public"."dividends_scraped" to "authenticated";

grant references on table "public"."dividends_scraped" to "authenticated";

grant select on table "public"."dividends_scraped" to "authenticated";

grant trigger on table "public"."dividends_scraped" to "authenticated";

grant truncate on table "public"."dividends_scraped" to "authenticated";

grant update on table "public"."dividends_scraped" to "authenticated";

grant delete on table "public"."dividends_scraped" to "service_role";

grant insert on table "public"."dividends_scraped" to "service_role";

grant references on table "public"."dividends_scraped" to "service_role";

grant select on table "public"."dividends_scraped" to "service_role";

grant trigger on table "public"."dividends_scraped" to "service_role";

grant truncate on table "public"."dividends_scraped" to "service_role";

grant update on table "public"."dividends_scraped" to "service_role";

-- Update trigger
drop trigger if exists "updated_at_trigger" on "public"."dividends_scraped";

create trigger updated_at_trigger
before update on dividends_scraped
for each row
when (old.* is distinct from new.*)
execute function update_updated_at();
