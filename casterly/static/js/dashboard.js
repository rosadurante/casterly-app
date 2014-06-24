/* globals define */

define('dashboard', ['app', 'jquery', 'underscore'], function (App, $, _) {
    'use strict';

    
    var _saveStats = function (statList) {
            this.stats = statList;
        },

        _getAllStats = function () {
            $.getJSON(this.url, this.saveStats);
        },

        _init = function () {
            App.prototype.init.call(this);
            this.getAllStats();
        },

        Dashboard = function () {
            this.initMessage = 'Dashboard - JS Initialised';
            this.url = '';
        };


    Dashboard.prototype = new App();
    Dashboard.prototype.saveStats = _saveStats;
    Dashboard.prototype.getAllStats = _getAllStats;
    Dashboard.prototype.init = _init;

    return Dashboard;
});