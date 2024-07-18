const router = require('express').Router();
const memoryUpload = require('../middlewares/multerMemory.middleware');
const uploadFilesToS3 = require('../middlewares/uploadToS3.middleware');
const processFile = require('../middlewares/processFile.middleware');
const { uploadFiles } = require('../controllers/mobileUploads.controller');

router.post('/', memoryUpload, processFile, uploadFilesToS3, uploadFiles);

module.exports = router;