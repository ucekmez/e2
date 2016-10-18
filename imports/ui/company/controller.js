import { Companies } from '/imports/api/collections/companies.js';

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
template events
***********************************************/

Template.CompanyTopMenu.helpers({
  company() {
    return Companies.findOne({ user: Meteor.userId() });
  }
});



/**********************************************
template events
***********************************************/

Template.CompanyTopMenu.events({
  'click #company-logout'(event, instance) {
    AccountsTemplates.logout();
  }
});
