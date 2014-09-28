/* globals define */

define('dashboard', ['app', 'jquery', 'underscore', 'pieChart', 'stackBarChart'], function (App, $, _, PieChart, StackBarChart) {
    'use strict';

    
    var Dashboard = function () {
            this.initMessage = 'Dashboard - JS Initialised';
            this.url = '/api/transactions';
        },

        behaviour = {
            getOrCreateChart : function () {
                if (!this.outcomePieChart) {
                    this.outcomePieChart = new PieChart('#outcomePieChart', this.outcomeStats, 500);
                    this.outcomePieChart.init();
                } else {
                    this.outcomePieChart.updateData(this.outcomeStats);
                    this.outcomePieChart.refresh();
                }

                if (!this.stackBarChart) {
                    this.stackBarChart = new StackBarChart('#stackBarChart', this.statsOut, 500, 750, [50,50,150,50]);
                    this.stackBarChart.init();
                } else {
                    this.stackBarChart.updateData(this.outcomeStats);
                    this.stackBarChart.refresh();
                }
            },

            saveStats: function (statList) {
                var self = this,
                    getTotalAmount = function (list, category, kind) {
                        var amount = _.reduce(list, function (memo, item) {
                            if (item.category.name === category) {
                                return memo + (item.kind === kind ? parseFloat(item.amount) : 0);
                            } else {
                                return memo;
                            }
                        }, 0);

                        return parseFloat(amount.toFixed(2));
                    };

                this.categories = _.uniq(_.map(statList, function (item) { return item.category.name; }));
                this.months = _.uniq(_.map(statList, function (item) { return item.when.substr(0,7); }));
                this.statsIn = [];
                this.statsOut = [];

                this.outcomeStats = _.sortBy(
                    _.map(this.categories, function (category) {
                        return {
                            'label': category,
                            'value': getTotalAmount(statList, category, 'out')
                        };
                    }),
                    function (data) { return data.value; });


                _.each(this.months, function (month) {
                    var amountMonthsOut = {}, amountMonthsIn = {};

                    _.each(self.categories, function (category) {
                        amountMonthsOut[category] = _.reduce(statList, function (memo, item) {
                            return memo + ((item.when.substr(0,7) === month && item.category.name === category && item.kind === 'out') ? parseFloat(item.amount) : 0);
                        }, 0);
                        amountMonthsIn[category] = _.reduce(statList, function (memo, item) {
                            return memo + ((item.when.substr(0,7) === month && item.category.name === category && item.kind === 'in') ? parseFloat(item.amount) : 0);
                        }, 0);
                    });

                    self.statsIn.push({key: month, value: amountMonthsIn});
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

    Dashboard.prototype = new App();
    _.extend(Dashboard.prototype, behaviour);

    return Dashboard;
});