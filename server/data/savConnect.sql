BEGIN;

DROP TABLE IF EXISTS "tag";
CREATE TABLE "tag" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title text NOT NULL,
    color text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "customer";
CREATE TABLE "customer" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    mail text,
    phone text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "action";
CREATE TABLE "action" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "role";
CREATE TABLE "role" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    mail text NOT NULL,
    "password" text NOT NULL,
    actif int NOT NULL DEFAULT 1,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    role_id int NOT NULL REFERENCES "role"(id)
);

DROP TABLE IF EXISTS "product";
CREATE TABLE "product" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ref text NOT NULL,
    "name" text NOT NULL,
    price text NOT NULL,
    mesure text NOT NULL,
    actif int NOT NULL DEFAULT 1,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "order_repair";
CREATE TABLE "order_repair" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_number text UNIQUE,
    picture text,
    device_name text NOT NULL,
    device_brand text,
    date_enter timestamp NOT NULL DEFAULT now(),
    interval_repair interval,
    actif int DEFAULT 1,
    urgent int DEFAULT 0,
    customer_id int NOT NULL REFERENCES "customer"(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone 
);

DROP TABLE IF EXISTS "order_detail";
CREATE TABLE "order_detail" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    panne text,
    intervention text,
    date_intervention timestamp,
    date_devis timestamp,
    amount text,
    amount_devis text,
    recall_devis int,
    recall_finish int,
    order_number_id text REFERENCES "order_repair"(order_number)
);

DROP TABLE IF EXISTS "order_repair_tag";
CREATE TABLE "order_repair_tag" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_repair_id int NOT NULL REFERENCES "order_repair"(id),
    tag_id int NOT NULL REFERENCES "tag"(id),
    user_id int NOT NULL REFERENCES "user"(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "order_repair_action";
CREATE TABLE "order_repair_action" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_repair_id int NOT NULL REFERENCES "order_repair"(id),
    action_id int NOT NULL REFERENCES "action"(id),
    user_id int NOT NULL REFERENCES "user"(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "order_repair_user";
CREATE TABLE "order_repair_user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id int NOT NULL REFERENCES "user"(id),
    order_repair_id int NOT NULL REFERENCES "order_repair"(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "order_repair_product";
CREATE TABLE "order_repair_product" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_repair_id int NOT NULL REFERENCES "order_repair"(id),
    product_id int NOT NULL REFERENCES "product"(id),
    user_id int NOT NULL REFERENCES "user"(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "config-panne";
CREATE TABLE "config_panne" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" text UNIQUE,
    "actif" int DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

DROP TABLE IF EXISTS "order_repair_config_panne";
CREATE TABLE "order_repair_config_panne" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "order_repair_id" int NOT NULL REFERENCES "order_repair"("id"),
    "config_panne_id" int NOT NULL REFERENCES "config_panne"("id"),
    "user_id" int NOT NULL REFERENCES "user"("id"),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

INSERT INTO "role" ("name") VALUES 
('Employés'),
('Administrateur');
INSERT INTO "user" (firstname, lastname, mail, "password", role_id) VALUES 
('Admin', 'Admin', 'admin@admin.fr', '$2b$10$FKRQ555eV.ChxrsSiqTnAulrGxXIcyuSXxZ1AX2q0j160WYILsgYS', 2);



ALTER TABLE "order_repair_tag" ADD CONSTRAINT allUniqueTag UNIQUE ("order_repair_id", "tag_id", "user_id");
ALTER TABLE "order_repair_product" ADD CONSTRAINT allUniqueProduct UNIQUE ("order_repair_id", "product_id", "user_id");
ALTER TABLE "order_repair_product" ADD COLUMN "qty" int DEFAULT 1 NOT NULL;
ALTER TABLE "customer" ADD COLUMN "phone_two" text;
ALTER TABLE "customer" ADD COLUMN "customer_detail" text;
ALTER TABLE "user" ADD token text; 
ALTER TABLE "tag" ADD COLUMN "actif" int DEFAULT '1';
ALTER TABLE "order_repair" DROP COLUMN "interval_repair";
ALTER TABLE "order_repair" ADD COLUMN "interval_repair" timestamp with time zone;
ALTER TABLE "order_detail" ADD COLUMN "amount_diag" text;
ALTER TABLE "order_detail" ADD COLUMN "devis_is_accepted" text;
ALTER TABLE "product" ADD UNIQUE (ref);
ALTER TABLE "order_detail" ADD COLUMN "is-pay" text;
ALTER TABLE "action" ADD COLUMN "is_blocked" int DEFAULT 0 NOT NULL;
ALTER TABLE "action" ADD COLUMN "archive" int DEFAULT 0 NOT NULL;
CREATE SEQUENCE "order_number";

ALTER TABLE "order_repair" ALTER "order_number" SET DEFAULT CONCAT('SAV', '', lpad(to_hex(nextval('order_number'::regclass)),10,'0'));


INSERT INTO "action" ("name","is_blocked") VALUES
('a appellé le client', 1),
('a créé la fiche', 1),
('a archivé la fiche', 1),
('a modifié la fiche', 1),
('a ajouté des produits dans la fiche', 1),
('a appellé le client',1),
('a terminé la réparation', 1),
('a commencé la réparation', 1),
('a mis à jour le client', 1),
('a envoyé le devis', 1);

CREATE view "activity" as
SELECT 
	'tag' as "type",
	title as "name",
	"tag".color as "color",
	"order_repair".order_number as order_number,
	"user".lastname as lastname,
	"user".firstname as firstname,
	"order_repair_tag".created_at as created_at,
	"order_repair"."customer_id" as customer_id,
	"user".id as user_id 
	FROM "tag" 
	JOIN "order_repair_tag" ON "order_repair_tag".tag_id="tag".id 
	JOIN "order_repair" ON "order_repair".id="order_repair_tag".order_repair_id 
	JOIN "user" ON "user".id="order_repair_tag".user_id
UNION
	SELECT 
	'action' as "type",
	"action".name as "name",
	'' as "color",
	"order_repair".order_number as "order_number",
	"user".lastname as lastname ,
	"user".firstname as firstname ,
	"order_repair_action".created_at as created_at,
	"order_repair"."customer_id" as customer_id,
	"user".id as user_id 
	FROM "action" 
	JOIN "order_repair_action" ON "order_repair_action".action_id="action".id 
	JOIN "order_repair" ON "order_repair".id="order_repair_action".order_repair_id 
	JOIN "user" ON "user".id="order_repair_action".user_id
ORDER BY created_at desc;

CREATE FUNCTION allactivites(lim int) 
RETURNS table (
	"type" text,
	"name" text,
	color text,
	order_number text,
	lastname text,
	firstname text,
	created_at timestamptz
	) 
AS $$ 
BEGIN
	return query SELECT 
	'tag' as "type",
	title as "name",
	"tag".color as "color",
	"order_repair".order_number as order_number,
	"user".lastname as lastname,
	"user".firstname as firstname,
	"order_repair_tag".created_at as created_at 
	FROM "tag" 
	JOIN "order_repair_tag" ON "order_repair_tag".tag_id="tag".id 
	JOIN "order_repair" ON "order_repair".id="order_repair_tag".order_repair_id 
	JOIN "user" ON "user".id="order_repair_tag".user_id
UNION
	SELECT 
	'action' as "type",
	"action".name as "name",
	'' as "color",
	"order_repair".order_number as "order_number",
	"user".lastname as lastname ,
	"user".firstname as firstname ,
	"order_repair_action".created_at as created_at 
	FROM "action" 
	JOIN "order_repair_action" ON "order_repair_action".action_id="action".id 
	JOIN "order_repair" ON "order_repair".id="order_repair_action".order_repair_id 
	JOIN "user" ON "user".id="order_repair_action".user_id
ORDER BY created_at DESC LIMIT lim;
END;

$$ LANGUAGE 'plpgsql';

CREATE view "savs" as
select "order_repair".*, "customer".lastname, "customer".firstname, array_agg("tag".color ) as tags_colors ,array_agg("tag".title ) as tags_title
from "order_repair"
join "customer"
on "customer".id="order_repair".customer_id
left join "order_repair_tag"
on "order_repair_tag".order_repair_id="order_repair".id
left join "tag"
on "tag".id="order_repair_tag".tag_id
group by "order_repair".id, "customer".lastname, "customer".firstname
;


COMMIT;
