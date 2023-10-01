'use strict';

 const Excel = require('exceljs');
 var mkdirp = require('mkdirp');

module.exports = async function (plantillas) {

    const saveExcel = async (workbook, path) => {
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

    const plantilla = async (type) => {
        var cols = {}
        switch(type){
            case 'usuarios':
                cols.data = ['Cedula', 'Nombres', 'Apellidos', 'Fecha de nacimiento', 'Codigo de casa', 'Email', 'Numero de telefono']
                cols.name = 'Plantilla de Usuarios'
            break;
        }

        const workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet(cols.name);
        var posis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ']

        for (let x = 0; x < cols.data.length; x++) {
            worksheet.getCell(posis[x] + 1).value = cols.data[x];
        }
        let path = `plantillas/${cols.name}.xlsx`
        await saveExcel(workbook, path)
        return path
    }

    plantillas.download = async function (type, path) {
        var path = await plantilla(type) 
        return path
    };


    plantillas.remoteMethod('download',   {
        accepts: [
            {
                arg: 'type',
                type: 'string'
            },
            {
                arg: 'path', 
                type: 'string'
            }
        ],
        returns: {arg: 'result', type: 'any'}
    });
};