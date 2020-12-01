/*Importaciones*/
const express = require('express')//framework para node
var mysql= require('mysql');//modulo para conectar con myslq database
var moment = require('moment'); //modulo para trabajar con fechas
const cors = require('cors');//modulo para activar el CORS para solicitudes de varios puertos
const fs = require('fs');//modulo de node para manejar archivos y carpetas
const rxjs = require('rxjs');//modulo de node para manejar archivos y carpetas
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

  app.post('/addUser', (req, res) => {
    console.log('addUser');
      connection.query('INSERT INTO vendedor(idvendedor) VALUES("'+req.fields.user_id+'")', function (error, results, fields) {
        if (error) throw error;
        console.log('Usuario registrado!');
        res.send('Usuario registrado!');
      });
    })
  
  
    /*Metodo para saber si un usuario ya esta registrado*/ 
    app.post('/isUserRegistered', (req, res) => {
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
    })

  app.post('/getArticulos', (req, res) => {
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

app.post('/getArticulosGeneral', (req, res) => {
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

app.get('/getArticulosStore', (req, res) => {
  console.log('/getArticulosStore');
  connection.query('SELECT idproducto,nombre,precio,ruta,detalle,fecha_creado FROM producto WHERE estado="activo"', function (error, results, fields) {
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

  
  app.post('/newItem', (req, res) => {
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
          connection.query('INSERT INTO producto(nombre,precio,ruta,detalle,fecha_creado,vendedor_idvendedor) VALUES("'+req.fields.nombre+'","'+req.fields.precio+'","'+file+'","'+req.fields.detalles+'","'+date+'","'+user_id+'")', function (error, results, fields) {
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
          connection.query('INSERT INTO producto(nombre,precio,ruta,detalle,fecha_creado,vendedor_idvendedor) VALUES("'+req.fields.nombre+'","'+req.fields.precio+'","'+file+'","'+req.fields.detalles+'","'+date+'","'+user_id+'")', function (error, results, fields) {
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
app.post('/deleteItem',  (req, res)=> {
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

app.post('/updateItem',  (req, res)=> {
  console.log('updateItem');
  connection.query('UPDATE producto set nombre="'+req.fields.nombre+'",precio='+req.fields.precio+',detalle="'+req.fields.detalles+'" WHERE idproducto='+req.fields.idproducto, function (error, results, fields) {
    if (error) throw error;
    console.log(results.affectedRows);
    //Eliminamos el fichero si y solo si fue eliminado de la base de datos
    res.status(200).send(JSON.stringify(results));

  });
});

app.post('/finishShop',  (req, res)=> {
  console.log('finishShop');
  let date=moment().format('YYYY-MM-DD hh:mm:ss');//obtenemos la fecha y hora
  connection.query('INSERT INTO venta(fecha_de_venta,total,vendedor_idvendedor) VALUES("'+date+'",'+req.fields.total+',"'+req.fields.user_id+'")', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    //Eliminamos el fichero si y solo si fue eliminado de la base de datos
    res.status(200).send(JSON.stringify(results));
  });
});

app.post('/finishShop2',  (req, res)=> {
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