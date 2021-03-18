const User = require ('../models/User');

const jwt = require ('../utils/jwt.utils');

module.exports = loginController = {

    login: async (req, res) => {
        try {
            const { mail , password } = req.body;
            if(!mail || !password){
                return res.send({"error": "Vous n'avez pas complété tous les champs."});
            }

            const result = await User.login(mail, password);
            if(!result){
                return res.send({"error" : "Une erreur s'est produite"});
            }
            req.session.token = result.token;
            const {token, isAdmin } = result;
            const resultSend = {
                token: token,
            };
            if(isAdmin === 2){
                resultSend.isAdmin = true
            }else{
                resultSend.isAdmin = false
            }
            return res.send(resultSend);

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    logout: async (req, res) => {
        try {
            const headerAuth = req.headers.authorization;
            const userId = jwt.getUserId(headerAuth);

            if (userId < 0) {
                return res.status(400).json({
                    'error': 'wrong token'
                });
            }

            // Logout user
            const result = await User.logout(userId);
            if(result){
                // Delete session token
                delete req.session.token;
                return res.send(true);
            }else{
                return res.send(false);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    getUserSession: async (req, res) => {

        if(req.session.token){
            // Send token
            return res.send({
                token: 'Bearer ' + req.session.token
            });
        }else{
            return res.send(false);
        }
    }
};