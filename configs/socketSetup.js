const AppSetup = require('./appSetup');

class SocketSetup {
    constructor() {
        this.io = AppSetup.getInstance().io;
        this.redisClient = AppSetup.getInstance().redisClient;
        this.setupSockets();
    }

    setupSockets() {
        this.io.on("connection", async (socket) => {
            const {userId} = socket.handshake.query;

            try {
                await this.redisClient.sadd(`user:${userId}`, socket.id);
            } catch (err) {
                console.error("Error handling connection:", err);
            }

            socket.on("startedUpload", async (data) => {
                try {
                    const activeSockets = await this.redisClient.smembers(`user:${data.userId}`);
                    activeSockets.forEach((socketId) => {
                        this.io.to(socketId).emit("uploadStarted", data);
                    });
                } catch (err) {
                    console.error("Error handling upload start event:", err);
                }
            });

            socket.on("disconnect", async () => {
                try {
                    await this.redisClient.srem(`user:${userId}`, socket.id);
                } catch (err) {
                    console.error("Error handling disconnection:", err);
                }
            });
        });
    }
}

module.exports = SocketSetup;