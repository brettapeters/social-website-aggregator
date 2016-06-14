import React, { Component } from 'react';

// App component
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { children } = this.props;
    return(
      <div>{children}</div>
    );
  }
}