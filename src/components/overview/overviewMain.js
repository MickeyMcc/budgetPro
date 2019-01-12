import React, { Component } from 'react';
import './budget.css';
import BudgetItem from './budgetItem';

const { ipcRenderer } = window.require('electron');

class Overview extends Component {
  state = {
    budgetObj: {},
    categories: [],
    allCategories: [],
  }

  componentDidMount() {
    this.fetchBudget();
    this.fetchAllCategories();

    ipcRenderer.on('send-spending-status', this.recieveSpendingStatus.bind(this));
  }

  fetchBudget() {
    ipcRenderer.send('fetch-spending-status', {
      month: this.props.month,
    });
  }

  recieveSpendingStatus ( event, { month, spending }){
    const budgetObj = spending.reduce((acc, entry) => {
      acc[entry.cat_name] = {
        amount: entry.budget_amount,
        cat_id: entry.cat_id,
      };
      return acc;
    }, {});
    this.setState({
      budget: budgetObj,
      categories: Object.keys(budgetObj),
    });

    if (this.state.allCategories.length) {
      this.filterForUnusedCategories(Object.keys(budgetObj), null)
    }
  }

  render() {
    return (
      <div className="flex-column">
        {this.state.categories.map((category, idx) => 
          <BudgetItem
            key={idx}
            amount={this.state.budget[category] && this.state.budget[category].amount}
            name={category}
            idx={idx}
          />
        )}
      </div>
    );
  }
}

export default Overview;

