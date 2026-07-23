const  Router = require('express');
const sendContactMessage = require('../controllers/contact.controller.js');
const router = Router();

router.post('/', sendContactMessage);

module.exports = router