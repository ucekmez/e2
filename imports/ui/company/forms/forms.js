import { Forms, FormResponses } from '/imports/api/collections/forms.js';
import { PredefinedLanguageTemplates, PredefinedTechnicalTemplates, PredefinedTechTopics } from '/imports/api/collections/predefined.js';
import { Sectors } from '/imports/api/collections/sectors.js';
import { CSession } from '/client/main.js';

import Stickyfill from 'stickyfill';

import './list_forms.html';
import './edit_form.html';
import './lang_tests.html';
import './tech_tests.html';
import './preview_test.html';
import './preview_prereq.html';
import './preview_survey.html';
import './preview_form_result.html';

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

Template.CompanyPreviewFormSurvey.helpers({
  form() { return Forms.findOne(); },
});

Template.CompanyPreviewFormTest.helpers({
  form() { return Forms.findOne(); },
});

Template.CompanyPreviewFormPrereq.helpers({
  form() { return Forms.findOne(); },
});

Template.CompanyPreviewFormResult.helpers({
  form() { return Forms.findOne(); },
  form_response() { return FormResponses.findOne(); }
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



// test ve prereq sorularinin cevaplarini fetch eder
const f_get_test_response = function(event, instance) {
  const question = $('.question-active .question-content').text();
  const cid = $('.question-active .question-content').attr('id');
  if ($('.question-active .type-radio').length == 1) {
    const selected = $('.question-active .type-radio input:checked');
    return {
      label: question,
      cid: cid,
      val: (selected.attr('id') && selected.val()) ? [{ 'id': selected.attr('id'), 'val': selected.val() }] : [],
      type: "radio"
    };
  }
  else if ($('.question-active .type-checkboxes').length == 1) {
    const checks = $('.question-active .type-checkboxes input:checked').map(function() { return {'id': this.id, 'val': this.value }; }).get();
    return {
      label: question,
      cid: cid,
      val: checks,
      type: "checkboxes"
    };
  }
}

const f_get_survey_response = function(event, instance) {
  const result_form = Forms.findOne();
  if (result_form && result_form.payload) {
    const fields = JSON.parse(result_form.payload).fields;
    const response = new Array();

    fields.forEach(function(field) {
      if (field.field_type === 'paragraph') {
        const text = $(`.type-paragraph input[name=${field.cid}]`).val();
        response.push({
          label: field.label,
          cid: field.cid,
          val: [{ 'id': false, 'val': text }] || [],
          type: field.field_type
        });

      } else if (field.field_type === 'checkboxes') {
        const checks = $(`.type-checkboxes input[name=${field.cid}]:checked`).map(function() {
          return {'id': this.id, 'val': this.value };
        }).get();
        response.push({
          label: field.label,
          cid: field.cid,
          val: checks,
          type: field.field_type
        });

      } else if (field.field_type === 'range') {
        const range = $(`.type-range input[name=${field.cid}]`).val();
        response.push({
          label: field.label,
          cid: field.cid,
          val: [{ 'id': false, 'val': range }] || [],
          type: field.field_type
        });

      } else if (field.field_type === 'radio') {
        const selected = $(`.type-radio input[name=${field.cid}]:checked`);
        response.push({
          label: field.label,
          cid: field.cid,
          val: (selected.attr('id') && selected.val()) ? [{ 'id': selected.attr('id'), 'val': selected.val() }] : [],
          type: field.field_type
        });

      } else if (field.field_type === 'dropdown') {
        const drop_select = $(`.type-dropdown select[name=${field.cid}] option:selected`);
        response.push({
          label: field.label,
          cid: field.cid,
          val: [{ 'id': drop_select.val(), 'val': drop_select.text() }] || [],
          type: field.field_type
        });

      } else if (field.field_type === 'number') {
        const number = $(`.type-number input[name=${field.cid}]`).val();
        response.push({
          label: field.label,
          cid: field.cid,
          val: [{ 'id': false, 'val': number }] || [],
          type: field.field_type
        });
      }
    });

    return response;
  }
}


// test sonu mesajini acar
const f_open_completed_message = function(event, instance) {
  const active = $('.form-all-questions-area');
  active.addClass('question-hide');
  active.next().removeClass('question-hide').addClass('question-active');
  active.remove();
}

// sorunun cevabini isler. Burada veritabanina yazma islemi yapilir
const f_get_response = function(event, instance, type) {
  Meteor.clearInterval(f_session_get('test_qtime'));
  if (type === "prereq") {
    const response = f_get_test_response(event, instance);
    Meteor.call('company_add_new_prereq_response_for_preview', response, FlowRouter.getParam('formId'), function(err, data) {
      if (err) { console.log(err) }
      else { toastr.info("Cevap kaydedildi!"); }
    });
  }else if(type === "test") {
    const response = f_get_test_response(event, instance);
    Meteor.call('company_add_new_test_response_for_preview', response, FlowRouter.getParam('formId'), function(err, data) {
      if (err) { console.log(err) }
      else { toastr.info("Cevap kaydedildi!"); }
    });
  }else { // type === survey
    const response = f_get_survey_response(event, instance);
    Meteor.call('company_add_new_survey_response_for_preview', response, FlowRouter.getParam('formId'), function(err, data) {
      if (err) { console.log(err) }
      else { toastr.info("Form kaydedildi!"); }
    });
  }
}


// mevcut ekrani silip sonraki ekrani getirir
const f_open_next_question = function(event, instance) {
  const active = $('.start-button');
  if (active.hasClass('question-active')) {
    active.addClass('question-hide').removeClass('question-active');
    active.next().removeClass('question-hide').addClass('question-active');
  }else {
    active.addClass('question-active').removeClass('question-hide');
  }
  return "OK";
}

const f_close_question = function(event, instance) {
  const active = $('.question-active.question');
  if (active.hasClass('question-active')) {
    active.addClass('question-hide').removeClass('question-active');
  }
}

// onkosul sorularinda zorunlu cevaplama seceneginin validasyonunu yapar
const f_check_if_prereq_filled = function(event, instance) {
  if ($('.question-active .type-radio.required-question').length == 1) {
    const selected = $('.question-active .type-radio.required-question input:checked');
    return selected.length > 0 ? true : false;
  }
  else if ($('.question-active .type-checkboxes.required-question').length == 1) {
    const checks = $('.question-active .type-checkboxes.required-question input:checked').map(function() { return this.id; }).get();
    return checks.length > 0 ? true : false;
  }else { return true;}
}

Template.CompanyPreviewFormSurvey.events({
  'click .question-submit-last-survey'(event, instance) { // submit survey
    const result_form = Forms.findOne();
    if (result_form && result_form.payload) {
      const fields = JSON.parse(result_form.payload).fields;

      const field_validations = {};
      fields.forEach(function(field) {
        if(field.field_type === 'number') {
          const min = parseInt(field.field_options.min);
          const max = parseInt(field.field_options.max);
          field_validations[field.cid]   = { required: field.required, number: true, range: [min,max] }
        }else if(field.field_type === 'range') {
          const min = parseInt(field.field_options.min);
          const max = parseInt(field.field_options.max);
          field_validations[field.cid]   = { required: field.required, range: [min,max] }
        }else {
          field_validations[field.cid]   = { required: field.required }
        }
      });

      $("#company-preview-survey-form").validate({ rules: field_validations });

      if($("#company-preview-survey-form").valid()) {
        f_get_response(event, instance, "survey");
        f_open_completed_message(event, instance);
        //console.log("finished");
      }else {
        toastr.warning("Lütfen zorunlu soruları cevaplayın!");
      }
    }
  },
});


export const f_session_set = function(key, value) {
  CSession.insert({ 'key': key, 'value': value });
}

export const f_session_get = function(key) {
  const result = CSession.findOne({ 'key': key });
  if (result) { return result.value; }
}

export const f_session_remove = function(key) {
  CSession.remove({ 'key': key});
}

/*
const f_check_test_time = function(cid, time) {
  f_session_set('test_'+cid+'_time', moment.now());
  let show_last_5_seconds = true;
  export const QUESTION_INTERVAL = Meteor.setInterval(function() {
    let remaining_seconds = time - moment().subtract(f_session_get('test_'+cid+'_time')).seconds();
    $(`.question-remaining-time.${cid}`).text(remaining_seconds);
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
*/

const f_check_test_time = function(cid, time) {
  TimeSync.resync();
  const start = TimeSync.serverTime();
  let show_last_5_seconds = true;
  f_session_set('test_qtime', Meteor.setInterval(function() {
    let remaining_seconds = time - moment(TimeSync.serverTime()).subtract(start).seconds();
    $(`.question-remaining-time.${cid}`).text(remaining_seconds);
    if (show_last_5_seconds && remaining_seconds <= 5) {
      toastr.warning("Son 5 saniye!"); show_last_5_seconds = false;
      $('.question-active .question-remaining-time-badget').addClass('red-icon');
    }
    if (remaining_seconds < 1) {
      Meteor.clearInterval(f_session_get('test_qtime'));
      if ($('.question-active .question-submit-next-test').length > 0) {
        $('.question-active .question-submit-next-test').click();
        toastr.info("Soru süresi doldu!");
      }else {
        $('.question-active .question-submit-last-test').click();
        toastr.info("Test sonlandırıldı!");
       }
    }
  }, 1000));
}



Template.CompanyPreviewFormTest.events({
  'click .question-start-test'(event, instance) { // start test form
    Meteor.call("company_add_bulk_question_to_test_for_preview", this.field, FlowRouter.getParam('formId'),
      function(err, data) { if (err) { console.log(err); } });
    f_session_set('test_'+this.field.cid, true);
    const fon = f_open_next_question(event, instance);
    if (fon === "OK") { f_check_test_time(this.field.cid, parseInt(this.field.field_options.answerduration)); }
  },
  'click .question-submit-next-test'(event, instance) { // submit test
    Meteor.clearInterval(f_session_get('test_qtime'));
    f_get_response(event, instance, "test");
    f_session_remove('test_'+this.field.cid);
    const fon = f_open_next_question(event, instance);
  },
  'click .question-submit-last-test'(event, instance) { // finish test form
    Meteor.clearInterval(f_session_get('test_qtime'));
    f_get_response(event, instance, "test");
    f_session_remove('test_'+this.field.cid);
    f_open_completed_message(event, instance);
  },
});

Template.CompanyPreviewFormPrereq.events({
  'click .question-start-prereq'(event, instance) { // start prerequisite form
    const fon = f_open_next_question(event, instance);
  },
  'click .question-submit-next-prereq'(event, instance) { // submit test
    const can_continue = f_check_if_prereq_filled(event, instance);
    if (can_continue) {
      f_get_response(event, instance, "prereq");
      $("input[type=radio]").prop('checked',false);
      $("input[type=checkbox]").prop('checked',false);
    }else { toastr.warning("Lütfen soruyu cevaplayın!"); }
  },
  'click .question-submit-last-prereq'(event, instance) { // finish prerequisite form
    const can_continue = f_check_if_prereq_filled(event, instance);
    if (can_continue) {
      f_get_response(event, instance, "prereq");
      f_open_completed_message(event, instance);
    }else { toastr.warning("Lütfen soruyu cevaplayın!"); }
  },
});



Template.CompanyPreviewFormResult.events({
  'click .company-form-clear-formresponse'(event, instance) {
    Meteor.call('company_remove_form_response', this._id, function(err, data) {
      if (err) { toastr.error(err.reason); }
      else { toastr.info("Form temizlendi!"); }
    });
  },
});


//// helpers


//Template.registerHelper("formPayload", function(payload){
//  return JSON.parse(payload).fields;
//});

Template.registerHelper("equalsIndex", function(index, fields, pos){
  if (pos === 'first') { return (index === 0) ? true : false; }
  else if(pos === 'last') { return (index === fields.length-1) ? true : false; }
  else { if (pos < fields.length) { return pos - 1 === index; } }
});


Template.registerHelper('responseExists', function(val) {
  return val.length > 0;
});

Template.registerHelper("CONTINUE_TEST", function(cid){
  return f_session_get('test_'+cid);
});

Template.registerHelper("responseStartedBefore", function(){
  return FormResponses.findOne();
});
