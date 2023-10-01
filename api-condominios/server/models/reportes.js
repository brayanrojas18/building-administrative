'use strict';

var _ = require('lodash')
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment')

module.exports = function(Reportes) {

	const saveExcel = ({workbook, path}) => {

		var mkdirp = require('mkdirp');

		return new Promise(resolve => {

			var dir = path.split('/')
			dir.pop()
			dir = dir.join('/')

			mkdirp(__dirname + '/files/' + dir, async function(){

				await workbook.xlsx.writeFile(__dirname + '/files/' + path)

				resolve(path)

			})
		})
	}

	const saveReporte = ({data, columns, name}) => {

		return new Promise(resolve => {

			var Excel = require('exceljs');

		  var workbook = new Excel.Workbook();

		  workbook.creator = 'Cambios';
		  workbook.lastModifiedBy = 'Cambios';
		  workbook.created = new Date();
		  workbook.modified = new Date();
		  workbook.lastPrinted = new Date();
		  workbook.properties.date1904 = true;

		  var worksheet = workbook.addWorksheet('Reporte');

		  worksheet.columns = columns.map(val => {

		    var width = val.label.length + 5

		    data.forEach((v,k) => {
		      if(("" + v[val.field]).length > width)
		        width = ("" + v[val.field]).length
		    })

		    return{
		      header: val.label,
		      key: val.field,
		      width: width + 5
		    }
		  })

		  data.forEach((val,key) => {
		    columns.forEach((v,k) => {
		    	var value = v.type == 'number' ? Number(Number(val[v.field]).toFixed(2)) + '' + '$' : val[v.field]
		      worksheet.getRow(key+2).getCell(k+1).value = value
		    })
		  })


		  saveExcel({
		    workbook,
		    path: 'reportes/' + moment().valueOf() + '/' + name + '.xlsx'
		  }).then(res => resolve(res))

		})

	}

	const getData = async function(type,month,year,condominium) {

		var Adelantos = Reportes.app.models.adelantos
		var Deudas = Reportes.app.models.deudas
		var Pagos = Reportes.app.models.pagos

		var data = []

		switch(type){

			case 'adelantos':

				var Adelantos = await Adelantos.find({
					where: {
						active: true,
						month: Number(month),
						year: Number(year),
						condominium
					}
				})

				data = Adelantos
			break;

			case 'deudas':

				var Deudas = await Deudas.find({
					where: {
						active: true,
						month: Number(month),
						year: Number(year),
						condominium
					}
				})

				data = Deudas
			break;

			case 'pagos':

				var Pagos = await Pagos.find({
					where: {
						month: Number(month),
						year: Number(year),
						condominium
					}
				})

				data = Pagos
			break;
		}

    return data

  }

  Reportes.get = getData

  	Reportes.generar = async function(type,month,year,condominium){
  		switch(type){

			case 'adelantos':

				var data = await getData(type,month,year,condominium)
				if(!data.length) return 'vacio'
				var url = await saveReporte({
					data: data,
					columns: [{
						label: 'Nombre',
						field: 'nombre'
					},{
						label: 'Apellido',
						field: 'apellido'
					},{
						label: 'Cédula',
						field: 'cedula'
					},{
						label: 'Código de Casa',
						field: 'numero_casa',
					},{
						label: 'Mes',
						field: 'month',
					},{
						label: 'Año',
						field: 'year',
					},{
						label: 'Monto',
						field: 'amount',
						type: 'number'
					},{
						label: 'Mensualidad Configurada',
						field: 'mensualidad_config',
						type: 'number'
					},],
					name: 'Reporte de Adelantos Pendientes'
				})

			break;

			case 'deudas':

				var data = await getData(type,month,year)
				if(!data.length) return 'vacio'
				var url = await saveReporte({
					data: data,
					columns: [{
						label: 'Nombre',
						field: 'nombre'
					},{
						label: 'Apellido',
						field: 'apellido'
					},{
						label: 'Cédula',
						field: 'cedula'
					},{
						label: 'Código de Casa',
						field: 'numero_casa',
					},{
						label: 'Mes',
						field: 'month',
					},{
						label: 'Año',
						field: 'year',
					},{
						label: 'Monto',
						field: 'amount',
						type: 'number'
					},{
						label: 'Mensualidad Configurada',
						field: 'mensualidad_config',
						type: 'number'
					},],
					name: 'Reporte de Deudas Pendientes'
				})

			break;

			case 'pagos':

				var data = await getData(type,month,year)
				if(!data.length) return 'vacio'
				var url = await saveReporte({
					data: data,
					columns: [{
						label: 'Nombre',
						field: 'nombre'
					},{
						label: 'Apellido',
						field: 'apellido'
					},{
						label: 'Cédula',
						field: 'cedula'
					},{
						label: 'Código de Casa',
						field: 'numero_casa',
					},{
						label: 'Mes',
						field: 'month',
					},{
						label: 'Año',
						field: 'year',
					},{
						label: 'Monto',
						field: 'amount',
						type: 'number'
					},{
						label: 'Mensualidad Configurada',
						field: 'mensualidad_config',
						type: 'number'
					},],
					name: 'Reporte de Pagos Generados'
				})

			break;
		}
		return url
  	}

	Reportes.remoteMethod('generar', {
  	accepts: [{
  		arg: 'type',
  		type: 'string'
  	},{
  		arg: 'month',
  		type: 'number'
  	},{
  		arg: 'year',
  		type: 'number'
  	},
  	{
        arg: 'condominium',
        type: 'string'
    }],
    returns: {arg: 'result', type: 'string'}
  });

  Reportes.remoteMethod('get', {
  	accepts: [{
  		arg: 'type',
  		type: 'string'
  	},{
  		arg: 'month',
  		type: 'number'
  	},{
  		arg: 'year',
  		type: 'number'
  	},
  	{
        arg: 'condominium',
        type: 'string'
    }],
    returns: {arg: 'result', type: 'array'}
  });

};
