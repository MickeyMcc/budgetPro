import React from 'react';
import changeCase from 'change-case';
import './lineItem.css';

const { ipcRenderer } = window.require('electron');

export default class LineItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      category: props.transaction.cat_id || 0,
      ignore: props.transaction.ignore,
    }
  }

  handleChange(category) {
    category !== this.state.category && this.updateCategory(category);
    this.setState({ category });
  }

  updateCategory(newCat) {
    const { id } = this.props.transaction;
    ipcRenderer.send('set-transaction-category', { transaction: id, category: newCat });
  }

  toggleIgnoreTransaction(ignoreVal) {
    const { id } = this.props.transaction;
    this.setState({ ignore: ignoreVal, category: 0 })
    ipcRenderer.send('set-ignore-value', {
      transaction: id,
      ignore: ignoreVal ? 1 : 0,
    });
  }

  render(){
    const { category, ignore } = this.state;
    console.log('state', ignore)
    const { availableCategories } = this.props;
    const { entity, date, transaction_amount, id } = this.props.transaction;
    return (
      <div key={id} className={`lineitem-container ${this.props.idx % 2 ? 'list-odd': 'list-even'}`}>
        <div className="lineitem-date">{date}</div>
        <div className="lineitem-vendor">{entity}</div>
        <div className="lineitem-cost">{transaction_amount}</div>
        <div className = "lineitem-dropdown">
          <select
            value={category}
            disabled={ignore}
            onChange={(e) => this.handleChange(e.target.value)}
          >
            <option value={0}>Unknown</option>
            {availableCategories.map((cat, idx) => <option key={idx} value={this.props.getCatId(cat)}>{changeCase.titleCase(cat)}</option>)}
          </select>
        </div>
        <div className = "lineitem-ignore">
          ignore?
          <input type="checkbox" checked={this.state.ignore} onChange={(e) => this.toggleIgnoreTransaction(e.target.checked)} />
        </div>
      </div>
    )
  }
};
