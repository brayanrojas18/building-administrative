'use strict';
var ObjectID = require('mongodb').ObjectID;

module.exports = function(Pagos) {

	// OBTENER USUARIOS
	const get_usuarios = async (condominium) => {
		var users = Pagos.app.models.usuarios
		users = await users.find({
            where: {
                role: 'user',
                condominium
            }
        })
        users = users.length ? users : []

        var adelantos = Pagos.app.models.adelantos
		adelantos = await adelantos.find({
            where: {
                active: true,
                condominium
            }
        })
        adelantos = adelantos.length ? adelantos : []

        var array = []
        if (users.length) {
        	for(let i in users){
        		var user = users[i]

        		var filter = adelantos.filter(v => v.usuario == ObjectID(user.id))
        		var descontar_adelanto = false
        		var descontar_disponibles = false
        		if (filter.length) {
        			descontar_adelanto = true
        			descontar_disponibles = true
        		}

        		array.push({
        			nombre: user.first_name,
	        		apellido: user.last_name,
	        		cedula: user.identity_card,
	        		numero_casa: user.house_code,
	        		user_id: user.id,
	        		amount: null,
	        		descontar_disponibles: descontar_disponibles,
	        		descontar_adelanto: descontar_adelanto
        		})
        	}
        }
        return array
    }
	
	Pagos.get_users = async function (condominium) {
		var result = await get_usuarios(condominium)
		return result
	};

	// PAGO AUTOMATICO
	const automatico = async (usuarios, year, month, full_pay, condominium) => {
		var mensualidad = Pagos.app.models.mensualidades
		mensualidad = await mensualidad.find({
            where: {
                year: year,
                month: month,
                condominium
            }
        })
        mensualidad = mensualidad.length ? mensualidad : []

        var array = []
        if (mensualidad[0]) {
        	for(let i in usuarios){
        		var user = usuarios[i]
        		var form = {}

        		form.nombre =  user.nombre
        		form.apellido = user.apellido
        		form.cedula = user.cedula
        		form.user_id = user.user_id
        		form.numero_casa = user.numero_casa
        		form.month = Number(month)
        		form.year = year
        		form.amount = full_pay ? mensualidad[0].amount : null,
        		form.descontar_disponibles = user.descontar_disponibles
        		form.descontar_adelanto = user.descontar_adelanto
        		array.push(form)
        	}
        	return array
        }
	}

	Pagos.automatico = async function (usuarios, year, month, full_pay, condominium) {
		var result = await automatico(usuarios, year, month, full_pay, condominium)
		return result
	};

	// GENERAR PAGO
	const generate_pago = async (datos, year, month, access) => {

		var company = {}
		var usuarios = Pagos.app.models.usuarios
	    var users = await usuarios.find({
	        where: {
	          id: ObjectID(access.userId)
	        }
	    })
	    if(users[0].condominium && users[0].role == 'admin'){
	    	company.condominium = users[0].condominium
	    	company.byUser = access.userId
	    }

		var pagar = Pagos.app.models.pagos
    var pagos_generate = Pagos.app.models['pagos-generados']
		var deudas = Pagos.app.models.deudas

		var adelantos = Pagos.app.models.adelantos
		var adelantos_get = await adelantos.find({
            where: {
                active: true
            }
        })
        adelantos_get = adelantos_get.length ? adelantos_get : []

		var mensualidad = Pagos.app.models.mensualidades
		mensualidad = await mensualidad.find({
            where: {
                year: year,
                month: Number(month),
            }
        })
        mensualidad = mensualidad.length ? mensualidad : []

        var array_pagos = []
        var array_adelantos = []
        var array_deudas = []
        var pago_id = await pagos_generate.create({
            year: year,
            month: Number(month),
            ...company
        })
        for(let i in datos) {
        	var dato = datos[i]

        	var amount = 0
        	var validar = false

        	//VERIFICAR SI EL MONTO ES MAYOR A LA MENSUALIDAD ESTABLECIDA, DE SER ASI SE GUARDA EL 
        	// RESTO EN ADELANTOS
        	if (dato.amount > mensualidad[0].amount){
        		validar = true
        		array_adelantos.push({
                    pago_id: pago_id.id,
        			usuario: dato.user_id,
        			nombre: dato.nombre,
	        		apellido: dato.apellido,
	        		cedula: dato.cedula,
	        		numero_casa: dato.numero_casa,
        			year: year,
        			month:  Number(month),
        			amount: dato.amount - mensualidad[0].amount,
        			active: true,
                    mensualidad_config: mensualidad[0].amount,
        			...company
        		})
        		amount = mensualidad[0].amount
        	}

        	//VERIFICAR SI EL MONTO ES MENOR A LA MENSUALIDAD ESTABLECIDA, DE SER ASI SE GUARDA EL 
        	// FALTANTE EN DEUDAS
        	if (dato.amount < mensualidad[0].amount){
        		validar = true
        		array_deudas.push({
                    pago_id: pago_id.id,
        			usuario: dato.user_id,
        			nombre: dato.nombre,
	        		apellido: dato.apellido,
	        		cedula: dato.cedula,
	        		numero_casa: dato.numero_casa,
        			year: year,
        			month: Number(month),
        			amount: mensualidad[0].amount - dato.amount,
        			pagada: false,
                    mensualidad_config: mensualidad[0].amount,
        			...company
        		})
        		amount = dato.amount
        	}	

        	// BUSCAR ADELANTOS PARA DESCONTAR
        	var mensual = mensualidad[0].amount
        	if (dato.descontar_adelanto) {
        		var filter = adelantos_get.filter(v => v.usuario == dato.user_id)
        		if (filter.length) {
        			var amount_adel = 0
        			filter.forEach(async v => {
        				if (v.amount == mensual){
        					var dato = await adelantos.findById(v.id)
        					dato.active = false
        					dato.month_pago = Number(month)
        					dato.year_pago = Number(year)
        					dato.save()
        				}
        				if (v.amount < mensual) {
        					amount_adel += v.amount
        					if (amount_adel != mensual) {
        						var dato = await adelantos.findById(v.id)
	        					dato.active = false
	        					dato.month_pago = Number(month)
        						dato.year_pago = Number(year)
	        					dato.save()
        					}
        				}
        			})
        		}
        	}

        	array_pagos.push({
                pago_id: pago_id.id,
        		usuario: dato.user_id,
        		year: year,
        		month: Number(month),
        		nombre: dato.nombre,
        		apellido: dato.apellido,
        		cedula: dato.cedula,
        		numero_casa: dato.numero_casa,
        		amount: dato.amount,
                mensualidad_config: mensualidad[0].amount,
                descontar_adelanto: dato.descontar_adelanto ? true : false,
        		...company
        	})
        }

        if (array_adelantos.length) 
        	await adelantos.create(array_adelantos)
        if (array_deudas.length) 
        	await deudas.create(array_deudas)

        await pagar.create(array_pagos)
        return true
		
	}

	Pagos.generar = async function (datos, year, month, token) {
		var access = token.accessToken
		var result = await generate_pago(datos, year, month, access)
		return result
	};

	Pagos.remoteMethod('automatico',   {
        accepts: [
            {
                arg: 'usuarios',
                type: 'array'
            },
            {
                arg: 'year', 
                type: 'number'
            },
            {
                arg: 'month', 
                type: 'number'
            },
            {
                arg: 'full_pay', 
                type: ' boolean'
            },
            {
                arg: 'condominium',
                type: 'string'
            }
        ],
        returns: {arg: 'result', type: 'any'}
    });

    Pagos.remoteMethod('get_users',   {
        accepts: [
            {
                arg: 'condominium',
                type: 'string'
            }
        ],
        returns: {arg: 'result', type: 'any'}
    });

    Pagos.remoteMethod('generar',   {
        accepts: [
            {
                arg: 'datos',
                type: 'array'
            },
            {
                arg: 'year',
                type: 'number'
            },
            {
                arg: 'month',
                type: 'number'
            },
            {arg: "token", type: "object", http: {source: "req"}},
        ],
        returns: {arg: 'result', type: 'boolean'}
    });
};
