create table "public"."sessions" (
    "id" bigint generated by default as identity not null,
    "token" uuid not null default gen_random_uuid(),
    "user_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."sessions" add constraint "sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_user_id_fkey";
