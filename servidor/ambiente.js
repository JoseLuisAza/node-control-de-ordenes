const log4js = require("../util/logger");
const path = require('path');

// objeto para manejar loggers de cors
const loggerAmbiente = log4js.getLogger('ambiente');
const ambiente=function(){
if (process.env.NODE_ENV == "production") {
    console.log(process.env.NODE_ENV);
    loggerAmbiente.info(process.env.NODE_ENV);
    require("dotenv").config({ path: path.resolve(__dirname, '.dev.peq.env') });
  }
  else{
    console.log(process.env.NODE_ENV);
    loggerAmbiente.info(process.env.NODE_ENV);
    require("dotenv").config();
  }
}
module.exports=ambiente;