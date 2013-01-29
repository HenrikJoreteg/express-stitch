// node core
var fs = require('fs'),
    path = require('path');


module.exports = function (stitchPackage, spec) {
    var config = {
            minify: true,
            uglifyConfig: {},
            writePath: null,
            serve: true
        },
        options = spec || {},
        item,
        uglify;

    // apply any passed in options
    for (item in config) {
        if (typeof options[item] !== 'undefined') {
            config[item] = options[item];
        }
    }

    // attempt require uglify if it's going to be used
    if (config.minify) {
        uglify = require('uglify-js');
    }

    // for minification to work we always need to set the fromString
    // option to uglify. So we make sure you can't pass in options that
    // break that basic functionality
    config.uglifyConfig.fromString = true;

    // if given, compile it
    if (config.writePath) {
        stitchPackage.compile(function (err, source) {
            if (err) throw err;
            if (config.minify && uglify) {
                fs.writeFile(config.writePath, uglify.minify(source, config.uglifyConfig).code, function (err) {
                    if (err) throw err;
                });
            } else {
                fs.writeFile(config.writePath, source, function (err) {
                    if (err) throw err;
                });
            }
        });
    } else if (config.serve) {
        return stitchPackage.createServer();
    }

    if (config.serve) {
        return stitchPackage.createServer();
    } else {
        return function (req, res, next) {
            next();
        };
    }
};
