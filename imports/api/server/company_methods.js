import { Forms } from '/imports/api/collections/forms.js';


import shortid from 'shortid';


Meteor.methods({

  /******************************
    methods related to forms
  *******************************/

  company_add_new_form(){
    const form_id = Forms.insert({
      title: "Yeni Anket",
      user: Meteor.userId(),
      type: "form",
    });
    return form_id;
  },

  company_add_new_test(){
    const form_id = Forms.insert({
      title: "Yeni Test",
      user: Meteor.userId(),
      type: "test",
    });
    return form_id;
  },

  company_add_new_prerequisite(){
    const form_id = Forms.insert({
      title: "Yeni Önkoşul Formu",
      user: Meteor.userId(),
      type: "prerequisite",
    });
    return form_id;
  },

  company_edit_form_name(form_id, title) {
    Forms.update({ _id: form_id }, { $set: { title: title } });
  },

  company_update_form_payload(id, payload) {
    Forms.update({ _id: id }, { $set: { payload: payload } });
  },


  company_remove_form(id) { Forms.remove(id); },


});
