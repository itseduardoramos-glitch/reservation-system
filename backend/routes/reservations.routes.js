const express = require('express');
const router = express.Router();

//Calling methods from the controllers
const {
    postDate,
    releaseReservation,
    confirmReservation
} = require('../controllers/reservations.controller');

//Route to save the date temporary
router.post('/', postDate);
//This endpoint runs when the front-end app is closed
router.post('/release-slot', express.text(), releaseReservation);
//This endpoint confirms the reservation
router.post("/confirm", express.text(), confirmReservation);


module.exports = router;