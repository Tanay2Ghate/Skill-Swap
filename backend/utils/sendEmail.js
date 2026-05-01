const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n--- MOCK EMAIL ---');
    console.log('TO:', options.to);
    console.log('SUBJECT:', options.subject);
    console.log('HTML:', options.html);
    console.log('------------------\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
