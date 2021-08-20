//Felipe Guilermmo Santuche Moleiro - 10724010

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service-controller');

router.post('/', serviceController.post);
router.get('/', serviceController.get);
router.delete('/', serviceController.delete);
router.put('/update/:id', serviceController.put);
router.get('/admin/:id', serviceController.getById);
router.get('/getHours', serviceController.getHours);
router.post('/schedule', serviceController.schedule);
router.post('/getSchedule', serviceController.getSchedule);

//router.get('/getScheduled', serviceController.getHours);

module.exports = router;