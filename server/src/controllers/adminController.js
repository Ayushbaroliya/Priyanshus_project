const Pdf = require('../models/Pdf');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.uploadPdf = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const { title } = req.body;
        if (!title) return res.status(400).json({ msg: 'Title is required' });

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'raw', folder: 'udeniya_pdfs' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary Upload Success:', result.secure_url);
                        resolve(result);
                    }
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const newPdf = new Pdf({
            title,
            fileUrl: result.secure_url,
            uploadedBy: req.user.id
        });

        await newPdf.save();
        res.status(201).json(newPdf);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during PDF upload' });
    }
};

exports.deletePdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ msg: 'PDF not found' });

        await pdf.deleteOne();
        res.json({ msg: 'PDF removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -__v').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error fetching users' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) {
            return res.status(400).json({ msg: 'Cannot delete your own admin account' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await user.deleteOne();
        res.json({ msg: 'User removed completely' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error deleting user' });
    }
};
