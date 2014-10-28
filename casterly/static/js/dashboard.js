/* globals define */

define('dashboard', ['jquery', 'underscore', 'pieChart', 'entriesList'], function ($, _, PieChart, EntriesList) {
    'use strict';

    var Dashboard = function () {
        var self = this;

        this.initMessage = 'Dashboard - JS Initialised';
        this.url = '/api/transactions';

        this._getOutComeData = function (categories) {
            var self = this, categories, getTotalAmount;

            categories = _.uniq(_.map(this._data, function (item) { return item.category.name; }));
            
            getTotalAmount = function (data, category, kind) {
                var amount = _.reduce(data, function (memo, item) {
                    return (item.category.name === category && item.kind === kind) ? memo + parseFloat(item.amount) : memo;
                }, 0);
                return parseFloat(amount.toFixed(2));
            };

            return (_.sortBy(
                _.map(categories, function (cat) {
                    return {
                        'label': cat,
                        'value': getTotalAmount(self._data, cat, 'out')
                    };
                }),
                function (data) { return data.value; }));
        };

        this._buildChart = function () {
            this.outcomePieChart = new PieChart({
                element: '#outcomePieChart',
                data: this._getOutComeData(),
                size: document.getElementById('outcomePieChart').clientWidth,
                innerRadio: 1
            }); 
        };

        $.getJSON(this.url, function (response) {
            self._data = response;
            self._buildChart();
        });     
    };

    return Dashboard;
});