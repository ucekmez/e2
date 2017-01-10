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

export const CSession = new Mongo.Collection(null);


$('body').on('change', '.sadece-bir-dogru-var', function() {
  $(".sadece-bir-dogru-var").prop('checked',false);
  $(this).prop('checked',true);
});


if (typeof(jQuery.validator) !== "undefined") {
  jQuery.extend(jQuery.validator.messages, {
      required: "Bu alan boş bırakılamaz!",
      remote: "Lütfen burayı düzeltin!",
      email: "Lütfen geçerli bir adres girin!",
      url: "Lütfen geçerli bir adres girin!",
      date: "Lütfen geçerli bir zaman girin!",
      dateISO: "Lütfen geçerli bir zaman girin!",
      number: "Lütfen geçerli bir sayı girin!",
      digits: "Lütfen sadece sayı girin!",
      creditcard: "Lütfen geçerli bir kart numarası girin!",
      equalTo: "Lütfen aynı değeri tekrar girin!",
      accept: "Lütfen burayı düzeltin",
      maxlength: jQuery.validator.format("En fazla {0} karakter girebilirsiniz"),
      minlength: jQuery.validator.format("En az {0} karakter girebilirsiniz"),
      rangelength: jQuery.validator.format("{0} ile {1} karakter arasında bir değer girin"),
      range: jQuery.validator.format("{0} ile {1} arasında bir değer girin"),
      max: jQuery.validator.format("{0} sayısından küçük olmalı"),
      min: jQuery.validator.format("{0} sayısından büyük olmalı")
  });
}
