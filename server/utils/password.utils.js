const regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

module.exports = {

    validate: (password) => {
        if(regExpPassword.test(password)){
            return true;
        }else{
            return false;
        }
    },

};