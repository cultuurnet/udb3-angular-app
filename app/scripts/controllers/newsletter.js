
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
  vm.url = _.get(appConfig, 'newsLetterManager.url');
  vm.list = _.get(appConfig, 'newsLetterManager.list');
  vm.email = '';
  vm.submit = submit;
  vm.showThanks = false;
  vm.showError = false;
  vm.hideNewsLetter = $cookies.get('hideNewsLetter') || (! vm.url || ! vm.list);
  vm.token = $cookies.get('token');

  function submit() {
    vm.showError = false;
    if (vm.email && vm.email !=='') {
     $http({
       method: 'PUT',
       headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer " + vm.token 
       },
       data: JSON.stringify({
        email: vm.email
       }),
       url: vm.url + vm.list
     }).then(function successCallback(response) {
       vm.showThanks = true;
       $cookies.put('hideNewsLetter',true);
     }, function errorCallback(response) {
        vm.showError= true;
     });
    } else {
      vm.showError= true;
    }

  }

}
NewsLetterController.$inject = ['$scope','appConfig','$http','$cookies'];
