const jwt = require('express-jwt');//modulo jwt para validar el token
const jwksRsa = require('jwks-rsa');//para obtener la clave publica de la cuenta Auth0

// importamos el archivo logger que contiene las configuraciones de log4js
const log4js = require("../util/logger");

path = require('path');

//objeto para manejar loggers
const loggerAuth0 = log4js.getLogger("auth0");

loggerAuth0.info("verificando token");
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({

    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://storebus.us.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
  //  audience: `https://dev-joseluisaza.auth0.com/api/v2/`,
    audience: `https://storebus.com`,
    issuer: `https://storebus.us.auth0.com/`,
    algorithms: ['RS256'],
    getToken: function fromHeaderOrQuerystring (req) {
      // console.log(JSON.stringify(req.headers));
      console.info('checkeando token');
      loggerAuth0.info(`checkeando token`);
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          console.info(`Tipo de token: ${req.headers.authorization.split(' ')[0]}`);
          loggerAuth0.info(`Tipo de token: ${req.headers.authorization.split(' ')[0]}`);
          return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          console.info(`Tipo de token: ${req.query}, ${req.query}`);
          loggerAuth0.info(`Tipo de token: ${req.query}, ${req.query}`);
          return req.query.token;
        }
        else{
          console.warn(`Token no encontrado`);
          loggerAuth0.warn(`Token no encontrado`);
        }
        return null;
      },
  }).unless(
    {path: ['/']}
    );

  module.exports = checkJwt;