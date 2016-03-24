var CityofSJApp = angular.module('starter', ['ionic', 'ngCordova', 'firebase']);
var fb = new Firebase("https://cityofsjapp.firebaseio.com");
  CityofSJApp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
        StatusBar.styleDefault();
        }
        });
      });
CityofSJApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("firebase", {
          url: "/firebase",
          templateUrl: "templates/firebase.html",
          controller: "AuthController",
          cache: false
        })
        .state("secure", {
          url: "/secure",
          templateUrl: "templates/secure.html",
          controller: "CamController"
        })
        .state("map", {
          url: "/map",
          templateUrl: "templates/map.html",
          controller: "MapController"
        })
      $urlRouterProvider.otherwise("/firebase");
      });
CityofSJApp.controller("AuthController", function($scope, $state, $firebaseAuth) {
      var fbAuth = $firebaseAuth(fb);
    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
          email: username,
          password: password
        }).then(function(authData) {
          $state.go("secure");
        }).catch(function(error) {
          console.error("ERROR: " + error);
        });
      }
    $scope.register = function(username, password) {
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
        return fbAuth.$authWithPassword({
          email: username,
          password: password
          });
        }).then(function(authData) {
          $state.go("secure");
        }).catch(function(error) {
          console.error("ERROR: " + error);
        });
      }

      });
CityofSJApp.controller("CamController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera, $location) {
  $ionicHistory.clearHistory();
  $scope.images = [];

      var fbAuth = fb.getAuth();
      if(fbAuth) {
        var userReferences = fb.child("users/" + fbAuth.uid);
        var syncArray = $firebaseArray(userReferences.child("images"));
        $scope.images = syncArray;
      } else {
        $state.go("firebase");
      }
  $scope.upload = function() {
      var options = {
          quality: 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourcetype: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: Camera.popoverOptions,
          targetWidth: 500,
          targetHeight: 500,
          saveToPhotoAlbum: false
    };
      $cordovaCamera.getPicture(options).then(function(imageData) {
        syncArray.$add({image: imageData}).then(function() {
          alert("The Image Was Saved")
          });
          }, function(error) {
          console.error("ERROR:" + error);
        });
      }
  $scope.go = function ( path ) {
      $location.path( path );
      };
    });
CityofSJApp.controller('MapController', function($scope, $state, $cordovaGeolocation, $firebaseArray, $location, $firebase) {
      var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });      
      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });
        google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
        });
      });
      },function(error){
        console.log("Could not get location");
        });
  var myDataRef = new Firebase("https://sizzling-inferno-2101.firebaseio.com/");
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          var text = $('#messageInput').val();
          myDataRef.push({text: text});
          $('#messageInput').val('');
        }
      });
      
});