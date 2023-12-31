create table "public"."portfolios" (
    "id" bigint generated by default as identity not null,
    "name" text not null,
    "user_id" uuid null,
    "isins" jsonb[] not null default '{}'::jsonb[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    constraint "portfolios_pkey" primary key (id),
    constraint "portfolios_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on delete cascade
);
