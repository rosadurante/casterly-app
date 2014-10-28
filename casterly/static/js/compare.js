/* globals define */

define('compare', ['app', 'jquery', 'underscore', 'stackBarChart'], function (App, $, _, StackBarChart) {
    'use strict';

    
    var Compare = function () {
            this.initMessage = 'Compare - JS Initialised';
            this.url = '/api/transactions';
        },

        behaviour = {
            getOrCreateChart : function () {
                if (!this.stackBarChart) {
                    this.stackBarChart = new StackBarChart('#stackBarChart', this.statsOut, 500, 750, [50,50,150,50]);
                    this.stackBarChart.init();
                } else {
                    this.stackBarChart.updateData(this.statsOut);
                    this.stackBarChart.refresh();
                }
            },

            saveStats: function (statList) {
                var self = this;

                this.categories = _.uniq(_.map(statList, function (item) { return item.category.name; }));
                this.months = _.uniq(_.map(statList, function (item) { return item.when.substr(0,7); }));
                this.statsOut = [];

                _.each(this.months, function (month) {
                    var amountMonthsOut = {};

                    _.each(self.categories, function (category) {
                        amountMonthsOut[category] = _.reduce(statList, function (memo, item) {
                            return memo + ((item.when.substr(0,7) === month && item.category.name === category && item.kind === 'out') ? parseFloat(item.amount) : 0);
                        }, 0);
                    });

                    self.statsOut.push({key: month, value: amountMonthsOut});
                });

                this.getOrCreateChart();
            },

            getAllStats: function () {
                var self = this;
                $.getJSON(this.url, function (response) {
                    self.saveStats(response);
                });
            },

            init: function () {
                App.prototype.init.call(this);
                this.getAllStats();
            }
        };

    Compare.prototype = new App();
    _.extend(Compare.prototype, behaviour);

    return Compare;
});