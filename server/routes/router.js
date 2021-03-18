const express = require('express');

const router = express.Router();

// page d'accueil
router.get('/', (req, res) => {
    res.send('Hello world !');
});

/**User routes */
const userController = require('../controllers/userController');
router.get('/users', userController.findAll);
router.get('/user/profil', userController.getProfil);
router.get('/user/:id', userController.findOne);
router.get('/archive/user/:id', userController.archive);
router.post('/user/add', userController.add);
router.patch('/user/edit/:id', userController.edit);
router.patch('/user/profil', userController.editProfil);

/**Login/Logout */
const loginController = require ('../controllers/loginController');
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);

/**Customer routes */
const customerController = require ('../controllers/customerController');
router.get('/customers', customerController.findAll);
router.get('/customer/:id', customerController.findOne);
router.post('/customer/add', customerController.add);
router.patch('/customer/edit/:id', customerController.edit);

/**Repair Sheet routes */
const repairSheetController = require ('../controllers/RepairSheetController');
router.get('/repairSheets', repairSheetController.findAll);
router.get('/repairSheet/:id', repairSheetController.findOne);
router.post('/repairSheet/add', repairSheetController.add);

router.post('/repairSheet/stepOne', repairSheetController.formStepOne);
router.get('/repairSheet/stepOne/:order_number', repairSheetController.getStepOne);

router.patch('/repairSheet/stepTwo/:order_number', repairSheetController.formStepTwo);
router.get('/repairSheet/stepTwo/:order_number', repairSheetController.getStepTwo);

router.patch('/repairSheet/stepThree/:order_number', repairSheetController.formStepThree);
router.get('/repairSheet/stepThree/:order_number', repairSheetController.getStepThree);

router.patch('/repairSheet/stepFour/:order_number', repairSheetController.formStepFour);
router.get('/repairSheet/stepFour/:order_number', repairSheetController.getStepFour);

router.get('/repairSheet/archive/:id', repairSheetController.archive);
router.get('/archivedRepairSheets', repairSheetController.findAllArchives);

/**Tags Routes */
const tagController = require ('../controllers/tagController');
router.get('/tag/:id', tagController.findOne);
router.get('/tags', tagController.findAll);
router.get('/tag/:idTag/sav/:idSav', tagController.addTagOnSav);
router.get('/repairSheet/tag/:idSav', tagController.tagsOnSav);
router.get('/remove/:idTag/sav/:idSav', tagController.removeTagOnSav);
router.get('/tag/archive/:id', tagController.archive);
router.post('/tag/add', tagController.add );
router.patch('/tag/edit/:id', tagController.edit);

/**Pannes Routes */
const panneController = require ('../controllers/configPanneController');
const { Router } = require('express');
router.post('/panne/add', panneController.add);
router.get('/pannes', panneController.findAll);
router.get('/panne/:id', panneController.findOne);
router.patch('/panne/edit/:id', panneController.edit);
router.get('/:idConfigPanne/sav/:idSav', panneController.addConfigPanneOnSav);
router.get('/remove/:idPanne/sav/:idSav', panneController.removeConfigPanneOnSav);
router.get('/panne/archive/:id', panneController.archive);

/**Action routes */
const actionController = require ('../controllers/actionController');
router.post('/action/add', actionController.add);
router.patch('/action/edit/:id', actionController.edit);
router.get('/actions', actionController.findAll);
router.get('/action/:id', actionController.findOne);
router.get('/action/:idAction/sav/:idSav', actionController.addActionOnSav);

/**Activity routes */
const activityController = require ('../controllers/activityController');

router.get('/activity/:nb', activityController.allActivities);
router.get('/activity/sav/:order_number', activityController.activitiesForOneSav);
router.get('/activity/user/:userId', activityController.activitiesForOneUser);

/**Search routes */
const searchController = require ('../controllers/searchController');

router.get('/search/user/lastname', searchController.userLastname);
router.get('/search/user/mail', searchController.userMail);
router.get('/search/user/phone', searchController.userPhone);
router.get('/search/user', searchController.user);
router.get('/search', searchController.search);

module.exports = router;