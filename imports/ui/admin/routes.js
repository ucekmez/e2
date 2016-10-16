import './layout.html'; // AdminLayout


/**********************************************
routes
***********************************************/

const adminRoutes = FlowRouter.group({ prefix: '/admin', name: 'admin',
  triggersEnter: [
    () => {
      $('body').addClass('mode-material');
      //if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) { FlowRouter.go('home'); }
    }],
  triggersExit:  [() => { $('body').removeClass('mode-material'); }],
});

adminRoutes.route('/', { name: 'admin_dashboard',
  breadcrumb: { title: "Panel" },
  action() {
    BlazeLayout.render('AdminLayout');
    NProgress.done();
  }
});
