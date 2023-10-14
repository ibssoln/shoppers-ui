const http = require('http');
require('dotenv').config();

const CONFIG = require('./config/setting.js')[process.env.APP_ENV || 'dev'];
const PORT = process.env.PORT || '3000';

const app = require('./controller/app.js')(CONFIG);
const server = http.createServer(app);

server.listen(PORT);
server.on('listening', () => {
  console.log(`Server is listening on ${server.address().port}`);
});

