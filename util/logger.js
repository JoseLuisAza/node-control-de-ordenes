// importamos la libreria npm
const log4js = require("log4js"); 


// configuramos el log4js con los 3 tipos de contexto de log
  log4js.configure(
    {
        appenders: { servidor: { type: "file", filename: "logs_node.log" } },
        categories: { default: { appenders: ["servidor"], level: "ALL" } },
        disableClustering: true,
    },
    {
        appenders: { ambiente: { type: "file", filename: "logs_node.log" } },
        categories: { default: { appenders: ["ambiente"], level: "ALL" } },
        disableClustering: true,
    },
    {
      appenders: { cors: { type: "file", filename: "logs_node.log" } },
      categories: { default: { appenders: ["cors"], level: "ALL" } },
      disableClustering: true,
    },
    {
      appenders: { token: { type: "file", filename: "logs_node.log" } },
      categories: { default: { appenders: ["token"], level: "ALL" } },
      disableClustering: true,
    },
    {
      appenders: { app: { type: "file", filename: "logs_node.log" } },
      categories: { default: { appenders: ["app"], level: "ALL" } },
      disableClustering: true,
    },
    {
      appenders: { auth0: { type: "file", filename: "logs_node.log" } },
      categories: { default: { appenders: ["auth0"], level: "ALL" } },
      disableClustering: true,
    },
  );
  module.exports = log4js;