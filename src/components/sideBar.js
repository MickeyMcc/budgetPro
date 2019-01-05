import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import './sideBar.css';

export default class TopBar extends React.PureComponent {

    menuItems = ['Transactions', 'Budget', 'Overview']

    render() {
        return (
            <div className="sidebar-container">
                {this.menuItems.map((menuItem, idx) => <div onClick={() => this.props.setSelected(idx)} className={`menu-item ${idx === this.props.selected && "active"}`}>{menuItem}</div>)}
            </div>
        );
    }
            // <div className="container">
            //     <h1 className="nav-item"> BudgetPro </h1>
            // </div>
}
