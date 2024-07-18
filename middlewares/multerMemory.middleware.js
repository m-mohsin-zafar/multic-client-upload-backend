const multer = require("multer");

const storage = multer.memoryStorage();
const memoryUpload = multer({ storage: storage }).any("files");

module.exports = memoryUpload;