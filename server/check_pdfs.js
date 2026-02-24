const mongoose = require('mongoose');
require('dotenv').config();

const PdfSchema = new mongoose.Schema({
    title: String,
    fileUrl: String,
    publicId: String,
    description: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

const Pdf = mongoose.model('Pdf', PdfSchema);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const count = await Pdf.countDocuments();
        console.log('Number of PDFs in DB:', count);
        const pdfs = await Pdf.find().limit(5);
        console.log('First 5 PDFs:', JSON.stringify(pdfs, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
