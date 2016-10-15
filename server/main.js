import { Meteor } from 'meteor/meteor';



/***************************
      init the admin user
*****************************/

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    // group : kullanicilar sadece gruplarinin icerisindeki
    // iceriklerde sahip olduklari rolleri kullanabilirler
    const users = [
      {
        name: "Ugur Cekmez",
        username: "ugur",
        email: "ugur@fililabs.com",
        roles: ['admin'],
        profile : {'name': "", 'gender': "", 'age': "", 'address': "", 'shortid': shortid.generate()}
      }
    ];

    users.forEach(function(user) {
      // Kullanici olusturuyoruz
      const id = Accounts.createUser({
        email: user.email,
        username: user.username,
        password: "asdasd",
        profile: user.profile
      });

      if (user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles);
      }

      console.log("User " + user.name + " added in role " + user.role);
    });

  }

});
