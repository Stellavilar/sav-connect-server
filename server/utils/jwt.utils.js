const jwt = require ('jsonwebtoken');

module.exports = {

    generateUserToken: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.role_id
        }, 
        process.env.JWT_SIGN_SECRET,
        {
            expiresIn: '24h'
        });
    },

    parseAuthorization: (authorization) => {
        return (authorization !== null ) ? authorization.split(' ')[1] : null;
    },

    getUserId: (authorization) => {
        let userId = -1;
        const token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try {
                const jwtToken = jwt.verify(token, process.env.JWT_SIGN_SECRET);
                if(jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch (error) {}
            
        }
        return userId;
    }
}