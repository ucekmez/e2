import { Companies } from '/imports/api/collections/companies.js';

import './add_new_company.html';
import './list_companies.html';


const datatable_lang = {
  processing:     "İşleniyor...",
  search:         "Kayıt içinde ara",
  lengthMenu:     "_MENU_ kayıt göster",
  info:           "Toplam _TOTAL_ kayıt var. _START_ - _END_ aralığındakiler görüntüleniyor.",
  infoEmpty:      "Kayıt bulunamadı.",
  infoFiltered:   "(_MAX_ kayıt arasından filtrelendi)",
  infoPostFix:    "",
  loadingRecords: "Yükleniyor...",
  zeroRecords:    "Kayıt bulunamadı.",
  emptyTable:     "Tabloda veri yok.",
  paginate: {
      first:      "İlk",
      previous:   "Önceki",
      next:       "Sonraki",
      last:       "Son"
  },
  aria: {
      sortAscending:  ": artan biçimde sıralar",
      sortDescending: ": azalan biçimde sıralar"
  }
};


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
  datatable_lang() {
    return datatable_lang;
  },
});


/**********************************************
template events
***********************************************/

Template.AdminTopMenu.events({
  'click #admin-logout'(event, instance) {
    AccountsTemplates.logout();
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
