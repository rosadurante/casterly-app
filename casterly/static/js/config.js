/* globals require */

/* -- Require config -- */
require.config({

    paths: {
        'jquery': './libs/jquery/dist/jquery.min',
        'domReady': './libs/domReady/domReady',
        'underscore':'./libs/underscore/underscore',
        'bootstrap': './libs/bootstrap/dist/js/bootstrap.min'
    },

    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        }
    }
});

/* Application init */
define(['require', 'app'], function (require, app) {
    'use strict';

    require(['domReady!'], function () {
        app.init();
    });
});