import { InterviewQuestions, Videos } from '/imports/api/collections/videos.js';

import './list_questions.html';
import './add_new_video_question.html';
import './edit_video_question.html';
import './preview_question.html';

import '../generic_events.js';

import  videojs  from 'video.js';
import  record  from 'videojs-record';


/**********************************************
template helpers
***********************************************/


Template.CompanyListVideoQuestions.helpers({
  questions() {
    return InterviewQuestions.find({}, { sort: { createdAt : -1 }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});

Template.CompanyEditVideoQuestion.helpers({
  videoquestion() {
    return InterviewQuestions.findOne();
  }
});


Template.CompanyPreviewQuestionRecord.helpers({
  question() {
    return InterviewQuestions.findOne();
  },
  player() {
    const question = InterviewQuestions.findOne();
    if (question && Session.get("OK_LOAD_PLAYER")) {

      setTimeout(function () {
        q_player = videojs("companyInterviewPreviewRecord", {
          // video.js options
          width: 640,
          height: 480,
          plugins: {
              // videojs-record plugin options
              record: {
                  image: false,
                  audio: true,
                  video: {
                    mandatory: {
                      minWidth: 320,
                      minHeight: 240
                    }
                  },
                  frameWidth: 320,
                  frameHeight: 240,
                  maxLength: question.time,
                  debug: false
              }
          }
        });

        q_player.on('deviceReady', function() {
          //console.log('device is ready!');
        });

        q_player.on('startRecord', function() {
          //console.log('started recording!');
        });

        q_player.on('stopRecord', function() {
          //console.log('stopped recording!');
        });

        q_player.on('finishRecord', function() {
          //const video = new Blob([q_player.recordedData], { type: 'video/*'});
          // FF = q_player.recordedData;

          let data = q_player.recordedData; // if Firefox
          if (/WebKit/.test(navigator.userAgent)) {
            data = q_player.recordedData.video; // Chrome
          }

          const upload_state = Videos.insert({
            file: data,
            streams: 'dynamic',
            chunkSize: 'dynamic'
          }, false);
          upload_state.on('end', function (err, fileObj) {
            if (err) {
              toastr.warning("Video Kaydedilemedi!");
            } else {
              //Meteor.call('save_video_response_preview', question._id, fileObj._id, function() {
              //  toastr.info("Your response has been saved!");
              //});
              toastr.info("Video başarıyla kaydedildi!");
            }
          });
          upload_state.start();

        })

        q_player.on('deviceError', function() {
          if (q_player.deviceErrorCode === "PermissionDeniedError") {
            toastr.warning("You must give permission to your camera and mic!");
          }else if (q_player.deviceErrorCode === "NotFoundError") {
            toastr.warning("You must have a working camera + mic!");
          }else {
            toastr.warning("You need Firefox or Chrome to record!");
          }
        });
      }, 1000);
    }
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
    Meteor.call('company_remove_interview_question', this._id);
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
