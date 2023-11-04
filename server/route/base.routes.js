const express = require('express');
const axios = require('axios');
const cors = require('cors');

module.exports = (app, config) => {

    const router = express.Router();

    app.get('/favicon.ico', cors(), (req, res) => res.sendStatus(204));

    //-- link test 1
    // app.get('/api/test', cors(), (req, res, next) => {
    //     console.log('api/data');
    //     res.send(['a','b','c']);
    // });

    // //-- link test 2
    // app.get('/api/test2', cors(), async (req, res, next) => {
    //   let response = await axios('http://localhost:8080/product/items');
    //   console.log(response.data);
    //   res.status(200).send(response.data);
    // });

    //-- global route
    app.get('*', cors(), async (req, res, next) => {
      // console.log('# url = '+req.url);
      let options = {
        method: req.method,
        url: config.endpoint+req.url,
        data: req.body,
        responseType: 'json',
        headers: {'Accept': 'application/json'}
      };
      let response = await axios(options);
      // console.log(response.data);
      res.status(200).send(response.data);
    });

  return router;
};
