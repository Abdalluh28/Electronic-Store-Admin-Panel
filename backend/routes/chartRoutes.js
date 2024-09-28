const express = require('express');
const router = express.Router();


const chartController = require('../controllers/chartsController');

router.route('/products').get(chartController.getProducts);
router.route('/categories').get(chartController.getCategories);
router.route('/users').get(chartController.getUsers);




module.exports = router