import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Posts } from '../../api/posts.js'
import { Comments } from '../../api/comments.js'
import Post from '../components/Post.jsx';
import Comment from '../components/Comment.jsx';

export default class ShowPost extends TrackerReact(React.Component) {
  constructor() {
    super();
    this.state = {
      subscription: {
        posts: Meteor.subscribe('posts'),
        comments: Meteor.subscribe('comments')
      }
    }
  }
  
  componentWillUnmount() {
    this.state.subscription.posts.stop();
    this.state.subscription.comments.stop();
  }
    
  getPost() {
    const { postId } = this.props.params;
    return Posts.findOne(postId);
  }
  
  getComments() {
    const { postId } = this.props.params;
    return Comments.find({ parentId: this.getPost()._id }, { sort: { createdAt: -1} }).fetch();
  }
  
  handleSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.commentInput).value.trim();
    Meteor.call('comments.insert', this.getPost()._id, text);
    ReactDOM.findDOMNode(this.refs.commentInput).value = '';
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
      <div>
        <div className="show-post">
          <Post
            key={post._id}
            post={post}
            showDeleteButton={showDeleteButton}
            upvoted={upvoted}
            downvoted={downvoted}
          />
        </div>
        { currentUser ?
        <form className="new-comment" onSubmit={this.handleSubmit.bind(this)} >
          <textarea
            ref="commentInput"
            placeholder="Add a comment"
            required
          />
          <input
            type="submit"
          />
        </form> : ''
        }
        <ol className="comments">
        { this.getComments().map((comment) => {
            return(
              <Comment
                key={comment._id}
                comment={comment}
                showDeleteButton={comment.owner === currentUserId}
              />
            );
          })
        }
        </ol>
      </div>
    );
  }
}

ShowPost.propTypes = {
  params: PropTypes.object.isRequired,
};