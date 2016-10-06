import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../components/Nav.jsx';

// App component
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { children } = this.props;
    return(
      <div>
        <Nav />
        <div className="container main">
          <div>{children}</div>
        </div>
      </div>
    );
  }
}