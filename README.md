Loupe is the application for operating the user daily task easily.

# Prerequisites
Installation depends on [node](http://nodejs.org/), [npm](https://npmjs.org/), [bower](http://bower.io/) and [grunt-cli](http://gruntjs.com/)

To install node, see http://nodejs.org/ (If you are using Mac, you can install node via [homebrew](http://mxcl.github.io/homebrew/))

Then, you can install bower and grunt-cli with npm like the following. When you have some error in installation, try sudo.

```
  [sudo] npm install -g bower
  [sudo] npm install -g grunt-cli
```

This project use [sass](http://sass-lang.com/) with [compass](http://compass-style.org/)(required 0.12.2 higher) for building CSS.

To install them, [gem](http://rubygems.org/) install is the easiest way. (In order to use gem, You need [ruby](http://www.ruby-lang.org/))

```
  [sudo] gem install sass
  [sudo] gem install compass
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
