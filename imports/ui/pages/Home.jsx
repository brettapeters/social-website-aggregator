import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Posts } from '../../api/posts.js';
import { Comments } from '../../api/comments.js';

import Post from '../components/Post.jsx';


// Home Page
export default class Home extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
    this.state = {
      subscription: {
        posts: Meteor.subscribe('posts'),
        comments: Meteor.subscribe('comments'),
      }
    }
  }
  
  componentWillUnmount() {
    this.state.subscription.posts.stop();
  }
    
  getPosts() {
    return Posts.find({}, { sort: { points: -1, score: -1 } }).fetch();
  }
  
  currentUser() {
    return Meteor.user();
  }
  
  renderPosts() {
    const user = this.currentUser();
    const currentUserId = user && user._id;
    const allPosts = this.getPosts();
    
    return allPosts.map((post) => {
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
      <ul className="posts">
        {this.renderPosts()}
      </ul>
    );
  }
}