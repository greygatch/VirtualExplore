'use strict';

angular.module('poseidon')
.factory('Map', function($window){
  function Map(){}

  Map.create = function(selector, lat, lng, zoom){
    var options = {
      center: new $window.google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: $window.google.maps.MapTypeId.ROADMAP
    };

    selector = angular.element(selector).get(0);
    var map = new $window.google.maps.Map(selector, options);
    return map;
  };

  Map.geocode = function(address, cb){
    console.log('address: ', address);
    var geocoder = new $window.google.maps.Geocoder();
    geocoder.geocode({address: address}, cb);
  };

  return Map;
})
.controller('HomeCtrl', function($rootScope, $scope, $state, $firebaseObject, $http, User, $window, Map){


  $scope.findLocation = function(location){
    $window.jQuery.get("http://api.flickr.com/services/rest/?method=flickr.photos.search&tags="+ location.toUpperCase() + "&api_key=ea15c092788c7cfb6911fa14efe1d88f&per_page=10&format=json&nojsoncallback=1",
    function(data){
      console.log(data.photos.photo);
      $scope.photos = data.photos.photo;
      $window.jQuery.get("http://api.wunderground.com/api/bdce31546b59e7b1/geolookup/forecast/q/"+location.toUpperCase()+".json", function(response){
        console.log(response.forecast.simpleforecast.forecastday[0], 'WEATHER');
        $scope.weather = response.forecast.simpleforecast.forecastday[0];
        Map.geocode(location, function(result){
          var lat = result[0].geometry.location.A;
          var lng = result[0].geometry.location.F;
          Map.create('#mapDiv', lat, lng, 12);
        });
      })
    })
  };


});
