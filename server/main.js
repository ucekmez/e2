import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';

import shortid from 'shortid';
Sortable.collections = ['slides'];

/**********************************************
      init the admin user
**********************************************/
Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const users = [ {
        name: "Ugur Cekmez",
        email: "ugur@fililabs.com",
        roles: ['admin'],
        profile : {'name': "", 'gender': "", 'age': "", 'address': "", 'shortid': shortid.generate()}
      }
    ];

    users.forEach(function(user) {
      const id = Accounts.createUser({
        email: user.email,
        username: user.username,
        password: "asdasd",
        profile: user.profile
      });

      if (user.roles.length > 0) { Roles.addUsersToRoles(id, user.roles); }
      console.log("User " + user.name + " added in role " + user.role);
    });
  }
});


/**********************************************
      add user role after sign up
**********************************************/
AccountsTemplates.configure({
  postSignUpHook: function(userId, info) {
    Roles.addUsersToRoles(userId, ['user']);
    profile = {'name': "", 'gender': "", 'age': "", 'address': "", 'shortid': shortid.generate()};
    Meteor.users.update({ _id: userId}, {$set: { profile: profile }});
  },
});
