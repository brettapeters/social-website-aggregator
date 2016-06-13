import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import 'meteor/maxharris9:classnames';

import { Posts } from '../api/posts.js';

export default class Upvote extends Component {
  upvote() {
    Meteor.call('posts.toggleUpvote', this.props.postId);
  }
  
  render() {
    const { width, height, fill, checked } = this.props;
    return(
      <svg className={classNames('vote', 'upvote', {checked: checked})}
           width={width}
           height={height}
           fill={fill}
           viewBox="0 0 490 490">
      	<g>
      		<path d="M490,474.459H0L245.009,15.541L490,474.459z"
      		      onClick={this.upvote.bind(this)} />
      	</g>
      </svg>
    );
  }
}

Upvote.propTypes = {
  postId: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

Upvote.defaultProps = {
  width: '12',
  height: '12',
  fill: '#828282',
  checked: false
}