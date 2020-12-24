const mysql = require("mysql");

const testDb = mysql.createConnection({
    host: 'localhost',
    user: 'marc',
    password: 'hzcsjgmb',
    database: 'tests'
})

testDb.connect((err) => {
    if(err) throw err;
});

module.exports = testDb;