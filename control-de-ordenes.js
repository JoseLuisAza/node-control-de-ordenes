/*Importaciones*/
const express = require('express')//framework para node
var mysql= require('mysql');//modulo para conectar con myslq database
var moment = require('moment'); //modulo para trabajar con fechas
const cors = require('cors');//modulo para activar el CORS para solicitudes de varios puertos
const fs = require('fs');//modulo de node para manejar archivos y carpetas
const formidableMiddleware = require('express-formidable');//para manejar multipart/form-data

/*Variables y Constantes */
const app = express()//iniciamos express
const port = 3000;//puerto donde va a escuchar el servidor
var connection = mysql.createConnection({//configuracion para conecciond de base de datos
  host     : 'localhost',
  user     : 'root',
  password : '@Sangreazul1',
  database : 'control-de-ordenes'
});

//usamos formidableMiddleware para manejar la data que llega
app.use(formidableMiddleware());

app.use(function (req, res, next)
{
    // Para que podamos conectarnos desde angular desde el puerto 4200
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Los metdos que vamo a aceptar en el servidor
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // Si en caso se manejan sesiones
    res.setHeader('Access-Control-Allow-Credentials', true);
    // pasa a la siguiente capa del middleware
    next();
})
  





  app.get('/', (req, res) => {
    res.send('Hola mundo!')
  });
  
  app.listen(port, () => {
    console.log(`control-de-ordenes app escuchando en http://localhost:${port}`)
  });