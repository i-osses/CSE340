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


/* ***************************
 *  Build management inventory view
 * ************************** */
invCont.buildManagementView = async function (req, res, next){
  let nav = await utilities.getNav()
  // This is the empty space ...
  const classificationSelect = await utilities.buildClassificationList() // 
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
    message: null,
  })
}

/* ***************************
 *  Build edit inventory view
Unit 5 - Update Inventory
 * ************************** */

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryDetailById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}



// GET: Add Classification Form
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

//  POST: Process Classification Form
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

// GET: Add Inventory Form
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventry",
    nav,
    classificationList,
    errors: null,
  })
}

// POST: Process Inventory Form
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (result) {
    req.flash("notice", "Inventory item successfully added.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

console.log("Update Inventory request body:", req.body);

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const id = Number(inv_id) // Ensure it's an integer

  const updateResult = await invModel.updateInventory(
    id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}





module.exports = invCont



