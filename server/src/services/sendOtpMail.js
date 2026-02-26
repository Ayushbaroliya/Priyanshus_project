const nodemailer = require('nodemailer');

const sendOtpMail = async (email, otp) => {
    console.log(`Attempting to send OTP to: ${email}`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Udeniya Project OTP',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (err) {
        console.error('Error sending email:', err);
        throw new Error(`Could not send OTP: ${err.message}`);
    }
};

module.exports = sendOtpMail;
