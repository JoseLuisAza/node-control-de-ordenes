const express = require('express')//framework para node
var router = express.Router();
const connection=require("./coneccion_mysql");
const formidableMiddleware = require('express-formidable');//para manejar multipart/form-data
const cors=require("../seguridad/cors");

router.use(
  formidableMiddleware(),
  cors
);


router.post('/addUser', (req, res) => {
    console.log('addUser');
      connection.query('INSERT INTO vendedor(idvendedor) VALUES("'+req.fields.user_id+'")', function (error, results, fields) {
        if (error) throw error;
        console.log('Usuario registrado!');
        res.send('Usuario registrado!');
      });
    })
  
  
/*Metodo para saber si un usuario ya esta registrado*/ 
router.post('/isUserRegistered', (req, res) => {
    console.log('isUserRegistered');
    /*Hacemos la consulta a la base de datos*/ 
    connection.query('SELECT idvendedor FROM vendedor WHERE idvendedor="'+req.fields.user_id+'"', function (error, results, fields) {
    if (error)
    {
        throw error;
    }   
    if(results.length>=1)
    {
        console.log("true");
        res.send('true');
    }
    else{
        console.log("false");
        res.send('false');
    }
    });
});

router.post('/getArticulos', (req, res) => {
    console.log('/getArticulos');
    connection.query('SELECT idproducto,nombre,precio,ruta,detalle,fecha_creado FROM producto WHERE estado="activo" AND vendedor_idvendedor="'+req.fields.user_id+'"', function (error, results, fields) {
        if (error)
        {
          throw error;
        }      
        console.log(results.length);
    setTimeout(() => {
      res.status(200).send(JSON.stringify(results));
    }, 1500);     

  });
});

module.exports=router;