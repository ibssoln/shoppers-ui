const express = require('express');
const roleController = require('../controller/role.controller');

module.exports = (app, config) => {

    const router = express.Router();

    router.get('/role', roleController.getRolesAndPolicies);

  return router;
};
