var ObjectID = require('mongodb').ObjectID;
var loopback = require('loopback')

module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Model.defineProperty('condominium', {type: ObjectID});


  Model.observe('before save', async function(ctx) {
    var token = ctx.options.accessToken
    if (token) {
      var usuarios = Model.app.models.usuarios
      var users = await usuarios.find({
        where: {
          id: token.userId
        }
      })
      if(users[0].condominium && users[0].role == 'admin')
        ctx.instance.condominium = ObjectID(users[0].condominium)
    }
    return
  });

  Model.observe('access', async function(ctx) {
    var token = ctx.options.accessToken
    if (token) {
      var usuarios = Model.app.models.usuarios
      var users = await usuarios.find({
        where: {
          id: token.userId
        }
      })
      if(users[0].condominium && users[0].role == 'admin'){
        ctx.query.where.condominium = ObjectID(users[0].condominium)
      }
    }
    return
  });
  
}