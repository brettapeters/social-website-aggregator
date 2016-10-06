import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';
import Search from '../components/Search.jsx';

export default class Nav extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
      <nav className="navbar navbar-inverse">
        <div className="container">
          <Link to="/" className="navbar-brand">BP News</Link>
          <p className="navbar-text navbar-right">
            { Meteor.user() ? <span>Signed in as </span> : "" }
            <AccountsUIWrapper />
          </p>
          <Search />
        </div>
      </nav>
    );
  }
}