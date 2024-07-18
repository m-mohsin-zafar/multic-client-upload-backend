const sharp = require('sharp');

const processFile = async (req, res, next) => {
    const { files } = req;
    if (!files) {
        return res.status(400).json({ message: 'No files found' });
    }

    const isImagePresent = files.some((file) => file.mimetype.includes('image'));
    if (isImagePresent) {
        try {
            req.files = await Promise.all(files.map(async (file) => {
                if (file.mimetype.includes('image')) {
                    const image = sharp(file.buffer);
                    if (file.originalname.includes('.webp')) {
                        return file;
                    }
                    const data = await image.webp({ quality: 80 }).toBuffer();
                    const modifiedName = file.originalname.replace(/\..*$/, '.webp');
                    return {
                        ...file,
                        originalname: modifiedName,
                        mimetype: 'image/webp',
                        buffer: data,
                        size: data.length
                    };
                }
                return file;
            }));
        } catch (error) {
            console.log('Error processing image', error);
            return res.status(500).json({ message: 'Error processing image' });
        }
    }
    next();
}

module.exports = processFile;
