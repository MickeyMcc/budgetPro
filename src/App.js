import React, { Component } from 'react';
import './App.css';

import TransactionsMain from './components/transactions/transactionsMain';
import BudgetMain from './components/createBudget/budgetMain';
import OverviewMain from './components/overview/overviewMain';
import TopBar from './components/menus/topBar';
import SideBar from './components/menus/sideBar';

const { ipcRenderer } = window.require('electron');

class App extends Component {
  state = {
    month: 'March 2019',
    sideBarSelected: 0,
  }

  componentDidMount() {
    ipcRenderer.on('fetch-data-err', this.reportErr.bind(this));
    ipcRenderer.on('transaction-update-err', this.reportErr.bind(this));
    ipcRenderer.on('budget-update-err', this.reportErr.bind(this));
  }

  reportErr() {
    console.error('ERROR:', arguments)
  }

  MainSection({ selected, month }) {
    switch(selected) {
      case 0:
        return <TransactionsMain month={month} />;
      case 1:
        return <BudgetMain month={month} />
      case 2:
        return <OverviewMain month={month} />
      default:
        return <div>Please select a month</div>
    }
  }

  render() {
    const { MainSection } = this;
    return (
      <div className="App">
        <TopBar month={this.state.month} />
        <div className="flex-row">
          <SideBar selected={this.state.sideBarSelected} setSelected={idx => this.setState({ sideBarSelected: idx })}/>
          <MainSection selected={this.state.sideBarSelected} month={this.state.month} />
        </div>
      </div>
    );
  }
}

export default App;
