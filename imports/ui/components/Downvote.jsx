import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Posts } from '../../api/posts.js';

export default class Downvote extends Component {
  downvote() {
    Meteor.call('posts.toggleDownvote', this.props.postId);
  }
  
  render() {
    const { width, height, fill, checked } = this.props;
    return(
      <svg className={classNames('vote', 'downvote', {checked: checked})}
           width={width}
           height={height}
           fill={fill}
           viewBox="0 0 490 490">
      	<g>
      		<path d="M0,15.541h490L244.991,474.459L0,15.541z"
      		      onClick={this.downvote.bind(this)} />
      	</g>
      </svg>
    );
  }
}

Downvote.propTypes = {
  postId: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

Downvote.defaultProps = {
  width: '12',
  height: '12',
  fill: '#828282',
  checked: false,
};