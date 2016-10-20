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
