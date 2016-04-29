# SJ311-Firebase-Ionic

SJ-311 is a civic non-emergency issue tracking and reporting application developed by the team at Open San Jose. SJ-311 is developed with Ionic both iOS and Android platforms.

Data in sj311 Firebase database is stored as JSON and synchronized in realtime to every connected client [https://sj311.firebaseio.com/](https://sj311.firebaseio.com//).

## Instructions for installation

Make sure you have [Node.js](https://nodejs.org/en/) installed.  We recommend having the LTS version (v4.4.1) installed.

Then, install [Ionic](http://ionicframework.com/):
```
# You may need to use `sudo`
$ npm install -g ionic cordova
```

Clone this repository into your local machine using the terminal 
```
$ git clone https://github.com/dgonzalez4/SJ311-Firebase-Ionic.git
```

Open project folder.
```
$ cd SJ311-Firebase-Ionic.git
```
To run as web project
```
$ ionic serve
```

To run as mobile project, add mobile platforms accordingly and run it.
```
$ ionic platform add ios
$ ionic platform add android
```

```
$ ionic run ios
$ ionic run android
```

See ionic installation guide if you need more information (http://ionicframework.com/docs/guide/installation.html)


## Contact
Contact Issue? Suggestions? Contact contact@opensanjose.com

