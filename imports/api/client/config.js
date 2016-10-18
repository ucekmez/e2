import { Session } from 'meteor/session';

import '/imports/ui/landing/landing.html';

// loading mesajlari
var message = '<p class="loading-message">Yükleniyor</p>';
var spinner = '<div class="spinner"><div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>';
Template.LoadingLayout.rendered = function () {
  if ( ! Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      logo: '/img/fililabs_logo.png',
      backgroundColor: '#7f8c8d',
      loadingHtml: message + spinner
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
};

Template.LoadingLayout.destroyed = function () {
  if ( this.loading ) {
    this.loading.finish();
  }
};



T9n.setLanguage("tr");

T9n.map('tr', {
  "Required Field" : "Gerekli alan",
  "Minimum required length: 6": "Minimum şifre uzunluğu: 6",
});


// toast mesajlari gostermek icin ayarlar (toastr)
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "200",
  "hideDuration": "800",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}


// User accounts - sign in ve sign up sayfalari icin ayarlar
const onSubmitHookHelper = function(error, state){
  if (!error) {
   if (state === "signIn") {
     toastr.info('Başarılı bir şekilde oturum açtınız!');
     FlowRouter.go('home');
   }
   if (state === "signUp") {
     toastr.info('Başarılı bir şekilde kayıt oldunuz!');
     FlowRouter.go('home');
   }
 }
};

const onLogoutHookHelper = function(){
  toastr.warning('Oturumunuz sonlandırıldı!');
  FlowRouter.go('home');
};


AccountsTemplates.configure({
  homeRoutePath: '/',
  onSubmitHook: onSubmitHookHelper,
  onLogoutHook: onLogoutHookHelper,
});
