const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  try {
    const nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
  } catch (err) {
    next(err)
  }
}

module.exports = baseController