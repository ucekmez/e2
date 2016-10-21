// events related to forms /////////////////////////

f_add_new_form = function(event, instance) {
  Meteor.call('company_add_new_form', function(err, data) {
    if (err) {
      toastr.error('Form oluşturulamadı!');
    }else {
      FlowRouter.go("company_edit_form", {formId: data});
    }
  });
};

f_add_new_test = function(event, instance) {
  Meteor.call('company_add_new_test', function(err, data) {
    if (err) {
      toastr.error('Form oluşturulamadı!');
    }else {
      FlowRouter.go("company_edit_form", {formId: data});
    }
  });
};


f_add_new_prerequisite = function(event, instance) {
  Meteor.call('company_add_new_prerequisite', function(err, data) {
    if (err) {
      toastr.error('Form oluşturulamadı!');
    }else {
      FlowRouter.go("company_edit_form", {formId: data});
    }
  });
};


// events related to keynotes /////////////////////////


f_add_new_keynote = function(event, instance) {
  Meteor.call('company_add_new_keynote', function(err, data) {
    if (err) {
      toastr.error('Online Sunum oluşturulamadı!');
    }else {
      Meteor.call('company_add_new_slide', data, function(err2, data2) {
        if (err2) {
          toastr.error('Slayt oluşturulamadı!');
        }else {
          FlowRouter.go("company_edit_keynote", {keynoteId: data});
        }
      });
    }
  });
};




// events related to video question ////////////////////////

f_add_new_video_question = function(event, instance) {

  $('.modal.add-new-question')
    .modal({
      //blurring: true,
      onDeny() {
        $('.ui.form').form('reset');
        $('.ui.form').form('clear');
        Session.set("question-success", false);
      },
      onApprove() {
        $('.ui.form')
          .form({
            fields: {
              question      : 'empty',
              responsetime  : 'empty',
            }
          });

        if ($('.ui.form').form('is valid')) {
          const question = $('#question').val();
          const description = $('#description').val();
          const responsetime = $('#responsetime').val();
          Meteor.call('add_new_interview_question', question, description, responsetime, function (err, data) {
            if (err) {
              toastr.error(err.reason);
              Session.set("question-success", false);
            }else {
              Session.set("question-success", false);
              $(".ui.form").form('reset');
              $(".ui.form").form('clear');
              toastr.success('New Question has been added!');
              $('.modal.add-new-question').modal('hide');
              FlowRouter.go('list_questions');
            }
          });

          if (!Session.get("question-success")) {
            Session.set("question-success", false);
            return false;
          }
        }else {
          toastr.error('Please correct the errors!');
          return false;
        }
      }
    })
    .modal('show');
};
