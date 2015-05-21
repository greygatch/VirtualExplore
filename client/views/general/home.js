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

  $scope.photos = [];
  $scope.isClicked = false;

  $scope.findLocation = function(location){
    $scope.isClicked = true;
    Map.geocode(location, function(result){
      var lat = result[0].geometry.location.A;
      var lng = result[0].geometry.location.F;
      console.log(result[0]);
      location = result[0].formatted_address;
      $scope.location = result[0].formatted_address;
      Map.create('#mapDiv', lat, lng, 10);
      $window.jQuery.get('http://api.flickr.com/services/rest/?method=flickr.photos.search&tags=' + location.toUpperCase() + '&api_key=ea15c092788c7cfb6911fa14efe1d88f&per_page=10&format=json&nojsoncallback=1',
      function(data){
        $scope.$apply(function(){
          $scope.photos = data.photos.photo;
        });
        $window.jQuery.get('http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location=%22'+location.trim()+'%22&format=json&u=c', function(response){
          console.log(response, '!!!!!!!!!!!!');
          $scope.$apply(function(){
            $scope.weather = response.forecast.simpleforecast.forecastday[0];
          });
          $window.jQuery.getJSON('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&prop=revisions&gsrsearch='+location+'&rvprop=content&rvsection=0&callback=?', function(info){
            var firstPageResult = Object.keys(info.query.pages)[0];
            $scope.$apply(function(){
              $scope.pageId = info.query.pages[firstPageResult].pageid;
            });
            // $window.jQuery.getJSON('http://twitter.com/search?q=place%3A247f43d441defc03', function(twitterResponse){
            //   console.log(twitterResponse, 'woot');
            // });
            // var contentKey = Object.keys(info.query.pages[firstPageResult].revisions[0])[2];
            // console.log(contentKey);
            // var pageContent = $window.markdown.toHTML(info.query.pages[firstPageResult].revisions[0][contentKey]);
            // console.log('hooray, andrew!', info.query.pages);
            // pageContent = pageContent.replace(/<[^>]*>/g, '');
            // $('#article').append(pageContent);
          });
        });
      });
    });
  };
});
