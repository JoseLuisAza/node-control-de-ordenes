var jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');//verificar apropiado ambitos
// importamos el archivo logger que contiene las configuraciones de log4js
const log4js = require("../util/logger");

//objeto para manejar loggers para auth0
const logAuth0 = log4js.getLogger("auth0");

logAuth0.info("Iniciando scopeVerify");
console.log("Iniciando scopeVerify");
//a traves de la funcion jwtAuthz se verifica si el token tiene el scope 'read:messages'
var options = {
    customScopeKey: 'permissions',
    checkAllScopes: true
};
const checkScopes=jwtAuthz(['read:items','read:reportes'],options);

// se exporta del archivo la constante checkScopes
module.exports = checkScopes;