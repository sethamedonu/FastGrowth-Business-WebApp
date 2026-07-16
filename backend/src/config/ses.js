const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

async function sendEmail({ to, subject, html, text }) {
  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: html,
        },
        Text: {
          Data: text || html.replace(/<[^>]+>/g, ""),
        },
      },
    },
  });

  return ses.send(command);
}

module.exports = {
  ses,
  sendEmail,
};