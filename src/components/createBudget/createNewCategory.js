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
      distribution: 0,
      amount: 0,
      error: '',
      income: false,
    };
  }
  
  onSelectCategory(id) {
    this.setState({ selected: id })
  }

  onSelectDistribution(id) {
    console.log(id);
    this.setState({ distribution: id })
  }
  
  onTypeCategory(name) {
    this.setState({ newCategory: name, selected: 0 });
  }
  
  onTypeAmount(value) {
    this.setState({ amount: value });
  }
  
  checkIncome() {
    this.setState({ income: !this.state.income });
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
    } else if (Number(this.state.amount) < 0 && !Number.isNaN(Number(this.state.amount))) {
      this.setState({ error: 'amount must be positive' });
    } else if (!this.state.distribution && !this.state.income) {
      this.setState({ error: 'must select a EOM distribution for non-income categories' });
    } else {
      ipcRenderer.send('create-budget-category', {
        month: this.props.month,
          newCategory: !this.state.selected && changeCase.snakeCase(this.state.newCategory),
          catId: this.state.selected,
          amount: Number(this.state.amount),
          income: this.state.income,
          distribution: this.state.distribution,
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
              <option value={category.cat_id}>{changeCase.titleCase(category.cat_name)}</option>  
              )}
          </select>
          or
          <input className="category-input" value={this.state.newCategory} onChange={(e) => this.onTypeCategory(e.target.value)} />
        </div>
        <div className="sub-container">
          Amount
          <input className="category-input" type="number" value={this.state.amount} onChange={(e) => this.onTypeAmount(e.target.value)} />
          Income?
          <input type="checkbox" value={this.state.income} onChange={(e) => this.checkIncome()} />
        </div>
        <div className="sub-container">
          End of Month Distribution
          <select className="category-selector" disabled={this.state.income ? 'disabled' : ''} value={this.state.distribution} onChange={(e) => this.onSelectDistribution(e.target.value)}>
            <option value={0}></option>
            {this.props.allCategories && this.props.allCategories.filter(cat => !cat.income).map(category => 
              <option value={category.cat_id}>{changeCase.titleCase(category.cat_name)}</option>  
              )}
          </select>
        </div>
        {this.state.error}
        <button className="button" onClick={() => this.create()}>Create</button>
      </div>
    );
  }
}

export default CreateNewCategory;