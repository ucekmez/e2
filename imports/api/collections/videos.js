import { FilesCollection } from 'meteor/ostrio:files';

export const InterviewQuestions = new Mongo.Collection('interviewquestions');

import shortid from 'shortid';

InterviewQuestions.attachSchema(new SimpleSchema({
  content: { type: String, max: 256 },
  description: { type: String, max: 256, optional: true },
  user: { type: String, max: 64},
  time: {type: Number, min: 0, max: 120},
  shortid : {
    type: String,
    autoValue: function() { if (this.isInsert) { return shortid.generate(); } },
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) { return new Date(); }
      else if (this.isUpsert) { $setOnInsert: new Date(); }
      else { this.unset(); }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() { if (this.isInsert) { return new Date(); } else if (this.isUpdate) { return new Date(); } },
    optional: true
  }
}));

InterviewQuestions.allow({
  insert: function (userId, doc) {
    if (userId && (Roles.userIsInRole(userId, ['admin']) || Roles.userIsInRole(userId, ['company']))) {
      return true;
    }
  },
  update: function (userId, doc, fields, modifier) {
    // burayi yalnizca oturum acan company VE admin degistirebilir
    if (userId && (Roles.userIsInRole(userId, ['admin']) || Roles.userIsInRole(userId, ['company']))) {
      return true;
    }
  },
  // burayi sadece oturum acan company ve admin degistirebilir
  remove: function (userId, doc, fields, modifier) {
    if (userId && (Roles.userIsInRole(userId, ['admin']) || Roles.userIsInRole(userId, ['company']))) {
      return true;
    }
  }
});


/////////////

//export const Videos = new FS.Collection("videos", {
//  stores: [new FS.Store.GridFS("videos", {})]
//});

export const Videos = new FilesCollection({
  collectionName: 'Videos',
  //allowClientCode: false, // Disallow remove files from Client
  storagePath: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return '/Users/ugur/Desktop/FILISRC/e2/data/videos/'+year+'/'+month;
  },
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 50485760) {
      return true;
    } else {
      return 'The file should be in size equal or less than 50MB';
    }
  }
});

/////////////









export const VideoResponses = new Mongo.Collection('video_responses');

VideoResponses.attachSchema(new SimpleSchema({
  question: { type: String, max: 64 },
  user: { type: String, max: 64},
  user_name: { type: String, max: 64, optional: true },
  email: { type: String, max: 128 },
  video: { type: String, max: 64 },
  finished: { type: Boolean, optional: true },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) { return new Date(); }
      else if (this.isUpsert) { $setOnInsert: new Date(); }
      else { this.unset(); }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() { if (this.isUpdate) { return new Date(); } },
    denyInsert: true,
    optional: true
  }
}));
