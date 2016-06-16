import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { HTTP } from 'meteor/http';

import { Posts } from '../../api/posts.js';
import { Comments } from '../../api/comments.js';

import Post from '../components/Post.jsx';


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
    const url = ReactDOM.findDOMNode(this.refs.urlInput).value.trim();
    extractMeta(url, function (err, meta) {
      console.log(meta);
      Meteor.call('posts.insert', url, meta.title);
    });
    ReactDOM.findDOMNode(this.refs.urlInput).value = '';
  }
  
  renderPosts() {
    const user = this.currentUser();
    const currentUserId = user && user._id;
    
    return this.getPosts().map((post) => {
      const showDeleteButton = post.owner === currentUserId;
      const upvoted = (post.upvoters.indexOf(currentUserId) !== -1);
      const downvoted = (post.downvoters.indexOf(currentUserId) !== -1);
      
      return(
        <li key={post._id}>
          <Post
            key={post._id}
            post={post}
            showDeleteButton={showDeleteButton}
            upvoted={upvoted}
            downvoted={downvoted}
          />
        </li>
      );
    }); 
  }
  
  render() {
    return (
      <div>
        { this.currentUser() ?
        <form className="new-post" onSubmit={this.handleSubmit.bind(this)} >
          <input
            type="text"
            ref="urlInput"
            placeholder="URL"
            required
          />
          <input
            type="submit"
          />
        </form> : ''
        }
          
        <ol className="posts">
          {this.renderPosts()}
        </ol>
      </div>
    );
  }
}