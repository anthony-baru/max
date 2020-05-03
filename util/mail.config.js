const nodemailer = require('nodemailer');

const sendMail = (email, subject, html, cb) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            cb(err, null);
            console.log(err);
        } else {
            cb(null, data)
        }
    });
};

module.exports = sendMail;

