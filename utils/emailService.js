const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

exports.sendEmail = async (email, link) => {
  console.log("Tentative d'envoi de mail...");
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_USER,
            Name: "Uxco group",
          },
          To: [
            {
              Email: email,
            },
          ],
          TemplateID: 6602291,
          TemplateLanguage: true,
          Subject: "Finalisez votre dossier de réservation pour votre appartement",
          Variables: {
            link, // Assurez-vous que "link" est correctement passé ici
          },
        },
      ],
    });

    const response = await request;
    console.log("Réponse de Mailjet :", JSON.stringify(response.body, null, 2));
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error.message || error);
    throw error;
  }
};
