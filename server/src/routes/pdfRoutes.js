const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const auth = require('../middleware/authMiddleware');

router.get('/all', auth, pdfController.getAllPdfs);
router.get('/:id', auth, pdfController.streamPdf);

module.exports = router;
