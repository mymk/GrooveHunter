// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngAnimate', 'ngCookies'])

	.run(function ($ionicPlatform) {
		'use strict';
		$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
		// add script to 
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	})


	.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	  delete $httpProvider.defaults.headers.common['X-Requested-With'];

	  // Ionic uses AngularUI Router which uses the concept of states
	  // Learn more here: https://github.com/angular-ui/ui-router
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
	  $stateProvider

		// setup an abstract state for the tabs directive
		.state('splash', {
		  url: "/",
		  templateUrl: "templates/splash.html"
		})

		.state('login', {
		  url: "/login",
		  templateUrl: "templates/login.html",
		  controller: 'LoginCtrl'
		})

		.state('logout', {
		  url: "/logout",
		  controller: 'LogoutCtrl'
		})

		.state('signup', {
		  url: '/signup',
		  templateUrl: 'templates/signup.html',
		  controller: 'SignupCtrl'
		})

		.state('search', {
		  url: '/search',
		  templateUrl: 'templates/search.html',
		  controller: 'VideosController'
		})

		.state('historique', {
		  url: '/historique',
		  templateUrl: 'templates/historique.html',
		  controller: 'VideosController'
		})

		// the pet tab has its own child nav-view and history
		.state('home_landing', {
		  url: '/home',
		  templateUrl: 'templates/home.html',
		  controller: 'VideosController'
		});

	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/');

	})

.provider('myCSRF',[function(){
  var headerName = 'X-CSRFToken';
  var cookieName = 'csrftoken';
  var allowedMethods = ['GET'];

  this.setHeaderName = function(n) {
    headerName = n;
  }
  this.setCookieName = function(n) {
    cookieName = n;
  }
  this.setAllowedMethods = function(n) {
    allowedMethods = n;
  }
  this.$get = ['$cookies', function($cookies){
    return {
      'request': function(config) {
        if(allowedMethods.indexOf(config.method) === -1) {
          // do something on success
          config.headers[headerName] = $cookies[cookieName];
        }
        return config;
      }
    }
  }];
}]).config(function($httpProvider) {
  $httpProvider.interceptors.push('myCSRF');
})



.run(function($rootScope, $firebaseSimpleLogin, $state, $window) {
  // reference de la base de donné
  var dataRef = new Firebase("https://groovehunter.firebaseio.com/");
  var loginObj = $firebaseSimpleLogin(dataRef);
  $rootScope.user = null;

  loginObj.$getCurrentUser().then(function(user) {
    if(!user){ 
      // Might already be handled by logout event below
      $state.go('login');
    }
  }, function(err) {
  });

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
    $state.go('home_landing');
    $rootScope.user = user;
    
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function(e, user) {
    console.log($state);
    $rootScope.user = null;
    $state.go('login');
  });

  $rootScope.$on("$firebaseSimpleLogin:error", function(e, error) {
    console.log("Error logging user in: ", error);
  });
})


.controller('LoginCtrl', function($scope, $firebaseSimpleLogin ) {
  $scope.loginData = {};

  var dataRef = new Firebase("https://groovehunter.firebaseio.com/");
  $scope.loginObj = $firebaseSimpleLogin(dataRef);


  $scope.user = null;

  $scope.tryLogin = function() {
    $scope.loginObj.$login('google').then(function(user) {
      // The root scope event will trigger and navigate

    }, function(error) {
      // Show a form error here
      console.error('Unable to login', error);
    });
  };

  $scope.logout = function() {
    $scope.loginObj.$logout();
  };


})


.controller('SignupCtrl', function($scope) {
})

.controller('SearchCtrl', function($scope) {
})

// Service

.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '236',
    playerWidth: '100%',
    state: 'stopped'
  };
  var results = [
     //{id: 'MBGm4lwjiuA', title: '12 Billy Joe Morgan - Stop Them (& Dub)', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
  ];
  var upcoming = [
    {id: '5LN7W3EtRMg', title: 'Igorrr - Vegetable Soup', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: '45YSGFctLws', title: 'Shout Out Louds - Illusions', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'ktoaj1IpTbw', title: 'CHVRCHES - Gun', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: '8Zh0tY2NfLs', title: 'N.E.R.D. ft. Nelly Furtado - Hot N\' Fun (Boys Noize Remix) HQ', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'zwJPcRtbzDk', title: 'Daft Punk - Human After All (SebastiAn Remix)', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'sEwM6ERq0gc', title: 'HAIM - Forever (Official Music Video)', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'fTK4XTvZWmk', title: 'Housse De Racket â˜â˜€â˜ Apocalypso', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'}
  ];
  var history = [
    {id: '8eJDTcDUQxQ', title: 'SKRILLEX - RAGGA BOMB WITH RAGGA TWINS [OFFICIAL VIDEO]', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'}
  ];

  $window.onYouTubeIframeAPIReady = function () {
    $log.info('Youtube API is ready');
    youtube.ready = true;
    service.bindPlayer('placeholder');
    service.loadPlayer();
    $rootScope.$apply();
  };

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    //recupere un video en fonction de son ID dans l'historique
    youtube.player.cueVideoById(history[0].id);
     youtube.videoId = history[0].id;
     youtube.videoTitle = history[0].title;
  }

  function onYoutubeStateChange (event) {
    /*
    -1 – unstarted
    0 – ended
    1 – playing
    2 – paused
    3 – buffering
    5 – video cued

    */
    if (event.data == YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'ended';
      service.launchPlayer(upcoming[0].id, upcoming[0].title);
      service.archiveVideo(upcoming[0].id, upcoming[0].title);
      service.deleteVideo(upcoming, upcoming[0].id);
    } else if (event.data == YT.PlayerState.unstarted) {
      youtube.state = 'unstarted';
    } else if (event.data == YT.PlayerState.BUFFERING) {
      youtube.state = 'buffering';
    } else if (event.data == YT.PlayerState.CUED) {
      youtube.state = 'cued';
    }
    $rootScope.$apply();
  }

  this.bindPlayer = function (elementId) {
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      /* variables du player */
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  };

  this.listResults = function (data) {
    results.length = 0;
    for (var i = data.items.length - 1; i >= 0; i--) {
      results.push({
        id: data.items[i].id.videoId,
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        thumbnail: data.items[i].snippet.thumbnails.medium.url,
        author: data.items[i].snippet.channelTitle
      });
    }
    return results;
  };

  this.queueVideo = function (id, title,description,thumbnail,author) {
    upcoming.push({
    	id: id,
    	title: title,
		description: description,
		thumbnail: thumbnail,
		author: author
    });
    return upcoming;
  };

  this.archiveVideo = function (id, title,description,thumbnail,author) {
    history.unshift({
    	id: id,
    	title: title,
		description: description,
		thumbnail: thumbnail,
		author: author
    });
    return history;
  };

  this.deleteVideo = function (list, id) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getResults = function () {
    return results;
  };

  this.getUpcoming = function () {
    return upcoming;
  };

  this.getHistory = function () {
    return history;
  };



}])

// Controller

.controller('VideosController', function ($scope, $http, $log, VideosService, $ionicPopover) {

    init();

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.upcoming = VideosService.getUpcoming();
      $scope.history = VideosService.getHistory();
      $scope.playlist = true;
    }

    $scope.launch = function (id, title, description, thumbnail, author) {
      VideosService.launchPlayer(id, title);
      VideosService.archiveVideo(id, title,description,thumbnail,author);
      VideosService.deleteVideo($scope.upcoming, id);
      $log.info('Launched id:' + id + ' and title:' + title);
    };
	
	$scope.next = function () {
		VideosService.launchPlayer($scope.upcoming[0].id, $scope.upcoming[0].title);
		VideosService.archiveVideo($scope.upcoming[0].id, $scope.upcoming[0].title);
		VideosService.deleteVideo($scope.upcoming, $scope.upcoming[0].id);
		$log.info('Launched id:' + $scope.upcoming[0].id + ' and title:' + $scope.upcoming[0].title);
    };
	
	$scope.previous = function () {
		VideosService.launchPlayer($scope.history[0].id, $scope.history[0].title);
		VideosService.queueVideo($scope.history[0].id, $scope.history[0].title);
		VideosService.deleteVideo($scope.history, $scope.history[0].id);
		$log.info('Launched id:' + $scope.upcoming[0].id + ' and title:' + $scope.upcoming[0].title);
    };

    $scope.queue = function (id, title,description,thumbnail,author) {
      VideosService.queueVideo(id, title,description,thumbnail,author);
      VideosService.deleteVideo($scope.history, id);
      $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function (list, id) {
      VideosService.deleteVideo($scope.upcoming, id);
      $log.info('delete id:' + id +'from upcomming');
    };

    $scope.deleteFromHistory = function (id) {
      VideosService.deleteVideo($scope.history, id);
      $log.info('delete id:' + id +'from history ');
    };

    $scope.search = function () {
      $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyB3UINspsc3X1K68olG8FcFLG-bDn8koG4',
          type: 'video',
          maxResults: '8',
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/medium,items/snippet/channelTitle',
          q: this.query
        }
      })
      .success( function (data) {
        VideosService.listResults(data);
        $log.info(data);
      })
      .error( function () {
        $log.info('Search error');
      });
    }

    $scope.hideResult = function (state) {
      $scope.result = state;
    }

})

.controller('NavController', function($scope, $http, $log, VideosService, $ionicPopover){
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
})