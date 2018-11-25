import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



export default class LineItem extends React.Component{
    state = {
      category: '',
    }
    render(){
        const { paid_to, date, category, amount, id } = this.props.transaction;
        return (
          <ListItem key={id}>
            <ListItemText primary={paid_to} />
            <ListItemText secondary={amount} />
            <ListItemSecondaryAction>
              <Select
                value={category}
                onChange={this.handleChange}
              >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </ListItemSecondaryAction>
          </ListItem>
        )
    }
};
