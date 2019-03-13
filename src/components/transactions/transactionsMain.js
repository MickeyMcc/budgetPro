import React, { Component } from 'react';

import LineItem from './lineItem';
const { ipcRenderer } = window.require('electron');

// budget_amount: 300
// budget_id: 3
// cat_id: 3
// cat_name: "emergency_funds"
// dist_id: 3
// month_id: 1
// month_name: "september"

class Transactions extends Component {
  state = {
    transactions: [],
    budget: {},
    categories: [],
  }

  componentDidMount() {
    this.fetchTransactions();
    this.fetchBudget();

    ipcRenderer.on('send-transactions', this.recieveTransactions.bind(this));
    ipcRenderer.on('send-budget', this.recieveBudget.bind(this));
  }

  fetchTransactions() {
    ipcRenderer.send('fetch-transactions', { month: this.props.month });
  }

  recieveTransactions ( event, { month, transactions }){
    this.setState({transactions});
  }

  fetchBudget() {
    ipcRenderer.send('fetch-budget', {
      month: this.props.month
    });
  }

  recieveBudget(event, { month, budget }) {
    const budgetObj = budget.reduce((acc, entry) => {
      acc[entry.cat_name] = {
        amount: entry.budget_amount,
        cat_id: entry.cat_id,
      };
      return acc;
    }, {});
    this.setState({ budget: budgetObj, categories: Object.keys(budgetObj) });
  }

  getCatId(name) {
    return this.state.budget[name].cat_id;
  }

  render() {
    const { transactions, categories } = this.state;
    const { month} = this.props;
    return (
        <div className="flex-column">
            <header className="App-header">
                <p>
                There are {transactions.length} transactions for {month}.
                </p>
            </header>
            <h4>To Be Categorized</h4>
            <ul className="transaction-list">
                {transactions.filter((transaction) => !transaction.ignore && !transaction.cat_id).map((transaction, idx) => (
                <LineItem key={transaction.id} idx={idx} transaction={transaction} availableCategories={categories} getCatId={(name) => this.getCatId(name)} />
                ))}
            </ul>
            <h4>Complete</h4>
            <ul className="transaction-list">
                {transactions.filter((transaction) => transaction.cat_id).map((transaction, idx) => (
                <LineItem key={transaction.id} idx={idx} transaction={transaction} availableCategories={categories} getCatId={(name) => this.getCatId(name)} />
                ))}
            </ul>
            <h4>Ignored</h4>
            <ul className="transaction-list">
                {transactions.filter((transaction) => transaction.ignore).map((transaction, idx) => (
                <LineItem key={transaction.id} idx={idx} transaction={transaction} availableCategories={categories} getCatId={(name) => this.getCatId(name)} />
                ))}
            </ul>
        </div>
    );
  }
}

export default Transactions;
