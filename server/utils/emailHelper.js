const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const {GMAIL_API_KEY} = process.env;

function replaceContent(content, creds) {
  // creds = {name:"John", otp:1234}
  const allKeys = Object.keys(creds);
  allKeys.forEach(function (key) {
    content = content.replace(`#{${key}}`, creds[key]);
  });
  return content;
}

async function EmailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname, "email_templates", templateName);
    const content = await fs.promises.readFile(templatePath, "utf-8");
    const emailDetails = {
      to: receiverEmail,
      from: '"Vedic Vedang.AI" <tanmay.kothale8@gmail.com>',
      subject: "OTP Verfication",
      text: `Hi ${creds.name}, Your OTP is ${creds.otp}`,
      html: replaceContent(content, creds),
    };
    const transportDetails = {
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "tanmay.kothale8@gmail.com",
        pass: GMAIL_API_KEY,
      },
    };

    const transporter = nodemailer.createTransport(transportDetails);
    await transporter.sendMail(emailDetails,(error,info) => {
      if (error) {
        console.error("Error sending email:", error);
        throw error;
      }
      console.log("Email sent successfully:", info.response);
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = EmailHelper;