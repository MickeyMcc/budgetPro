import React, { Component } from 'react';
import './budget.css';
import BudgetItem from './budgetItem';
import CreateNewCategory from './createNewCategory';

const { ipcRenderer } = window.require('electron');

class Budget extends Component {
  state = {
    budget: {},
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
    ipcRenderer.send('fetch-budget', {
      month: this.props.month,
    });
  }

  recieveBudget ( event, { month, budget }){
    console.log(budget, 'budget')
    const budgetObj = budget.reduce((acc, entry) => {
      acc[entry.cat_name] = {
        amount: entry.budget_amount,
        cat_id: entry.cat_id,
      };
      return acc;
    }, {});
    this.setState({
      budgetFetched: true,
      budget: budgetObj,
      categories: Object.keys(budgetObj),
    });

    if (this.state.categoriesFetched) {
      this.filterForUnusedCategories(Object.keys(budgetObj), null)
    }
  }

  recieveCategories (event, { month, categories }) {
    console.log('categories', categories)
    this.setState({
      categoriesFetched: true,
      allCategories: categories,
    })
    if (this.state.budgetFetched) {
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
    console.log('usedNames', usedNames)
    this.setState({ unusedCategories: all.filter(cat => !usedNames[cat.cat_name]) });
  }

  budgetedExpenditures() {
    console.log(this.state.budget, this.state.categories)
    if (!this.state.budget || !this.state.allCategories) {
      return 0;
    }
    const {budget} = this.state;
    return this.state.allCategories.filter(cat => !cat.income).reduce((total, cat) => {
      if (budget[cat.cat_name] && budget[cat.cat_name].amount) {
        return total + budget[cat.cat_name].amount;
      }
      return total;
    }, 0)
  }

  budgetedIncome() {
    if (!this.state.budget || !this.state.allCategories) {
      return 0;
    }
    const {
      budget
    } = this.state;
    return this.state.allCategories.filter(cat => cat.income).reduce((total, cat) => {
      if (budget[cat.cat_name] && budget[cat.cat_name].amount) {
        return total + budget[cat.cat_name].amount;
      }
      return total;
    }, 0)
  }

  render() {
    const { Summary } = this;

    var budgetedIncome = 0;
    var budgetedExpenditures = 0;
    return (
      <div className="flex-column">
        <CreateNewCategory
          allCategories={this.state.allCategories}
          unusedCategories={this.state.unusedCategories}
          month={this.props.month}
        />
        Summary
        <h5>Budgeted Income: {this.budgetedIncome()} \t Budgeted Expenditures: {this.budgetedExpenditures()} </h5>
        Income
        {this.state.allCategories.filter(cat => cat.income).map((category, idx) => {
          if (this.state.budget && this.state.budget[category.cat_name])
            budgetedIncome += this.state.budget[category.cat_name].amount;
            return <BudgetItem
              key={idx}
              amount={this.state.budget[category.cat_name] && this.state.budget[category.cat_name].amount}
              name={category.cat_name}
              idx={idx}
            />
        })}
        <br />     
        Expenditures
        {
          this.state.allCategories.filter(cat => !cat.income).map((category, idx) => {
            if (this.state.budget && this.state.budget[category.cat_name]) {
              budgetedExpenditures += this.state.budget[category.cat_name].amount;
              return <BudgetItem
                key={idx}
                amount={this.state.budget[category.cat_name] && this.state.budget[category.cat_name].amount}
                name={category.cat_name}
                idx={idx}
              />

            }
        })}
      </div>
    );
  }
}

export default Budget;

