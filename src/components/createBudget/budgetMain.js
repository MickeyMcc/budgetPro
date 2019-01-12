import React, { Component } from 'react';
import './budget.css';
import BudgetItem from './budgetItem';
import CreateNewCategory from './createNewCategory';

const { ipcRenderer } = window.require('electron');

class Budget extends Component {
  state = {
    budgetObj: {},
    categories: [],
    allCategories: [],
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
    const budgetObj = budget.reduce((acc, entry) => {
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

  recieveCategories (event, { month, categories }) {
    this.setState({
      allCategories: categories,
    })
    if (this.state.categories.length) {
      this.filterForUnusedCategories(null, categories)
    }
  }

  filterForUnusedCategories (used, all) {
    if (!used) {
      used = this.state.categories;
    }
    if (!all) {
      all = this.state.allCategories;
    }

    const usedIds = used.reduce((acc, cat) => {
      acc[cat.cat_id] = true;
      return acc
    }, {});
    this.setState({ unusedCategories: all.filter(cat => usedIds[cat.cat_id]) });
  }

  render() {
    return (
      <div className="flex-column">
        <CreateNewCategory
          allCategories={this.state.allCategories}
          unusedCategories={this.state.unusedCategories}
          month={this.props.month}
        />
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

