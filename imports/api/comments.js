import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Comments = new Mongo.Collection('comments');

if (Meteor.isServer) {
  // This code only runs on the server
  // Publish all posts
  Meteor.publish('comments', function commentsPublication() {
    return Comments.find({});
  });
}

Meteor.methods({
  'comments.insert'(parentId, text) {
    check(parentId, String);
    check(text, String);
    
    // Make sure the user is logged in before inserting a comment
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Comments.insert({
      parentId,
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username ||
                Meteor.users.findOne(this.userId).profile.name,
      children: []
    });
  },
  'comments.remove'(commentId) {
    check(commentId, String);
    
    const comment = Comments.findOne(commentId);
    if (comment.owner !== this.userId) {
      // Make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    Comments.remove(commentId);
  },
});