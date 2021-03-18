const Customer = require ('../models/Customer');
const RepairSheet = require ('../models/RepairSheet');

module.exports = searchController = {

    user: async (req, res) => {
        try {
            const search = req.query.q;
            // Search Customer with lastname, firstname, phone
            const result = await Customer.findByLastnameFirstnamePhone(search.toLowerCase());

            result ? res.send(result): res.send({"error":"Pas de résultat"});

        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    },

    userLastname: async (req, res) => {
        try {
            const search = req.query.q;
            // Search Customer with lastname
            const result = await Customer.findByLastname(search.toLowerCase());
            if(result){
                return res.send(result);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    userMail: async (req, res) => {
        try {
            const search = req.query.q;
            const result = await Customer.findByMail(search.toLowerCase());
            if(result){
                return res.send(result);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    userPhone: async (req, res) => {
        try {
            const search = req.query.q;
            const result = await Customer.findByPhone(search.toLowerCase());
            if(result){
                return res.send(result);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    search: async (req, res) => {
        try {
            const search = req.query.q;

            const result = await RepairSheet.search(search.toLowerCase());
            if(result){
                return res.send(result);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }

};