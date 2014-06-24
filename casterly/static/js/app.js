/* globals define */

define('app', ['bootstrap'], function () {
    'use strict';

    var _init = function () {
            console.log(this.initMessage);
        },

        App = function () {
            this.initMessage = 'App - JS initialized.';
        };

    App.prototype.init = _init;

    return App;
});