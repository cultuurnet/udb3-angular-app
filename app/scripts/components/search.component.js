'use strict';

angular
  .module('udbApp')
  .component('searchComponent', {
    bindings: { $router: '<' },
    templateUrl: 'templates/search.html'
  });

/*function searchComponent($controller, $scope) {
  var controller = this; // jshint ignore:line

  angular.extend(controller, $controller('Search', {
    $scope: $scope
  }));
}*/
