import React, { Component } from 'react';
import changeCase from 'change-case';
import './budget.css';

const { ipcRenderer } = window.require('electron');

// props
// allCategories
// unusedCategories
// month

class CreateNewCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      newCategory: '',
      amount: 0,
      error: '',
      income: false,
    };
  }

  onSelectCategory(id) {
    this.setState({ selected: id })
  }

  onTypeCategory(name) {
    this.setState({ newCategory: name, selected: 0 });
  }

  onTypeAmount(value) {
    this.setState({ amount: value });
  }

  checkIncome(value) {
    this.setState({ income: value });
  }

  create() {
    if (!this.state.newCategory && !this.state.selected) {
      this.setState({ error: 'please select or name a category' });
    } else if (this.props.allCategories.includes(this.state.newCategory)) {
      this.setState({ error: 'that category already exists' });
    } else if (this.state.newCategory && this.state.selected) {
      this.setState({ error: 'please reset the selector or clear the input box' })
    } else if (!this.state.amount) {
      this.setState({ error: 'please enter a positive amount to budget for this category' });
    } else if (this.state.amount < 0) {
      this.setState({ error: 'amount must be positive' });
    } else {
      ipcRenderer.send('create-budget-category', {
        month: this.props.month,
        newCategory: !!this.state.newCategory,
        catId: changeCase.snakeCase(this.state.selected),
        amount: this.state.amount,
        income: this.state.income,
      });
    }
  }

  render() {
    return (
      <div className="container-create-category">
        <h4>Add a Category</h4>
        <div className="sub-container">
          New Category
          <select className="category-selector" value={0} onChange={(e) => this.onSelectCategory(e.target.value)}>
            <option value={0}>New Category</option>
            {this.props.unusedCategories && this.props.unusedCategories.map(category => 
              <option value={category.id}>{category.name}</option>  
              )}
          </select>
          or
          <input className="category-input" value={this.state.newCategory} onChange={(e) => this.onTypeCategory(e.target.value)} />
        </div>
        <br />
        Amount
        <input className="category-input" value={this.state.amount} onChange={(e) => this.onTypeAmount(e.target.value)} />
        Income?
        <input type="checkbox" value={this.state.income} onChange={(e) => this.checkIncome(e.target.value)} />
        <button className="button" onClick={() => this.create()}>Create</button>
        <br />
        <h5>{this.state.error}</h5>
      </div>
    );
  }
}

export default CreateNewCategory;