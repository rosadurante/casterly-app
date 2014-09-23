/* globals define */

define('dashboard', ['app', 'jquery', 'underscore', 'pieChart'], function (App, $, _, PieChart) {
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

                if (!this.incomePieChart) {
                    this.incomePieChart = new PieChart('#incomePieChart', this.incomeStats, 500, 200);
                    this.incomePieChart.init();
                } else {
                    this.incomePieChart.updateData(this.incomeStats);
                    this.incomePieChart.refresh();
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
                this.outcomeStats = _.sortBy(
                    _.map(this.categories, function (category) {
                        return {
                            'label': category,
                            'value': getTotalAmount(statList, category, 'out')
                        };
                    }),
                    function (data) { return data.value; });

                this.incomeStats = _.sortBy(
                    _.map(this.categories, function (category) {
                        return {
                            'label': category,
                            'value': getTotalAmount(statList, category, 'in')
                        };
                    }),
                    function (data) { return data.value; /* Ordering descending */ });

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