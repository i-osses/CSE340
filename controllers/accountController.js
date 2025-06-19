// Account baseController 
// Unit 4, deliver login view activity
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***********************
 * deliver login view activity
 * unit 4
 * ************************/

async function buildLogin(req, res, next) {
 
let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "", 
    })
}

/* ***********************
 * deliver registration view activity
 * unit 4
 * ************************/

async function buildRegister(req, res, next) {
 
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "", // Sticky support
    account_lastname: "",
    account_email: ""
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body


  // Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hash(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  return res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email
  })
}



const regResult = await accountModel.registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    // res.status(201).render("account/login", {
    //   title: "Login",
    //   nav,
    // })

    res.redirect("/account/login")

  } else {
    req.flash("notice", "Sorry, the registration failed.")
     res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
 *  Process login request* 
 *  Unit 5* 
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Unit 5 Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    notice: null
  })
}

/* ****************************************
 *  Deliver account update view
 * **************************************** */
async function buildAccountUpdateView(req, res) {
  const account_id = parseInt(req.params.account_id)
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}


/* ****************************************
 *  Process account update form
 * **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed. Please try again.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}


/* ****************************************
 *  Process password update form
 * **************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    return res.redirect("/account/")
  } catch (error) {
    req.flash("notice", "Something went wrong. Please try again.")
    res.status(500).redirect("/account/")
  }
}

/* ****************************************
 * Logout process: clear the JWT cookie
 * *************************************** */
function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}







module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin,
  buildAccountManagement,
  buildAccountUpdateView,
  updateAccount,
  updatePassword,
  logoutAccount
}