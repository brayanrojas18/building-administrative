// Copyright IBM Corp. 2014,2017. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var dsConfig = require('../datasources.json');
var path = require('path');

module.exports = function(app) {
  var Usuario = app.models.usuarios;

  //send an email with instructions to reset an existing user's password
  app.post('/api/request-password-reset', function(req, res, next) {
    Usuario.resetPassword({
      email: req.query.email
    }, function(err) {
      if (err) return res.status(401).send(err);
      res.send(true)
    });
  });
};