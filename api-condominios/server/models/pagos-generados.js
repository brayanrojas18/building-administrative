'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = function(Pagosgenerados) {

	// OBTENER PAGOS
	const get_pago = async (id, condominium) => {
		var pagos = Pagosgenerados.app.models.pagos
		pagos = await pagos.find({
            where: {
                pago_id: ObjectID(id),
                condominium
            }
        })
        pagos = pagos.length ? pagos : []

        var adelantos = Pagosgenerados.app.models.adelantos
		adelantos = await adelantos.find({
            where: {
                pago_id: ObjectID(id),
                condominium
            }
        })
        adelantos = adelantos.length ? adelantos : []

        var deudas = Pagosgenerados.app.models.deudas
		deudas = await deudas.find({
            where: {
                pago_id: ObjectID(id),
                condominium
            }
        })
        deudas = deudas.length ? deudas : []

        var array = []
        if (pagos.length) {
        	for(var i in pagos) {
        		var pago = pagos[i]
            
            // Find and match the user's payment with its advance/debt
	        	var adelanto = adelantos.find(userWithAdvance => {
              if(userWithAdvance.usuario.toString() === ObjectID(pago.usuario).toString()) {
                return userWithAdvance
              }
            })
	        	var deuda = deudas.find(userWithDebt => {
              if(userWithDebt.usuario.toString() === ObjectID(pago.usuario).toString()) {
                return userWithDebt
              }
            })

	        	array.push({
	        		nombre: pago.nombre,
	        		apellido: pago.apellido,
	        		cedula: pago.cedula,
	        		numero_casa: pago.numero_casa,
	        		amount: pago.amount,
	        		mensualidad_config: pago.mensualidad_config,
	        		descontar_adelanto: pago.descontar_adelanto ? 'Si' : 'No',
	        		adelanto: adelanto ? adelanto.amount : 0,
	        		deuda: deuda ? deuda.amount : 0,
	        	})
	        }
        }

        return array
    }
	
	Pagosgenerados.get_pagos = async function (id, condominium) {
		var result = await get_pago(id, condominium)
		return result
	};

    // ELIMINAR PAGOS
    const eliminar_pagos = async (id) => {
        var pagos = Pagosgenerados.app.models.pagos
        var pagos_generate = Pagosgenerados.app.models['pagos-generados']
        var adelantos = Pagosgenerados.app.models.adelantos
        var deudas = Pagosgenerados.app.models.deudas

        // ELIMINAR
        await pagos_generate.deleteById(ObjectID(id))
        await pagos.destroyAll({ pago_id: ObjectID(id) })
        await adelantos.destroyAll({ pago_id: ObjectID(id) })
        await deudas.destroyAll({ pago_id: ObjectID(id) })

        return true
    }

    Pagosgenerados.delete_pago = async function (id) {
        var result = await eliminar_pagos(id)
        return result
    };

    Pagosgenerados.remoteMethod('get_pagos',   {
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
        returns: {arg: 'result', type: 'any'}
    });

    Pagosgenerados.remoteMethod('delete_pago',   {
        accepts: [
            {
                arg: 'id',
                type: 'string'
            }
        ],
        returns: {arg: true, type: 'boolean'}
    });
};
