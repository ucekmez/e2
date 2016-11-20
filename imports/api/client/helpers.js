import { Sectors } from '/imports/api/collections/sectors.js';

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
