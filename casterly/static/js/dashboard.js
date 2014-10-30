/* globals define */

define('dashboard', ['jquery', 'underscore', 'pieChart', 'entriesList', 'bootstrap'], function ($, _, PieChart, EntriesList) {
    'use strict';

    var Dashboard = function () {
        var self = this;

        this.initMessage = 'Dashboard - JS Initialised';
        this.url = '/api/transactions';

        this._getOutComeData = function (categories) {
            var self = this, categoryList, getTotalAmount;

            categoryList = _.uniq(_.map(this._data, function (item) { return item.category.name; }));
            
            getTotalAmount = function (data, category) {
                var amount = _.reduce(data, function (memo, item) {
                    return (item.category.name === category) ? memo + parseFloat(item.amount) : memo;
                }, 0);
                return parseFloat(amount.toFixed(2));
            };

            return (_.sortBy(
                _.map(categoryList, function (cat) {
                    return {
                        'label': cat,
                        'value': getTotalAmount(self._data, cat)
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

        this._displayEntries = function () {
            var self = this;
            this._list = new EntriesList('outcomeTable', this._data);

            this.outcomePieChart.chart.on('click', function () {
                self._list.updateEntries(self._data, self.outcomePieChart.getSelectedCategories());
            });
        };

        $.getJSON(this.url, function (response) {
            self._data = _.filter(response, function (item) { return item.kind === 'out'; });
            self._buildChart();
            self._displayEntries();
        });     
    };

    new Dashboard();
});