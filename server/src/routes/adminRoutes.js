const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', auth, admin, upload.single('pdf'), adminController.uploadPdf);
router.delete('/pdf/:id', auth, admin, adminController.deletePdf);

module.exports = router;
