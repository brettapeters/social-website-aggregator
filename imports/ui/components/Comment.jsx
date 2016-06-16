import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';

// Comment component - represents a single comment item
export default class Comment extends Component {
  formatDate(date) {
    return moment(date).fromNow();
  }
  
  deleteThisComment() {
    Meteor.call('comments.remove', this.props.comment._id);
  }
  
  render() {
    const { comment, showDeleteButton } = this.props
    const username = comment.username;
    const date = this.formatDate(comment.createdAt);
    const handleDeleteClick = this.deleteThisComment.bind(this);
    
    return (
      <li>
        { showDeleteButton ? (
          <button className="delete" onClick={handleDeleteClick}>
            &times;
          </button>
        ) : ''}
        <p className="comment-text">{comment.text}</p>
        <p className="comment-details">{username} commented {date}</p>
      </li>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  showDeleteButton: React.PropTypes.bool.isRequired,
};