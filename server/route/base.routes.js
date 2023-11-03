const express = require('express');

module.exports = (app, config) => {

    const router = express.Router();

    router.get('/favicon.ico', (req, res) => res.sendStatus(204));
    
    router.get('/api/data', (req, res, next) => {
        console.log('api/data');
        res.send(['a','b','c']);
    });

  return router;
};
