import './landing.html';


/**********************************************
routes
***********************************************/

FlowRouter.route('/', { name: 'home',
  triggersEnter: [() => { $('body').addClass('landing-general'); }],
  triggersExit:  [() => { $('body').removeClass('landing-general'); }],
  action() {
    BlazeLayout.render('LandingLayout', { nav: 'LandingNavBar', main: 'LandingPage' });
    NProgress.done();
  }
});

FlowRouter.route('/login', { name: 'login',
  triggersEnter: [() => {
    $('body').addClass('landing-general');
    if (Meteor.userId()) { FlowRouter.go('home'); }
  }],
  triggersExit:  [() => { $('body').removeClass('landing-general'); }],
  breadcrumb: { title: "Ziyaretçi Alanı" },
  action() {
    BlazeLayout.render('LandingLayout', { nav: 'LandingNavBar', main: 'LoginPage' });
    NProgress.done();
  }
});

FlowRouter.notFound = {
  name: 'notfound',
  triggersEnter: [() => { $('body').addClass('landing-general'); }],
  triggersExit: [() => { $('body').removeClass('landing-general'); }],
  action() {
    BlazeLayout.render('LandingLayout', { nav: 'LandingNavBar', main: 'NotFoundPage' });
    NProgress.done();
  }
};
