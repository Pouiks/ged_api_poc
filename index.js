const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
const gedRoutes = require('./routes/gedRoutes');
app.use('/api/ged', gedRoutes);


// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API GED en cours d'exécution sur http://localhost:${PORT}`);
});
