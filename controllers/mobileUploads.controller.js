const {redisClient, io} = require('../configs/appSetup').getInstance();

async function uploadFiles(req, res) {
     try {
         // the below implementation is a dummy one
         const {token} = req.query;
         const files = req.files.map((file) => {
             return file.key
         });
         if (files && files.length > 0){
             const activeSockets = await redisClient.smembers(`user:${token}`);
             activeSockets.forEach((socketId) => {
                 io.to(socketId).emit("uploadComplete", files);
             });
             return res.status(200).json({keys: files})
         }
         return res.status(200).json({keys: []})
     } catch (e) {
         return res.status(500).json({message: e})
     }
}

module.exports = {uploadFiles}