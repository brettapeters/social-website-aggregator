import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Posts } from '../api/posts.js';

// Post component - represents a single post item
export default class Post extends Component {
  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }

  render() {
    return (
      <li className="">
        { this.props.showDeleteButton ? (
          <button className="delete" onClick={this.deleteThisPost.bind(this)}>
            &times;
          </button>
        ) : ''}
        
        <span className="text">
          <strong>{this.props.post.username}</strong>: {this.props.post.url} || {this.props.post.description}
        </span>
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