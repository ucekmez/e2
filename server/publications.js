import { Companies } from '/imports/api/collections/companies.js';
import { Forms, FormResponses } from '/imports/api/collections/forms.js';
import { Keynotes,Slides } from '/imports/api/collections/keynotes.js';
import { PIGroups, PIs } from '/imports/api/collections/pis.js';
import { Positions } from '/imports/api/collections/positions.js';
import { InterviewQuestions, Videos } from '/imports/api/collections/videos.js';
import { PredefinedLanguageTemplates, PredefinedTechnicalTemplates, PredefinedTechTopics } from '/imports/api/collections/predefined.js';
import { Sectors } from '/imports/api/collections/sectors.js';


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
    return [
      Forms.find({ _id: form_id }),
      FormResponses.find({ $and : [{ form: form_id}, {user: this.userId}]})
    ];
  }
});


Meteor.publish("company_list_lang_tests", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return PredefinedLanguageTemplates.find({ user: this.userId });
  }
});

Meteor.publish("company_list_tech_tests", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return [
      PredefinedTechnicalTemplates.find({ user: this.userId }),
      Sectors.find()
    ];
  }
});

Meteor.publish("company_list_sectors", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Sectors.find();
  }
});



/*** keynotes ***/

Meteor.publish("company_list_keynotes", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Keynotes.find({ user: this.userId });
  }
});

Meteor.publish("company_list_keynotes_slides_for_count", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Slides.find({ user: this.userId },{
      fields: {'keynote':1 }
    });
  }
});

Meteor.publish("company_keynote_preview", function(keynote_id) {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return [
      Keynotes.find({ _id: keynote_id }),
      Slides.find({ keynote: keynote_id })
    ];
  }
});



/*** pis ***/


Meteor.publish("company_list_pigroups", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return [
      PIGroups.find({ user: this.userId }),
      Sectors.find()
    ]
  }
});

Meteor.publish("company_list_pis", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return [
      PIs.find({}, { fields: { 'scale': 1, 'shortid': 1, 'slug': 1 } }),
      Sectors.find()
    ];
  }
});


/*** positions ***/

Meteor.publish("company_list_positions", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return Positions.find({ user: this.userId });
  }
});


/*** videos ***/

Meteor.publish("company_list_video_questions", function() {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return InterviewQuestions.find({ user: this.userId });
  }
});

Meteor.publish("company_video_question_preview", function(question_id) {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return InterviewQuestions.find({ _id: question_id });
  }
});

Meteor.publish("company_video_question_preview_record", function(question_id) {
  if (Roles.userIsInRole(this.userId, ['company'])) {
    return [
      InterviewQuestions.find({ _id: question_id }),
      Videos.find({ 'meta.companypreview': true, 'meta.company': this.userId, 'meta.question': question_id }).cursor
    ];
  }
});
