# express-stitch

Simple tool for serving client-side apps built with [stitch](https://github.com/sstephenson/stitch) and [express.js](http://expressjs.com/).

## goals

make it easy to:

- serve stitch packages dynamically while developing
- write/serve minified versions of packages to disk for production use

## install

```
npm install express-stitch
```

## demo

A simple express server, example:

```js
var express = require('express'),
    stitch = require('stitch'),
    stitcher = require('express-stitch');


// a simple stitch client-package
var clientApp = stitch.createPackage({
    paths: [__dirname + '/clientapp', __dirname + '/clientlib'],
    dependencies: [
        __dirname + '/public/jquery.js'
    ]
});

// set up express
var app = express();

app.configure(function () {
    // use gzip
    app.use(express.compress());
    // serve our 'normal' static files as usual
    app.use(express['static'](__dirname + '/public')); // our normal static files
});

// if production, also serve the files built by stitch
app.configure('production', function () {
    app.use(express['static'](__dirname + '/public/build'));
});

// our special stitch package. We pass in the package and options specifying
// where to write the minified file. Notice we write them to a directory called "build"
// by specifying items in this order, the static middleware will always intercept this
// route in production (since a file now exists at that path). So this particular handler
// never gets called.
app.get('/app.js', stitcher(stitchPackages.main, {writePath: __dirname + '/public/build/app.js'}));

// at this point our html can just point to /app.js and will either get the minified/static
// version in production and the dynamically served stitch package in dev.

app.listen(80);

```

## options

```js
{
    // whether to run through minifier before writing to disk. default is `true`
    minify: true, 
    // if you want to pass additional compression options to uglify's minify function, here's where you do it.
    uglifyConfig: {},
    // if you set this it will write the compiled file here. If left blank it won't write it to disk.
    writePath: '/path/something.js', 
    // serve: let's you optionally disable serving the dynamic package. `true` is the default.
    serve: true 
}
```

## credits

Written by [@henrikjoreteg](http://twitter.com/henrikjoreteg). If you're an awesome person you should say hi to me on twitter.

## license

MIT
