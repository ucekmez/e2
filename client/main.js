/* all routes */
import '/imports/startup/client/routes.js';

/* config file
  icinde useraccounts, loading, toastr gibi eklentilerin ayarlari var
*/
import '/imports/api/client/config.js';

/* helpers file
  template helpers
*/
import '/imports/api/client/helpers.js';


$('body').on('change', '.sadece-bir-dogru-var', function() {
  $(".sadece-bir-dogru-var").prop('checked',false);
  $(this).prop('checked',true);
});
