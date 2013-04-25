MTCard (kari) is the building user mode application easily

# Prerequisites
Installation depends on [node](http://nodejs.org/), [npm](https://npmjs.org/), [bower](http://bower.io/) and [grunt-cli](http://gruntjs.com/)

To install node, see http://nodejs.org/ (If you are using Mac, you can install node via [homebrew](http://mxcl.github.io/homebrew/))

Then, you can install bower and grunt-cli with npm like the following. When you have some error in installation, try sudo.

```
  [sudo] npm install -g bower
  [sudo] npm install -g grunt-cli
```

# Installation
```git clone git@github.com:movabletype/MTCard.git```, and move the directory you cloned, then execute the following command

```
  npm install
  bower install
```

# Building for develop
grunt dev task generate index.html in app directory and run the dependant tasks

```
  grunt dev
```

# Building for production
grunt build task generate optimized scrips in build directory

```
  grunt build
```

# connect server in local
If you want to run the user mode application in local, grunt connect task can do it easily.

```
  grunt connect:test
```

You can see the app starting at http://localhost:9002/
