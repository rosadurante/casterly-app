/* globals define */

define('compare', ['jquery', 'underscore', 'stackBarChart', 'entriesList'], function ($, _, StackBarChart, EntriesList) {
    'use strict';

    
    var Compare = function () {
        var self = this;

        this.initMessage = 'Compare - JS Initialised';
        this.url = '/api/transactions';

        this._getCompareData = function () {
            var self = this,
                categories = _.uniq(_.map(this._data, function (item) { return item.category.name; })),
                months = _.uniq(_.map(this._data, function (item) { return item.when.substr(0,7); })),
                compareData = [];

            _.each(months, function (month) {
                var amountMonthsOut = {};

                _.each(categories, function (category) {
                    amountMonthsOut[category] = _.reduce(self._data, function (memo, item) {
                        return memo + ((item.when.substr(0,7) === month && item.category.name === category && item.kind === 'out') ? parseFloat(item.amount) : 0);
                    }, 0);
                });

                compareData.push({key: month, value: amountMonthsOut});
            });

            return compareData;
        };

        this._buildChart = function () {
            this.stackBarChart = new StackBarChart({
                element: '#stackBarChart',
                data: this._getCompareData(),
                size: document.getElementById('stackBarChart').clientWidth,
                width: 500,
                height: 750,
                offset: [50,50,150,50]
            }); 
        };

        $.getJSON(this.url, function (response) {
            self._data = response;
            self._buildChart();
        });   
    };

    return Compare;
});