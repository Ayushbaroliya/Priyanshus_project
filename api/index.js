const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');

// Connect to Database
connectDB();

module.exports = app;
