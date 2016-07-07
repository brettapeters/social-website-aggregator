import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Comments } from './comments.js';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  Posts._ensureIndex({
    'title': 'text',
  });
  
  Meteor.publish('posts', function(searchValue) {
    if (!searchValue) {
      return Posts.find({});
    }
    return Posts.find(
      { $text: { $search: searchValue } },
      {
        // `fields` is where we can add MongoDB projections. Here we're causing
        // each document published to include a property named `score`, which
        // contains the document's search rank, a numerical value, with more
        // relevant documents having a higher score.
        fields: {
          score: { $meta: "textScore" }
        },
        // This indicates that we wish the publication to be sorted by the
        // `score` property specified in the projection fields above.
        sort: {
          score: { $meta: "textScore" }
        }
      }
    );
  });
}

function updatePoints(postId) {
  const post = Posts.findOne(postId);
  Posts.update(postId, { $set: { points: post.upvoters.length - post.downvoters.length } });
}

Meteor.methods({
  'posts.insert'(url, title) {
    check(url, String);
    check(title, String);
    
    // Make sure the user is logged in before inserting a post
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Posts.insert({
      url,
      title,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username ||
                Meteor.users.findOne(this.userId).profile.name,
      upvoters: [],
      downvoters: [],
      points: 0,
    });
  },
  'posts.remove'(postId) {
    check(postId, String);
    
    const post = Posts.findOne(postId);
    if (post.owner !== this.userId) {
      // Make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    Posts.remove(postId);
  },
  'posts.toggleUpvote'(postId) {
    check(postId, String);
    
    if (!Meteor.user()) {
      // Make sure only logged-in user can vote
      throw new Meteor.Error('not-authorized');
    }
    
    const post = Posts.findOne(postId);
    const userId = Meteor.user()._id;
    
    if (post.upvoters.indexOf(userId) === -1) {
      Posts.update(postId, { $pull: { downvoters: userId },
                             $addToSet: { upvoters: userId } });
    } else {
      Posts.update(postId, { $pull: { upvoters: userId } });
    };
    
    updatePoints(postId);
  },
  'posts.toggleDownvote'(postId) {
    check(postId, String);
    
    if (!Meteor.user()) {
      // Make sure only logged-in user can vote
      throw new Meteor.Error('not-authorized');
    }
    
    const post = Posts.findOne(postId);
    const userId = Meteor.user()._id;
    
    if (post.downvoters.indexOf(userId) === -1) {
      Posts.update(postId, { $pull: { upvoters: userId },
                             $addToSet: { downvoters: userId } });
    } else {
      Posts.update(postId, { $pull: { downvoters: userId } });
    }
    
    updatePoints(postId);
  },
});