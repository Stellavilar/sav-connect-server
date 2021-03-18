const Action = require ('../models/Action');
const Activity = require ('../models/Activity');

module.exports = activityController = {

    allActivities : async (req, res) => {
        try {

            const nb = req.params.nb;
            // If no id, i send an error with message
            if(!nb) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            const result = await Activity.allActivities(nb);
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

    activitiesForOneSav: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            // If no order_number, i send an error with message
            if(!order_number) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            const result = await Activity.activityForOneSav(order_number);
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

    activitiesForOneUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            // If no order_number, i send an error with message
            if(!userId) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await Activity.activityForOneUser(userId);
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
};