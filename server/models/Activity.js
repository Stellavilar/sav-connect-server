const db = require ('../dbConnect');

module.exports = class Activity {

    static async allActivities(nb){
        try {
            // Use function sql for find all activities
            const query = 'SELECT * FROM "activity" LIMIT ($1);';
            const values = [nb];
            const result = await db.query(query,values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async activityForOneSav(idSav){
        try {
            // Use function sql for find all activities

            let id;
            if(idSav.substring(0, 3) != 'SAV'){
                const queryId = 'SELECT order_number FROM "order_repair" WHERE id=$1;';
                const valuesId = [idSav];
                const resultId = await db.query(queryId, valuesId);
                if(resultId.rowCount !== 0) {
                    id = resultId.rows[0].order_number;
                }
            }else{
                id = idSav;
            }
            
            if(id){
                const query = 'SELECT * FROM "activity" WHERE order_number=$1::text;';
                const values = [id];
                const result = await db.query(query,values);

                if(result.rowCount == 0){
                    return [];
                }else{
                    return result.rows;
                }
            }else{
                return [];
            }
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async activityForOneUser(userId){
        try {
            // Use function sql for find all activities
            const query = 'SELECT * FROM "activity" WHERE user_id=$1 LIMIT 15;';
            const values = [userId];
            const result = await db.query(query,values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};