import { Sectors } from '/imports/api/collections/sectors.js';


Meteor.startup(() => {
  if (Sectors.find().count() === 0) {
    sector_info = [
      { name: "Bilişim" },
    ];

    sector_info.forEach(function(s) {
      const q_id = Sectors.insert({
        name: s.name,
        slug: s.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-') // slugify
      });
    });
    console.log("Sector info added");

  }
});
