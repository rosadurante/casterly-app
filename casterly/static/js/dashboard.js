/* globals define */

define('dashboard', ['app', 'jquery', 'underscore', 'd3'], function (App, $, _, d3) {
    'use strict';

    
    var DashboardPieChart = function (element, data, w, h, r, ir, textOffset) {
            var self = this;

            this.element = element || 'body';
            this.data = data || [];
            this.width = w || 300;
            this.height = h || 350;
            this.radio = r || 100;
            this.innerRadio = ir || 45;
            this.textOffset = textOffset || 14;

            this.colour = d3.scale.category20();


            this.getTotal = function () {
                return _.reduce(data, function (memo, item) { return memo + item.value; }, 0);
            };

            this.buildCenter = function () {
                this.centerGroup = this.vis.append("svg:g")
                    .attr("class", "center-group")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                this.whiteCircle = this.centerGroup.append("svg:circle")
                  .attr("fill", "white")
                  .attr("r", this.innerRadio);

                // "TOTAL" LABEL
                this.centerGroup.append("svg:text")
                  .attr("class", "label")
                  .attr("dy", -15)
                  .attr("text-anchor", "middle") // text-align: right
                  .text("TOTAL");

                //TOTAL TRAFFIC VALUE
                this.totalValue = this.centerGroup.append("svg:text")
                  .attr("class", "total")
                  .attr("dy", 7)
                  .attr("text-anchor", "middle") // text-align: right
                  .text(self.getTotal());

                //UNITS LABEL
                this.centerGroup.append("svg:text")
                  .attr("class", "units")
                  .attr("dy", 21)
                  .attr("text-anchor", "middle") // text-align: right
                  .text("£");

            };

            this.buildArcs = function () {
                this.arc = d3.svg.arc()
                    .innerRadius(this.innerRadio)
                    .outerRadius(this.radio);

                this.donut = d3.layout.pie().value(function (d) { return d.value; });

                this.arcGroup = this.vis.append("svg:g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                this.paths = this.arcGroup.selectAll("path").data(this.donut(this.data));
                this.paths.enter()
                    .append("svg:g")
                        .attr("class", "slice")
                    .append("svg:path")
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .attr("d", this.arc)
                        .attr("fill", function(d, i) { return self.colour(i); });
            };

            this.buildLabels = function () {
                // Labels
                this.labelGroup = this.vis.append("svg:g")
                    .attr("class", "label-group")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                this.donut = d3.layout.pie().value(function (d) { return d.value; });

                this.lines = this.labelGroup.selectAll("line").data(this.donut(this.data));
                this.lines.enter().append("svg:line")
                    .attr("x1", 0)
                    .attr("x2", 0)
                    .attr("y1", - this.radio - 3)
                    .attr("y2", - this.radio - 8)
                    .attr("stroke", "gray")
                    .attr("transform", function (d) {
                        return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
                  });

                this.valueLabels = this.labelGroup.selectAll("text.value").data(this.donut(this.data));

                this.valueLabels.enter().append("svg:text")
                    .attr("class", "value")
                    .attr("transform", function (d) {
                        return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) *
                            (self.radio + self.textOffset) + "," +
                            Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) *
                            (self.radio + self.textOffset) + ")";
                    })
                    .attr("dy", function (d) {
                        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 &&
                            (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5 ) {
                            return 5;
                        } else {
                            return -7;
                        }
                    })
                    .attr("text-anchor", function (d) {
                        if ((d.startAngle + d.endAngle) / 2 < Math.PI ){
                            return "beginning";
                        } else {
                            return "end";
                        }
                    }).text(function (d) {
                        var percentage = (d.value / self.getTotal()) * 100;
                        return percentage.toFixed(1) + "%";
                    });

                this.nameLabels = this.labelGroup.selectAll("text.units").data(this.donut(this.data));

                this.nameLabels.enter().append("svg:text")
                    .attr("class", "units")
                    .attr("transform", function (d) {
                        return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) *
                            (self.radio + self.textOffset) + "," +
                            Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) *
                            (self.radio + self.textOffset) + ")";
                    })
                    .attr("dy", function (d) {
                        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 &&
                            (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5 ) {
                            return 17;
                        } else {
                            return 5;
                        }
                    })
                    .attr("text-anchor", function(d){
                        if ((d.startAngle + d.endAngle) / 2 < Math.PI ) {
                            return "beginning";
                        } else {
                            return "end";
                        }
                    }).text(function (d) {
                        return d.data.label;
                    });

            };
            


            this.vis = d3.select(this.element)
                .append("svg:svg")
                    .attr("width", this.width)
                    .attr("height", this.height);

            this.buildCenter();
            this.buildLabels();
            this.buildArcs();
        },

        Dashboard = function () {
            this.initMessage = 'Dashboard - JS Initialised';
            this.url = '/api/transactions';
        },

        behaviour = {
            saveStats: function (statList) {
                this.stats = statList;
            },

            getAllStats: function () {
                $.getJSON(this.url, this.saveStats);
            },

            init: function () {
                App.prototype.init.call(this);
                this.getAllStats();

                var data = [
                    {'label': 'food and drink', 'value': 350},
                    {'label': 'rent', 'value': 1300},
                    {'label': 'bils', 'value': 300},
                    {'label': 'cash', 'value': 460}
                ];

                this.pieChart = new DashboardPieChart('#pieChart', data);
            }
        };

    Dashboard.prototype = new App();
    _.extend(Dashboard.prototype, behaviour);

    return Dashboard;
});