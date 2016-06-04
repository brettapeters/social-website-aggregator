import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Posts } from '../api/posts.js'

import Post from './Post.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    // Find the input fields via the React refs
    const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.descriptionInput).value.trim();
    
    // Insert form data
    Meteor.call('posts.insert', url, description);
    
    // Clear form
    ReactDOM.findDOMNode(this.refs.urlInput).value = '';
    ReactDOM.findDOMNode(this.refs.descriptionInput).value = '';
  }
  
  renderPosts() {
    return this.props.posts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showDeleteButton = post.owner === currentUserId;
      
      return(
        <Post
          key={post._id}
          post={post}
          showDeleteButton={showDeleteButton}
        />
      );
    }); 
  }
  
  render() {
    return (
      <div className="container">
        <header>
          <h1>Posts</h1>
          
          <AccountsUIWrapper />
          
          { this.props.currentUser ?
            <form className="new-post" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="urlInput"
                placeholder="URL"
              />
              <input
                type="text"
                ref="descriptionInput"
                placeholder="Description"
              />
              <input
                type="submit"
              />
            </form> : ''
          }
        </header>
        
        <ul>
          {this.renderPosts()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('posts');
  
  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);