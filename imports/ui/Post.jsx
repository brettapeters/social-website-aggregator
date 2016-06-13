import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Posts } from '../api/posts.js';

import Upvote from './Upvote.jsx';
import Downvote from './Downvote.jsx';

// Post component - represents a single post item
export default class Post extends Component {
  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }
  
  formatDate(date) {
    return moment(date).fromNow();
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
    
    return (
      <li>
        { postShowDeleteButton ? (
          <button className="delete" onClick={handleDeleteClick}>
            &times;
          </button>
        ) : ''}
        <span>
          <Upvote postId={this.props.post._id}
                  checked={this.props.upvoted} />
          <Downvote postId={this.props.post._id}
                    checked={this.props.downvoted} />
        </span>
        <div className="postWrap">
          <div className="postUrl">
            <strong><a href={normalizedUrl} target="_blank">{postDescription}</a></strong>
            <span> ({urlHost})</span>
          </div>
          <div className="postDetails">
            {pluralize('point', postPoints, true)} by: {postUsername} {postDate} | {pluralize('comment', postComments, true)}
          </div>
        </div>
      </li>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  showDeleteButton: React.PropTypes.bool.isRequired,
  upvoted: PropTypes.bool,
  downvoted: PropTypes.bool,
};