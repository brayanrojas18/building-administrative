'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = function(Adelantos) {

	// OBTENER USUARIOS
	const get_usuarios = async (condominium) => {
		var users = Adelantos.app.models.usuarios
		users = await users.find({
            where: {
                role: 'user',
                condominium
            }
        })
        users = users.length ? users : []

        var adelantos = Adelantos.app.models.adelantos
		adelantos = await adelantos.find()
        adelantos = adelantos.length ? adelantos : []

        var array = []
        if (users.length) {
        	for(let i in users){
        		var user = users[i]

        		var find = adelantos.find(v => v.usuario == String(user.id))
        		if (find) {
	        		array.push({
	        			nombre: user.first_name,
		        		apellido: user.last_name,
		        		cedula: user.identity_card,
		        		numero_casa: user.house_code,
		        		id: user.id,
	        		})
        		}
        	}
        }
        return array
    }

    Adelantos.get_users = async function (condominium) {
		var result = await get_usuarios(condominium)
		return result
	};

	const select = async (id, condominium) => {
        var adelantos = Adelantos.app.models.adelantos
		adelantos = await adelantos.find({
            where: {
                usuario: ObjectID(id),
                condominium
            }
        })
        adelantos = adelantos.length ? adelantos : []

        var array = []
       	if (adelantos.length) {
       		for(let i in adelantos) {
       			var adelanto = adelantos[i]
       			
       			array.push(adelanto)
       		}
       	}

       	return array
    }

    Adelantos.selected = async function (id, condominium) {
		var result = await select(id, condominium)
		return result
	};

	Adelantos.remoteMethod('selected',   {
        accepts: [
            {
                arg: 'id', 
                type: 'string'
            },
            {
                arg: 'condominium',
                type: 'string'
            }
        ],
        returns: {arg: 'result', type: 'array'}
    });

    Adelantos.remoteMethod('get_users',   {
        accepts: [
            {
                arg: 'condominium',
                type: 'string'
            }
        ],
        returns: {arg: 'result', type: 'array'}
    });


};
