import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import './topBar.css';

export default class TopBar extends React.Component {
    render() {
        return (
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Typography className="logo" variant="h6" color="inherit">
                        BudgetPro
                    </Typography>
                    <Button className="float-right" color="inherit">Introduction.</Button>
                    <Button className="float-right"color="inherit">Add Transactions.</Button>
                    <Typography className="float-right" variant="h6" color="inherit">
                        {this.props.month}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

