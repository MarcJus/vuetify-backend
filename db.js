const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'marc',
    password: 'hzcsjgmb',
    database: 'vuetify'
})

connection.connect((err) => {
    if(err) throw err;
});

module.exports = connection;
