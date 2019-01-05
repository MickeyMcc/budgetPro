import React, { Component } from 'react';
import '../App.css';

const { ipcRenderer } = window.require('electron');

class Budget extends Component {
  state = {
    budgetObj: {},
    categories: [],
  }

  componentDidMount() {
    this.fetchBudget();
  }

  fetchBudget() {
    ipcRenderer.send('fetch-budget', {
      month: this.props.month
    });
  }

  recieveBudget ( event, {month, budget }){
    console.log(month, budget);
    const budgetObj = budget.reduce((acc, entry) => {
      acc[entry.cat_name] = {
        amount: entry.budget_amount,
        cat_id: entry.cat_id,
      };
      return acc;
    }, {});
    console.log(budgetObj)
    this.setState({
      budget: budgetObj,
      categories: Object.keys(budgetObj)
    });
  }

  render() {
    return (
      <div>
        {this.state.categories.map(category => {
          console.log(category, this.state.budgetObj[category]);
          return (
            <div>
              <div>{category}</div>
              <div>{this.state.budgetObj[category] && this.state.budgetObj[category].amount}</div>
            </div>
          )
        })}
      </div>
    );
  }
}

export default Budget;

