import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Posts } from '../api/posts.js';

// Post component - represents a single post item
export default class Post extends Component {
  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }
  
  formatDate(date) {
    return moment(date).fromNow();
  }
  
  upVote() {
    Meteor.call('posts.upvote', this.props.post._id);
  }
  
  downVote() {
    Meteor.call('posts.downvote', this.props.post._id);
  }

  render() {
    const rawUrl = this.props.post.url;
    const normalizedUrl = UrlUtils.normalize(rawUrl);
    const urlHost = UrlUtils.parse(rawUrl).hostname;
    const postDescription = this.props.post.description;
    const postUsername = this.props.post.username;
    const postDate = this.formatDate(this.props.post.createdAt);
    const postPoints = this.props.post.points;
    const postComments = this.props.post.comments.length;
    const postShowDeleteButton = this.props.showDeleteButton;
    const handleDeleteClick = this.deleteThisPost.bind(this);
    const handleUpVoteClick = this.upVote.bind(this);
    const handleDownVoteClick = this.downVote.bind(this);
    
    return (
      <li>
        { postShowDeleteButton ? (
          <button className="delete" onClick={handleDeleteClick}>
            &times;
          </button>
        ) : ''}
        
        <div className="postUrl">
          <img src="images/up-arrow.png" alt="up arrow" onClick={handleUpVoteClick} />
          <span> | </span>
          <img src="images/down-arrow.png" alt="down arrow" onClick={handleDownVoteClick} />
          <strong><a href={normalizedUrl} target="_blank">{postDescription}</a></strong>
          <span> ({urlHost})</span>
        </div>
        <div className="postDetails">
          {pluralize('point', postPoints, true)} by: {postUsername} {postDate} | {pluralize('comment', postComments, true)}
        </div>
      </li>
    );
  }
}

Post.propTypes = {
  // This component gets the post to display through a React prop.
  // We can use propTypes to indicate it is required
  post: PropTypes.object.isRequired,
  showDeleteButton: React.PropTypes.bool.isRequired,
};