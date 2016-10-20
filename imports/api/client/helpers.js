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

// bu checkbox harici cevaplar icin kullaniliyor
Template.registerHelper('processFormResponseValue', function(type, val) {
  if(type == "address") {
    return `${val.address}, ${val.city}, ${val.country}`;
  }else {
    return val;
  }
});

// bu checkbox cevaplari icin kullaniliyor
Template.registerHelper('processFormResponseValueCheckbox', function(val, result) {
  if (result){ // eger form tipimiz test ise bu calisacak
    const overall = new Array();
    for(let i=0;i<val.length;i++) {
      overall.push({o_val: val[i], o_result: result[i]});
    }
    return overall;
  }else { // eger form tipimiz survey ise bu calisacak
    const overall = new Array();
    for(let i=0;i<val.length;i++) {
      overall.push({o_val: val[i]});
    }
    return overall;
  }
});

Template.registerHelper('responseExists', function(type, val) {
  if (type == "checkboxes") {
    return val.length > 0;
  }else if(type == "address") {
    return val.address || val.city || val.country;
  }else {
    return val;
  }
});

Template.registerHelper("getResponseData", function(response_id){
  return Responses.findOne(response_id);
});

Template.registerHelper("coming_from_single_forms", function(){
  return Session.get("coming_from") === "single_forms";
});

Template.registerHelper("current_application_id", function(){
  return Session.get("current_application_id");
});
