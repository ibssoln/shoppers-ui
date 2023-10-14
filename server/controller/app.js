const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('../route/routes.js');

module.exports = (config) => {

    const app = express();

    app.use('/', express.static(path.join(__dirname, '../public')));
    app.use(express.json());
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
