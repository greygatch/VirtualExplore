'use strict';

angular.module('poseidon')
.controller('HomeCtrl', function($rootScope, $scope, $state, $firebaseObject, $http, User){
  $scope.findLocation = function(location){
    console.log(location);
  }
});
