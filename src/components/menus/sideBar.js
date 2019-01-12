import React from 'react';

import './sideBar.css';

export default class TopBar extends React.PureComponent {

    menuItems = ['Transactions', 'Budget', 'Overview']

    render() {
        return (
            <div className="sidebar-container">
                {this.menuItems.map((menuItem, idx) => <div key={idx} onClick={() => this.props.setSelected(idx)} className={`menu-item ${idx === this.props.selected && "active"}`}>{menuItem}</div>)}
            </div>
        );
    }
            // <div className="container">
            //     <h1 className="nav-item"> BudgetPro </h1>
            // </div>
}
