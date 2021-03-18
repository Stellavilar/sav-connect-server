const jwt = require ('../utils/jwt.utils');

const validateEmail = require ('../utils/mail.utils');

const RepairSheet = require ('../models/RepairSheet');
const Customer = require ('../models/Customer');
const RepairSheets = require('../models/RepairSheet');
const Action = require ('../models/Action');

module.exports = RepairSheetController = {

    findAll: async (req,res) => {
        try {
            const order_repairs = await RepairSheet.findAll();
            if(order_repairs) {
                return res.send(order_repairs);
            }else{
                return res.status(403).send({"error" : "Une erreur s'est produite."});
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    },

    findOne: async (req,res) => {
        try {
            const id = req.params.id;
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            const order_repair = await RepairSheet.findOne(id);
            if(order_repair == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(order_repair);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    add: async (req, res) => {
        try {
            let { 
                device_name,
                device_brand,
                interval_repair,
                urgent,
                customer_id,
                firstname,
                lastname,
                mail,
                phone,
                phone_two,
                customer_detail,
            } = req.body;

            if(customer_id){
                // update customer
                let customer = await Customer.findOne(customer_id);
                if(!firstname) {
                    firstname = customer.firstname;
                }
                if(!lastname) {
                    lastname = customer.lastname;
                }
                if(!mail) {
                    mail = customer.mail;
                }
                if(!phone_two){
                    phone_two = customer.phone_two;
                }
                if(!customer_detail){
                    customer_detail = customer.customer_detail;
                }
                if(!phone) {
                    phone = customer.phone;
                }
                
                if(!validateEmail.validate(mail)){
                    return res.send({"error": "Votre adresse Email n'est pas correct."});
                }

                customer = await Customer.edit(customer.id, firstname, lastname, mail, phone, phone_two, customer_detail);

                if(customer == false) {
                    res.status(403).send({"error": "Une erreur s'est produite lors de la modification du Client."});
                }else{
                    customer_id = customer.id;
                }
            }else{
                // create customer
                const customer = new Customer({
                    firstname,
                    lastname,
                    mail,
                    phone,
                    phone_two,
                    customer_detail
                });
                const result = await customer.save();
                customer_id = result.id;
            }
            let customer = await Customer.findOne(customer_id);
            if(!device_name || !customer_id) {
                return res.status(403).send({"error": "Vous n'avez pas complété tous les champs obligatoire (nom de l'appareil, id du client, id de l'employé, panne de l'appareil)."});
            }

            // New instance Order_repair
            const repairSheet = new RepairSheet({
                device_name,
                customer_id,
            });

            if(device_brand){
                repairSheet.device_brand = device_brand;
            }

            if(interval_repair){
                repairSheet.interval_repair = interval_repair;
            }

            if(urgent && urgent == 1){
                repairSheet.urgent = urgent;
            }

           let headerAuth = req.headers.authorization;
           // On récupère l'id stocké dans le code
           const userId = jwt.getUserId(headerAuth);
           const result = await repairSheet.save();
           // is the result is good
           if(result !== false){
                // ATTENTION il va faloir relier la fiche avec l'employé pour l'historique en récuupérant l'id de l'user dans le token
                const isOk = await RepairSheet.addUserInSav(result.id, userId);

                if(isOk) {
                    // Send data for the new order_repair
                    result.customer = customer;
                    res.send(result);
                }else{
                    res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du OrderRepair."});
                }
            }else{
                    // or send an error with status code 403
                res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du OrderRepair."});
            }
            
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    },

    archive: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await RepairSheet.archive(id);
            if(result) {
                let headerAuth = req.headers.authorization;
                // On récupère l'id stocké dans le code
                const userId = jwt.getUserId(headerAuth);
                await Action.addActionOnSav(3,id,userId);
                res.send(true);
            }else{
                res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }        
    },
    findAllArchives: async (req,res) => {
        try {
            const order_repairs = await RepairSheet.findAllArchives();
            if(order_repairs) {
                return res.send(order_repairs);
            }else{
                return res.status(403).send({"error" : "Une erreur s'est produite."});
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    },

    formStepOne: async (req,res) => {
        try {
            if(!req.body){
                return res.send({"error": "Vous n'avez pas complété le formulaire."});
            }
            let { customer_id, firstname, lastname, mail, phone, phone_two, customer_detail,device_name } = req.body;

            if(!device_name){
                return res.send({"error": "Vous n'avez pas complété de nom d'appareil."});
            }
            customer_id == 'undefined' ? customer_id=null : '';
            customer_id == 'Choisissez un client' ? customer_id=null : '';
            if(!customer_id){
                if(firstname && lastname) {
                    const customer = new Customer({
                        firstname,
                        lastname,
                        phone,
                        phone_two,
                        customer_detail
                    });
    
                    if(mail){
                        if(!validateEmail.validate(mail)){
                            return res.send({"error": "Votre adresse Email n'est pas correct."});
                        }
    
                        customer.mail = mail;
    
                    }else{
                        customer.mail = '';
                    }
                    const result = await customer.save();
                    if(result == false){
                        return res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du client."});
                    }else{
                        customer_id = result.id;
                    }
               }
            }
            customer_id = parseInt(customer_id,10);
            const result = await RepairSheets.formStepOne({
                customer_id,
                device_name
            });

            if(!result){
                return res.send({"error": "Une erreur s'est produite lors de la création de la fiche."});
            }
            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            await Action.addActionOnSav(2,result.id,userId);
            return res.send({"order_number": result});
        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    },
    getStepOne: async (req,res) => {
        try {
            const order_number = req.params.order_number;
            
            if(!order_number){
                return res.send({"error": "Vous n'avez le paramètre nécéssaire."});
            }
            const result = await RepairSheet.getStepOne(order_number);
            if(!result){
                return res.send({"error":"Pas de résultat"});
            }
            return res.send(result);
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    formStepTwo: async (req,res) => {
        try {
            const order_number = req.params.order_number;
            if(!order_number){
                return res.send({"error": "Il manque un paramètre pour éxécuter votre demande."})
            }
            let { device_brand, interval_repair, panne } = req.body;
            if(!device_brand){
                device_brand = '';
            }
            if(!interval_repair){
                interval_repair = null;
            }
            if(!panne){
                panne = '';
            }
            const result = await RepairSheet.formStepTwo({
                device_brand,
                interval_repair,
                panne,
                order_number
            });

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            // const resultAction = await Action.addActionOnSav(4, order_number_id, userId);

            // result ? res.send(true) : res.send(false);
            res.send(result)
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    getStepTwo: async (req,res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await RepairSheet.getStepTwo(order_number);
            !result ? res.send({"error": "Pas de résultat"}) : res.send(result);

        } catch (error) {
            console.log(error);
            return false;
        }
    },
    formStepThree: async (req,res) => {
    try {
        const order_number = req.params.order_number;
        !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

        let {intervention, date_intervention, order_number_id } = req.body;
        
        !intervention ? intervention='' : '';
        !date_intervention ? date_intervention=null : '';

        const result = await RepairSheet.formStepThree({
            intervention,
            date_intervention,
            order_number
        });

        !result ? res.send({"error": "Une erreur s'est produite lors de la modification."}): ''; 

        let headerAuth = req.headers.authorization;
        // On récupère l'id stocké dans le code
        const userId = jwt.getUserId(headerAuth);
        // await Action.addActionOnSav(4, order_number_id, userId);
        
        return res.send(true);
    } catch (error) {
        console.log(error);
        return false;
    }

    },
    getStepThree: async (req,res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await RepairSheet.getStepThree(order_number);
            !result ? res.send({"error": "Pas de résultat"}) : res.send(result);

        } catch (error) {
            console.log(error);
            return false;
        }
    },
    formStepFour: async (req,res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;
            let {devis_is_accepted, date_devis, amount_devis, amount_diag, recall_devis, order_number_id } = req.body;
            !devis_is_accepted ? devis_is_accepted='' : '';
            !date_devis ? date_devis=null : '';
            !amount_devis ? amount_devis=null : '';
            !amount_diag ? amount_diag=null : '';
            recall_devis ? recal_devis = parseInt(recall_devis, 10) : null;
            !recall_devis ? recall_devis=null : '';

            const result = await RepairSheet.formStepFour({
                devis_is_accepted,
                date_devis,
                amount_devis,
                amount_diag,
                recall_devis,
                order_number
            });

            if(!result){
                return res.send({"error": "Une erreur s'est produite lors de la modification."});
            }

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            // await Action.addActionOnSav(4, order_number_id, userId);

            return res.send(true);
        } catch (error) {
            console.trace(error);
            return res.send(false);
        }
    },
    getStepFour: async (req,res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await RepairSheet.getStepFour(order_number);

            // const id = result[0].id;
            // const products = await Product.productBySav(id);
            // if(products){
            //     result[0].products = products;
            // }
            // console.log(result);
            if(!result){
                return res.send({"error": "Pas de résultat"});
            }
            return res.send(result);
        } catch (error) {
            console.log(error);
            return false;
        }
    },


};