/*Importaciones*/
const express = require('express')//framework para node
const app = express()//iniciamos express

const ambiente=require("./servidor/ambiente");
const servidor=require("./servidor/servidor");
const crud_articulos = require("./rutas/CRUD_articulos");
const publico= require("./rutas/publico");
const reportes= require("./rutas/reportes");
const tienda= require("./rutas/tienda");
const usuario= require("./rutas/usuario");


//usamos formidableMiddleware para manejar la data que llega
// app.use(
//   formidableMiddleware(),
//   cors,
// );

ambiente();
servidor(app);
// app.listen(process.env.SERVER_PORT, () => {
//   console.log(`control-de-ordenes app escuchando en ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
//   // loggerServidor.debug(`control-de-ordenes app escuchando en ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);   
// });
app.use('/tienda',tienda);
app.use('/usuario',usuario);
app.use('/reportes',reportes);
app.use('/crud',crud_articulos);
app.use("/publico",publico);





  


  app.get('/', (req, res) => {
    res.send('Hola mundo!')
  });
  









  
  





