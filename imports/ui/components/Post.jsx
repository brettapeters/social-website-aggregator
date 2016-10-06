import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { UrlUtils } from 'meteor/peerlibrary:url-utils';
import { moment } from 'meteor/momentjs:moment';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Posts } from '../../api/posts.js';
import { Comments } from '../../api/comments.js';

import { Link } from 'react-router';
import Upvote from './Upvote.jsx';
import Downvote from './Downvote.jsx';

// Post component - represents a single post item
export default class Post extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
    this.state = {
      subscription: {
        comments: Meteor.subscribe('comments')
      }
    }
  }
  
  componentWillUnmount() {
    this.state.subscription.comments.stop();
  }
  
  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }
  
  formatDate(date) {
    return moment(date).fromNow();
  }
  
  numComments(postId) {
    return Comments.find({ parentId: postId }).count();
  }
  
  render() {
    const rawUrl = this.props.post.url;
    const normalizedUrl = UrlUtils.normalize(rawUrl);
    const urlHost = UrlUtils.parse(rawUrl).hostname;
    const postTitle = this.props.post.title;
    const postUsername = this.props.post.username;
    const postDate = this.formatDate(this.props.post.createdAt);
    const postPoints = this.props.post.points;
    const postComments = this.numComments(this.props.post._id);
    const postShowDeleteButton = this.props.showDeleteButton;
    const handleDeleteClick = this.deleteThisPost.bind(this);
    
    return (
      <div>
        { postShowDeleteButton ? (
          <button className="delete" onClick={handleDeleteClick}>
            &times;
          </button>
        ) : ''}
        { Meteor.user() ?
        <span>
          <Upvote postId={this.props.post._id}
                  checked={this.props.upvoted} />
          <Downvote postId={this.props.post._id}
                    checked={this.props.downvoted} />
        </span> : ''
        }
        <div className="postWrap">
          <div className="postUrl">
            <strong><a href={normalizedUrl}>{postTitle}</a></strong>
            <span> ({urlHost})</span>
          </div>
          <div className="postDetails">
            {pluralize('point', postPoints, true)} by: {postUsername} {postDate} | <Link to={`/posts/${this.props.post._id}`}>{pluralize('comment', postComments, true)}</Link>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  showDeleteButton: React.PropTypes.bool.isRequired,
  upvoted: PropTypes.bool,
  downvoted: PropTypes.bool,
};