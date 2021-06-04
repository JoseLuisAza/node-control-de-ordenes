const express = require('express')//framework para node
const log4js = require("../util/logger");
// objeto para manejar loggers de cors
const loggerServidor = log4js.getLogger('servidor');


const servidor=function(app){
  app.listen(process.env.SERVER_PORT, () => {
  console.log(`control-de-ordenes app escuchando en ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
  loggerServidor.debug(`control-de-ordenes app escuchando en ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);   
});
}
module.exports=servidor;