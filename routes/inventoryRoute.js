// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")
const utilities = require("../utilities/") 

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Vehicle detail route
router.get("/detail/:inv_id", invController.buildDetailView);

// Management view
router.get("/", invController.buildManagementView)

// Add Classification
router.get("/add-classification", invController.buildAddClassification)
router.post(
  "/add-classification",
  invValidation.classificationRules(),
  invValidation.checkClassificationData,
  invController.addClassification
)

// Add Inventory
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  invValidation.inventoryRules(),
  invValidation.checkInventoryData,
  invController.addInventory
)


router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;