const Pdf = require('../models/Pdf');
const axios = require('axios');

exports.getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find().sort({ createdAt: -1 });
        // Only returning basic info to the frontend
        res.json(pdfs.map(p => ({
            _id: p._id,
            title: p.title,
            description: p.description,
            category: p.category,
            createdAt: p.createdAt
        })));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.streamPdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ msg: 'PDF not found' });

        const response = await axios({
            method: 'get',
            url: pdf.fileUrl,
            responseType: 'stream'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + pdf.title + '.pdf"');

        response.data.pipe(res);
    } catch (err) {
        console.error('Error streaming PDF:', err);
        res.status(500).send('Error retrieving PDF');
    }
};
