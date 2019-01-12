import React from 'react';
import changeCase from 'change-case';
import Delete from '../../assets/close-512.png';

class BudgetItem extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      amount: this.props.amount,
    };
  }

  updateAmount(amount) {
    this.setState({ amount })
  }

  render() {
    const { idx, name } = this.props;
    return (
      <div className={`budgetitem-container ${idx % 2 ? 'list-odd' : 'list-even'}`}>
        <div className="budgetitem-date">{changeCase.titleCase(name)}</div>
        <input onChange={(e) => this.updateAmount(e.target.value)} className="budgetItem-amount" value={this.state.amount} />
        <img className="delete" src={Delete} alt="" />
      </div>
    )
  }
}

export default BudgetItem;