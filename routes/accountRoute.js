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
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(

  // Unit 4
/*   "/login",
  (req, res) => {
    res.status(200).send('login process')
  } */

  // Unit 5 Modification to Loging Process
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Unit 5 - Account Management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Update account info
router.get("/update/:account_id", utilities.checkLogin, accountController.buildAccountUpdateView);

router.post(
  "/update",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  accountController.updateAccount
);

// Change password
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordUpdateData,
  accountController.updatePassword
);

// Logout activity
router.get("/logout", accountController.logoutAccount)


module.exports = router