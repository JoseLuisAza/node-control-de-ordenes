// importamos el archivo logger
const log4js = require("../util/logger");

// objeto para manejar loggers de cors
const logger = log4js.getLogger('cors');

const cors=function (req, res, next)
{
    console.log(req);
    //Origes de la solicitud permitidos.
    let allowedOrigins = [
    "http://localhost",
     "http://localhost:80",
     "http://localhost:4200",
     "https://bluter.softland.website",
     "https://bluter.softland.website/",
     "https://www.bluter.softland.website",
     "https://www.bluter.softland.website/",
     "http://bluter.softland.website",
     "http://bluter.softland.website/",
     "http://www.bluter.softland.website",
     "http://www.bluter.softland.website/"]
    //obtenemos el origen de la solicitud
    let origin = req.headers.origin;
    logger.info(`Verificando origin: ${origin}`);
    //verificamos si el origin de la solicitud esta entre los permitidos
    //si es asi entonces se añade la cabecera 
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
        console.log(`Origin permitido: ${origin}`);
        logger.info(`Origin permitido: ${origin}`);
        console.log('Peticion hacia el path:', req.originalUrl);
        logger.info('Peticion hacia el path:', req.originalUrl);
    }
    else{
        console.log(`El Origin ${origin} no está en la lista`);
        logger.debug(`El Origin ${origin} no está en la lista`);
        console.log('Peticion hacia el path:', req.originalUrl);
        logger.info('Peticion hacia el path:', req.originalUrl);
        return null;
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
}

module.exports = cors;