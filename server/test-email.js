require('dotenv').config();
const sendOtpMail = require('./src/services/sendOtpMail');

const testEmail = async () => {
    const testRecipient = process.env.EMAIL_USER; // Send to self for testing
    const testOtp = '123456';

    console.log('--- Email Test Start ---');
    console.log(`Using EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`Using EMAIL_PASS: ${process.env.EMAIL_PASS ? '********' : 'NOT SET'}`);

    try {
        await sendOtpMail(testRecipient, testOtp);
        console.log('--- Email Test Success ---');
    } catch (err) {
        console.error('--- Email Test Failed ---');
        console.error(err);
    }
};

testEmail();
