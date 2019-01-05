import React, { Component } from 'react';
import './App.css';

import TransactionsMain from './components/transactionsMain';
import BudgetMain from './components/budgetMain';
import TopBar from './components/topBar';
import SideBar from './components/sideBar';

const OverviewMain = () => <div />;

class App extends Component {
  state = {
    month: 'september',
    sideBarSelected: 0,
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
