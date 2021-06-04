const express = require('express')//framework para node
var router = express.Router();
const connection=require("./coneccion_mysql");
const formidableMiddleware = require('express-formidable');//para manejar multipart/form-data
const cors=require("../seguridad/cors");

router.use(
  formidableMiddleware(),
  cors
);

router.get('/getArticulosStore', (req, res) => {
    console.log('/getArticulosStore');
    connection.query('SELECT idproducto,nombre,precio,ruta,detalle,fecha_creado FROM producto WHERE estado="activo"', function (error, results, fields) {
        if (error)
        {
          throw error;
        }      
        console.log(results.length);
    setTimeout(() => {
      res.status(200).send(JSON.stringify(results));
    }, 0);     
  
  });
  });


  module.exports=router;