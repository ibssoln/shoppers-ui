const express = require('express');

module.exports = (app, config) => {

    const router = express.Router();

    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    
    app.get('/api/data', (req, res, next) => {
        console.log('api/data');
        res.send(['a','b']);
    });

  return router;
};
