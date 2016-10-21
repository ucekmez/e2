export const Positions = new Mongo.Collection('positions');

import shortid from 'shortid';

Positions.attachSchema(new SimpleSchema({
  shortid       : { type: String, max: 64 },
  title         : { type: String, max: 256 },
  user          : { type: String, max: 64},
  description   : { type: String, max: 4096, optional: true},
  opensAt       : { type: Date,   optional: true },
  endsAt        : { type: Date,   optional: true },
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

Positions.allow({
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

export const SingleProcesses = new Mongo.Collection('single_processes');

SingleProcesses.attachSchema(new SimpleSchema({
  related_to: { type: [String] },
  description: { type: String, max: 2018, optional: true },

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

export const RecruitmentProcesses = new Mongo.Collection('recruitment_processes');

RecruitmentProcesses.attachSchema(new SimpleSchema({
  position      : { type: String },
  user          : { type: String, max: 64},

  prerequisites : { type: String, optional: true },
  test          : { type: String, optional: true },
  survey        : { type: String, optional: true },
  pi            : { type: String, optional: true },
  keynote       : { type: String, optional: true },
  video         : { type: String, optional: true },

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
