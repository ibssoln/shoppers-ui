const express = require('express');

module.exports = (app, config) => {

    const router = express.Router();

    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    
    app.get('/', (req, res, next) => {
        console.log('works');
        res.send('works');
    });

  return router;
};
