const express = require('express');
const axios = require('axios');

module.exports = (app, config) => {

    const router = express.Router();

    router.get('/favicon.ico', (req, res) => res.sendStatus(204));
    
    router.get('/api/data', (req, res, next) => {
        console.log('api/data');
        res.send(['a','b','c']);
    });

    router.get('/api/data2', async (req, res, next) => {
      console.log('api/data2');
      let httpAxios = {
        method: 'get',
        url: 'localhost:8080/product/items',
        data: req.body,
        responseType: 'json',
        headers: {'Accept': 'application/json'}
      };
      let request = await axios(httpAxios);
      console.log('resp = '+request);
      res.send(request);
  });

  return router;
};
