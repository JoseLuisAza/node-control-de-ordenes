var mysql= require('mysql');//modulo para conectar con myslq database

var connection = mysql.createConnection({//configuracion para conecciond de base de datos
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'control-de-ordenes'
  });

  module.exports=connection;