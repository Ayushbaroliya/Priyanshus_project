const Otp = require('../models/Otp');
const User = require('../models/User');
const sendOtpMail = require('../services/sendOtpMail');
const generateToken = require('../services/generateToken');
const generateOtp = require('../utils/generateOtp');

exports.sendOtp = async (req, res) => {
    const { email, name, isRegistration } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    try {
        const existingOtp = await Otp.findOne({ email });
        if (existingOtp && (Date.now() - (existingOtp.expiresAt.getTime() - 5 * 60 * 1000) < 60000)) {
            return res.status(429).json({ msg: 'Please wait 60 seconds before requesting a new OTP' });
        }

        const user = await User.findOne({ email });
        if (isRegistration && user) {
            return res.status(400).json({ msg: 'User already exists. Please login.' });
        }
        if (!isRegistration && !user) {
            return res.status(404).json({ msg: 'User not found. Please register first.' });
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        console.log(`Generated OTP for ${email}: ${otp}`);

        await Otp.findOneAndUpdate(
            { email },
            { otp, expiresAt, name },
            { upsert: true, new: true }
        );

        console.log(`Saved OTP to database for ${email}`);

        await sendOtpMail(email, otp);
        res.status(200).json({ msg: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error in sendOtp controller:', err);
        res.status(500).json({ msg: 'Server error while sending OTP', error: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });

    try {
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord || otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        let user = await User.findOne({ email });
        const isAdmin = email === process.env.ADMIN_EMAIL;

        if (!user) {
            user = await User.create({
                email,
                name: otpRecord.name,
                isVerified: true,
                role: isAdmin ? 'admin' : 'user'
            });
        } else {
            user.isVerified = true;
            user.role = isAdmin ? 'admin' : user.role;
            if (otpRecord.name) user.name = otpRecord.name;
            await user.save();
        }

        await Otp.deleteOne({ email });

        const token = generateToken(user);
        res.status(200).json({ token, user: { email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during verification' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
