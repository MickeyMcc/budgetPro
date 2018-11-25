const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyparser());
app.options('*', cors());

app.get('/transactions/month/:month', function (req, res) {
  const { month } = req.params;
  db.getTransactionsByMonth(month) 
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.err();
    })
});

app.get('/budgets/month/:month', function (req, res) {
  const {
    month
  } = req.params;
  db.getBudgetsByMonth(month)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.err();
    })
});

app.listen(8080, function () {
  console.log('listening on port 8080!');
});
