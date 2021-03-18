const ConfigPanne = require ('../models/ConfigPanne');

const jwt = require ('../utils/jwt.utils');

module.exports = configPanneController = {

    add: async (req, res) => {
        try {
            const {title} = req.body;
            // Check exist title
            if(title) {
                const configPanne = new ConfigPanne({
                    title
                });
                // Save this new configPanne
                const result = await configPanne.save();
                // is the result is good
                if(result !== false){
                    // Send data for the new configPanne
                    return res.send(result);
                }else{
                    // or send an error with status code 403
                    return res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde de la Panne."});
                }
            }
            return res.status(403).send({"error": "Vous n'avez pas complété tous les champs."});
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    },
    findAll: async (req, res) => {
        try {
            // I search all configPannes on data
            const configPannes = await ConfigPanne.findAll();
            if(configPannes) {
                // If i result, i send all configPannes
                return res.send(configPannes);
            }else{
                // or i send an error
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
            // I search this configPanne with id
            const configPanne = await ConfigPanne.findOne(id);
            if(configPanne == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(configPanne);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            let { title } = req.body;

            const configPanne = await ConfigPanne.findOne(id);
            if(configPanne == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer le configPanne."});
            }
            if(!title) {
                title = configPanne.title;
            }
            const result = await ConfigPanne.edit(configPanne.id, title);
            if(result == false) {
                return res.status(403).send({"error": "Une erreur s'est produite lors de la modification du ConfigPanne."});
            }else{
                return res.send(result);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },
    archive: async (req, res) => {
        try {
            const id = req.params.id;
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            const result = await ConfigPanne.archive(id);
            if(result) {
                res.send(true);
            }else{
                res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }        
    },
    addConfigPanneOnSav: async (req, res) => {
        try {
            const { idConfigPanne, idSav } = req.params;
            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            // Save acion for an order_repair with idAction, idSav and userId
            const result = await ConfigPanne.addConfigPanneOnSav(idConfigPanne, idSav, userId);
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
    removeConfigPanneOnSav: async (req, res) => {
        try {
            const { idPanne, idSav } = req.params;
            let headerAuth = req.headers.authorization;
            const userId = jwt.getUserId(headerAuth);
            const result = await ConfigPanne.removeConfigPanneOnSav(idSav, idPanne);
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