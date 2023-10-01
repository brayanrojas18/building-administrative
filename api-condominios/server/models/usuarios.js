var config = require('../../server/config.json');
var path = require('path');

//Replace this address with your actual address
var senderAddress = 'brayanmontilla26@gmail.com'; 
var ObjectID = require('mongodb').ObjectID;

module.exports = function(usuarios) {

  //send password reset link when requested
  usuarios.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host_public + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">aquí</a> para restaurar su contraseña';

    usuarios.app.models.Email.send({
      to: info.email,
      from: senderAddress,
      subject: 'Restaurar clave',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email',err);
      console.log('> sending password reset email to:', info.email);
    });
  });
};