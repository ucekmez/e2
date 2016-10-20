import { Forms } from '/imports/api/collections/forms.js';

import Stickyfill from 'stickyfill';

import './list_forms.html';
import './edit_form.html';

import '../generic_events.js';


/**********************************************
template helpers
***********************************************/


Template.CompanyEditForm.onRendered(function() {
  FlowRouter.subsReady("company_form_preview", function() {
    const form = Forms.findOne({_id: FlowRouter.getParam('formId')});

    if (form && form.user === Meteor.userId()) {
      fb = new Formbuilder({ selector: '.fb-main', bootstrapData: form.payload ? JSON.parse(form.payload).fields : [], workingFormType: form.type });
      fb.on('save', function(payload) {
        Meteor.call("company_update_form_payload", form._id, payload, function(err, data) {
          toastr.info("Form güncellendi!");
        });
      });
      if (form.type == 'test' || form.type == 'prerequisite') {
          $("a[data-field-type='address']").remove();
          $("a[data-field-type='number']").remove();
          $("a[data-field-type='date']").remove();
          $("a[data-field-type='paragraph']").remove();
          $("a[data-field-type='range']").remove();
          $("a[data-field-type='dropdown']").remove();
          $("a[data-field-type='section_break']").remove();
      }
      const stickyfill = Stickyfill();
      stickyfill.add($('.fb-left')[0]);

    }
  });
});


Template.CompanyEditForm.helpers({
  form() {
    return Forms.findOne({_id: FlowRouter.getParam('formId')});
  }
});

Template.CompanyListForms.helpers({
  forms() {
    return Forms.find({ user: Meteor.userId() })
    .map(function(document, index) {
      document.index = index + 1;
      return document;
    });
  },
});





/**********************************************
template events
***********************************************/

Template.CompanyEditForm.events({
  'click .show-edit-name'(event, instance) {
    $('.show-edit-name').hide();
    $('.edit-name-form').show();
    $("#new-name-value").focus();
    $("#new-name-value").focusout(function() {
      $('.show-edit-name').show();
      $('.edit-name-form').hide();;
      $('#new-name-value').val($(".show-edit-name h3").text());
    });
  },
  'keypress input#new-name-value'(event, instance) {
    if (event.which == 13) {
      const new_name = $('#new-name-value').val();
      Meteor.call('company_edit_form_name', FlowRouter.getParam('formId'), new_name, function(err, data) {
        if (!err) {
          toastr.info("Form adı değiştirildi!");
          $('.show-edit-name').show();
          $('.edit-name-form').hide();
        }else {
          toastr.warning(err);
        }
      });
      $('#new-name-value').val(new_name);
    }
  }
});

Template.CompanyListForms.events({
  'click #add_new_form_right'(event, instance) { // ana sayfadaki buton
    f_add_new_form(event ,instance);
  },
  'click #add_new_test_right'(event, instance) { // ana sayfadaki buton
    f_add_new_test(event ,instance);
  },
  'click #add_new_prerequisite_right'(event, instance) { // ana sayfadaki buton
    f_add_new_prerequisite(event ,instance);
  },
  'click #company-remove-form'(event, instance) {
    Meteor.call('company_remove_form', this._id, function(err, data) {
      if (err) {
        toastr.error(err);
      }else {
        toastr.success("Form kayıtlardan silindi!");
      }
    });
  }

});
