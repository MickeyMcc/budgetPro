import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const { ipcRenderer } = window.require('electron');

export default class LineItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      category: props.transaction.cat_id || 0,
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

  render(){
    const { category } = this.state;
    const { availableCategories } = this.props;
    const { entity, date, transaction_amount, id } = this.props.transaction;
    return (
      <ListItem key={id}>
        <ListItemText secondary={date} />
        <ListItemText primary={entity} />
        <ListItemText secondary={transaction_amount} />
        <ListItemSecondaryAction>
          <Select
            root={{ width: 150 }}
            value={category}
            onChange={(e) => this.handleChange(e.target.value)}
          >
          <MenuItem value={0}>Unknown</MenuItem>
          {availableCategories.map((cat, idx) => <MenuItem key={idx} value={this.props.getCatId(cat)}>{cat}</MenuItem>)}
        </Select>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
};
