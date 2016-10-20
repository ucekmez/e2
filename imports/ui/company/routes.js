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


/**********************************************
form routes
***********************************************/

const companyFormRoutes = companyRoutes.group({ prefix: "/forms", name: "companyforms"});

companyFormRoutes.route('/list', { name: 'company_list_forms',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_forms', Meteor.subscribe("company_list_forms"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "Anket ve Testler" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListForms' });
    NProgress.done();
  }
});

companyFormRoutes.route('/edit/:formId', { name: 'company_edit_form',
  breadcrumb: { parent: "company_list_forms", title: "Form Düzenleme" },
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('company_form_preview', Meteor.subscribe("company_form_preview", params.formId));
      this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
    }
  },
  action: function(params) {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyEditForm' });
    NProgress.done();
  }
});






/**********************************************
keynote routes
***********************************************/

const companyKeynoteRoutes = companyRoutes.group({ prefix: "/keynotes", name: "companykeynotes"});

companyKeynoteRoutes.route('/list', { name: 'company_list_keynotes',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_keynotes', Meteor.subscribe("company_list_keynotes"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "Online Sunumlar" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListKeynotes' });
    NProgress.done();
  }
});



/**********************************************
video routes
***********************************************/

const companyVideoRoutes = companyRoutes.group({ prefix: "/videos", name: "companyvideos"});

companyVideoRoutes.route('/list', { name: 'company_list_videos',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_videos', Meteor.subscribe("company_list_videos"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "Video Kayıtlar" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListVideos' });
    NProgress.done();
  }
});





/**********************************************
pis routes
***********************************************/

const companyPIsRoutes = companyRoutes.group({ prefix: "/pis", name: "companypis"});

companyPIsRoutes.route('/list', { name: 'company_list_pis',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_pis', Meteor.subscribe("company_list_pis"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "Kişilik Envanterleri" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListPIs' });
    NProgress.done();
  }
});



/**********************************************
position routes
***********************************************/

const companyPositionRoutes = companyRoutes.group({ prefix: "/positions", name: "companypositions"});

companyPositionRoutes.route('/list', { name: 'company_list_positions',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_positions', Meteor.subscribe("company_list_positions"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "İlanlar" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListPositions' });
    NProgress.done();
  }
});
