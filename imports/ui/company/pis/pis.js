import { PIGroups, PIs } from '/imports/api/collections/pis.js';
import { Sectors } from '/imports/api/collections/sectors.js';

import './list_pis.html';


/**********************************************
template helpers
***********************************************/



Template.CompanyAddNewPICombination.helpers({
  pis() {
    return PIs.find();
  },
  sectors() {
    return Sectors.find();
  }
});

Template.CompanyListPIGroups.helpers({
  pigroups() {
    return PIGroups.find({ user: Meteor.userId() }, { sort: { updatedAt: -1, createdAt: -1  }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});


/**********************************************
template events
***********************************************/




Template.CompanyAddNewPICombination.events({
  'submit #company-add-new-pigroup-form'(event, instance) {
    event.preventDefault();
    const name    = $('#pigroupname').val();
    const sector  = $('#pigroupsector').val();
    const chosens = $('[name=check_pi]:checked').map(function() {return this.value;}).get();

    Meteor.call('company_add_new_pigroup', name, sector, chosens, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Kişilik Envanteri Oluşturuldu!');
        FlowRouter.go('company_list_pigroups');
      }
    });

  },

  'click #company-add-new-pigroup-gorm-reset'(event, instance) {
    $('#pigroupname').val()?$('#pigroupname').val(""):"";
    $('[name=check_pi]:checked').prop("checked", false).parent().removeClass("active");
  },
});


Template.CompanyListPIGroups.events({
  'click #company-remove-pigroup'(event, instance) {
    Meteor.call('company_remove_pigroup', this._id, function(err, data) {
      if (err) {
        toastr.error(err);
      }else {
        toastr.success("Envanter kayıtlardan silindi!");
      }
    });
  },
});
