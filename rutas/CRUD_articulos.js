const express = require('express')//framework para node
var router = express.Router();
const fs = require('fs');//modulo de node para manejar archivos y carpetas
var moment = require('moment'); //modulo para trabajar con fechas
const connection=require("./coneccion_mysql");
const formidableMiddleware = require('express-formidable');//para manejar multipart/form-data
const cors=require("../seguridad/cors");

router.use(
  formidableMiddleware(),
  cors
);


router.post('/newItem', (req, res) => {
    console.log('newItem');
    console.log(req.files); // contains files
    console.log(req.fields.user_id);
    let user_id=req.fields.user_id;//obtenemos el campo user_id de los campos a travez del objeto req
    const nameDirectorio=user_id.replace('|', '-');//reemplazar del user_id los campos | por -
    let pathDirectorio='assets/item/'+nameDirectorio;//establece el directorio en donde se va a guardar los libros
    const {name, path} = req.files.file//sustraemos el nombre y el path temporal del archivo
    let file=pathDirectorio+'/'+name;//nombre y directorio del archivo
    let date=moment().format('YYYY-MM-DD hh:mm:ss');//obtenemos la fecha y hora
    try //try catch para manejar los errores
    {
      if (!fs.existsSync(pathDirectorio))//verificamos si el directorio no existe
      {
          //Creamos el directorio
          let dir=fs.mkdirSync(pathDirectorio,{ recursive: true }, (err) => {
            console.error(err);
            console.error("Hubo un herror al crear directorio!");
          })
          console.log('directorio '+dir+" creado!");//mostramos mensaje en consola si no hubo errores
          fs.writeFileSync(file, fs.readFileSync(path));//Escribimos al directorio nuevo del directorio viejo
          connection.query('INSERT INTO producto(nombre,precio,ruta,detalle,fecha_creado,vendedor_idvendedor,estado) VALUES("'+req.fields.nombre+'","'+req.fields.precio+'","'+file+'","'+req.fields.detalles+'","'+date+'","'+user_id+'","activo")', function (error, results, fields) {
            if (error) throw error;
            console.info('Archivo subido! ');//si no hubo ningun problema con el copiado
            res.status(201).send('Libro subido');//respondemos con codigo de status ok
          });
        }
      else{
        //si el directorio si existe
        try {
          fs.readFileSync(file, 'utf8');//Verificamos si el archivo ya existe
          console.error('Archivo ya existe');//Mostramos en consola que el archivo ya existe
          res.status(200).send('Libro ya existe');//respondemos con codigo de status ok
        } catch (err) {
          console.error(err)//mostramos el error en consola
          fs.writeFileSync(file, fs.readFileSync(path));//Escribimos al directorio nuevo del directorio viejo
          connection.query('INSERT INTO producto(nombre,precio,ruta,detalle,fecha_creado,vendedor_idvendedor,estado) VALUES("'+req.fields.nombre+'","'+req.fields.precio+'","'+file+'","'+req.fields.detalles+'","'+date+'","'+user_id+'","activo")', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            if(results.affectedRows>=1)
            {
              connection.commit((err) =>{
                if (err) { 
                  connection.rollback(()=> {
                    throw err;
                  });
                }
                console.info('Archivo subido! ');//si no hubo ningun problema con el copiado
                res.status(201).send('Articulo subido');//respondemos con codigo de status ok
              });
            }
          });
         
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });


//Se debe implementa COMMIT Y ROLLBACK
router.post('/deleteItem',  (req, res)=> {
  console.log('deleteItem');
  console.log(req.fields);
  connection.query('UPDATE producto set estado="inactivo" WHERE idproducto='+req.fields.idproducto, function (error, results, fields) {
    if (error) throw error;
    console.log(results.affectedRows);
    //Eliminamos el fichero si y solo si fue eliminado de la base de datos
    if(results.affectedRows>=1)
    {
        try //try catch para manejar los errores
        {
          //fs.unlinkSync(req.fields.path.toString());
          res.status(200).send(JSON.stringify(results));
        }catch(err)
        {
          console.error(err);
          res.status(500).send(err);  
        }
    }
    else{
      res.status(200).send(JSON.stringify(results));
    }
  });
});

router.post('/updateItem',  (req, res)=> {
  console.log('updateItem');
  connection.query('UPDATE producto set nombre="'+req.fields.nombre+'",precio='+req.fields.precio+',detalle="'+req.fields.detalles+'" WHERE idproducto='+req.fields.idproducto, function (error, results, fields) {
    if (error) throw error;
    console.log(results.affectedRows);
    //Eliminamos el fichero si y solo si fue eliminado de la base de datos
    res.status(200).send(JSON.stringify(results));

  });
});

module.exports=router;