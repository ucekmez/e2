import { PIGroups, PIs } from '/imports/api/collections/pis.js';
import { Sectors } from '/imports/api/collections/sectors.js';

import './list_pis.html';
import './preview_pi.html';


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

Template.CompanyEditPICombination.helpers({
  pis() {
    return PIs.find();
  },
  sectors() {
    return Sectors.find();
  },
  PIGroup() {
    return PIGroups.findOne();
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


Template.CompanyPreviewPICombination.helpers({
  PIGroup() {
    return PIGroups.findOne();
  },
  // burada shuffle ediyoruz
  pi() {
    const combination = PIGroups.findOne();
    if (combination) {
      const scales = PIs.find({ shortid: { $in : combination.scales }}).fetch();
      if (scales.length > 0) {
        const phrases = new Array();
        scales.forEach(function(scale) {
          let index = 0;
          scale.phrases.forEach(function(phrase) {
            phrases.push({ scale: scale.shortid, phrase: phrase, index: index++ });
          });
        });
        for(let i=0;i<phrases.length;i++) {
          const rnd = Math.floor(Math.random() * phrases.length);
          const tmp = phrases[i];
          phrases[i] = phrases[rnd];
          phrases[rnd] = tmp;
        }
        return {'phrases': phrases, 'length': phrases.length};
      }
    }
  }
});


/**********************************************
template events
***********************************************/

// mevcut ekrani silip sonraki ekrani getirir
const f_open_first_expression = function(event, instance) {
  const active = $('.start-button');
  if (active.hasClass('expression-active')) {
    active.addClass('expression-passive').removeClass('expression-active');
    active.next().children().first().removeClass('pi-add-checkmark');
    active.next().removeClass('expression-passive').addClass('expression-active');
  }else {
    active.addClass('expression-active').removeClass('expression-passive');
  }
  return "OK";
}

const f_open_next_expression = function(event, instance) {
  const active = $('.expression-active');
  active.children().first().addClass('pi-add-checkmark');

  setTimeout(function(){
    active.hide();
    active.next().removeClass('expression-passive').addClass('expression-active');
    active.next().children().first().removeClass('pi-add-checkmark');
    active.remove();
    return "OK";
  }, 1000);
}

const f_get_expression_response = function(event, instance) {
  const scale = $('.expression-active input:checked').prop('name').split('__')[0];
  const expression_index = $('.expression-active input:checked').prop('name').split('__')[1];
  const val = $('.expression-active input:checked').val();
  if (typeof(val) === "undefined") {
    toastr.warning("Lütfen bir seçim yapın!");
  }else {
    Meteor.call("company_add_pi_preview_response", FlowRouter.getParam('groupID'), scale, expression_index, val, function(err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        const fone = f_open_next_expression(event, instance);
        toastr.info("Seçiminiz kaydedildi!");
      }
    });
  }
}


Template.CompanyPreviewPICombination.events({
  'click input[type="radio"]'(event, instance) {
    $(event.currentTarget).parent().parent().children()
      .removeClass("fill-with-agree")
      .removeClass("fill-with-disagree")
      .removeClass("fill-with-neutral");

    if ($(event.currentTarget).val() === "1" || $(event.currentTarget).val() === "2") {
      $(event.currentTarget).parent().toggleClass("fill-with-agree");
    }else if ($(event.currentTarget).val() === "4" || $(event.currentTarget).val() === "5") {
      $(event.currentTarget).parent().toggleClass("fill-with-disagree");
    }else {
      $(event.currentTarget).parent().toggleClass("fill-with-neutral");
    }
    const fger = f_get_expression_response(event, instance);
  },
  'click .question-start-pi'(event, instance) {
    const fofe = f_open_first_expression(event, instance);
  }
});

Template.CompanyAddNewPICombination.onRendered(() => {
  $("#company-add-new-pigroup-form").validate({
    rules: {
      pigroupname: { required: true, },
      pigroupsector: { required: true }
    },
    messages: {
      pigroupname: { required: "Bu alan boş bırakılamaz.", },
      pigroupsector: { required: "Bu alan boş bırakılamaz.", }
    }
  })
});

Template.CompanyAddNewPICombination.events({
  'submit #company-add-new-pigroup-form'(event, instance) {
    event.preventDefault();
    const name    = $('#pigroupname').val();
    const sector  = $('#pigroupsector').val();
    const chosens = $('[name=check_pi]:checked').map(function() {return this.value;}).get();

    if (chosens.length > 0) {
      Meteor.call('company_add_new_pigroup', name, sector, chosens, function (err, data) {
        if (err) {
          if (err.error === 400) { toastr.error("Lütfen tüm alanları doldurun!"); }
          else {toastr.error(err.reason);}
        }else {
          toastr.success('Kişilik Envanteri Oluşturuldu!');
          FlowRouter.go('company_list_pigroups');
        }
      });
    }else {toastr.warning("Lütfen ölçek seçimi yapın!");}


  },

  'click #company-add-new-pigroup-form-reset'(event, instance) {
    $('#pigroupname').val()?$('#pigroupname').val(""):"";
    $('[name=check_pi]:checked').prop("checked", false).parent().removeClass("active");
  },
});


Template.CompanyEditPICombination.onRendered(() => {
  $("#company-edit-pigroup-form").validate({
    rules: {
      pigroupname_edit: { required: true, },
      pigroupsector_edit: { required: true }
    },
    messages: {
      pigroupname_edit: { required: "Bu alan boş bırakılamaz.", },
      pigroupsector_edit: { required: "Bu alan boş bırakılamaz.", }
    }
  })
});

Template.CompanyEditPICombination.events({
  'submit #company-edit-pigroup-form'(event, instance) {
    event.preventDefault();
    const name    = $('#pigroupname_edit').val();
    const sector  = $('#pigroupsector_edit').val();
    const chosens = $('[name=check_pi_edit]:checked').map(function() {return this.value;}).get();

    if (chosens.length > 0) {
      Meteor.call('company_edit_pigroup', FlowRouter.getParam('groupID'), name, sector, chosens, function (err, data) {
        if (err) {
          if (err.error === 400) { toastr.error("Lütfen tüm alanları doldurun!"); }
          else {toastr.error(err.reason);}
        }else {
          toastr.success('Kişilik Envanteri Güncellendi!');
          FlowRouter.go('company_list_pigroups');
        }
      });
    }else {toastr.warning("Lütfen ölçek seçimi yapın!");}


  },

  'click #company-edit-pigroup-form-reset'(event, instance) {
    $('#pigroupname_edit').val()?$('#pigroupname_edit').val(""):"";
    $('[name=check_pi_edit]:checked').prop("checked", false).parent().removeClass("active");
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

Template.registerHelper("getNumberOfScales", function(scales){
  return scales.length;
});

Template.registerHelper("isThisPIChecked", function(scale_id){
  const group = PIGroups.findOne();
  if (group) {
    return group.scales.indexOf(scale_id) > -1
  }
});

Template.registerHelper("PIAddPlusOne", function(index){
  return parseInt(index) + 1;
});




//
