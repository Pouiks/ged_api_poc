const express = require("express");
const router = express.Router();
const { generateToken, handleDocumentSubmission } = require("../controllers/gedController");

// Route pour générer un token
router.post("/generate-token", (req, res, next) => {
    console.log("Route /generate-token atteinte !");
    next();
  }, generateToken);
// Route pour soumettre les documents
router.post("/submit-documents", handleDocumentSubmission);

module.exports = router;
