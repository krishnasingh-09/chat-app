const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config({path: "../config.env"})
sgMail.setApiKey(process.env.SG_KEY);

 sendMail = async ({
  to,
  recipient,
  sender,
  subject,
  html,
  attachments,
  text,
}) => {
  try {
    //const from = "process";
    const from = sender || "singhkrishnakeshav@gmail.com"

    const msg = {
      to: recipient, // Change to your recipient
      //from: "singhkrishnakeshav@gmail.com",
      //email: process.env.FROM_EMAIL, // Change to your verified sender
      from: from,
      subject: 'OTP Verifification Code',
      html: html,
     text: text,
      attachments,
    };

    
    return sgMail.send(msg);
  console.log('Email sent')
  } catch (error) {
    console.log(error);
    console.error("Error sending email:", error);
   // throw new Error("Failed to send email");
  }
};

exports.sendEmail = async (args) => {
  if (process.env.NODE_ENV === "development") {
    return  new Promise.resolve();
  } else {
    //return sgMail(args);
    return sendSGMail(args);
  }
};
