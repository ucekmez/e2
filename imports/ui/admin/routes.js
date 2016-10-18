import './layout.html';
import './add_new_company.html';
import './list_companies.html';

/**********************************************
routes
***********************************************/

const adminRoutes = FlowRouter.group({ prefix: '/admin', name: 'admin',
  triggersEnter: [() => { $('body').addClass('mode-material'); }],
  triggersExit:  [() => { $('body').removeClass('mode-material'); }],
});

adminRoutes.route('/', { name: 'admin_dashboard',
  breadcrumb: { title: "Panel" },
  action() {
    BlazeLayout.render('AdminLayout', { main: 'AdminMainArea' });
    NProgress.done();
  }
});

adminRoutes.route('/new/company', { name: 'admin_add_new_company',
  breadcrumb: { title: "Yeni Firma Ekle", parent: "admin_dashboard" },
  action() {
    BlazeLayout.render('AdminLayout', { main: 'AdminAddNewCompany' });
    NProgress.done();
  }
});

adminRoutes.route('/list/companies', { name: 'admin_list_companies',
  subscriptions: function(params, queryParams) {
      if(Meteor.isClient) {
        this.register('admin_show_company_list', Meteor.subscribe("admin_show_company_list"));
      }
  },
  breadcrumb: { title: "Firma Listesi", parent: "admin_dashboard" },
  action() {
    BlazeLayout.render('AdminLayout', { main: 'AdminListCompanies' });
    FlowRouter.subsReady("admin_show_company_list", function() {
      NProgress.done();
    });
  }
});
