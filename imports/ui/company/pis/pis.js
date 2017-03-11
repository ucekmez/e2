import { PIGroups, PIs, PIResponses } from '/imports/api/collections/pis.js';
import { Sectors } from '/imports/api/collections/sectors.js';

import './list_pis.html';
import './preview_pi.html';
import './preview_pi_result.html';

import Chart from 'chart.js';

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
  pi() {
    return PIGroups.findOne();
  }
});



Template.CompanyPreviewPIResult.helpers({
  PIGroup() {
    return PIGroups.findOne();
  },
  response() {
    const response = PIResponses.findOne();
    if (response && response.response_result) {
      const scale_names = new Array();
      response.response_acc.forEach(function(acc, i) {
        scale_names.push(PIs.findOne({ shortid: acc.scale }).scale);
      });

      const data = {
        labels: scale_names,
        datasets: [
            {
                label: "Adayın Sonucu",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                data: response.response_result
            },
            {
                label: "Genel Ortalama",
                backgroundColor: "rgba(0,0,0,0.1)",
                borderColor: "rgba(179,181,198,1)",
                pointBackgroundColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                data: [4, 3, 4, 3, 3]
            },
        ]
      };

      Meteor.setTimeout(function(){
        const ctx1 = $("#companyPreviewResult-radar");
        const resultChart1 = new Chart(ctx1, {
          type: 'radar',
          data: data,
          options: {
            scale    : { ticks:  { beginAtZero: true, stepSize: 1, fontSize: 14, max:5 }, pointLabels: { fontSize: 14 }},
            legend   : { labels: { fontSize: 14, } },
            elements : { point:  { radius: 6 } },
          }
        });

        const ctx2 = $("#companyPreviewResult-line");
        const resultChart2 = new Chart(ctx2, {
          type: 'line',
          data: data,
          options: {
            scale    : { ticks:  { beginAtZero: true, stepSize: 1, fontSize: 14, max:5 }, pointLabels: { fontSize: 14 }},
            legend   : { labels: { fontSize: 14, } },
            elements : { point:  { radius: 6 } },
          }
        });
      }, 500);


      let canvas_size = 600;
      if (scale_names.length >= 6 && scale_names.length <= 8) {canvas_size = 700}
      if (scale_names.length > 9 && scale_names.length <= 14) {canvas_size = 800}
      if (scale_names.length > 14 && scale_names.length <= 20) {canvas_size = 900}
      if (scale_names.length > 20) {canvas_size = 1000}

      return {'response': response, 'size': canvas_size};
    }
  }
});

/**********************************************
template events
***********************************************/

// mevcut ekrani silip sonraki ekrani getirir
const f_open_first_expression = function(event, instance) {
  const active = $('.start-button');
  if (!active.hasClass('expression-passive')) { active.addClass('expression-passive'); }
  active.next().fadeIn(500, function() {
    active.next().removeClass('expression-passive');
  });
  active.next().children().first().removeClass('pi-add-checkmark');
}


const f_get_expression_response = function(event, instance) {
  const scale = $('.company-pi-preview-whole-expression input:checked').first().prop('name').split('__')[0];
  const expression_index = $('.company-pi-preview-whole-expression input:checked').first().prop('name').split('__')[1];
  const val = $('.company-pi-preview-whole-expression input:checked').first().val();
  $('input:checked').hide();
  if (typeof(val) === "undefined") {
    toastr.warning("Lütfen bir seçim yapın!");
  }else {
    $('.company-pi-preview-whole-expression').children().first().addClass('pi-add-checkmark');
    Meteor.call("company_add_pi_preview_response", FlowRouter.getParam('groupID'), scale, expression_index, val, function(err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        $("input[type=radio]").prop('checked',false);
        $(".option.fill-with-agree").removeClass('fill-with-agree');
        $(".option.fill-with-disagree").removeClass('fill-with-disagree');
        $(".option.fill-with-neutral").removeClass('fill-with-neutral');

        Meteor.setTimeout(function(){
          $('.company-pi-preview-whole-expression').children().first().removeClass('pi-add-checkmark');
        }, 200);
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
    f_get_expression_response(event, instance);
  },
  'click .question-start-pi'(event, instance) {
    f_open_first_expression(event, instance);
  },
  'click .company-pi-show-result'(event, instance) {
    FlowRouter.go('company_preview_pi_result', {'groupID': FlowRouter.getParam('groupID'), 'userID': Meteor.userId()});
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
      $('.company-save-pi-group').html('<i class="icmn-floppy-disk"></i> Kaydediliyor...').prop('disabled',true).addClass('disabled');
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

// how many scales exist in this PIGroup
Template.registerHelper("getNumberOfScales", function(scales){
  return scales.length;
});


Template.registerHelper("isThisPIChecked", function(scale_id){
  const group = PIGroups.findOne();
  if (group) {
    return group.scales.indexOf(scale_id) > -1
  }
});

Template.registerHelper("ShowNextPhrase", function(group){
  if (group) {
    const response = PIResponses.findOne();
    if (response) {
      let next = false;
      group.phrases.some(function(phrase, i) {
        let is_next = true;
        response.response_acc.some(function(acc, j) {
          if (acc.scale === phrase.scale && acc.filled.indexOf(phrase.index) > -1) {
            is_next = false;
            return true;
          }
        });
        if (is_next) { next = { 'phrase': phrase, 'index': i+1 }; return true; }
      });

      if(next) { return next; }
      else {
        if (!response.response_result) {
          Meteor.call('company_pi_collect_response', group._id, Meteor.userId(), function(err, data) {
            if (!err) { toastr.success("Test tamamlandı!"); }
          });
        }
        return { 'phrase': false, 'index': false };
      }
    }else {
      return {'phrase': group.phrases[0], 'index': 1 };
    }
  }
});


//
