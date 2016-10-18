import { Companies } from '/imports/api/collections/companies.js';

import shortid from 'shortid';


Meteor.methods({
  add_new_company(companyname, email, password){
    // yeni bir kullanici olusturuyoruz
    const user_id = Accounts.createUser({
      email: email,
      password: password,
    });
    // olusturdugumuz kullaniciya firma rolunu veriyoruz
    Roles.addUsersToRoles(user_id, ['company']);
    // yeni bir firma olusturuyoruz
    const company_id = Companies.insert({
      shortid: shortid.generate(),
      name: companyname,
      commercial_name: "",
      address: "",
      phone: "",

    });
    // olusturdugumuz firmanin yetkilisi olacak kullaniciyi bagliyoruz
    Companies.update(company_id, { $set: {user: user_id, email: email}});
  },

  remove_company(id) {
    const company = Companies.findOne(id);
    Meteor.users.remove(company.user);
    Companies.remove(id);
  },


});
