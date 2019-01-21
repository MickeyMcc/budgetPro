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
    ipcRenderer.on('new-budget-category', this.fetchBudget.bind(this));
  }

  fetchAllCategories() {
    ipcRenderer.send('fetch-categories', {
      month: this.props.month,
    })
  }

  fetchBudget() {
    console.log('fetchBudget');
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
    
    const usedNames = used.reduce((acc, catName) => {
      acc[catName] = true;
      return acc
    }, {});
    this.setState({ unusedCategories: all.filter(cat => !usedNames[cat.cat_name]) });
  }

  render() {
    return (
      <div className="flex-column">
        <CreateNewCategory
          allCategories={this.state.allCategories}
          unusedCategories={this.state.unusedCategories}
          month={this.props.month}
        />
        Income
        {this.state.allCategories.filter(cat => cat.income).map((category, idx) => 
          this.state.budget[category.cat_name] && < BudgetItem
            key={idx}
            amount={this.state.budget[category.cat_name] && this.state.budget[category.cat_name].amount}
            name={category.cat_name}
            idx={idx}
          />
        )}
        <br />     
        Expenditures
        {
          this.state.allCategories.filter(cat => !cat.income).map((category, idx) =>
          this.state.budget[category.cat_name] && <BudgetItem
            key={idx}
            amount={this.state.budget[category.cat_name] && this.state.budget[category.cat_name].amount}
            name={category.cat_name}
            idx={idx}
          />
        )}
      </div>
    );
  }
}

export default Budget;

