const mysql = require('mysql');

// CONNECT TO MYSQL
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "budget",
}, (err, data) => console.log(err, data));

con.connect(function (err) {
    console.log('attempting to connect');
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

const getTransactionsByMonth = async ({ month }, cb) => {
  try {
    const transactions = await basicQuery('SELECT * FROM transactions INNER JOIN months ON months.month_id = transactions.month_id LEFT JOIN categories on categories.cat_id = transactions.cat_id WHERE months.month_name = ? ORDER BY date',
      [month]);

    cb(null, transactions);
  } catch (err) {
    cb(err);
  }
}

const getBudgetByMonth = async ({ month }, cb) => {
  try {
    const budget = await basicQuery(
      'SELECT * FROM budgets INNER JOIN months ON months.month_id = budgets.month_id INNER JOIN categories ON categories.cat_id = budgets.cat_id WHERE months.month_name = ?',
      [month],
    );
    cb(null, budget);
  } catch (err) {
    cb(err);
  }
}

const updateTransactionCategory = async ({transaction, category}, cb) => {
  const newCategory = category || null; // convert 0 for 'unknown' to null
  console.log(transaction, category);
  try {
    const result = await basicQuery(
      'UPDATE transactions SET cat_id = ? WHERE id = ?', [newCategory, transaction],
    );
    cb(null, result);
  } catch (err) {
    cb(err);
  }
}

module.exports = {
  con,
  getTransactionsByMonth,
  getBudgetByMonth,
  updateTransactionCategory,
}