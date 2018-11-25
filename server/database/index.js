const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "budget",
})

con.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log("Connected!");
    }
});

const basicQuery = (sql, params) => new Promise((resolve, reject) => 
    con.query(sql, params, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
);

const getByMonth = (month) => basicQuery('SELECT * FROM transactions WHERE month = ? ORDER BY date', [month]);

module.exports = {
    getByMonth,
};



