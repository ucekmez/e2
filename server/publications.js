import { Companies } from '/imports/api/collections/companies.js';
import { Forms } from '/imports/api/collections/forms.js';
import { Keynotes } from '/imports/api/collections/keynotes.js';
import { PIGroups } from '/imports/api/collections/pis.js';
import { Positions } from '/imports/api/collections/positions.js';
import { InterviewQuestions } from '/imports/api/collections/videos.js';


/******* subs for admin **********/

Meteor.publish("admin_show_company_list", function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Companies.find();
  }
});



/******* subs for company **********/

Meteor.publish("company_show_company_profile", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Companies.find({ user: this.userId }, {
      fields: {'name':1, 'email': 1, 'user': 1}
    });
  }
});

/*** forms ***/

Meteor.publish("company_list_forms", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Forms.find({ user: this.userId });
  }
});

Meteor.publish("company_form_preview", function(form_id) {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Forms.find({ _id: form_id });
  }
});



/*** keynotes ***/

Meteor.publish("company_list_keynotes", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Keynotes.find({ user: this.userId });
  }
});


/*** pis ***/


Meteor.publish("company_list_pis", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return PIGroups.find({ user: this.userId });
  }
});


/*** positions ***/

Meteor.publish("company_list_positions", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Positions.find({ user: this.userId });
  }
});


/*** videos ***/

Meteor.publish("company_list_videos", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return InterviewQuestions.find({ user: this.userId });
  }
});
