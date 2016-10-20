import shortid from 'shortid';

export const Sectors = new Mongo.Collection("sectors");

Sectors.attachSchema(new SimpleSchema({
  name         : { type: String, max: 64},
  slug         : { type: String, max: 64}, // bu, name'in slugify hali olacak
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
    autoValue: function() { if (this.isUpdate) { return new Date(); } },
    denyInsert: true,
    optional: true
  }
}));
