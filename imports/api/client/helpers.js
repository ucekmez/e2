import { Sectors } from '/imports/api/collections/sectors.js';
import { FormResponses } from '/imports/api/collections/forms.js';

Template.registerHelper("scaleText", function(content){
  if (content) {
    let c = content.replace(new RegExp("[1][0-9]px","gm"), "6px");
    c = c.replace(new RegExp("[2][0-9]px","gm"), "9px");
    c = c.replace(new RegExp("[3-9][0-9]px","gm"), "12px");
    c = c.replace(new RegExp("<br>","gm"), "");
    c = c.replace(new RegExp("<p></p>","gm"), "");
    return c;
  }
});


setInterval(function() { Session.set("time", new Date()); }, 60000);
Template.registerHelper("dateFromNow", function(date){
  Session.get('time');
  return moment(date).fromNow();
});

Template.registerHelper("convertToDateFormat", function(date) {
  var day = date.getDate();
  if (day < 10) { day = "0" + day }

  var month = date.getMonth() + 1;
  if (month < 10) { month = "0" + month }

  return date.getFullYear() + "-" + month + "-" + day;
});


Template.registerHelper("ifEqualSelect", function(v1, v2) {
  if (v1 === v2) return "selected";
});


Template.registerHelper('toJSON', function(payload){
  if (payload) {
    return JSON.parse(payload);
  }
});

Template.registerHelper("toJSONSurvey", function(payload){
  if (payload) {
    const form_response = FormResponses.findOne();
    if (form_response) {
      return { fields: [] };
    }else {
      return JSON.parse(payload);
    }
  }
});

Template.registerHelper("toJSONPrereq", function(payload){
  if (payload) {
    const form_response = FormResponses.findOne();
    if (form_response) {
      const existing_payload = JSON.parse(payload);
      const new_payload = new Array();

      const response_cids = new Array();
      form_response.response.forEach(function(rsp) {
        response_cids.push(rsp.cid); // collect existing answer ids.
      });

      existing_payload.fields.forEach(function(field) {
        if (response_cids.indexOf(field.cid) == -1) {
          new_payload.push(field);
        }
      });

      if (new_payload.length > 1) {
        return {result: {field: new_payload[0], isLast: false} };
      }else if(new_payload.length == 1) {
        return {result: {field: new_payload[0], isLast: true} };
      } else {
        return {result: {field: [], isLast: true} };
      }

    }else {
      if (JSON.parse(payload).fields.length > 1) {
        return {result: {field: JSON.parse(payload).fields[0], isLast: false} };
      }else if(JSON.parse(payload).fields.length == 1) {
        return {result: {field: JSON.parse(payload).fields[0], isLast: true} };
      }else {
        return {result: {field: [], isLast: true} };
      }
    }
  }
});


Template.registerHelper("toJSONTest", function(payload){
  if (payload) {
    const form_response = FormResponses.findOne();
    if (form_response) {
      const existing_payload = JSON.parse(payload);
      const new_payload = new Array();

      const response_cids = new Array();
      form_response.response.forEach(function(rsp) {
        if (!(rsp.bulk)) {
          response_cids.push(rsp.cid); // collect existing answer ids.
        }
      });

      existing_payload.fields.forEach(function(field) {
        if (response_cids.indexOf(field.cid) == -1) {
          new_payload.push(field);
        }
      });

      if (new_payload.length > 1) {
        return {result: {field: new_payload[0], isLast: false} };
      }else if(new_payload.length == 1) {
        return {result: {field: new_payload[0], isLast: true} };
      } else {
        return {result: {field: [], isLast: true} };
      }

    }else {
      if (JSON.parse(payload).fields.length > 1) {
        return {result: {field: JSON.parse(payload).fields[0], isLast: false} };
      }else if(JSON.parse(payload).fields.length == 1) {
        return {result: {field: JSON.parse(payload).fields[0], isLast: true} };
      }else {
        return {result: {field: [], isLast: true} };
      }
    }
  }
});


Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
});

Template.registerHelper('equalsOr', function(s1, s2, s3){
  return s1 === s2 || s1 === s3;
});


Template.registerHelper("getLanguageHelper", function(slug){
  if (slug === "english") { return "İngilizce"; }
});


Template.registerHelper("getSectorHelper", function(slug){
  return Sectors.findOne({ slug: slug }).name;
});


Template.registerHelper("getLevelHelper", function(level_id){
  if (level_id === "easy") { return "Kolay"; }
  if (level_id === "moderate") { return "Orta"; }
  if (level_id === "hard") { return "Zor"; }
});
