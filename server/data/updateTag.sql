BEGIN;

ALTER  TABLE "order_repair_tag" ADD COLUMN "order_number_id" text;

ALTER TABLE "order_repair_tag"
    ADD CONSTRAINT order_repair_tag_order_repair_order_number_fkey FOREIGN KEY (order_number_id)
    REFERENCES "order_repair" (order_number) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

COMMIT;