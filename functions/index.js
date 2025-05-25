const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

exports.notifyNewUser = functions.auth.user().onCreate((user) => {
  const mailOptions = {
    from: '"City Discoverer" <noreply@citydiscoverer.ai>',
    to: "youremail@example.com", // 👈 replace with your own email
    subject: "🚨 New User Registered",
    html: `
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>UID:</strong> ${user.uid}</p>
    `
  };

  return transporter.sendMail(mailOptions).then(() => {
    console.log("📩 Notification sent!");
  }).catch((error) => {
    console.error("Failed to send email:", error);
  });
});
