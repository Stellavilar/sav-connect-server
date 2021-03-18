const db = require ('../dbConnect');

module.exports = class Tag {

    id;
    title;
    color;
    created_at;
    updated_at;

    constructor(params) {
        if(params.id) { this.id = params.id }
        if(params.title) { this.title = params.title}
        if(params.color) { this.color = params.color }
        if(params.created_at) { this.created_at = params.created_at }
        if(params.updated_at) { this.updated_at = params.updated_at }
    }

    async save() {
        try {
            const query = 'INSERT INTO "tag" (title, color) VALUES($1, $2) RETURNING *;';
            const values = [this.title, this.color];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                this.id = result.rows[0].id;
                this.created_at = result.rows[0].created_at;
                return this;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static async findOne(id) {
        try {
            if(!id) { false };
            const query = 'SELECT * FROM "tag" WHERE id=$1 AND actif=1;';
            const values = [id];
            const result = await db.query(query, values);
            if(result.rowCount == 1) {
                return result.rows[0];
            }else{
                return {"message": "Pas de résultat."};
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }
    static async edit(id, title, color) {
        try {
            const query = 'UPDATE "tag" SET title=$1, color=$2, updated_at=now() WHERE id=$3 RETURNING *;';
            const values = [title, color, id];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return result.rows[0];
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }
    static async findAll() {
        try {
            const query = 'SELECT * FROM "tag" WHERE "actif"=1;';
            const result = await db.query(query);
            
            return result.rows;
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    static async addTagOnSav(idTag, idSav, idUser) {
        try {
            const query = 'INSERT INTO "order_repair_tag" (order_repair_id, tag_id, user_id) VALUES ($1, $2, $3);';
            const values = [idSav, idTag, idUser];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return true;
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static async tagBySav(idSav) {
        try {

            const query = `SELECT "tag".title, "tag".color 
                            FROM "tag" 
                            JOIN "order_repair_tag" ON "tag".id="order_repair_tag".tag_id 
                            WHERE "order_repair_tag".order_repair_id=$1;`;
            const values = [idSav];
            const result = await db.query(query, values);
            // if(result.rowCount < 1){
            //     return {};
            // }
            return result.rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    static async removeTagOnSav(idTag, idSav) {
        try {
            const query = 'DELETE FROM "order_repair_tag" WHERE order_repair_id=$1 AND tag_id=$2;';
            const values = [idSav, idTag];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return true;
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static async archive(id) {
        try {
            const query = 'UPDATE "tag" SET actif=0, updated_at=now() WHERE id=$1;';
            const values = [id];
            const result = await db.query(query, values);
            if(result.rowCount == 1) {
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};