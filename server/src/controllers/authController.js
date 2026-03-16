const Otp = require('../models/Otp');
const User = require('../models/User');
const sendOtpMail = require('../services/sendOtpMail');
const generateToken = require('../services/generateToken');
const generateOtp = require('../utils/generateOtp');

const bcrypt = require('bcrypt');

exports.sendOtp = async (req, res) => {
    // For registration, we expect email, name, mobile, and password.
    // For forgot password, we just expect email.
    const { email, name, mobile, password, isRegistration } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    try {
        const existingOtp = await Otp.findOne({ email });
        if (existingOtp && (Date.now() - (existingOtp.expiresAt.getTime() - 5 * 60 * 1000) < 60000)) {
            return res.status(429).json({ msg: 'Please wait 60 seconds before requesting a new OTP' });
        }

        const user = await User.findOne({ email });
        
        if (isRegistration) {
            if (user) return res.status(400).json({ msg: 'User already exists. Please login.' });
            if (!mobile || !password) return res.status(400).json({ msg: 'Mobile and password are required for registration.' });
        } else {
            // Forgot password flow
            if (!user) return res.status(404).json({ msg: 'User not found. Please register first.' });
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        let updateData = { otp, expiresAt };
        if (isRegistration) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData = { ...updateData, name, mobile, password: hashedPassword };
        }

        console.log(`Generated OTP for ${email}: ${otp}`);

        await Otp.findOneAndUpdate(
            { email },
            updateData,
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
    const { email, otp, newPassword } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });

    try {
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord || otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        let user = await User.findOne({ email });
        const isAdmin = email === process.env.ADMIN_EMAIL;

        if (!user) {
            // Registration completion
            user = await User.create({
                email,
                name: otpRecord.name,
                mobile: otpRecord.mobile,
                password: otpRecord.password,
                isVerified: true,
                role: isAdmin ? 'admin' : 'user'
            });
        } else {
            // Forgot password completion
            if (newPassword) {
                 const salt = await bcrypt.genSalt(10);
                 user.password = await bcrypt.hash(newPassword, salt);
            }
            user.isVerified = true;
            user.role = isAdmin ? 'admin' : user.role;
            await user.save();
        }

        await Otp.deleteOne({ email });

        const token = generateToken(user);
        res.status(200).json({ token, user: { email: user.email, role: user.role, mobile: user.mobile } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during verification' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found. Please register.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({ token, user: { email: user.email, role: user.role, mobile: user.mobile } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -__v');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
