import { Forms } from '/imports/api/collections/forms.js';
import { Keynotes, Slides } from '/imports/api/collections/keynotes.js';
import { InterviewQuestions, Videos } from '/imports/api/collections/videos.js';
import { PredefinedLanguageTemplates, PredefinedTechnicalTemplates } from '/imports/api/collections/predefined.js';
import { PIs, PIGroups } from '/imports/api/collections/pis.js';


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


  /******************************
    methods related to keynotes
  *******************************/


  company_add_new_keynote() {
    const keynote_id = Keynotes.insert({
      title: "New Keynote",
      user: Meteor.userId()
    });
    return keynote_id;
  },

  company_add_new_slide(keynote_id) {
    Slides.insert({
      content : '<p><span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">Başlık</span></span></span></p><p><span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">Text text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text&nbsp;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></p><ul><li>Input List</li><li>Input List</li><li>Input List</li><li>Input list</li></ul><hr>',
      order : 0,
      keynote : keynote_id,
      user : Meteor.userId(),
    });
  },

  company_edit_keynote_name(keynote_id, title) {
    Keynotes.update({ _id: keynote_id }, { $set: { title: title } });
  },

  company_remove_keynote(id) {
    Keynotes.remove(id);
    Slides.remove({keynote: id});
  },

  company_add_new_slide_to_keynote(keynote_id) {
    const slides_cursor = Slides.find({keynote: keynote_id});
    const slides_count = slides_cursor.count();
    const slides = slides_cursor.fetch();

    let last_order = 0;
    if (slides_count > 0) {
      last_order = slides[slides_count - 1].order + 1;
    }

    const new_empty_slide_id = Slides.insert({
      content : "",
      order : last_order,
      keynote : keynote_id,
      user : Meteor.userId(),
    });
  },

  /******************************
    methods related to video interview
  *******************************/

  company_add_new_interview_question(question, description, responsetime) {
    let time = 30;
    if (responsetime == 1) { time = 20; }
    else if (responsetime == 3) { time = 40; }

    const question_id = InterviewQuestions.insert({
      content: question,
      description: description,
      user: Meteor.userId(),
      time: time
    });

    return question_id;
  },

  company_edit_interview_question(question_id, question, description, responsetime) {
    let time = 30;
    if (responsetime == 1) { time = 20; }
    else if (responsetime == 3) { time = 40; }

    InterviewQuestions.update({ _id: question_id },
      { $set: {
        content: question,
        description: description,
        time: time
      }
    });
  },

  company_remove_interview_question(question_id) {
    InterviewQuestions.remove(question_id);
  },

  company_clear_video_preview_saved_before(question_id) {
    const exists = Videos.findOne({ 'meta.companypreview': true, 'meta.company': Meteor.userId(), 'meta.question': question_id });

    if (exists) {
      Videos.remove(exists._id);
    }

  },



  /******************************
    methods related to predefined tests
  *******************************/

  company_add_new_lang_test_template(testname, language, level, numquestions) {
    const question_times = ["10","20","30"];
    const languages = ["english"];
    const levels = ["easy","moderate","hard"];


    if (question_times.indexOf(numquestions) == -1 || languages.indexOf(language) == -1 || levels.indexOf(level) == -1) {
      throw new Meteor.Error(450, 'Hata! Geçersiz seçim');
    }else {
      const template_id = PredefinedLanguageTemplates.insert({
        title: testname,
        user: Meteor.userId(),
        language: language,
        level: level,
        numquestions: numquestions,
      });

      return template_id;
    }
  },

  company_remove_lang_test(test_id) {
    PredefinedLanguageTemplates.remove(test_id);
  },



  company_add_new_tech_test_template(testname, sector, level, numquestions, relatedto) {
    const question_times = ["10","20","30"];
    const sectors = ["bilisim"];
    const levels = ["easy","moderate","hard"];

    if (question_times.indexOf(numquestions) == -1 || sectors.indexOf(sector) == -1 || levels.indexOf(level) == -1) {
      throw new Meteor.Error(450, 'Hata! Geçersiz seçim');
    }else {
      const template_id = PredefinedTechnicalTemplates.insert({
        title: testname,
        user: Meteor.userId(),
        sector: sector,
        level: level,
        numquestions: numquestions,
        related_to: relatedto
      });

      return template_id;
    }
  },

  company_remove_tech_test(test_id) {
    PredefinedTechnicalTemplates.remove(test_id);
  },



    /******************************
      methods related to pis and pigroups
    *******************************/


  company_add_new_pigroup(name, sector, chosens) {
    //const selected_pis = PIs.find({ shortid: { $in : chosens }});
    PIGroups.insert({
      user: Meteor.userId(),
      name: name,
      type: "custom",
      sector: sector,
      scales: chosens
    });
  },

  company_remove_pigroup(pigroup_id) {
    PIGroups.remove(pigroup_id);
  },

});
