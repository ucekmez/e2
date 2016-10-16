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
