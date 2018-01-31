'use strict';

// Third party modules
const express = require('express');
const router = express.Router();

// Application data
const routes = require('./project-routes/hanoi-towers');

// api routes
router.use('/api', require('./api'));

routes.forEach(({method, route, fn}) => {
  router[method](route, fn);
});

// fallback route
router.all('*', function notFound(req, res) {
  res.send('Page not found!');
});

module.exports = router;