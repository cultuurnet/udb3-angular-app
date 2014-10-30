'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventTagModalCtrl
 * @description
 * # EventTagModalCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('EventTagModalCtrl', function ($scope, $modalInstance, UdbApi) {

    var getRecentLabels = UdbApi.getRecentLabels();
    var getMarkers = UdbApi.getMarkers();

    var tagPromise = getRecentLabels.then(function (labels) {
      if(labels.length) {
        return labels;
      } else {
        return getMarkers;
      }
    });

    var ok = function () {
      var tags = $scope.tags;
      $modalInstance.close(tags);
    };

    var close = function () {
      $modalInstance.dismiss('cancel');
    };

    tagPromise.then(function (labels) {
      $scope.availableLabels = labels;
    });
    // ui-select can't get to this scope variable unless you reference it from the $parent scope.
    // seems to be 1.3 specific issue, see: https://github.com/angular-ui/ui-select/issues/243
    $scope.labels = [];
    $scope.close = close;
    $scope.ok = ok;
  });
