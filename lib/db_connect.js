//database setup
var mysql = require('mysql');

var { DB_HOST,DB_USER,DB_PASSWORD,DB_PORT,DB_DATABASE } = process.env;

var db_config = {
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_DATABASE,
    port:DB_PORT
};

var connection;
function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } 
    console.log("connected!");
  });
  connection.on('error', function(err) {
    console.log('Database error code :', err.code);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {                                     
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;