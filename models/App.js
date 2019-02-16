const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AppSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  url: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  }, 
  mobileFriendly: {
    type: String,
    default: 'Yes'
  },
  techStack: {
    type: Array,
    default: []
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate: {
      type: Date,
      default: Date.now
    },
    commentUser: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('apps', AppSchema, 'apps');