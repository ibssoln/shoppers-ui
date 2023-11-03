const express = require('express');
const ssoController = require('../controller/sso.controller');

module.exports = (app, config) => {

    const router = express.Router();

    router.get('/sso', ssoController.ssoService);

  return router;
};
