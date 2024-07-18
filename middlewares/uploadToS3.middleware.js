const s3 = require("../configs/s3Configs");
const randomToken = require("random-token").create("abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const {Readable} = require("stream");

const generate = () => {
    return randomToken(16);
};

const generateFileName = (file, prefix = "") => {
    const uniqueName = generate() + Date.now().toString() + file.originalname.match(/\..*$/)[0];
    return prefix + uniqueName.replace(/ /g, "_");
};

const uploadFilesToS3 = async (req, res, next) => {
    const { files } = req;
    if (!files) {
        return res.status(400).json({ message: 'No files found' });
    }

    try {
        req.files = await Promise.all(files.map(async (file) => {
            let filename = "";
            filename = `images/mobile-uploads/` + generateFileName(file);            

            const command = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: filename,
                Body: Readable.from(file.buffer),
                ContentType: file.mimetype,
                ContentLength: file.size
            });
            const res = await s3.send(command);
            return {
                ...file,
                key: filename,
                mimetype: file.mimetype,
                size: file.size
            };
        }));
    } catch (error) {
        console.log('Error uploading files', error);
        return res.status(500).json({ message: 'Error uploading files' });
    }
    next();
}

module.exports = uploadFilesToS3;