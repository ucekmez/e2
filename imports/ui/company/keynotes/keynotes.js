import { Keynotes, Slides } from '/imports/api/collections/keynotes.js';

import './list_keynotes.html';
import './edit_keynote.html';
import './preview_keynote.html';



/**********************************************
template helpers
***********************************************/

Template.CompanyListKeynotes.helpers({
  keynotes() {
    return Keynotes.find({}, { sort: { updatedAt: -1, createdAt : -1 }})
    .map(function(document, index) {
      document.index = index + 1;
      return document;
    });
  },
  numberOfSlides(keynote_id) {
    return Slides.find({ keynote: keynote_id }).count();
  }
});

Template.CompanyEditSingleSlide.onRendered(function() {
  $('.fr-toolbar').addClass("panel");
  $('.fr-wrapper').addClass("panel");
});

Template.CompanyEditKeynote.helpers({
  keynote() {
    return Keynotes.findOne();
  },
  slides() {
    return Slides.find({}, { sort: {order: 1} });
  },
  sortableOptions() {
    return {
      sort: true,
      group: {
        scroll: true,
        name: 'slidesSortGroup',
        pull: false
      },
      onSort: function(event) {
        Slides.update({_id: event.data._id}, {
          $set: {x: event.data.order * 1000}
        });
      }
    }
  },
});


Template.CompanyEditSingleSlide.helpers({
  getFEContext : function() {
    const self = this;
    return {
      _value: self.content, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "froala-reactive-meteorized-override", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 2048,
      width: 'auto',
      height: '360',
      heightMax: '360',
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
      "_oncontentChanged": function (e, editor) { // FE save.before event handler function:
        // Get edited HTML from Froala-Editor
        const newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        if (!_.isEqual(newHTML, self.content)) {
          Slides.update({_id: self._id}, {
            $set: {content: newHTML}
          });
          toastr.success('Sunum kaydedildi!');
        }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    };
  }
});


Template.CompanyPreviewKeynote.helpers({
  keynote() {
    return Keynotes.findOne();
  },
  slides() {
    return Slides.find({}, { sort: {order: 1} });
  },
  getFEContext() {
    const self = this;
    return {
      _value: self.content, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "fr-wrapper-keynote-preview", // Override wrapper class
      toolbarInline: true, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 2048,
      width: '100%',
      height: '400',
      heightMax: '600',
      toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color', 'paragraphStyle', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'quote', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'html'],
      "_oncontentChanged": function (e, editor) { // FE save.before event handler function:
        // Get edited HTML from Froala-Editor
        const newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        if (!_.isEqual(newHTML, self.content)) {
          Slides.update({_id: self._id}, {
            $set: {content: newHTML}
          });
          toastr.success('Sunum güncellendi!');
        }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    };
  }
});


Template.CompanyPreviewKeynote.onRendered(function() {
  FlowRouter.subsReady("company_keynote_preview", function() {
    $.getScript("/js/reveal.js")
      .done(function(script, textStatus) {
        Reveal.initialize();
    });
  });
});

/**********************************************
template events
***********************************************/

Template.CompanyListKeynotes.events({
  'click #add_new_keynote_right'(event, instance) { // ana sayfadaki buton
    f_add_new_keynote(event ,instance);
  },
  'click #company-remove-keynote'(event, instance) {
    Meteor.call('company_remove_keynote', this._id);
  },
});



Template.CompanyEditKeynote.events({
  'click .keynote-show-edit-name'(event, instance) {
    $('.keynote-show-edit-name').hide();
    $('.keynote-edit-name-keynote').show();
    $("#keynote-new-name-value").focus();
    $("#keynote-new-name-value").focusout(function() {
      $('.keynote-show-edit-name').show();
      $('.keynote-edit-name-keynote').hide();;
      $('#keynote-new-name-value').val($(".keynote-show-edit-name h3").text());
    });
  },
  'keypress input#keynote-new-name-value'(event, instance) {
    if (event.which == 13) {
      const new_name = $('#keynote-new-name-value').val();
      Meteor.call('company_edit_keynote_name', FlowRouter.getParam('keynoteId'), new_name, function(err, data) {
        if (!err) {
          toastr.info("Sunum adı değiştirildi!");
          $('.keynote-show-edit-name').show();
          $('.keynote-edit-name-keynote').hide();
        }else {
          toastr.warning(err);
        }
      });
      $('#keynote-new-name-value').val(new_name);
    }
  },
  'click #company-slide-add-icon': function(event, template) {
    Meteor.call('company_add_new_slide_to_keynote', FlowRouter.getParam('keynoteId'), function(err, data) {
      if (err) {
        toastr.error("Slayt oluşturulamadı!");
      }
    });
  },

  'click #company-slide-delete-icon': function(event, template) {
    const thisslide = Slides.findOne(this._id);
    Slides.remove(this._id);
  },

  'click #company-slide-thumbnail': function() {
    if (!Session.get("active-slide-before")) {
      Session.set("active-slide-before", this._id);
      //$('#company-start-editing').addClass('passive');
    }else {
      //$('#company-start-editing').addClass('passive');
      $('#slide-' + Session.get("active-slide-before")).removeClass('active').addClass('passive');
      Session.set("active-slide-before", this._id);
    }
    $('#slide-' + this._id).removeClass('passive').addClass('active');
  }
});


Template.CompanyPreviewKeynote.events({
  'click #edit-inline-keynote'(event, instance) {
    let edit = Session.get("inlineedit");
    if (!edit) {
      $('.showsingleslide').hide();
      $('.editsingleslide').show();
      $('#edit-inline-keynote').removeClass("btn-default");
      $('#edit-inline-keynote').addClass("button-secondary");
      $('#edit-inline-keynote').html('<i class="icmn-wrench"></i> Düzenle')
      Session.set("inlineedit", true);
    }else {
      $('.showsingleslide').show();
      $('.editsingleslide').hide();
      $('#edit-inline-keynote').removeClass("button-secondary");
      $('#edit-inline-keynote').addClass("btn-default");
      $('#edit-inline-keynote').html('<i class="icmn-wrench2"></i> Düzenle')
      Session.set("inlineedit", false);
    }
  }
});
