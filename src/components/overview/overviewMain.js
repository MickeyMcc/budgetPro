import React, { Component } from 'react';
import ReactTable from 'react-table';
import changeCase from 'change-case';

import "react-table/react-table.css";

const { ipcRenderer } = window.require('electron');

class Overview extends Component {
  state = {
    spending: [],
    income: [],
    expenditures: [],
  }

  componentDidMount() {
    this.fetchSpending();

    ipcRenderer.on('send-spending-status', this.recieveSpendingStatus.bind(this));
  }

  fetchSpending() {
    ipcRenderer.send('fetch-spending-status', {
      month: this.props.month,
    });
  }

  recieveSpendingStatus ( event, { month, spending }){
    console.log(spending);
    const expenditures = [];
    const income = [];

    spending.forEach(cat => {
      cat.income ? income.push(cat) : expenditures.push(cat);
    });
    this.setState({
      spending,
      expenditures,
      income,
    });
  }

  render() {
    const { expenditures, income } = this.state;
    return (
      <div className="flex-column">
        INCOME
        <ReactTable
          data={income}
          columns={[
            { 
              Header: 'Name',
              id: 'name',
              accessor: cat => changeCase.titleCase(cat['cat_name']),
              minWidth: 200,
            },
            {
              Header: 'Budgetted',
              id: 'budgetted',
              accessor: d => d.budget_amount.toFixed(2),
            },
            {
              Header: 'Realized',
              id: 'spent',
              accessor: cat => cat.spending_amount ? cat.spending_amount.toFixed(2) : 0.00
            },
            {
              Header: 'Waiting For',
              id: 'remaining',
              accessor: cat => (cat.budget_amount + cat.spending_amount).toFixed(2)
            }
          ]}
          showPagination={false}
          pageSize={income.length}
          className="-striped -highlight"
        />
        <br />
        EXPENDITURES
        <ReactTable
          data={expenditures}
          columns={[
            { 
              Header: 'Name',
              id: 'name',
              accessor: cat => changeCase.titleCase(cat['cat_name']),
              minWidth: 200,
            },
            {
              Header: 'Budgetted',
              id: 'budgetted',
              accessor: d => d.budget_amount.toFixed(2),
            },
            {
              Header: 'Spent',
              id: 'spent',
              accessor: cat => cat.spending_amount ? cat.spending_amount.toFixed(2) : 0.00
            },
            {
              Header: 'Remaining',
              id: 'remaining',
              accessor: cat => (cat.budget_amount + cat.spending_amount).toFixed(2)
            }
          ]}
          showPagination={false}
          pageSize={expenditures.length}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default Overview;

