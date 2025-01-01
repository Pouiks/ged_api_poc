const { generateJWT } = require("../utils/jwtUtils");
const { sendEmail } = require("../utils/emailService");

// Fonction pour générer un token et envoyer un email
exports.generateToken = async (req, res) => {
  const { opportunityId, email, locataires } = req.body;

  if (!opportunityId || !email || !Array.isArray(locataires)) {
    console.error(
      "Données manquantes : opportunityId, email ou locataires mal formatés."
    );
    return res.status(400).json({
      error: "Toutes les données (opportunityId, email, locataires) sont requises et doivent être au format attendu.",
    });
  }

  try {
    // Mise à jour des locataires et documents
    const updatedLocataires = locataires.map((locataire) => {
      const updatedGarants = locataire.garants.map((garant) => {
        if (!garant) return null;
        const updatedDocuments = {};
        Object.entries(garant.documents || {}).forEach(([docKey, docValue]) => {
          updatedDocuments[docKey] = docValue === null ? null : docValue;
        });
        return { ...garant, documents: updatedDocuments };
      });

      const updatedRepresentantLegal = locataire.representantLegal
        ? {
            documents: Object.entries(locataire.representantLegal.documents || {}).reduce(
              (acc, [docKey, docValue]) => {
                acc[docKey] = docValue === null ? null : docValue;
                return acc;
              },
              {}
            ),
          }
        : null;

      return {
        ...locataire,
        garants: updatedGarants,
        representantLegal: updatedRepresentantLegal,
      };
    });

    // Générer le token avec les données mises à jour
    const token = generateJWT({ opportunityId, locataires: updatedLocataires });

    if (!token) {
      console.error("Erreur lors de la génération du token");
      return res.status(500).json({
        error: "Erreur interne lors de la génération du token",
      });
    }

    // Générer l'URL avec le token
    const portalUrl = process.env.PORTAL_URL;
    const link = `${portalUrl}?token=${encodeURIComponent(token)}`;
    console.log("Lien généré avec succès :", link);

    // Envoyer l'email via Mailjet
    try {
      await sendEmail(email, link);
      console.log(`Email envoyé avec succès à ${email}`);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email :", emailError);
      return res.status(500).json({
        error: "Le lien a été généré mais une erreur est survenue lors de l'envoi de l'email.",
      });
    }

    // Réponse réussie
    res.status(200).json({
      message: "Lien généré avec succès et email envoyé.",
      url: link,
    });
  } catch (error) {
    console.error("Erreur interne lors de la génération du token :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.handleDocumentSubmission = (req, res) => {
    const { opportunityId, locataires } = req.body;

    if (!opportunityId || !Array.isArray(locataires)) {
        console.log("Validation échouée : opportunityId ou locataires manquants ou incorrects.");
        return res.status(400).json({ error: "Toutes les données sont requises et doivent être au format attendu." });
    }

    try {
        locataires.forEach((locataire) => {
            locataire.garants.forEach((garant, index) => {
                if (garant) {
                    Object.entries(garant.documents || {}).forEach(([docKey, docValue]) => {
                        if (docValue === null) {
                            console.log(
                                `Document requis manquant : ${docKey} pour le garant ${index + 1} du locataire ${locataire.profil}`
                            );
                        } else {
                            console.log(`Document fourni : ${docKey} pour le garant ${index + 1} du locataire ${locataire.profil}`);
                        }
                    });
                }
            });

            if (locataire.representantLegal) {
                Object.entries(locataire.representantLegal.documents || {}).forEach(([docKey, docValue]) => {
                    if (docValue === null) {
                        console.log(
                            `Document requis manquant : ${docKey} pour le représentant légal du locataire ${locataire.profil}`
                        );
                    } else {
                        console.log(`Document fourni : ${docKey} pour le représentant légal du locataire ${locataire.profil}`);
                    }
                });
            }
        });

        res.status(200).json({ message: "Données traitées avec succès" });
    } catch (error) {
        console.error("Erreur lors du traitement des données :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
