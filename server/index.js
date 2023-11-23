const http = require('http');
const express = require('express');
require('dotenv').config();

const CONFIG = require('./config/setting.js')[process.env.APP_ENV || 'dev'];
const PORT = process.env.PORT || '3000';

const app = require('./controller/app.js')(CONFIG);
app.use(express.static('dist/shoppers-ui'));
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.redirect('/');
});

server.listen(PORT);
server.on('listening', () => {
  console.log(`Server is listening on ${server.address().port}`);
});
