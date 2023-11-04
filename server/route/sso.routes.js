const express = require('express');
const ssoController = require('../controller/sso.controller');
const cors = require('cors');

module.exports = (app, config) => {

    const router = express.Router();

    app.get('/sso', cors(), ssoController.ssoService);

  return router;
};
