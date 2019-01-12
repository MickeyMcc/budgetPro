import React, { Component } from 'react';
import './budget.css';
import BudgetItem from './budgetItem';
import CreateNewCategory from './createNewCategory';

const { ipcRenderer } = window.require('electron');

class Budget extends Component {
  state = {
    budgetObj: {},
    categories: [],
  }

  componentDidMount() {
    this.fetchBudget();
    this.fetchAllCategories();

    ipcRenderer.on('send-budget', this.recieveBudget.bind(this));
    ipcRenderer.on('send-categories', this.recieveCategories.bind(this));
  }

  fetchAllCategories() {
    ipcRenderer.send('fetch-categories', {
      month: this.props.month,
    })
  }

  fetchBudget() {
    ipcRenderer.send('fetch-budget', {
      month: this.props.month,
    });
  }

  recieveBudget ( event, { month, budget }){
    console.log(budget);
    const budgetObj = budget.reduce((acc, entry) => {
      acc[entry.cat_name] = {
        amount: entry.budget_amount,
        cat_id: entry.cat_id,
      };
      return acc;
    }, {});
    this.setState({
      budget: budgetObj,
      categories: Object.keys(budgetObj)
    });
  }

  recieveCategories (event, { month, categories }) {
    console.log(categories);
    this.setState({
      allCategories: categories,
    })
  }

  render() {
    return (
      <div className="flex-column">
        <CreateNewCategory />
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

export default Budget;

