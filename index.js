const dotenv = require('dotenv');
dotenv.config();

const {app, server, redisClient} = require('./configs/appSetup').getInstance();
const SocketSetup = require('./configs/socketSetup');
const mobileUploadsRoute = require('./routes/mobileUploads.route');

app.use('/mobile-uploads', mobileUploadsRoute);

// Initialize the socket setup
const socketSetup = new SocketSetup();

// Start the server
const PORT = process.env.PORT || 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
