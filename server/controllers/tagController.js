const Tag = require ('../models/Tag');

const jwt = require ('../utils/jwt.utils');

module.exports = tagController = {

    add: async (req, res) => {
        try {
            const {title, color} = req.body;
            if(title && color) {
                const tag = new Tag({
                    title,
                    color
                });
                const result = await tag.save();
                if(result !== false){
                    return res.send(result);
                }else{
                    return res.send({"error": "Une erreur s'est produite lors de la sauvegarde du Tag."});
                }
            }
            return res.send({"error": "Vous n'avez pas complété tous les champs."});
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    },
    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            // I search this tag with id
            const tag = await Tag.findOne(id);
            if(tag == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(tag);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            let {title, color} = req.body;

            // I search this tag with id
            const tag = await Tag.findOne(id);
            if(tag == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer le tag."});
            }
            // if not body params i save hold values
            if(!title) {
                title = tag.title;
            }
            if(!color) {
                color = tag.color;
            }
            // edit tag with class
            const result = await Tag.edit(tag.id, title, color);
            if(result == false) {
                res.status(403).send({"error": "Une erreur s'est produite lors de la modification du Tag."});
            }else{
                return res.send(result);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },
    findAll: async (req, res) => {
        try {
            // I search all tags on data
            const tags = await Tag.findAll();
            return res.send(tags)
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    },
    addTagOnSav: async (req, res) => {
        try {
            const { idTag, idSav } = req.params;
            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            // Save Tag with idTag, idSav and userId
            const result = await Tag.addTagOnSav(idTag, idSav, userId);
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
    tagsOnSav: async (req, res) => {
        try {
            const {idSav} = req.params;
            if(!idSav) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await Tag.tagBySav(idSav);
            if(result){
                return res.send(result);
            }
            else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    removeTagOnSav: async (req, res) => {
        try {
            const { idTag, idSav } = req.params;
            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            // Save Tag with idTag, idSav and userId
            const result = await Tag.removeTagOnSav(idTag, idSav);
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
    archive: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await Tag.archive(id);
            if(result) {
                res.send(true);
            }else{
                res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }        
    }
};