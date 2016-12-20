import { Sectors } from '/imports/api/collections/sectors.js';


Meteor.startup(() => {
  if (Sectors.find().count() === 0) {
    sector_info = [
      { name: "Bilişim", slug: "bilisim" },
    ];

    sector_info.forEach(function(s) {
      const q_id = Sectors.insert({
        name: s.name,
        slug: s.slug
      });
    });
    console.log("Sector info added");

  }
});
