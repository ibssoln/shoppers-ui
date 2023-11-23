const express = require('express');
const roleController = require('../controller/role.controller');
const cors = require('cors');

module.exports = (app, config) => {

    const router = express.Router();

    app.get('/role', cors(), roleController.getRolesAndPolicies);

  return router;
};
