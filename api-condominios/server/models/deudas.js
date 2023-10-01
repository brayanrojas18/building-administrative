'use strict';
var ObjectID = require('mongodb').ObjectID;

module.exports = function(Deudas) {

	// OBTENER USUARIOS
	const get_usuarios = async (condominium) => {
		var users = Deudas.app.models.usuarios
		users = await users.find({
            where: {
                role: 'user',
                condominium
            }
        })
        users = users.length ? users : []

        var deudas = Deudas.app.models.deudas
		deudas = await deudas.find()
        deudas = deudas.length ? deudas : []

        var array = []
        if (users.length) {
        	for(let i in users){
        		var user = users[i]

        		var find = deudas.find(v => v.usuario == String(user.id))
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

    Deudas.get_users = async function (condominium) {
		var result = await get_usuarios(condominium)
		return result
	};

	const select = async (id, condominium) => {
        var deudas = Deudas.app.models.deudas
		deudas = await deudas.find({
            where: {
                usuario: ObjectID(id),
                condominium
            }
        })
        deudas = deudas.length ? deudas : []

        var array = []
       	if (deudas.length) {
       		for(let i in deudas) {
       			var deuda = deudas[i]
       			
       			array.push(deuda)
       		}
       	}

       	return array
    }

    Deudas.selected = async function (id, condominium) {
		var result = await select(id, condominium)
		return result
	};

	Deudas.remoteMethod('selected',   {
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

    Deudas.remoteMethod('get_users',   {
        accepts: [
            {
                arg: 'condominium',
                type: 'string'
            }
        ],
        returns: {arg: 'result', type: 'array'}
    });


};
