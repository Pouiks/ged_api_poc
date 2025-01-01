const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.url}`);
    next();
});
console.log("PORTAL_URL chargé depuis .env :", process.env.PORTAL_URL);

// Routes
const gedRoutes = require("./routes/gedRoutes");
app.use("/api/ged", gedRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API GED en cours d'exécution sur http://localhost:${PORT}`);
});
