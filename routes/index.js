var express = require('express');
var router = express.Router();

// import models
require('../models/resource');
// import controllers
const resourceController = require('../controllers/resourceController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.index);
router.get('/resources', resourceController.resource_list);

module.exports = router;

