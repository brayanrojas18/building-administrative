'use strict';

const multer = require('multer');
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node')
const moment = require('moment')
const axios = require('axios');

module.exports = async function (cargas_masivas) {

    const readFile = async (ruta, type) => {
        var file = await readXlsxFile(__dirname + '/files/cargas-masivas/' + ruta).then((v) => {
            return v
        })

        var company = {}
        var usuarios = Pagos.app.models.usuarios
        var users = await usuarios.find({
            where: {
              id: access.userId
            }
        })
        if(users[0].condominium && users[0].role == 'admin'){
            company.condominium = users[0].condominium
            company.byUser = access.userId
        }

        var posis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ']
        var errores = []
        var error = {}

        switch(type){
            case 'usuarios':

                var usuarios = cargas_masivas.app.models.usuarios
                var users = await usuarios.find({
                    where: {
                        role: 'user',
                    }
                })
                users = users.length ? users : []


                if (!file.length) {
                    error.message = 'Se ha cargado un archivo en blanco'
                    errores.push(error)
                    error = {}
                    return errores
                }

                var cedula = file[0].indexOf('Cedula')
                var nombres = file[0].indexOf('Nombres')
                var apellidos = file[0].indexOf('Apellidos')
                var fecha_nacimiento = file[0].indexOf('Fecha de nacimiento')
                var codigo = file[0].indexOf('Codigo de casa')
                var email = file[0].indexOf('Email')
                var telefono = file[0].indexOf('Numero de telefono')
                var data = []

                for (let i = 1; i < file.length; i++) {

                    // VALIDAR DATOS
                    if (file[i][cedula] == null) {
                        error.ubicacion = posis[cedula] + (i + 1)
                        error.message = 'Campo "Cedula" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }else{

                        if (typeof file[i][cedula] != 'number') {
                            error.ubicacion = posis[cedula] + (i + 1)
                            error.message = 'La cedula ' +  file[i][cedula] + ' no es valida. Asegurese de que sea solo numeros'
                            errores.push(error)
                            error = {}
                        }
                        var repetidos = file.filter(v => {
                            var array = []
                            var res = v.find(e => e == file[i][cedula])
                            if (res) array.push(res)
                            if (array.length) return array
                        })
                        if (repetidos.length > 1) {
                            error.ubicacion = posis[cedula] + (i + 1)
                            error.message = 'El usuario con el siguiente número de cedula ' +  file[i][cedula] + ' se repite en el archivo'
                            errores.push(error)
                            error = {}
                        }
                        var repetidos2 = users.find(v => v.identity_card == file[i][cedula])
                        if (repetidos2) {
                            error.ubicacion = posis[cedula] + (i + 1)
                            error.message = 'El usuario con el siguiente número de cedula ' +  file[i][cedula] + ' ya está registrado en el sistema'
                            errores.push(error)
                            error = {}
                        }
                    }
                    if (file[i][nombres] == null) {
                        error.ubicacion = posis[nombres] + (i + 1)
                        error.message = 'Campo "Nombres" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }
                    if (file[i][apellidos] == null) {
                        error.ubicacion = posis[apellidos] + (i + 1)
                        error.message = 'Campo "Apellidos" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }
                    if (file[i][fecha_nacimiento] == null) {
                        error.ubicacion = posis[fecha_nacimiento] + (i + 1)
                        error.message = 'Campo "Fecha de nacimiento" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }
                    if (file[i][codigo] == null) {
                        error.ubicacion = posis[codigo] + (i + 1)
                        error.message = 'Campo "Codigo de casa" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }
                    if (file[i][email] == null) {
                        error.ubicacion = posis[email] + (i + 1)
                        error.message = 'Campo "Email" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }else{
                        if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                          .test(file[i][email])){
                            error.ubicacion = posis[email] + (i + 1)
                            error.message = 'La dirección de "Email" no es valida'
                            errores.push(error)
                            error = {}
                        }
                        var emails = users.filter(v => v.email == file[i][email])
                        if (emails.length){
                            error.ubicacion = posis[email] + (i + 1)
                            error.message = `Se encontro en el sistema un usuario con la misma dirección de email en el archivo que se intenta cargar: ${file[i][email]}`
                            errores.push(error)
                            error = {}
                        }
                    }
                    if (file[i][telefono] == null) {
                        error.ubicacion = posis[telefono] + (i + 1)
                        error.message = 'Campo "Numero de telefono" está vacío o es diferente y es requerido'
                        errores.push(error)
                        error = {}
                    }else{
                        if (typeof file[i][telefono] != 'number') {
                            error.ubicacion = posis[telefono] + (i + 1)
                            error.message = 'El campo "Numero de telefono" no debe de tener letras solo números'
                            errores.push(error)
                            error = {}
                        }
                    }

                    //AGREGAR DATOS
                    data.push({
                        first_name: file[i][nombres],
                        last_name: file[i][apellidos],
                        identity_card: file[i][cedula],
                        email: file[i][email],
                        phone: file[i][telefono],
                        password: file[i][cedula] + '_User123!',
                        house_code: file[i][codigo],
                        role: 'user',
                        birthdate: moment(file[i][fecha_nacimiento]).format('YYYY/MM/DD'),
                        ...company
                    })
                }
                if (!file[1]) {
                    error.message = 'No se han encontrado datos en el archivo'
                    errores.push(error)
                    error = {}
                }

                if (errores.length) {
                    let hash = {}
                    errores = errores.filter(o => hash[o.message] ? false : hash[o.message] = true)
                    return errores
                }else{
                   // CREAR DATOS
                   cargas_masivas.app.models.usuarios.create(data)
                   return true
                }
            break;
        }
    }

    var uploadedFileName = '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var dirPath = 'server/models/files/cargas-masivas'
            if (!fs.existsSync(dirPath)) {
                var dir = fs.mkdirSync(dirPath);
            }
            cb(null, dirPath + '/');
        },
        filename: async function (req, file, cb) {
            var fileName = file.originalname;
            uploadedFileName = fileName;
            cb(null, fileName);
        }
    });

    cargas_masivas.upload = function (req, res, cb) {
        var upload = multer({
            storage: storage
        }).array('file', 12);
        upload(req, res, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.json(uploadedFileName);
            }
        });        
    };

    cargas_masivas.read = async function (type, answer, cb) {
        var answer = await readFile(uploadedFileName, type) 
        return answer
    };

    cargas_masivas.remoteMethod('upload',   {
        accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
        }, {
            arg: 'res',
            type: 'object',
            http: {
                source: 'res'
            }
        }],
        returns: {
            arg: 'result',
            type: 'string'
        }
    });

    cargas_masivas.remoteMethod('read',   {
        accepts: [
            {
                arg: 'type',
                type: 'string'
            },
            {
                arg: 'answer', 
                type: 'array'
            }
        ],
        returns: {arg: 'result', type: 'any'}
    });
};