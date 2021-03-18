const regExpMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

module.exports = {

    validate: (email) => {
        if(regExpMail.test(email)){
            return true;
        }else{
            return false;
        }
    },

};