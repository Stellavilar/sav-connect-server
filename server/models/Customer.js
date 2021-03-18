const db = require ('../dbConnect');

module.exports = class Customer {

    id;
    firstname;
    lastname;
    mail;
    phone;
    phone_two;
    customer_detail;
    created_at;
    updated_at;

    constructor(params) {
        if(params.id) { this.id = params.id }
        if(params.firstname) { this.firstname = params.firstname}
        if(params.lastname) { this.lastname = params.lastname }
        if(params.mail) { this.mail = params.mail }
        if(params.phone) { this.phone = params.phone }
        if(params.phone_two) { this.phone_two = params.phone_two }
        if(params.customer_detail) { this.customer_detail = params.customer_detail }
        if(params.created_at) { this.created_at = params.created_at }
        if(params.updated_at) { this.updated_at = params.updated_at }
    }

    /**
     * Save customer
     */
    async save() {
        try {
            const query = 'INSERT INTO "customer" (firstname, lastname, mail, phone, phone_two, customer_detail) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;';
            const values = [this.firstname, this.lastname, this.mail, this.phone, this.phone_two, this.customer_detail];
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
            const errMessage = {
                "error" : error.detail
            }
            return errMessage;
        }
    }

    static async findAll() {
        try {
            const query = 'SELECT * FROM "customer";';
            const result = await db.query(query);
            // if(result.rowCount < 1){
            //     return {"message": "Pas de résultat."};
            // }
            return result.rows;
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
    /**
     * Search one customer by ID
     * @param {id} id int  
     */
    static async findOne(id) {
        try {
            if(!id) { false };
            const query = 'SELECT * FROM "customer" WHERE id=$1;';
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

    static async countCustomers() {
        try {
            const query = 'SELECT count(id) FROM "customer";';
            const result = await db.query(query);
            if(result.rows[0].count){
                return result.rows[0].count;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    
    static async edit(id, firstname, lastname, mail, phone, phone_two, customer_detail) {
        try {
            const query = 'UPDATE "customer" SET firstname=$1, lastname=$2, mail=$3, phone=$4, phone_two=$5, customer_detail=$6, updated_at=now() WHERE id=$7 RETURNING *;';
            const values = [firstname, lastname, mail, phone, phone_two, customer_detail, id];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return result.rows[0];
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return (error);
        }
    }

    static async findByLastname(search){
        try {
            const query = `SELECT * FROM "customer" WHERE lower("lastname") LIKE $1;`;
            const values = ['%'+search+'%'];
            const result = await db.query(query, values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async findByMail(search){
        try {
            const query = `SELECT * FROM "customer" WHERE lower("mail") LIKE $1;`;
            const values = ['%'+search+'%'];
            const result = await db.query(query, values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async findByPhone(search){
        try {
            const query = `SELECT * FROM "customer" WHERE lower("phone") LIKE $1 OR lower("phone_two") LIKE $1;`;
            const values = ['%'+search+'%'];
            const result = await db.query(query, values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async findByLastnameFirstnamePhone(search) {
        try {
            const query = `SELECT * FROM "customer" WHERE lower("phone") LIKE $1 OR lower("phone_two") LIKE $1 OR lower("lastname") LIKE $1 OR lower("firstname") LIKE $1 LIMIT 10;`;
            const values = ['%'+search+'%'];
            const result = await db.query(query, values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

};