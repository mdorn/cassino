/*
  Helper functions that we can expose and use in our templates
*/
const Handlebars = require('hbs');
const MomentHandler = require("handlebars.moment");
const config = require('../config');

Handlebars.registerHelper('config', function(key) {
  return config[key];
});

Handlebars.registerHelper('dump', function(obj) {
  return JSON.stringify(obj, null, 2);
});

MomentHandler.registerHelpers(Handlebars);
