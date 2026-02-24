const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    name: { type: String },
    expiresAt: { type: Date, required: true, index: { expires: '5m' } }
});

module.exports = mongoose.model('Otp', OtpSchema);
