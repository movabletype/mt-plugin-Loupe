Loupe is the application for operating the user daily task easily.

# Prerequisites
Installation depends on [node](http://nodejs.org/), [npm](https://npmjs.org/) and [grunt-cli](http://gruntjs.com/)

To install node, see http://nodejs.org/ (If you are using Mac, you can install node via [homebrew](http://mxcl.github.io/homebrew/))

Then, you can install grunt-cli with npm like the following. When you have some error in installation, try sudo.

```
  [sudo] npm install -g grunt-cli
```

This project use [sass](http://sass-lang.com/) with [compass](http://compass-style.org/)(required 0.12.2 higher) for building CSS.

To install them, [gem](http://rubygems.org/) install is the easiest way. (In order to use gem, You need [ruby](http://www.ruby-lang.org/))

```
  [sudo] gem install sass
  [sudo] gem install compass
```

# Installation
```git clone git@github.com:movabletype/mt-plugin-Loupe.git```, and move the directory you cloned, then execute the following command

```
  cd build
  make dev
```

# Update sass

# Building for production (optimized)
grunt dev task generate index.html in app directory and run the dependant tasks

```
  cd build
  make build
```

You can clean up build files with the following command

```
  cd build
  make clean
```

The MIT License (MIT)

Copyright (c) 2013 Six Apart, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
