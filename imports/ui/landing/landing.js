import './landing.html';


/**********************************************
routes
***********************************************/

FlowRouter.route('/', { name: 'home',
  action() {
    BlazeLayout.render('LandingLayout', { main: 'LandingPage' });
    NProgress.done();
  }
});

FlowRouter.route('/login', { name: 'login',
  triggersEnter: [() => {
    if (Meteor.loggingIn() || Meteor.userId() && Meteor.user()) { FlowRouter.go('home'); }
    else { FlowRouter.go('login'); }
  }],
  breadcrumb: { title: "Ziyaretçi Alanı" },
  action() {
    BlazeLayout.render('LandingLayout', { main: 'LoginPage' });
    NProgress.done();
  }
});

FlowRouter.notFound = {
  name: 'notfound',
  action() {
    BlazeLayout.render('LandingLayout', { main: 'NotFoundPage' });
    NProgress.done();
  }
};



/**********************************************
template events
***********************************************/

Template.LandingLayout.events({
  'click #logout'(event, instance) {
    AccountsTemplates.logout();
  }
});
