const express = require('express')//framework para node
var router = express.Router();
const connection=require("./coneccion_mysql");
const formidableMiddleware = require('express-formidable');//para manejar multipart/form-data
const cors=require("../seguridad/cors");
const checkScopes = require('../seguridad/scopeVerify');
const checkJwt = require('../seguridad/auth0TokenVerify');

router.use(
  formidableMiddleware(),
  cors
);


router.post('/ventasPorProducto',checkJwt,checkScopes, (req, res) => {
    console.log('ventasPorProducto');
    connection.query(`SELECT p.idproducto,p.nombre,p.detalle, sum(dv.subtotal) as venta
                      FROM producto as p 
                      JOIN detalle_venta as dv 
                      ON p.idproducto=dv.producto_idproducto 
                      JOIN vendedor as v
                      ON v.idvendedor=p.vendedor_idvendedor
                      WHERE v.idvendedor="${req.fields.user_id}"
                      GROUP BY(p.idproducto)`, function (error, results, fields) {
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
  
  router.post('/ventas', checkJwt, checkScopes,(req, res) => {
    console.log('ventas');
    connection.query(`SELECT ve.idventa,ve.fecha_de_venta,ve.total
                      FROM venta as ve
                      JOIN detalle_venta as dv 
                      ON ve.idventa=dv.venta_idventa
                      JOIN producto as p 
                      ON p.idproducto=dv.producto_idproducto
                      JOIN vendedor as v
                      ON v.idvendedor=p.vendedor_idvendedor
                      WHERE v.idvendedor="${req.fields.user_id}"
                      GROUP BY(ve.idventa)`, function (error, results, fields) {
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
  
  
  router.post('/promedioDePrecios',checkJwt,checkScopes, (req, res) => {
    console.log('promedioDePrecios');
    connection.query(`SELECT COUNT(idproducto) as producto,
                      AVG(p.precio) as promedio
                      FROM producto as p
                      JOIN vendedor v
                      ON v.idvendedor=p.vendedor_idvendedor
                      WHERE v.idvendedor="${req.fields.user_id}"`, function (error, results, fields) {
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