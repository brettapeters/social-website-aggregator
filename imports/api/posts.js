import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  // This code only runs on the server
  // Publish all posts
  Meteor.publish('posts', function postsPublication() {
    return Posts.find({});
  });
}

Meteor.methods({
  'posts.insert'(url, description) {
    check(url, String);
    check(description, String);
    
    // Make sure the user is logged in before inserting a post
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Posts.insert({
      url,
      description,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username ||
                Meteor.users.findOne(this.userId).profile.name,
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
});