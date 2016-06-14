import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Posts } from '../../api/posts.js'
import Post from '../components/Post.jsx';

export default class ShowPost extends TrackerReact(React.Component) {
  constructor() {
    super();
    this.state = {
      subscription: {
        posts: Meteor.subscribe('posts')
      }
    }
  }
  
  componentWillUnmount() {
    this.state.subscription.posts.stop();
  }
    
  getPost() {
    const { postId } = this.props.params;
    return Posts.findOne(postId);
  }
  
  render() {
    const post = this.getPost();
    
    if (!post) {
      return (<div>Loading...</div>);
    }
    
    const currentUser = Meteor.user();
    const currentUserId = currentUser && currentUser._id;
    const showDeleteButton = post.owner === currentUserId;
    const upvoted = (post.upvoters.indexOf(currentUserId) !== -1);
    const downvoted = (post.downvoters.indexOf(currentUserId) !== -1);
    
    return (
      <Post
        key={post._id}
        post={post}
        showDeleteButton={showDeleteButton}
        upvoted={upvoted}
        downvoted={downvoted}
      />
    );
  }
}

ShowPost.propTypes = {
  params: PropTypes.object.isRequired,
};