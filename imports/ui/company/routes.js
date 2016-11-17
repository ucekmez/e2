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
    FlowRouter.subsReady("company_show_company_profile", function() {
      NProgress.done();
    });
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
    FlowRouter.subsReady("company_list_forms", function() {
      NProgress.done();
    });
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
    FlowRouter.subsReady("company_form_preview", function() {
      NProgress.done();
    });
  }
});



/**********************************************
predefined tests routes
***********************************************/


// lang

companyFormRoutes.route('/lang/list', { name: 'company_list_lang_tests',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_lang_tests', Meteor.subscribe("company_list_lang_tests"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_list_forms", title: "Hazır Dil Testleri" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListLangTests' });
    FlowRouter.subsReady("company_list_lang_tests", function() {
      NProgress.done();
    });
  }
});

companyFormRoutes.route('/lang/new', { name: 'company_add_new_lang_test',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_list_lang_tests", title: "Yeni Dil Testi Ekle" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyAddNewLangTest' });
    FlowRouter.subsReady("company_show_company_profile", function() {
      NProgress.done();
    });
  }
});


// tech

companyFormRoutes.route('/tech/list', { name: 'company_list_tech_tests',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_tech_tests', Meteor.subscribe("company_list_tech_tests"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_list_forms", title: "Hazır Teknik Testler" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListTechTests' });
    FlowRouter.subsReady("company_list_tech_tests", function() {
      NProgress.done();
    });
  }
});

companyFormRoutes.route('/tech/new', { name: 'company_add_new_tech_test',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
        this.register('company_list_sectors', Meteor.subscribe("company_list_sectors"));
      }
  },
  breadcrumb: { parent: "company_list_tech_tests", title: "Yeni Teknik Test Ekle" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyAddNewTechTest' });
    FlowRouter.subsReady("company_list_sectors", function() {
      NProgress.done();
    });
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
        this.register('company_list_keynotes_slides_for_count', Meteor.subscribe("company_list_keynotes_slides_for_count"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "Online Sunumlar" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListKeynotes' });
    FlowRouter.subsReady("company_list_keynotes_slides_for_count", function() {
      NProgress.done();
    });
  }
});

companyKeynoteRoutes.route('/edit/:keynoteId', { name: 'company_edit_keynote',
  breadcrumb: { parent: "company_list_keynotes", title: "Online Sunum Düzenleme" },
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('company_keynote_preview', Meteor.subscribe("company_keynote_preview", params.keynoteId));
      this.register('company_keynote_slides_preview', Meteor.subscribe("company_keynote_slides_preview", params.keynoteId));
      this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
    }
  },
  action: function(params) {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyEditKeynote' });
    FlowRouter.subsReady("company_keynote_slides_preview", function() {
      NProgress.done();
    });
  }
});




/**********************************************
video routes
***********************************************/

const companyVideoRoutes = companyRoutes.group({ prefix: "/videos", name: "companyvideos"});

companyVideoRoutes.route('/list', { name: 'company_list_video_questions',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_list_video_questions', Meteor.subscribe("company_list_video_questions"));
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_dashboard", title: "Video Sorular" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyListVideoQuestions' });
    FlowRouter.subsReady("company_list_video_questions", function() {
      NProgress.done();
    });
  }
});

companyVideoRoutes.route('/new/question', { name: 'company_add_new_video_question',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
      }
  },
  breadcrumb: { parent: "company_list_video_questions", title: "Yeni Soru Ekle" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyAddNewVideoQuestion' });
    FlowRouter.subsReady("company_show_company_profile", function() {
      NProgress.done();
    });
  }
});


companyVideoRoutes.route('/edit/:questionId', { name: 'company_edit_video_question',
  breadcrumb: { parent: "company_list_video_questions", title: "Video Soru Düzenle" },
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('company_video_question_preview', Meteor.subscribe("company_video_question_preview", params.questionId));
      this.register('company_show_company_profile', Meteor.subscribe("company_show_company_profile"));
    }
  },
  action: function(params) {
    BlazeLayout.render('CompanyLayout', { main: 'CompanyEditVideoQuestion' });
    FlowRouter.subsReady("company_video_question_preview", function() {
      NProgress.done();
    });
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
    FlowRouter.subsReady("company_list_pis", function() {
      NProgress.done();
    });
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
    FlowRouter.subsReady("company_list_positions", function() {
      NProgress.done();
    });
  }
});
