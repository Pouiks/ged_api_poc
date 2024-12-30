const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { generateJWT } = require('../utils/jwtUtils');

// Fonction pour générer un token et envoyer un email
exports.generateToken = async (req, res) => {
    const { opportunityId, Data } = req.body;

    if (!opportunityId || !Data || !Array.isArray(Data)) {
        return res.status(400).json({ error: "Toutes les données sont requises" });
    }

    try {
        // Parcourir chaque locataire et garant pour vérifier leur état
        const updatedData = Data.map((locataire) => {
            // Transformer chaque document en fonction de son état
            const updatedLocataire = {};
            Object.entries(locataire).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                    updatedLocataire[key] = {};
                    Object.entries(value).forEach(([docKey, docValue]) => {
                        // Si le document est null, il doit être rempli
                        updatedLocataire[key][docKey] = docValue === null ? null : docValue;
                    });
                } else {
                    updatedLocataire[key] = value;
                }
            });
            return updatedLocataire;
        });

        // Générer le token avec les données mises à jour
        const token = generateJWT({ opportunityId, Data: updatedData });

        // Créer l'URL avec le token
        const url = `${process.env.PORTAL_URL}?token=${encodeURIComponent(token)}`;

        console.log(url); // Afficher l'URL dans la console

        res.status(200).json({ message: "Lien envoyé avec succès", url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.handleDocumentSubmission = (req, res) => {
    const { opportunityId, Data } = req.body;
  
    if (!opportunityId || !Data) {
        console.log("Vérification échouée : opportunityId ou Data manquant.");
        return res.status(400).json({ error: "Toutes les données sont requises" });
    }
  
    try {
      Data.forEach((locataire) => {
        Object.entries(locataire).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([docKey, docValue]) => {
              if (docValue === null) {
                console.log(`Document requis non fourni : ${docKey} pour ${key}`);
              } else {
                console.log(`Document déjà fourni : ${docKey} pour ${key}`);
              }
            });
          }
        });
      });
  
      res.status(200).json({ message: "Données traitées avec succès" });
    } catch (error) {
      console.error("Erreur lors du traitement :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  };
  
// Fonction pour envoyer l'email
async function sendEmail(recipient, url) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Accédez à votre espace de dépôt de documents',
        html: `<p>Veuillez cliquer sur le lien suivant pour accéder à votre espace sécurisé :</p><a href="${url}">${url}</a>`,
    };

    await transporter.sendMail(mailOptions);
}
