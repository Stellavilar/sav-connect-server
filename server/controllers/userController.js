// BCRYPT
const bcrypt = require('bcrypt');
const rounds = 10;

// Verify Email Module
const validateEmail = require('../utils/mail.utils');

// Verify Password Module
const validatePassword = require('../utils/password.utils');

const jwt = require('../utils/jwt.utils');

/// User Model
const User = require('../models/User');

module.exports = userController = {

    /**
     * Find All users
     */
    findAll: async (req, res) => {
        try {
            // I search all users on data
            const users = await User.findAll();
            if(users) {
                // If i result, i send all users
                return res.send(users);
            }else{
                // or i send an error
                return res.status(403).send({"error" : "Une erreur s'est produite."});
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    },

    /**
     * FindOne for select one user
     */
    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            // I search this user with id
            const user = await User.findOne(id);
            if(user == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(user);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    /**
     * Add User
     */
    add: async (req, res) => {
        try {
            const { firstname, lastname, mail, password, role_id } = req.body;
            // Check exist required params for save new user;
            if(!password || !firstname || !lastname || !mail || !role_id){
                return res.send({"error": "Vous n'avez pas entré tous les éléments nécéssaire."});
            }

            // Validate email with Utils.js
            if(!validateEmail.validate(mail)){
                return res.send({"error": "Votre adresse Email n'est pas correct."});
            }

            // Validate password width Utils.js
            if(!validatePassword.validate(password)){
                return res.send({"error": "Votre mot de passe doit contenir au minum 8 caractères avec une majuscules, une minuscule, un chiffre et un caractère spécial."});
            }

            // HASH password
            const passwordHashed = await bcrypt.hash(password, rounds);

            // New instance for the new user
            const user = new User({
                firstname,
                lastname,
                mail,
                password: passwordHashed,
                role_id
            });

            // Save the new user
            const result = await user.save();

            return res.send(result);

        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    },

    /**
     * Edit User by id
     */
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            // I search this tag with id
            const userOld = await User.findOne(id);
            if(userOld == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer l'utilisateur."});
            }

            let { firstname, lastname, mail, password, role_id } = req.body;

            if(!firstname){ firstname =userOld.firstname }
            if(!lastname){ lastname =userOld.lastname }
            if(!mail){ mail =userOld.mail }
            if(!role_id){ role_id =userOld.role_id }
            
            // Validate Password with utils.js
            if(password){ 
                if(!validatePassword.validate(password)){
                    return res.send({"error": "Votre mot de passe doit contenir au minum 8 caractères avec une majuscules, une minuscule, un chiffre et un caractère spécial."});
                }
            }

            // Validate email with Utils.js
            if(!validateEmail.validate(mail)){
                return res.send({"error": "Votre adresse Email n'est pas correct."});
            }


            // New instance for the new user
            const user = new User({
                id,
                firstname,
                lastname,
                mail,
                role_id
            });
            if(password){
                // HASH password
                const passwordHashed = await bcrypt.hash(password, rounds);
                user.password = passwordHashed;
            }

            // Edit this user
            const result = await user.edit();

            return res.send(result);

        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    },

    getProfil: async (req, res) => {
        try {
            let headerAuth = req.headers.authorization;
                // On récupère l'id stocké dans le code
            const id = jwt.getUserId(headerAuth);


            // I search this user with id
            const user = await User.findOne(id);
            if(user == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(user);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },


    /**
     * Edit User by id
     */
    editProfil: async (req, res) => {
        try {
            let headerAuth = req.headers.authorization;
                // On récupère l'id stocké dans le code
            const id = jwt.getUserId(headerAuth);

            // I search this tag with id
            const userOld = await User.findOne(id);
            if(userOld == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer l'utilisateur."});
            }

            let { firstname, lastname, mail, password, newPassword_two } = req.body;
            console.log(req.body);


            if(!firstname){ firstname =userOld.firstname }
            if(!lastname){ lastname =userOld.lastname }
            if(!mail){ mail =userOld.mail }
            
            // Validate Password with utils.js
            if(!password && !newPassword_two){ 
                password = userOld.password;
            }else{
                password = newPassword_two;
            }

            // Validate email with Utils.js
            if(!validateEmail.validate(mail)){
                return res.send({"error": "Votre adresse Email n'est pas correct."});
            }


            // // New instance for the new user
            const user = new User({
                id,
                firstname,
                lastname,
                mail,
                password,
            });
            if(password){
                // HASH password
                const passwordHashed = await bcrypt.hash(password, rounds);
                user.password = passwordHashed;
            }

            
            // // Edit this user
            const result = await user.editProfil();

            return res.send(true);

        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    },

    /**
     * Archive one user
     */
    archive: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await User.archive(id);
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