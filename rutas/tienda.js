const express = require('express')//framework para node
var router = express.Router();
const rxjs = require('rxjs');//modulo de node para manejar archivos y carpetas
const connection=require("./coneccion_mysql");
const formidableMiddleware = require('express-formidable');//para manejar multipart/form-data
const cors=require("../seguridad/cors");

router.use(
  formidableMiddleware(),
  cors
);

router.post('/getArticulosGeneral', (req, res) => {
    console.log('/getArticulosGeneral');
    connection.query('SELECT idproducto,nombre,precio,ruta,detalle,fecha_creado FROM producto WHERE estado="activo" AND vendedor_idvendedor !="'+req.fields.user_id+'"', function (error, results, fields) {
        if (error)
        {
          throw error;
        }      
        console.log(results.length);
    setTimeout(() => {
      res.status(200).send(JSON.stringify(results));
    }, 300);     
  
  });
  });

router.post('/finishShop',  (req, res)=> {
    console.log('finishShop');
    let date=moment().format('YYYY-MM-DD hh:mm:ss');//obtenemos la fecha y hora
    connection.query('INSERT INTO venta(fecha_de_venta,total,vendedor_idvendedor) VALUES("'+date+'",'+req.fields.total+',"'+req.fields.user_id+'")', function (error, results, fields) {
      if (error) throw error;
      res.status(200).send(JSON.stringify(results));
    });
  });
  
  router.post('/finishShop2',  (req, res)=> {
    console.log('finishShop2');
    var affectedRows=0;
    const obs$=new rxjs.Observable(subscriber => {
      let cont=0;
        for (const property in req.fields) 
        {
            connection.query(`INSERT INTO detalle_venta(producto_idproducto,venta_idventa,cantidad,subtotal) VALUES(${req.fields[property].idproducto},${req.fields[property].idventa},${req.fields[property].cantidad},${req.fields[property].subtotal})`, function (error, results, fields) {
            if (error) throw error;
            affectedRows=affectedRows+results.affectedRows;
            cont++;
            if(cont==Object.keys(req.fields).length)
            {
              subscriber.next(affectedRows);
            }
            });
        }
  
  
    });
  
    obs$.subscribe(
      data=>{
        console.log('affectedRows '+ data);
        res.status(200).send(JSON.stringify(data));
      }
    );
  });


module.exports=router;