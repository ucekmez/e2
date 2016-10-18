import './layout.html';

/**********************************************
routes
***********************************************/

const companyRoutes = FlowRouter.group({ prefix: '/company', name: 'company',
  triggersEnter: [() => { $('body').addClass('mode-material'); }],
  triggersExit:  [() => { $('body').removeClass('mode-material'); }],
});

companyRoutes.route('/', { name: 'company_dashboard',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { title: "Panel" },
  action() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyMainArea' });
    NProgress.done();
  }
});
