import { InterviewQuestions } from '/imports/api/collections/videos.js';

import './list_questions.html';
import './add_new_video_question.html';
import './edit_video_question.html';

import '../generic_events.js';



/**********************************************
template helpers
***********************************************/


Template.CompanyListVideoQuestions.helpers({
  questions() {
    return InterviewQuestions.find({ user: Meteor.userId() }, { sort: { createdAt : -1 }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});

Template.CompanyEditVideoQuestion.helpers({
  videoquestion() {
    return InterviewQuestions.findOne({ _id: FlowRouter.getParam("questionId") });
  }
});




/**********************************************
template events
***********************************************/

Template.CompanyListVideoQuestions.events({
  'click #add_new_video_question_right'(event, instance) {
    f_add_new_video_question(event, instance);
  },
  'click #company-remove-video-question'(event, instance) {
    Meteor.call('company_remove_video_question', this._id);
  },
});

Template.CompanyAddNewVideoQuestion.onRendered(() => {
  $("#company-add-new-video-question-form").validate({
    rules: {
      videoquestion: { required: true, },
      videoresponsetime: { required: true }
    },
    messages: {
      videoquestion: { required: "Bu alan boş bırakılamaz.", },
      videoresponsetime: { required: "Bu alan boş bırakılamaz.", },
    }
  })
});

Template.CompanyAddNewVideoQuestion.events({
  'submit #company-add-new-video-question-form'(event, instance) {
    event.preventDefault();

    const question = $('#videoquestion').val();
    const description = $('#videoquestiondesc').val();
    const responsetime = $('#videoresponsetime').val();

    Meteor.call('company_add_new_interview_question', question, description, responsetime, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Soru eklendi!');
        FlowRouter.go('company_list_video_questions');
      }
    });
  },
  'click #company-add-new-question-form-reset'(event, instance) {
    $('#videoquestion').val()?$('#videoquestion').val(""):"";
    $('#videoquestiondesc').val()?$('#videoquestiondesc').val(""):"";
    $('#videoresponsetime').val("1");
  },
});


Template.CompanyEditVideoQuestion.onRendered(() => {
  $("#company-edit-video-question-form").validate({
    rules: {
      videoquestion_edit: { required: true, },
      videoresponsetime_edit: { required: true }
    },
    messages: {
      videoquestion_edit: { required: "Bu alan boş bırakılamaz.", },
      videoresponsetime_edit: { required: "Bu alan boş bırakılamaz.", },
    }
  })
});

Template.CompanyEditVideoQuestion.events({
  'submit #company-edit-video-question-form'(event, instance) {
    event.preventDefault();

    const question = $('#videoquestion-edit').val();
    const description = $('#videoquestiondesc-edit').val();
    const responsetime = $('#videoresponsetime-edit').val();

    Meteor.call('company_edit_interview_question', FlowRouter.getParam('questionId'), question, description, responsetime, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Soru güncellendi!');
        FlowRouter.go('company_list_video_questions');
      }
    });
  },
  'click #company-edit-question-form-reset'(event, instance) {
    $('#videoquestion-edit').val()?$('#videoquestion-edit').val(""):"";
    $('#videoquestiondesc-edit').val()?$('#videoquestiondesc-edit').val(""):"";
    $('#videoresponsetime-edit').val("1");
  },
});
