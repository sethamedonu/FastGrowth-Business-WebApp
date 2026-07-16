const Message       = require('../models/Message');
const { sendEmail } = require('../config/ses');

async function submit(req, res, next) {
  try {
    const { name, email, subject, service, message } = req.body;

    // Save to DB
    const saved = await Message.create({ name, email, subject, service, message });

    // Notify admin via SES
    await sendEmail({
      to:      process.env.SES_TO_EMAIL,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service || 'Not specified'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    }).catch(err => console.error('SES error (non-fatal):', err.message));

    res.status(201).json({ success: true, message: 'Message received. We will be in touch soon.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit };
