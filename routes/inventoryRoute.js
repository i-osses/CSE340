// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Vehicle detail route
router.get("/detail/:inv_id", invController.buildDetailView);

// Management view
router.get("/", invController.buildManagement)

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


module.exports = router;