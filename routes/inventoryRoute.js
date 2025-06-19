// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView)

// Management view (requires login + Admin or Employee)
router.get("/", utilities.checkLogin, utilities.checkAccountType, invController.buildManagementView)

// Add Classification
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, invController.buildAddClassification)
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidation.classificationRules(),
  invValidation.checkClassificationData,
  invController.addClassification
)

// Add Inventory
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, invController.buildAddInventory)
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidation.inventoryRules(),
  invValidation.checkInventoryData,
  invController.addInventory
)

// Edit Inventory View
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
)

// JSON route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Update Inventory
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidation.inventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router
