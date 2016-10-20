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
