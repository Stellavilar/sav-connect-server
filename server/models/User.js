const db = require ('../dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt.utils');

module.exports = class User {

    id;
    firstname;
    lastname;
    mail;
    password;
    actif;
    created_at;
    updated_at;
    role_id;
    token;

    constructor(params) {
        if(params.id) { this.id = params.id }
        if(params.firstname) { this.firstname = params.firstname}
        if(params.lastname) { this.lastname = params.lastname }
        if(params.mail) { this.mail = params.mail }
        if(params.password) { this.password = params.password }
        if(params.actif) { this.actif = params.actif }
        if(params.created_at) { this.created_at = params.created_at }
        if(params.updated_at) { this.updated_at = params.updated_at }
        if(params.role_id) { this.role_id = params.role_id }
    }

    async save() {
        try {
            const query = 'INSERT INTO "user" (firstname, lastname, mail, password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
            const values = [this.firstname, this.lastname, this.mail, this.password, this.role_id];
            const result = await db.query(query,values);
            if((await result).rowCount != 1){
                return false;
            }
            this.id = result.rows[0].id;
            this.actif = result.rows[0].actif;
            this.created_at = result.rows[0].created_at;

            return this;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    /**
     * FindALL 
     */
    static async findAll() {
        try {
            const query = 'SELECT * FROM "user";';
            const result = await db.query(query);
            if(result.rowCount < 1){
                return false;
            }
            return result.rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async findOne(id) {
        try {
            if(!id) { false };
            const query = 'SELECT * FROM "user" WHERE id=$1;';
            const values = [id];
            const result = await db.query(query, values);
            if(result.rowCount == 1) {
                return result.rows[0];
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async edit() {
        try {
            const query = 'UPDATE "user" SET firstname=$1, lastname=$2, mail=$3, password=$4, role_id=$5, updated_at=now() WHERE id=$6 RETURNING *;';
            const values = [this.firstname, this.lastname, this.mail, this.password, this.role_id, this.id];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return result.rows[0];
            }else {
                return false;
            }            
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async editProfil() {
        try {
            const query = 'UPDATE "user" SET firstname=$1, lastname=$2, mail=$3, password=$4, updated_at=now() WHERE id=$5 RETURNING *;';
            const values = [this.firstname, this.lastname, this.mail, this.password, this.id];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return result.rows[0];
            }else {
                return false;
            }            
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async archive(id) {
        try {
            const query = 'UPDATE "user" SET actif=0, updated_at=now() WHERE id=$1;';
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

    static async login(mail, password) {
        try {
            const query = 'SELECT * FROM "user" WHERE mail=$1;';
            const values = [mail];
            const result = await db.query(query,values);
            if(result.rowCount == 1) {
                const passwordDB = result.rows[0].password;
                if(await bcrypt.compare(password, passwordDB)){
                    this.token = jwt.generateUserToken(result.rows[0]);
                    const queryAddToken = 'UPDATE "user" SET token=$1 WHERE mail=$2 RETURNING *;';
                    const valuesAddToken = [this.token, mail];
                    const resultAddToken = await db.query(queryAddToken, valuesAddToken);
                    const sendQuery = {
                        token: this.token,
                        isAdmin : resultAddToken.rows[0].role_id
                    }
                    return sendQuery;
                }else{
                    return false;
                }     
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    /**
     * Logout
     */
    static async logout (userId) {
        try {   
            const query = `UPDATE "user" SET token=null, updated_at=now() WHERE id=$1;`;
            const values = [userId];
            const result = await db.query(query,values);
            if(result.rowCount == 1) {
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

};