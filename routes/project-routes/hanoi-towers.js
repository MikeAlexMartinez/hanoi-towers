'use strict';

// Application data
const views = 'my-projects/hanoi-towers/';

const allRoutes = [
  {
    method: 'get',
    route: '/',
    fn: function homePage(req, res) {
        res.render(`${views}home`, {title: 'Hanoi Towers'});
    }
  }
];

module.exports = allRoutes;