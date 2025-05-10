const path = require('path');

if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
  });
}

global.MONGODB_URI = process.env.MONGODB_URI_LOCAL;
global.BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
