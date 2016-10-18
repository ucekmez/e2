import { Companies } from '/imports/api/collections/companies.js';


/******* subs for admin **********/

Meteor.publish("admin_show_company_list", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Companies.find();
  }
});



/******* subs for company **********/

Meteor.publish("company_show_company_profile", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Companies.find({ user: this.userId });
  }
});
