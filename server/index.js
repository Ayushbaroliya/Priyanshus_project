const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

module.exports = app;
