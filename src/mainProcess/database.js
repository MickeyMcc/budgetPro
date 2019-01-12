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
  return basicQuery('INSERT INTO categories (name, income) VALUES (?, ?);', [catName, isIncome])
}

const createBudgetCategory = async ({ month, amount, category, income, distributionCatId }, cb) => {
  const cat_id = typeof category === 'string' ? undefined : category;
  if (!cat_id) {
    const creationData = await createCategory(category, income);
    // creation data needs to include the id of the new category;
    cat_id = creationData.cat_id // this probably doesn't exist
  }
  const insert = "INSERT INTO BUDGETS (category_id, month_id, distribution_id, amount) VALUES (?, ?, ?, ?);";
  const params = [cat_id, month, distributionCatId, amount];
  basicQuery(insert, params)
    .then(data => {
      cb(null, data);
    })
    .catch(err => {
      // couldnot create budget item, figure out why
    })
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
    console.log(month)
    const categories = await basicQuery(
      'SELECT * FROM categories',
      [month],
    );
    console.log(categories);
    cb(null, categories);
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
  getAllCategories,
}