const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('../route/routes.js');
const compression = require('compression');
const https = require('https');
const httpContext = require('express-http-context');
const fs = require('fs');
const cors = require('cors');

module.exports = (config) => {

    const app = express();

    app.use('/', express.static(path.join(__dirname, '../public')));
    app.use(express.json());
    app.use(httpContext.middleware);
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', routes(app, {}));

    if (config.env === 'dev') {
        app.locals.pretty = true;
        console.log(`The environment: ${config.env}`);
    }

    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.status = (err.status || 500);
        res.locals.error = (config.env === 'dev' ? err : {});
        console.error(`An error occurred. ${err.stack}`);
        res.render('An error occurred.');
    });

    return app;
};
