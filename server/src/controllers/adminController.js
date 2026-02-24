const Pdf = require('../models/Pdf');
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
