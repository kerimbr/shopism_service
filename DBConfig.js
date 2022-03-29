

// const  config = {
//     user:  'nodeapi', // sql user
//     password:  'nodeapi123', //sql user password
//     server:  '127.0.0.1', // if it does not work try- localhost
//     database:  'ShopismDB',
//     options: {
//       trustedconnection:  true,
//       enableArithAbort:  true,
//       encrypt: false,
//       instancename:  'MSSQLSERVER'  // SQL Server instance name
//     },
//     port:  1433
//   }
  


const  config = {
  user:  'krmbr', // sql user
  password:  'Kerim123', //sql user password
  server:  'shopism-server.database.windows.net', // if it does not work try- localhost
  database:  'shopism',
  options: {
    trustedConnection:  true,
    encrypt: true,
  },
  port:  1433
}

module.exports = config;