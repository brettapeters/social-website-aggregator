import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Posts } from '../../api/posts.js'

import Post from '../components/Post.jsx';
import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';

// Home Page
export default class Home extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
    this.state = {
      subscription: {
        posts: Meteor.subscribe('posts')
      }
    }
  }
  
  componentWillUnmount() {
    this.state.subscription.posts.stop();
  }
    
  getPosts() {
    return Posts.find({}, { sort: { createdAt: -1} }).fetch();
  }
  
  currentUser() {
    return Meteor.user();
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
    const user = this.currentUser();
    const currentUserId = user && user._id;
    
    return this.getPosts().map((post) => {
      const showDeleteButton = post.owner === currentUserId;
      const upvoted = (post.upvoters.indexOf(currentUserId) !== -1);
      const downvoted = (post.downvoters.indexOf(currentUserId) !== -1);
      
      return(
        <Post
          key={post._id}
          post={post}
          showDeleteButton={showDeleteButton}
          upvoted={upvoted}
          downvoted={downvoted}
        />
      );
    }); 
  }
  
  render() {
    return (
      <div className="container">
        <header>
          <h1>Social Website Aggregator</h1>
          
          <AccountsUIWrapper />
          
          { this.currentUser() ?
            <form className="new-post" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="urlInput"
                placeholder="URL"
                required
              />
              <input
                type="text"
                ref="descriptionInput"
                placeholder="Link Title"
                required
              />
              <input
                type="submit"
              />
            </form> : ''
          }
        </header>
        
        <ol>
          {this.renderPosts()}
        </ol>
      </div>
    );
  }
}