const db = require ('../dbConnect');

module.exports = class ConfigPanne {

    id;
    title;
    actif;
    created_at;
    updated_at;

    constructor(params) {
        if(params.id) { this.id = params.id }
        if(params.title) { this.title = params.title}
        if(params.actif) { this.actif = params.actif}
        if(params.created_at) { this.created_at = params.created_at }
        if(params.updated_at) { this.updated_at = params.updated_at }
    }

    async save() {
        try {
            const query = 'INSERT INTO "config_panne" (title) VALUES($1) RETURNING *;';
            const values = [this.title];
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
    static async findAll() {
        try {
            const query = 'SELECT * FROM "config_panne" WHERE actif=0;';
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    static async findOne(id) {
        try {
            if(!id) { false };
            const query = 'SELECT * FROM "config_panne" WHERE id=$1;';
            const values = [id];
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    static async edit(id, title) {
        try {
            const query = 'UPDATE "config_panne" SET title=$1, updated_at=now() WHERE id=$2 RETURNING *;';
            const values = [title, id];
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
    static async addConfigPanneOnSav(idConfigPanne, idSav, idUser) {
        try {
            const query = 'INSERT INTO "order_repair_config_panne" (order_repair_id, config_panne_id, user_id) VALUES ($1, $2, $3);';
            const values = [idSav, idConfigPanne, idUser];
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
    static async configPanneBySav(idSav) {
        try {
            const query = `SELECT "config_panne".id ,"config_panne".title
                            FROM "config_panne" 
                            JOIN "order_repair_config_panne" ON "config_panne".id="order_repair_config_panne".config_panne_id 
                            WHERE "order_repair_config_panne".order_repair_id=$1;`;
            const values = [idSav];
            const result = await db.query(query, values);
            if(result.rowCount < 1){
                return {};
            }
            return result.rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    static async removeConfigPanneOnSav(idSav, idPanne) {
        try {
            const query = 'DELETE FROM "order_repair_config_panne" WHERE order_repair_id=$1 AND config_panne_id=$2;';
            const values = [idSav, idPanne];
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
            const query = 'UPDATE "config_panne" SET actif=1, updated_at=now() WHERE id=$1;';
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
