// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// login activity
router.get("/login", utilities.handleErrors(accountController.buildLogin));


/* ***********************
 * deliver registration view activity
 * unit 4
 * ************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister));


module.exports = router