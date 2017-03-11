import { Positions } from '/imports/api/collections/positions.js';

import './list_positions.html';
import './add_new_position.html';
import './edit_position.html';


Template.CompanyListPositions.helpers({
  positions() {
    return Positions.find({}, { sort: { createdAt : -1 }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyAddNewPosition.helpers({
  getFEContext() {
    const self = this;
    return {
      _value: self.description, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "fr-edit-position", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 4096,
      width: 'auto',
      height: '240',
      heightMax: '240',
      toolbarButtons: ['bold', 'italic', 'fontFamily', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'undo'],
      toolbarButtonsMD: ['bold', 'italic', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertLink', 'insertImage', 'insertVideo', 'undo'],
      toolbarButtonsSD: ['bold', 'italic', 'fontSize', 'color', 'align', 'formatUL', 'insertLink', 'insertImage', 'undo'],
    };
  }
});


Template.CompanyEditPosition.helpers({
  position() {
    const position = Positions.findOne();
    if (position) {
      const opensAt = moment(position.opensAt).format("DD/MM/YYYY");
      const endsAt = moment(position.endsAt).format("DD/MM/YYYY");
      Session.set('opensAt', opensAt);
      Session.set('endsAt', endsAt);
      return position;
    }
  },
  getFEContext() {
    const self = this;
    return {
      _value: self.description, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "fr-edit-position", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 4096,
      width: 'auto',
      height: '240',
      heightMax: '240',
      toolbarButtons: ['bold', 'italic', 'fontFamily', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'undo'],
      toolbarButtonsMD: ['bold', 'italic', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertLink', 'insertImage', 'insertVideo', 'undo'],
      toolbarButtonsSD: ['bold', 'italic', 'fontSize', 'color', 'align', 'formatUL', 'insertLink', 'insertImage', 'undo'],
    };
  }
});


Template.CompanyAddNewPosition.events({
  'submit #company-add-new-position-form'(event, instance) {
    event.preventDefault();

    const title  = $('#positiontitle').val();
    const starts = $('#positiontime').data('daterangepicker').startDate.toDate();
    const ends   = $('#positiontime').data('daterangepicker').endDate.toDate();
    const description = $('#positiondescription .fr-element.fr-view').html();

    Meteor.call('company_add_new_position', title, starts, ends, description, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Pozisyon eklendi!');
        FlowRouter.go('company_list_positions');
      }
    });
  },
  'click #company-add-new-position-form-reset'(event, instance) {
    $('#positiontitle').val()?$('#positiontitle').val(""):"";
    $('.form-group.row .fr-element.fr-view').html("");
  },
});


Template.CompanyEditPosition.events({
  'submit #company-edit-position-form'(event, instance) {
    event.preventDefault();

    const title  = $('#positiontitle_edit').val();
    const starts = $('#positiontime_edit').data('daterangepicker').startDate.toDate();
    const ends   = $('#positiontime_edit').data('daterangepicker').endDate.toDate();
    const description = $('#positiondescription_edit .fr-element.fr-view').html();

    Meteor.call('company_edit_position', FlowRouter.getParam('positionId'), title, starts, ends, description, function (err, data) {
      if (err) {
        toastr.error(err.reason);
      }else {
        toastr.success('Pozisyon düzenlendi!');
        FlowRouter.go('company_list_positions');
      }
    });
  },
  'click #company-edit-position-form-reset'(event, instance) {
    $('#positiontitle_edit').val()?$('#positiontitle_edit').val(""):"";
    $('.form-group.row .fr-element.fr-view').html("");
  },
});
