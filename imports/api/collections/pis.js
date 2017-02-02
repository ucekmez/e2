export const PIs = new Mongo.Collection('pis');
export const PIGroups = new Mongo.Collection('pi_groups');

import shortid from 'shortid';

PIGroups.attachSchema(new SimpleSchema({
  name            : { type: String, max: 256},
  user            : { type: String, max: 64},
  type            : { type: String, max: 16},
  sector          : { type: String, max: 32, optional: true},
  scales          : { type: [String] },
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

PIGroups.allow({
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








export const PIResponses = new Mongo.Collection('pi_responses');
PIResponses.attachSchema(new SimpleSchema({
  group                           : { type: String, max: 64 }, // PIGroup ID
  user                            : { type: String, max: 64},
  user_name                       : { type: String, max: 64, optional: true },
  email                           : { type: String, max: 128 },
  response                        : { type: Array, optional: true },
  'response.$'                    : { type: Object },
  "response.$.scale"              : { type: String },
  "response.$.expressions"        : { type: Array, optional: true },
  "response.$.expressions.$"      : { type: Object },
  "response.$.expressions.$.index": { type: Number },
  "response.$.expressions.$.val"  : { type: Number },
  finishedAt                      : { type: Date, optional: true },
  company_preview                 : { type: Boolean, optional: true},
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
