import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Search extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
  }
  
  handleSearch(event) {
    event.preventDefault();
    const searchValue = ReactDOM.findDOMNode(this.refs.search).value.trim();
    browserHistory.push(`/search?q=${searchValue}`);
  }
  
  render() {
    return(
      <form className="navbar-form navbar-right"
            id="search-form"
            onSubmit={this.handleSearch.bind(this)}>
        <div className="form-group">
          <div className="input-group">
            <input type="text"
                   className="form-control"
                   placeholder="Search..." 
                   ref="search" />
            <span className="input-group-btn">
              <button className="btn btn-default"
                      type="submit">
                <i className="glyphicon glyphicon-search" />
              </button>
            </span>
          </div>
        </div>
      </form>
    );
  }
}