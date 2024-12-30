const express = require('express');
const router = express.Router();
const { generateToken,handleDocumentSubmission , sendEmail } = require('../controllers/gedController');

// Route pour générer un token et envoyer un email
router.post('/generate-token', generateToken);
router.post("/submit-documents", handleDocumentSubmission);


// Exporter les routes
module.exports = router;
