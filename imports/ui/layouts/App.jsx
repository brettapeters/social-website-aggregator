import React, { Component } from 'react';
import { Link } from 'react-router';
import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';

// App component
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { children } = this.props;
    return(
      <div className="container">
        <header>
          <h1><Link to={"/"}>BP News</Link></h1>
          
          <AccountsUIWrapper />
        </header>
        
        <div>{children}</div>
      </div>
    );
  }
}