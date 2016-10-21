export const Keynotes = new Mongo.Collection('keynotes');

import shortid from 'shortid';

Keynotes.attachSchema(new SimpleSchema({
  title           : { type: String, max: 256},
  user            : { type: String, max: 64},
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

Keynotes.allow({
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


export const Slides = new Mongo.Collection('slides');

Slides.attachSchema(new SimpleSchema({
  content           : { type: String, max: 16384, optional: true},
  order             : { type: Number, min: 0},
  keynote           : { type: String, max: 64},
  user              : { type: String, max: 64},
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

Slides.allow({
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
