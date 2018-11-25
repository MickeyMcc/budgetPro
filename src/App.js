import React, { Component } from 'react';
import API from './API';

import List from '@material-ui/core/List';

import LineItem from './components/lineItem';

class App extends Component {
  state = {
    results: [],
  }
  componentDidMount() {
    API.getByMonth('june')
      .then(({ data: entries }) => {
        console.log('entries', entries);
        this.setState({ results: entries });
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            There are {this.state.results.length} transactions for June.
          </p>
          <List>
            {this.state.results.map((transaction) => (
              <LineItem key={transaction.id} transaction={transaction} />
            ))}
          </List>
        </header>
      </div>
    );
  }
}

export default App;
