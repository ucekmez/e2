import './landing.html';



/**********************************************
template helpers
***********************************************/



/**********************************************
template events
***********************************************/

Template.LandingNavBar.events({
  'click #logout'(event, instance) {
    AccountsTemplates.logout();
  }
});
