import { Forms, FormResponses } from '/imports/api/collections/forms.js';
import { Keynotes, Slides } from '/imports/api/collections/keynotes.js';
import { InterviewQuestions, Videos } from '/imports/api/collections/videos.js';
import { PredefinedLanguageTemplates, PredefinedTechnicalTemplates } from '/imports/api/collections/predefined.js';
import { PIs, PIGroups, PIResponses } from '/imports/api/collections/pis.js';
import { Positions } from '/imports/api/collections/positions.js';


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

  company_remove_form(id) {
    Forms.remove(id);
    FormResponses.remove({form: id}); // remove related responses, too.
   },

   company_remove_form_response(id) {
     FormResponses.remove(id);
   },



  company_add_new_survey_response_for_preview(response, form_id) {
    const user            = Meteor.user();
    const already_exists  = FormResponses.findOne({ $and : [{ form: form_id}, {user: user._id}]});

    if (already_exists) {
      FormResponses.update({ $and : [{ form: form_id}, {user: user._id}]}, {
        $set: { response: response } // set the new one
      });
      return already_exists._id;
    }else {
      const user_name = (user.profile && user.profile.name) ?  user.profile.name : "";
      const user_email = (user.emails) ? user.emails[0].address : "";

      const form_response_id = FormResponses.insert({
        form: form_id,
        user: user._id,
        user_name: user_name,
        email: user_email,
        response: response,
        company_preview: true,
        first_response_date : new Date()
      });
      return form_response_id;
    }
  },

  company_add_new_prereq_response_for_preview(response, form_id) {
    const user            = Meteor.user();
    const already_exists  = FormResponses.findOne({ $and : [{ form: form_id}, {user: user._id}]});

    if (already_exists) {
      FormResponses.update({ $and : [{ form: form_id}, {user: user._id}]}, {
        $addToSet: { response: response } // set the new one
      });
      return already_exists._id;
    }else {
      const user_name = (user.profile && user.profile.name) ?  user.profile.name : "";
      const user_email = (user.emails) ? user.emails[0].address : "";

      const form_response_id = FormResponses.insert({
        form: form_id,
        user: user._id,
        user_name: user_name,
        email: user_email,
        response: [response],
        company_preview: true,
        first_response_date : new Date()
      });
      return form_response_id;
    }
  },

  company_add_bulk_question_to_test_for_preview(field, form_id) {
    const user            = Meteor.user();
    const already_exists  = FormResponses.findOne({ $and : [{ form: form_id}, {user: user._id}]});
    if (already_exists) {
      FormResponses.update({ $and : [{ form: form_id}, {user: user._id}]}, {
        $addToSet: { response: {
          "cid": field.cid,
          "label": field.label,
          "val": [],
          "type": field.field_type,
          "bulk": true}
        }
      });
    }else {
      const user_name = (user.profile && user.profile.name) ?  user.profile.name : "";
      const user_email = (user.emails) ? user.emails[0].address : "";
      const form_response_id = FormResponses.insert({
        form: form_id,
        user: user._id,
        user_name: user_name,
        email: user_email,
        response: [{"cid": field.cid, "label": field.label, "val": [], "type": field.field_type, "bulk": true}],
        company_preview: true,
        first_response_date : new Date()
      });
    }
  },

  company_test_check_if_bulk_remains(form_id) {
    const user            = Meteor.user();
    const already_exists  = FormResponses.findOne({ $and : [{ form: form_id}, {user: user._id}]});
    if (already_exists) {
      FormResponses.update({ $and : [{ form: form_id}, {user: user._id}, { 'response.bulk': true}]}, {
        $set: { 'response.$.bulk': false, 'response.$.date': new Date() }
      });
    }
  },

  company_add_new_test_response_for_preview(response, form_id) {
    //console.log(response);
    const user            = Meteor.user();
    const already_exists  = FormResponses.findOne({ $and : [{ form: form_id}, {user: user._id}]});

    if (already_exists) {
      FormResponses.update({ $and : [{ form: form_id}, {user: user._id}, {'response.cid': response.cid}]}, {
        $set: {
          'response.$.label': response.label,
          'response.$.cid'  : response.cid,
          'response.$.val'  : response.val,
          'response.$.type' : response.field_type,
          'response.$.bulk' : false,
          'response.$.date' : new Date()
        } // set the new one
      });
      return already_exists._id;
    }else {
      const user_name = (user.profile && user.profile.name) ?  user.profile.name : "";
      const user_email = (user.emails) ? user.emails[0].address : "";

      const form_response_id = FormResponses.insert({
        form: form_id,
        user: user._id,
        user_name: user_name,
        email: user_email,
        response: [response],
        company_preview: true,
        first_response_date : new Date()
      });

      FormResponses.update({ $and : [{ form: form_id}, {user: user._id}, {'response.cid': response.cid}]}, {
        $set: { 'response.$': response, 'response.$.date': new Date() } // set the new one
      });


      return form_response_id;
    }
  },

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
    const pis = PIs.find({ shortid: { $in : chosens }}).fetch();

    const phrases = new Array();
    const scale_ids = new Array();
    // response means empty array
    const responsemeans = new Array();
    pis.forEach(function(scale, i) {
      scale.phrases.forEach(function(phrase, j) {
        phrases.push({ 'scale': scale.shortid, 'phrase': phrase, 'index': j });
      });
      scale_ids.push(scale.shortid);
      responsemeans.push(0);
    });

    for(let j=0;j<2;j++) {
      for(let i=0; i<phrases.length; i++) {
        const rnd = Math.floor(Math.random() * phrases.length);
        const tmp = phrases[i];
        phrases[i] = phrases[rnd];
        phrases[rnd] = tmp;
      }
    }

    PIGroups.insert({
      user: Meteor.userId(),
      name: name,
      type: "custom",
      sector: sector,
      phrases: phrases,
      numscales: pis.length,
      length: phrases.length,
      scales: scale_ids,
      responsemeans: responsemeans
    });

  },

  company_edit_pigroup(group_id, name, sector, chosens) {
    const pis = PIs.find({ shortid: { $in : chosens }}).fetch();

    const phrases = new Array();
    const scale_ids = new Array();
    // response means empty array
    const responsemeans = new Array();
    pis.forEach(function(scale, i) {
      scale.phrases.forEach(function(phrase, j) {
        phrases.push({ 'scale': scale.shortid, 'phrase': phrase, 'index': j });
      });
      scale_ids.push(scale.shortid);
      responsemeans.push(0);
    });

    for(let j=0;j<2;j++) {
      for(let i=0; i<phrases.length; i++) {
        const rnd = Math.floor(Math.random() * phrases.length);
        const tmp = phrases[i];
        phrases[i] = phrases[rnd];
        phrases[rnd] = tmp;
      }
    }


    PIGroups.update({ _id: group_id}, { $set: {
      name: name,
      sector: sector,
      phrases: phrases,
      numscales: pis.length,
      length: phrases.length,
      scales: scale_ids,
      responsemeans: responsemeans
    }});
  },

  company_add_pi_preview_response(group_id, scale, expression_index, val) {
    const user = Meteor.user();
    const already_exists = PIResponses.findOne({ $and : [{ group: group_id}, {user: user._id}]});
    const response = {}
    response['scale'] = scale;
    response['expressions'] = new Array();
    const expression_answer = { 'index': parseInt(expression_index), 'val': parseInt(val), 'date': new Date() };
    response['expressions'].push(expression_answer);

    if (already_exists) {
      const expression_exists = PIResponses.findOne({ $and : [{ group: group_id}, {user: user._id}, { 'response.scale': scale}]});
      if (expression_exists) {
        PIResponses.update({ $and : [{ group: group_id}, {user: user._id}, { 'response.scale': scale}]}, {
          '$addToSet': {
            'response.$.expressions': expression_answer,
            'response_acc.$.filled': parseInt(expression_index)
        }});
      }else {
        PIResponses.update({ $and : [{ group: group_id}, {user: user._id}]}, { $addToSet: {
          response: response,
          response_acc: { 'scale': scale, 'filled': [parseInt(expression_index)] },
        }});
      }
    }else {
      const user_name = (user.profile && user.profile.name) ?  user.profile.name : "";
      const user_email = (user.emails) ? user.emails[0].address : "";

      PIResponses.insert({
        group: group_id,
        user: user._id,
        user_name: user_name,
        email: user_email,
        response: [response],
        response_acc: [{ 'scale': scale, 'filled': [parseInt(expression_index)] }],
        company_preview: true,
      });
    }
  },

  company_pi_collect_response(groupId, userId) {
    const response = PIResponses.findOne({ group: groupId, user: userId});
    if (response) {

      response.response.forEach(function(rsp, i) {
        let total_points = 0;
        rsp.expressions.forEach(function(exp, j) {
          total_points += exp.val;
        });
        // burada verilen cevaplari ilgili scale icin topluyoruz daha sonra asagida ortalamasi alinacak
        PIResponses.update({ $and : [{ group: groupId}, {user: userId}, { 'response_acc.scale': rsp.scale}]}, {
          '$set': {
            'response_acc.$.total': total_points
        }});
      });


      let scale_means = new Array();
      response.response_acc.forEach(function(acc) {
        scale_means.push(parseFloat((acc.total / acc.filled.length).toFixed(2)));
      });



      PIResponses.update({ group: groupId, user: userId}, {
        '$set': { 'response_result': scale_means }
      });
    }
  },

  company_remove_pigroup(pigroup_id) {
    PIGroups.remove(pigroup_id);
    PIResponses.remove({});
  },



  /******************************
    methods related to position
  *******************************/

  company_add_new_position(title, starts, ends, description) {
    const position_id = Positions.insert({
      title: title,
      user: Meteor.userId(),
      description: description,
      opensAt: starts,
      endsAt: ends,
    });
    return position_id;
  },

  company_edit_position(positionId, title, starts, ends, description) {
    Positions.update({ _id: positionId }, {
      $set: {
        title: title,
        description: description,
        opensAt: starts,
        endsAt: ends,
      }
    });
  },

});
