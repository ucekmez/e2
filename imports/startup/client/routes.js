import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


/************************************************
router files
*************************************************/

import '/imports/ui/landing/landing.js';


/************************************************
routes
*************************************************/

FlowRouter.triggers.enter([() => {
  if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
  NProgress.start();
}]);
