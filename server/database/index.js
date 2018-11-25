const mysql = require('mysql');
// INT(CODE(E2)&IFERROR(CODE(MID(E2,2,1)),0)&IFERROR(CODE(MID(E2,3,1)),0)&IFERROR(CODE(MID(E2,4,1)),0)&IFERROR(CODE(MID(E2,5,1)),0)&IFERROR(CODE(MID(E2,6,1)),0)&IFERROR(CODE(MID(E2,7,1)),0)&IFERROR(CODE(MID(E2,8,1)),0)&ABS(G2)&CODE(C2)&IFERROR(CODE(MID(C2,2,1)),0)&IFERROR(CODE(MID(C2,3,1)),0)&IFERROR(CODE(MID(C2,4,1)),0)&IFERROR(CODE(MID(C2,5,1)),0)&IFERROR(CODE(MID(C2,6,1)),0)&IFERROR(CODE(MID(E2,7,1)),0)&IFERROR(CODE(MID(E2,8,1)),0))
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

const getTransactionsByMonth = (month) => basicQuery('SELECT * FROM transactions INNER JOIN months ON months.id = transactions.month_id WHERE months.name = ? ORDER BY date', [month]);

const getBudgetsByMonth = (month) => basicQuery('SELECT * FROM budgets INNER JOIN months ON months.id = budgets.month_id WHERE months.name = ?', [month]);

module.exports = {
    getTransactionsByMonth,
    getBudgetsByMonth,
};



