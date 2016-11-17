import { Companies } from '/imports/api/collections/companies.js';

import './forms/forms.js';
import './keynotes/keynotes.js';
import './pis/pis.js';
import './positions/positions.js';
import './videos/videos.js';


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
  },
  'click .left-menu-toggle'(event, instance) {
    $(this).toggleClass('active');
    $('nav.left-menu').toggleClass('left-menu-showed');
    $('.main-backdrop').toggleClass('main-backdrop-showed');
  },
});

Template.CompanyFooter.events({
  'click .main-backdrop'(event, instance) {
    $('.left-menu-toggle').removeClass('active');
    $('nav.left-menu').removeClass('left-menu-showed');
    $('.main-backdrop').removeClass('main-backdrop-showed');
  }
});
