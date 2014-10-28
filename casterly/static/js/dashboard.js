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
                    this.outcomePieChart = new PieChart({
                        element: '#outcomePieChart',
                        data: this.outcomeStats,
                        size: 200,
                        innerRadio: 1
                    });
                } else {
                    this.outcomePieChart.updateData(this.outcomeStats);
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