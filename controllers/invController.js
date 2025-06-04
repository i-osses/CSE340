const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}


/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryDetailById(inv_id)
    const html = await utilities.buildVehicleDetailHTML(data)
    const nav = await utilities.getNav()
    const title = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/vehicle-detail", {
      title,
      nav,
      detail: html,
    })
  } catch (err) {
    next(err)
  }
};

module.exports = invCont
