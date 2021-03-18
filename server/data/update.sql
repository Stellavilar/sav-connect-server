BEGIN;

DROP TABLE IF EXISTS "order_repair_config_panne";
CREATE TABLE "order_repair_config_panne" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "order_repair_id" int NOT NULL REFERENCES "order_repair"("id"),
    "config_panne_id" int NOT NULL REFERENCES "config_panne"("id"),
    "user_id" int NOT NULL REFERENCES "user"("id"),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);

COMMIT;