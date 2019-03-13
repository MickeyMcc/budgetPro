const mysql = require('mysql');

// CONNECT TO MYSQL
// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "budget",
// }, (err, data) => console.log(err, data));

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'budget'
  }
});

// con.connect(function (err) {
//     console.log('attempting to connect');
//     if (err) {
//         throw err;
//     } else {
//         console.log("Connected!");
//     }
// });

// const basicQuery = (sql, params) => new Promise((resolve, reject) =>
//   knex.raw(sql, params, (err, data) => {
//     if (err) {
//       reject(err);
//     } else {
//       resolve(data);
//     }
//   })
// );

const createCategory = async (catName, isIncome, cb) => {
  // return basicQuery('INSERT INTO categories (cat_name, income) VALUES (?, ?);', [catName, isIncome])
  return await knex.insert({ cat_name: catName, income: isIncome }, ['cat_id']).into('categories');

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
      newCatId = await createCategory(newCategory, income);
      // newCatId = Object.assign({}, creationData).insertId;
    }
    distribution = distribution || null;
    const monthSubquery = await knex.select('month_id').from('months').where('month_name', month);

    console.log(monthSubquery)
    const data = await knex('budgets').insert({
      cat_id: newCatId || catId,
      month_id: monthSubquery[0].month_id,
      dist_id: distribution,
      budget_amount: amount,
    })
    cb(null, data);
    // const insert = "INSERT INTO BUDGETS (cat_id, month_id, dist_id, budget_amount) VALUES (?, (SELECT month_id FROM months WHERE month_name=?), ?, ?);";
    // const params = [newCatId || catId, month, distribution, amount];
    // basicQuery(insert, params)
    //   .then(data => {
    //     console.log(data);
    //     cb(null, data);
    //   })
  } catch (err) {
    cb(err)
    // couldnot create budget item, figure out why
  }
}

const getTransactionsByMonth = async ({ month }, cb) => {
  try {
    // const transactions = await basicQuery('SELECT * FROM transactions 
    // INNER JOIN months ON months.month_id = transactions.month_id 
    // LEFT JOIN categories on categories.cat_id = transactions.cat_id WHERE months.month_name = ? ORDER BY date',
    //   [month]);

    const transactions = await knex.select()
      .from('transactions')
      .innerJoin('months', 'months.month_id', 'transactions.month_id')
      .leftJoin('categories', 'categories.cat_id', 'transactions.cat_id')
      .where('months.month_name', month)
      .orderBy('transactions.date');

    cb(null, transactions);
  } catch (err) {
    cb(err);
  }
}

const getBudgetByMonth = async ({ month }, cb) => {
  try {
    // const budget = await basicQuery(getBudgetByMonth
    //   'SELECT * FROM budgets INNER JOIN months ON months.month_id = budgets.month_id INNER JOIN categories ON categories.cat_id = budgets.cat_id WHERE months.month_name = ?',
    //   [month],
    // );

    const budget = await knex.select()
      .from('budgets')
      .innerJoin('months', 'months.month_id', 'budgets.month_id')
      .innerJoin('categories', 'categories.cat_id', 'budgets.cat_id')
      .where('months.month_name', month);

    cb(null, budget);
  } catch (err) {
    cb(err);
  }
}

const getAllCategories = async ({ month }, cb) => {
  try {
    // const categories = await basicQuery(
    //   'SELECT * FROM categories',
    //   [month],
    // );
    const categories = await knex.select().from('categories');

    cb(null, categories);
  } catch (err) {
    cb(err);
  }
}

const updateTransactionCategory = async ({transaction, category, ignore }, cb) => {
  const newCategory = category || null; // convert 0 for 'unknown' to null
  try {
    // const result = await basicQuery(
    //   'UPDATE transactions SET cat_id = ? WHERE id = ?', [newCategory, transaction],
    // );
    console.log('UPDATE', newCategory, ignore)
    const result = await knex('transactions')
      .update({ cat_id: newCategory, ignore })
      .where({ id: transaction });
    console.log(result);
    cb(null, result);
  } catch (err) {
    cb(err);
  }
}

const getSpendingByMonth = async ({ month }, cb) => {
  try {
    const query = "SELECT categories.cat_id as cat_id, " +
      "categories.cat_name as cat_name, " + 
      "categories.income as income, " +
      "budgets.budget_amount, " +
      "(SELECT SUM(transaction_amount) FROM transactions " + // total transactions
      "WHERE month_id = (SELECT month_id FROM months WHERE month_name = ?) " +
      "AND budgets.cat_id = transactions.cat_id) as spending_amount " + // for a particular month and category
      "FROM budgets INNER JOIN categories ON categories.cat_id = budgets.cat_id " + // join categories
      "WHERE month_id = (SELECT month_id FROM months WHERE month_name = ?);" // budgets is used to know what categories are about to have attributed categories
    const params = [month, month];
    const [spendingStatus] = await knex.raw(query, params)
    // const monthSubquery = knex('months').select('month_id').where('month_name', month)

    // // const spendingSubquery = 

    // //   const spendingSubquery2 = await knex.sum('transaction_amount').from('transactions')
    // //     .where({
    // //       'month_id': monthSubquery,
    // //       'budgets.cat_id': 'transactions.cat_id',
    // //     })
    
    //     // console.log(spendingSubquery2);

    // const spendingAmount = await knex('transactions')
    //   .innerJoin('budgets', 'budgets.cat_id', 'transactions.cat_id')
    //   .sum('transaction_amount')
    //   .where({
    //     'budgets.month_id': monthSubquery,
    //   });

    //   console.log('spending amount', spendingAmount);
      
    // const spendingStatus = await knex
    //   .select({
    //     cat_id: 'categories.cat_id',
    //     cat_name: 'categories.cat_name',
    //     income: 'categories.income',
    //     budget_amount: 'budgets.budget_amount',
    //     spending_amount: (builder) => {
    //       return builder.select('transactions')
    //         .innerJoin('budgets', 'budgets.cat_id', 'transactions.cat_id')
    //         .sum('transaction_amount')
    //         .where({
    //           'budgets.month_id': monthSubquery,
    //         });
    //     },
    //   })
    //   .from('budgets')
    //   .innerJoin('categories', 'categories.cat_id', 'budgets.cat_id')
    //   .where('month_id', monthSubquery);

    console.log(spendingStatus);
    cb(null, spendingStatus);
  } catch (err) {
    cb(err);
  }
}

// need to add editting existing budget categories
// if a category is removed from a budget need to de-attribute transactions from that category

module.exports = {
  getTransactionsByMonth,
  getBudgetByMonth,
  updateTransactionCategory,
  getAllCategories,
  createBudgetCategory,
  getSpendingByMonth,
}