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

const createCategory = async (catName, isIncome) => {
  return basicQuery('INSERT INTO categories (cat_name, income) VALUES (?, ?);', [catName, isIncome])
}

// {
//   month: "september",
//   newCategory: "food_stuff",
//   catId: 0,
//   amount: 300.00,
//   income: false
//   distribution: 1
// }

const createBudgetCategory = async ({ month, amount, newCategory, catId, income, distribution }, cb) => {
  let newCatId;
  
  try {
    if (!catId) {
      if (!newCategory) {
        throw new Error('no category selected');
      }
      const creationData = await createCategory(newCategory, income);
      newCatId = Object.assign({}, creationData).insertId;
    }
    distribution = distribution || null;
    const insert = "INSERT INTO BUDGETS (cat_id, month_id, dist_id, budget_amount) VALUES (?, (SELECT month_id FROM months WHERE month_name=?), ?, ?);";
    const params = [newCatId || catId, month, distribution, amount];
    basicQuery(insert, params)
      .then(data => {
        console.log(data);
        cb(null, data);
      })
  } catch (err) {
    console.log(err);
    cb(err)
    // couldnot create budget item, figure out why
  }
}

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

const getAllCategories = async ({ month }, cb) => {
  try {
    const categories = await basicQuery(
      'SELECT * FROM categories',
      [month],
    );
    cb(null, categories);
  } catch (err) {
    cb(err);
  }
}

const updateTransactionCategory = async ({transaction, category}, cb) => {
  const newCategory = category || null; // convert 0 for 'unknown' to null
  try {
    const result = await basicQuery(
      'UPDATE transactions SET cat_id = ? WHERE id = ?', [newCategory, transaction],
    );
    cb(null, result);
  } catch (err) {
    cb(err);
  }
}

const getSpendingByMonth = async ({ month }, cb) => {
  try {
    const query = "SELECT cat_id, " +
      "(SELECT cat_name FROM categories WHERE budgets.cat_id = categories.cat_id) as cat_name, " + // could also do this with a join
      "budget_amount, " +
      "(SELECT SUM(transaction_amount) FROM transactions " + // total transactions
      "WHERE month_id = (SELECT month_id FROM months WHERE month_name = ?) " +
      "AND budgets.cat_id = transactions.cat_id) as spending_amount " + // for a particular month and category
      "FROM budgets WHERE month_id = (SELECT month_id FROM months WHERE month_name = ?);" // budgets is used to know what categories are about to have attributed categories
    const params = [month, month];
    const spendingStatus = await basicQuery(query, params)
    cb(null, spendingStatus);
  } catch (err) {
    cb(err);
  }
}

// need to add editting existing budget categories
// if a category is removed from a budget need to de-attribute transactions from that category

module.exports = {
  con,
  getTransactionsByMonth,
  getBudgetByMonth,
  updateTransactionCategory,
  getAllCategories,
  createBudgetCategory,
}