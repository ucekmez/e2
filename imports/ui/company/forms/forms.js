import { Forms } from '/imports/api/collections/forms.js';
import { PredefinedLanguageTemplates, PredefinedTechnicalTemplates, PredefinedTechTopics } from '/imports/api/collections/predefined.js';
import { Sectors } from '/imports/api/collections/sectors.js';

import Stickyfill from 'stickyfill';

import './list_forms.html';
import './edit_form.html';
import './lang_tests.html';
import './tech_tests.html';

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
    return Forms.findOne();
  }
});

Template.CompanyListForms.helpers({
  forms() {
    return Forms.find({ user: Meteor.userId() }, { sort: { updatedAt: -1, createdAt: -1  }})
    .map(function(document, index) {
      document.index = index + 1;
      return document;
    });
  },
});


Template.CompanyListLangTests.helpers({
  tests() {
    return PredefinedLanguageTemplates.find({},{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyListTechTests.helpers({
  tests() {
    return PredefinedTechnicalTemplates.find({},{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyPreviewForm.helpers({
  form() {
    return Forms.findOne();
  },
});



/**********************************************
template events
***********************************************/

Template.CompanyEditForm.events({
  'click .form-show-edit-name'(event, instance) {
    $('.form-show-edit-name').hide();
    $('.form-edit-name-form').show();
    $("#form-new-name-value").focus();
    $("#form-new-name-value").focusout(function() {
      $('.form-show-edit-name').show();
      $('.form-edit-name-form').hide();;
      $('#form-new-name-value').val($(".form-show-edit-name h3").text());
    });
  },
  'keypress input#form-new-name-value'(event, instance) {
    if (event.which == 13) {
      const new_name = $('#form-new-name-value').val();
      Meteor.call('company_edit_form_name', FlowRouter.getParam('formId'), new_name, function(err, data) {
        if (!err) {
          toastr.info("Form adı değiştirildi!");
          $('.form-show-edit-name').show();
          $('.form-edit-name-form').hide();
        }else {
          toastr.warning(err);
        }
      });
      $('#form-new-name-value').val(new_name);
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
  },

});



Template.CompanyAddNewLangTest.events({
  'submit #company-add-new-lang-test-form'(event, instance) {
    event.preventDefault();

    const testname     = $('#langtestname').val();
    const language     = $('#langtestlanguage').val();
    const level        = $('#langtestlevel').val();
    const numquestions = $('#langtestnumquestions').val();

    Meteor.call('company_add_new_lang_test_template', testname, language, level, numquestions, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Test eklendi!');
        FlowRouter.go('company_list_lang_tests');
      }
    });
  },

  'click #company-add-new-lang-test-reset'(event, instance) {
    $('#langtestname').val()?$('#langtestname').val(""):"";
    $('#langtestlanguage').val("");
    $('#langtestlevel').val("");
    $('#langtestnumquestions').val("");
  },
});

Template.CompanyListLangTests.events({
  'click #company-remove-lang-test'(event, instance) {
    Meteor.call('company_remove_lang_test', this._id, function(err, data) {
      if (err) {
        toastr.error(err);
      }else {
        toastr.success("Test kayıtlardan silindi!");
      }
    });
  },
});


Template.CompanyAddNewTechTest.helpers({
  sectors() {
    return Sectors.find();
  }
});


Template.CompanyAddNewTechTest.events({
  'submit #company-add-new-tech-test-form'(event, instance) {
    event.preventDefault();

    const testname     = $('#techtestname').val();
    const sector       = $('#techtestsector').val();
    const relatedto    = $('#techtestrelatedto').tagsinput('items');
    const level        = $('#techtestlevel').val();
    const numquestions = $('#techtestnumquestions').val();

    Meteor.call('company_add_new_tech_test_template', testname, sector, level, numquestions, relatedto, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Test eklendi!');
        FlowRouter.go('company_list_tech_tests');
      }
    });
  },

  'click #company-add-new-tech-test-reset'(event, instance) {
    $('#techtestname').val()?$('#techtestname').val(""):"";
    $('#techtestsector').val("");
    $('#techtestlevel').val("");
    $('#techtestnumquestions').val("");
    $('.bootstrap-tagsinput').children().not('input').remove();
    $('#techtestrelatedto').tagsinput("removeAll");
  },
});

Template.CompanyListTechTests.events({
  'click #company-remove-tech-test'(event, instance) {
    Meteor.call('company_remove_tech_test', this._id, function(err, data) {
      if (err) {
        toastr.error(err);
      }else {
        toastr.success("Test kayıtlardan silindi!");
      }
    });
  },
});



//// helpers


Template.registerHelper("formPayload", function(payload){
  return JSON.parse(payload).fields;
});
