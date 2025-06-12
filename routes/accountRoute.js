// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// login activity
router.get("/login", utilities.handleErrors(accountController.buildLogin));


/* ***********************
 * deliver registration view activity
 * unit 4
 * ************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/* ***********************
 * unit 4
 * register account activity
 * ************************/
router.post('/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router