// Account baseController 
// Unit 4, deliver login view activity
const utilities = require("../utilities/")

/* ***********************
 * deliver login view activity
 * unit 4
 * ************************/

async function buildLogin(req, res, next) {
 
    let nav = await utilities.getNav()
    res.render("account/login", { 
      title: "Login", 
      nav, 
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
      errors: null
    })
}



module.exports = {
  buildLogin, buildRegister
}