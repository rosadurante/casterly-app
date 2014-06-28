/* globals define */

define('app', ['bootstrap'], function () {
    'use strict';

    var App = function () {
            this.initMessage = 'App - JS initialized.';
        };

    App.prototype.init = function () { console.log(this.initMessage); };

    return App;
});