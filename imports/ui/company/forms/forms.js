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


f_check_question_time = function(event, instance) {
  Session.set("test-start-time", moment.now());
  Session.set("test-question-start-time", moment.now());
  if ($('.question-active .question-remaining-time').length > 0) {
    const max_time_allowed = $('.question-active .question-remaining-time').text();
    let show_last_5_seconds = true;
    QUESTION_INTERVAL = Meteor.setInterval(function(){
      let remaining_seconds = max_time_allowed - moment().subtract(Session.get("test-question-start-time")).seconds();
      $('.question-active .question-remaining-time').text(remaining_seconds);
      if (show_last_5_seconds && remaining_seconds <= 5) {
        toastr.warning("Son 5 saniye!"); show_last_5_seconds = false;
        $('.question-active .question-remaining-time-badget').addClass('red-icon');
      }
      if (remaining_seconds < 1) {
        Meteor.clearInterval(QUESTION_INTERVAL);
        if ($('.question-active .question-submit-next-test').length > 0) {
          $('.question-active .question-submit-next-test').click();
          toastr.info("Soru süresi doldu!");
        }else {
          $('.question-active .question-submit-last-test').click();
          toastr.info("Test sonlandırıldı!");
         }
      }
    }, 1000);
  }
}


/* her sorunun tek bir seferde dolduruldugunu varsayarak cekiyor
f_get_form_response = function(event, instance) {
  const question = $('.question-active .question-content').text();
  const cid = $('.question-active .question-content').attr('id');
  if ($('.question-active .type-radio').length == 1) {
    const selected = $('.question-active .type-radio input:checked');
    return {label: question, cid: cid, val: selected.attr('id') || "", type: "radio"};
  }
  else if ($('.question-active .type-checkboxes').length == 1) {
    const checks = $('.question-active .type-checkboxes input:checked').map(function() { return this.id; }).get();
    return {label: question, cid: cid, val: checks, type: "checkboxes"};
  }
  else if ($('.question-active .type-paragraph').length == 1) {
    const text = $('.type-paragraph input').val();
    return {label: question, cid: cid, val: text, type: "paragraph"};
  }
  else if ($('.question-active .type-dropdown').length == 1) {
    const selected = $('.type-dropdown select').val();
    return {label: question, cid: cid, val: selected, type: "dropdown"};
  }
  else if ($('.question-active .type-number').length == 1) {
    const number = $('.type-number input').val();
    return {label: question, cid: cid, val: number, type: "number"};
  }
  else if ($('.question-active .type-range').length == 1) {
    const selected = $('.type-range input').val();
    return {label: question, cid: cid, val: selected, type: "range"};
  }
}
*/


f_get_test_response = function(event, instance) {
  const question = $('.question-active .question-content').text();
  const cid = $('.question-active .question-content').attr('id');
  if ($('.question-active .type-radio').length == 1) {
    const selected = $('.question-active .type-radio input:checked');
    return {label: question, cid: cid, val: selected.attr('id') || "", type: "radio"};
  }
  else if ($('.question-active .type-checkboxes').length == 1) {
    const checks = $('.question-active .type-checkboxes input:checked').map(function() { return this.id; }).get();
    return {label: question, cid: cid, val: checks, type: "checkboxes"};
  }
}

f_open_completed_message = function(event, instance) {
  const active = $('.form-all-questions-area');

  active.addClass('question-hide');
  active.next().removeClass('question-hide').addClass('question-active');
  active.remove();
}

f_open_next_question = function(event, instance, where) {
  const active = $('.question-active');

  if (where === "question" || where === "last") {
    const response = f_get_test_response(event, instance);
    console.log(response); // tam burada veritabanina yazacagiz
  }

  active.addClass('question-hide').removeClass('question-active');
  active.next().removeClass('question-hide').addClass('question-active');
  active.remove();
}



Template.CompanyPreviewForm.events({
  'click .question-start-test'(event, instance) { // start test and prerequisite form
    f_open_next_question(event, instance, "start");
    f_check_question_time(event, instance);
  },
  'click .question-submit-next-test'(event, instance) { // submit test
    if (typeof(QUESTION_INTERVAL) != "undefined") { Meteor.clearInterval(QUESTION_INTERVAL); }
    f_open_next_question(event, instance, "question");
    f_check_question_time(event, instance);
  },
  'click .question-submit-next-prereq'(event, instance) { // submit test
    f_open_next_question(event, instance, "question");
  },
  'click .question-continue-test'(event, instance) { // continue to test and prerequisite form
    f_open_next_question(event, instance, "continue");
    f_check_question_time(event, instance);
  },
  'click .question-submit-last-test'(event, instance) { // finish test and prerequisite form
    if (typeof(QUESTION_INTERVAL) != "undefined") { Meteor.clearInterval(QUESTION_INTERVAL); }
    f_open_completed_message(event, instance);
    console.log("finished");
  },
  'click .question-submit-last-prereq'(event, instance) { // finish test and prerequisite form
    f_open_completed_message(event, instance);
    console.log("finished");
  },
  'click .question-submit-last-survey'(event, instance) { // submit survey
    f_open_completed_message(event, instance);
    console.log("finished");
  },
});



//// helpers


Template.registerHelper("formPayload", function(payload){
  return JSON.parse(payload).fields;
});

Template.registerHelper("equalsIndex", function(index, fields, pos){
  if (pos === 'first') { return (index === 0) ? true : false; }
  else if(pos === 'last') { return (index === fields.length-1) ? true : false; }
  else { if (pos < fields.length) { return pos - 1 === index; } }
});
