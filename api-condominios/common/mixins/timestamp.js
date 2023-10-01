var ObjectID = require('mongodb').ObjectID;

module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Model.defineProperty('createdAt', {type: Date, default: '$now'});
  Model.defineProperty('updatedAt', {type: Date, default: '$now'});
  Model.defineProperty('byUser', {type: ObjectID});

  Model.observe('before save', async function(ctx) {

    var data = ctx.instance || ctx.data

    if(ctx.isNewInstance){
      data.createdAt = new Date()
      if(ctx.options.accessToken && ctx.options.accessToken.userId)
        data.byUser = ctx.options.accessToken.userId
    }
    else
      data.updatedAt = new Date()

    if(!Model.definition || !Model.definition.properties || typeof Model.definition.properties != 'object')
      return

    for(var i in Model.definition.properties){
      if(Model.definition.properties[i].type && Model.definition.properties[i].type.constructor.name == 'Function' && Model.definition.properties[i].type.name == 'ObjectID' && (typeof data[i] == "string" || typeof data[i] == "number"))
        data[i] = ObjectID(data[i])
    }

    return
  });
  
}