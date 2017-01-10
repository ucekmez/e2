export const Forms = new Mongo.Collection('forms');

import shortid from 'shortid';

Forms.attachSchema(new SimpleSchema({
  title           : { type: String, max: 128 },
  user            : { type: String, max: 64},
  type            : { type: String, max:32 },
  payload         : { type: String, optional: true},
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

Forms.allow({
  insert: function (userId, doc) {
    if (userId && (Roles.userIsInRole(userId, ['admin']) || Roles.userIsInRole(userId, ['company']))) {
      return true;
    }
  },
  update: function (userId, doc, fields, modifier) {
    // burayi yalnizca oturum acan company VE admin degistirebilir
    if (userId && (Roles.userIsInRole(userId, ['admin']) || (Roles.userIsInRole(userId, ['company']) && userId === doc.user))) {
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




// tum cevaplar burada tutulacak
export const FormResponses = new Mongo.Collection('form_responses');

FormResponses.attachSchema(new SimpleSchema({
  form                  : { type: String, max: 64 },
  user                  : { type: String, max: 64},
  user_name             : { type: String, max: 64, optional: true },
  email                 : { type: String, max: 128 },
  response              : { type: Array, optional: true },
  'response.$'          : { type: Object },
  "response.$.label"    : { type: String },
  "response.$.cid"      : { type: String },
  "response.$.val"      : { type: Array },
  "response.$.val.$"    : { type: Object },
  "response.$.val.$.id" : { type: String, optional: true },
  "response.$.val.$.val": { type: String, optional: true },
  "response.$.type"     : { type: String },
  "response.$.bulk"     : { type: Boolean, optional: true },
  "response.$.date"     : { type: Date, optional: true },
  points                : { type: Number, optional: true },
  first_response_date   : { type: Date },
  company_preview       : { type: Boolean, optional: true},
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


FormResponses.allow({
  insert: function (userId, doc) {
    if (userId && (Roles.userIsInRole(userId, ['admin']) || Roles.userIsInRole(userId, ['company']))) {
      return true;
    }
  },
  update: function (userId, doc, fields, modifier) {
    // burayi yalnizca oturum acan company VE admin degistirebilir
    if (userId && (Roles.userIsInRole(userId, ['admin']) || (Roles.userIsInRole(userId, ['company']) && userId === doc.user))) {
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



export const PredefinedLanguageTestResponses = new Mongo.Collection('predefined_language_test_responses');
export const PredefinedTechnicalTestResponses = new Mongo.Collection('predefined_technical_test_responses');
