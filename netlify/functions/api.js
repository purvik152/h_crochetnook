const serverless = require('serverless-http');
const app = require('../../server'); // Path to the existing Express app

// Wrap the Express app
module.exports.handler = serverless(app);
