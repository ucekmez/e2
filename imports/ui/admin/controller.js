import { Companies } from '/imports/api/collections/companies.js';

import './add_new_company.html';
import './list_companies.html';



/**********************************************
template helpers
***********************************************/

Template.AdminListCompanies.helpers({
  companies() {
    return Companies.find({}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});


/**********************************************
template events
***********************************************/

Template.AdminTopMenu.events({
  'click #admin-logout'(event, instance) {
    AccountsTemplates.logout();
  },
  'click .left-menu-toggle'(event, instance) {
    $(this).toggleClass('active');
    $('nav.left-menu').toggleClass('left-menu-showed');
    $('.main-backdrop').toggleClass('main-backdrop-showed');
  },
  'click nav.left-menu a.left-menu-link'(event, instance) {
    if (!$(this).parent().hasClass('left-menu-list-submenu')) {
      $('.left-menu-toggle').removeClass('active');
      $('nav.left-menu').removeClass('left-menu-showed');
      $('.main-backdrop').removeClass('main-backdrop-showed')
    }
  }
});


Template.AdminAddNewCompany.onRendered(() => {
  $("#admin-add-new-company-form").validate({
    rules: {
      companyname: { required: true, },
      email: { required: true, email: true },
      password: { required: true }
    },
    messages: {
      companyname: { required: "Bu alan boş bırakılamaz.", },
      email: { required: "Bu alan boş bırakılamaz.", email: "E-posta geçersiz."},
      password: { required: "Bu alan boş bırakılamaz.", },
    }
  })
});

Template.AdminAddNewCompany.events({
  'submit #admin-add-new-company-form'(event, instance) {
      event.preventDefault();

      const companyname = $('#companyname').val();
      const email = $('#email').val();
      const password = $('#password').val();

      Meteor.call('add_new_company', companyname, email, password, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('New Company has been added!');
          FlowRouter.go('admin_list_companies');
        }
      });
  },
  'click #company-form-reset'(event, instance) {
    $('#companyname').val()?$('#companyname').val(""):"";
    $('#email').val()?$('#email').val(""):"";
    $('#password').val()?$('#password').val(""):"";
  }
});


Template.AdminListCompanies.events({
  'click #admin-remove-company'(event, instance) {
    Meteor.call('remove_company', this._id, function(err, data) {
      if (err) {
        toastr.error(err);
      }else {
        toastr.success("Firma kayıtlardan silindi!");
      }
    });
  },
});


Template.AdminFooter.events({
  'click .main-backdrop'(event, instance) {
    $('.left-menu-toggle').removeClass('active');
    $('nav.left-menu').removeClass('left-menu-showed');
    $('.main-backdrop').removeClass('main-backdrop-showed');
  }
});
