const Action = require ('../models/Action');

const jwt = require ('../utils/jwt.utils');

module.exports = actionController = {

    findAll: async (req, res) => {
        try {
            const actions = await Action.findAll();
            if(actions) {
                return res.send(actions);
            }else{
                return res.status(403).send({"error" : "Une erreur s'est produite."});
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    },
    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            // I search this action with id
            const action = await Action.findOne(id);
            if(action == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(action);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },
    add: async (req, res) => {
        try {
            const {name} = req.body;
            if(name) {
                const action = new Action({
                    name
                });
                const result = await action.save();
                if(result !== false){
                    return res.send(result);
                }else{
                    return res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du Action."});
                }
            }
            return res.status(403).send({"error": "Vous n'avez pas complété tous les champs."});
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    },
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            let { name } = req.body;
            const action = await Action.findOne(id);
            if(action == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer le action."});
            }
            if(!name) {
                name = action.name;
            }
            const result = await Action.edit(action.id, name);
            if(result == false) {
                return res.status(403).send({"error": "Une erreur s'est produite lors de la modification du Action."});
            }else{
                return res.send(result);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    addActionOnSav: async (req, res) => {
        try {
            const { idAction, idSav } = req.params;
            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            // Save acion for an order_repair with idAction, idSav and userId
            const result = await Action.addActionOnSav(idAction, idSav, userId);
            if(result){
                return res.send(true);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

};