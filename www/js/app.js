var CityofSJApp = angular.module('starter', ['ionic', 'ngCordova', 'firebase']);

var fb = new Firebase("https://cityofsjapp.firebaseio.com/");
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
        .state("home", {
          url: "/home",
          templateUrl: "templates/home.html",
          controller: "AuthController",
          cache: false
        })
        
        .state("camera", {
          url: "/camera",
          templateUrl: "templates/camera.html",
          controller: "CameraController"
        })
        
        .state("map", {
          url: "/map",
          templateUrl: "templates/map.html",
          controller: "MapController"
        })

        .state("last", {
          url: "/last",
          templateUrl: "templates/service.html",
          controller: "RequestController"
        })

      $urlRouterProvider.otherwise("/home");
      });

CityofSJApp.controller("AuthController", function($scope, $state, $firebaseAuth) {
      var fbAuth = $firebaseAuth(fb);
    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
          email: username,
          password: password
        }).then(function(authData) {
          $state.go("camera");
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
          $state.go("camera");
        }).catch(function(error) {
          console.error("ERROR: " + error);
        });
      }

      });

CityofSJApp.controller("CameraController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera, $location) {
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

CityofSJApp.controller('MapController', function($scope, $state, $cordovaGeolocation, $firebaseArray, $location, $firebaseObject, $firebase) {
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

  var firebaseUrl = "https://cityofsjapp.firebaseio.com/";
  
  var firebaseRef = new Firebase(firebaseUrl);

  // Set the URL of the link element to be the Firebase URL
  document.getElementById("firebaseRef").setAttribute("href", firebaseUrl);

  // Create a new GeoFire instance at the random Firebase location
  var geoFire = new GeoFire(firebaseRef);

  /* Uses the HTML5 geolocation API to get the current user's location */
  var getLocation = function() {
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);
    } else {
      log("Your browser does not support the HTML5 Geolocation API, so this demo will not work.")
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallback = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    log("Retrieved location: [" + latitude + ", " + longitude + "]");

    var username = "wesley";
    geoFire.set(username, [latitude, longitude]).then(function() {

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
    }).catch(function(error) {
      log("Error adding user " + username + "'s location to GeoFire");
    });
  }

  /* Handles any errors from trying to get the user's current location */
  var errorHandler = function(error) {
    if (error.code == 1) {
      log("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      log("Error: TIMEOUT: Calculating the user's location too took long");
    } else {
      log("Unexpected error code")
    }
  };

  // Get the current user's location
  getLocation();
  
  function generateRandomString(length) {
      var text = "";
      var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < length; i++) {
          text += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }

      return text;
  }

  /* Logs to the page instead of the console */
  function log(message) {
    var childDiv = document.createElement("div");
    var textNode = document.createTextNode(message);
    childDiv.appendChild(textNode);
    document.getElementById("log").appendChild(childDiv);
  }
   $scope.go = function ( path ) {
      $location.path( path );
      };
    });

CityofSJApp.controller('RequestController', function($scope, $state, $firebaseArray, $firebaseObject, $firebase) {
      
      $scope.specialValue1 = {
        "id": "Graffiti",
        "value": "antigraffiti@sanjoseca.gov"
      };
       $scope.specialValue2 = {
        "id": "Illegal Dumping",
        "value": "antigraffiti@sanjoseca.gov"
      };
       $scope.specialValue3 = {
        "id": "Homeless Outreach",
        "value": "outreach@homefirstscc.org"
      };
       $scope.specialValue4 = {
        "id": "Water Waste",
        "value": "drought@valleywater.org"
      };
       $scope.specialValue5 = {
        "id": "Abandoned Carts",
        "value": "TBA"
      };
       $scope.specialValue6 = {
        "id": "Littering",
        "value": "antigraffiti@sanjoseca.gov"
      };

    //ngSubmit   
      $scope.list = [];
      $scope.text = 'hello';
      $scope.submit = function() {
        if ($scope.text) {
          $scope.list.push(this.text);
          $scope.text = '';
        }
      };
  //$binding 
      var ref = new Firebase("https://cityofsjapp.firebaseio.com/");
  // download the data into a local object
      var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
      syncObject.$bindTo($scope, "data");

    });