/* globals require */

/* -- Require config -- */
require.config({

    paths: {
        'jquery': './libs/jquery/dist/jquery.min',
        'domReady': './libs/domReady/domReady',
        'underscore':'./libs/underscore/underscore',
        'bootstrap': './libs/bootstrap/dist/js/bootstrap.min',
        'd3': './libs/d3/d3.min'
    },

    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        }
    }
});

/* Application init */
define(['require'], function (require) {
    'use strict';

    require(['domReady!'], function () {
        var moduleName;

        switch (window.location.pathname.replace('/', '')) {
            case 'dashboard':
                moduleName = 'dashboard';
                break;
            case 'compare':
                moduleName = 'compare';
                break;
            default:
                moduleName = 'app';
                break;
        };

        require([moduleName]);
    });
});