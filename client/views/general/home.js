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

  $scope.photos = null;
  $scope.photo = null;
  $scope.isClicked = false;
  $scope.i = 0;

  $scope.findLocation = function(location){
    $scope.photos = [];
    $scope.photo = null;
    $scope.i = 0;
    $scope.isClicked = true;
    Map.geocode(location, function(result){
      var lat = result[0].geometry.location.A;
      var lng = result[0].geometry.location.F;
      location = result[0].formatted_address;
      $scope.location = result[0].formatted_address;
      Map.create('#mapDiv', lat, lng, 10);
      $window.jQuery.get('http://api.flickr.com/services/rest/?method=flickr.photos.search&tags=' + location.toUpperCase() + '&api_key=ea15c092788c7cfb6911fa14efe1d88f&per_page=10&format=json&nojsoncallback=1',
      function(data){
        $scope.$apply(function(){
          $scope.i = 0;
          $scope.photos = [];
          $scope.photo = null;
          $scope.photos = data.photos.photo;
          $scope.photo = $scope.photos[$scope.i];
        });
        $window.jQuery.get('http://api.openweathermap.org/data/2.5/weather?q=' + location, function(response){
          $scope.$apply(function(){
            $scope.weather = {};
            $scope.weather.temp = (response.main.temp - 273.16).toFixed(1);
            $scope.weather.humidity = response.main.humidity;
            $scope.weather.desc = response.weather[0].description;
            $scope.weather.icon = response.weather[0].icon;
          });
          $window.jQuery.getJSON('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&prop=revisions&gsrsearch='+location+'&rvprop=content&rvsection=0&callback=?', function(info){
            var firstPageResult = Object.keys(info.query.pages)[0];
            $scope.$apply(function(){
              $scope.pageId = info.query.pages[firstPageResult].pageid;
            });
          });
        });
      });
    });
  };
  $scope.move = function(direction){
    if(direction === 'next' && $scope.i < $scope.photos.length - 1){
     $scope.i += 1;
    }else if(direction === 'prev' && $scope.i > 0){
     $scope.i -= 1;
    }
    $scope.photo = $scope.photos[$scope.i];
  }
});
