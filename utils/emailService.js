const mailjet = require("node-mailjet");

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

exports.sendEmail = async (email, link) => {
  console.log("Tentative d'envoi de mail...");
  try {
    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_USER, // Email expéditeur (configuré dans .env)
            Name: "Uxco group", // Nom de l'expéditeur
          },
          To: [
            {
              Email: email, // Email destinataire
            },
          ],
          TemplateID: 6602291, // Remplacez par l'ID de votre template Mailjet existant
          TemplateLanguage: true, // Utilise les variables définies dans le template
          Subject: "Finalisez votre dossier de réservation pour votre appartement", // Sujet de l'email
          Variables: {
            link: link, // Lien généré pour déposer les documents
          },
        },
      ],
    });

    const response = await request;
    console.log(`Email envoyé avec succès à ${email}:`, response.body);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email à ${email}:`, error);
    throw error; // Relance l'erreur pour gestion par l'appelant
  }
};
