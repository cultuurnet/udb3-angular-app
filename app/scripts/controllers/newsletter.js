
'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:NewsLetterController
 * @description
 * # NewsLetterController
 * Controller for the newsletter subscription
 */
angular
  .module('udbApp')
  .controller('NewsLetterController', NewsLetterController);

/* @ngInject */
function NewsLetterController($scope,appConfig,$http,$cookies) {

  var vm = this;
  vm.publicKey = _.get(appConfig, 'newsLetterManager.public');
  vm.privateKey = _.get(appConfig, 'newsLetterManager.private');
  vm.url = _.get(appConfig, 'newsLetterManager.url');
  vm.email = '';
  vm.submit = submit;
  vm.showThanks = false;
  vm.showError = false;
  vm.hideNewsLetter = $cookies.get('hideNewsLetter');

  function submit() {
    vm.showError = false;
    if (vm.email && vm.email !=='') {
     var form = new FormData();
     form.append("Email", vm.email);
     form.append("Action", "addforce");
     $http({
     method: 'POST',
     url: vm.url,
     headers: {
         Authorization : 'Basic:' + btoa(vm.publicKey+':'+vm.privateKey)
     },
     crossDomain: true
    }).then(function successCallback(response) {
     vm.showThanks = true;
     $cookies.put('hideNewsLetter',true);
     console.log(response);
    }, function errorCallback(response) {
     console.log(response);
      vm.showError= true;
    });
    } else {
      vm.showError= true;
    }

  }

}
NewsLetterController.$inject = ['$scope','appConfig','$http','$cookies'];
