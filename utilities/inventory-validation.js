const { body, validationResult } = require("express-validator")
const utilities = require("./")
const invModel = require("../models/inventory-model")

/* ***************************
 *  Add Classification Rules
 * ************************** */
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("Classification name must be alphanumeric with no spaces or special characters."),
  ]
}

/* ***************************
 *  Check Classification Data
 * ************************** */
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
    })
    return
  }
  next()
}

/* ***************************
 *  Add Inventory Rules
 * ************************** */
const inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Valid year is required."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    body("classification_id")
      .isInt()
      .withMessage("Classification selection is required."),
  ]
}

/* ***************************
 *  Check Inventory Data
 * ************************** */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body, // Keep form sticky
    })
    return
  }
  next()
}


/* ***************************
 *  Check Update Data
 *  For inventory item updates; errors sent to edit view
 * ************************** */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("inventory/edit-inventory", {
      title: "Edit " + req.body.inv_make + " " + req.body.inv_model,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id: req.body.inv_id, 
      ...req.body  
    })
    return
  }
  next()
}






module.exports = {

  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
  checkUpdateData,

  
}
