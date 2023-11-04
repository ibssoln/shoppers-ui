const express = require('express');
const axios = require('axios');
const cors = require('cors');

module.exports = (app, config) => {

    const router = express.Router();

    router.get('/favicon.ico', cors(), (req, res) => res.sendStatus(204));

    app.get('/api/test', cors(), (req, res, next) => {
        console.log('api/data');
        res.send(['a','b','c']);
    });

    app.get('/api/test2', cors(), async (req, res, next) => {
      console.log('api/data2');
      let httpAxios = {
        method: 'get',
        url: 'http://localhost:8080/product/items',
        data: req.body,
        responseType: 'json',
        headers: {'Accept': 'application/json', }
      };
      let request = await axios(httpAxios);
      // console.log('resp = '+request);
      res.send(request);
  });

  return router;
};
