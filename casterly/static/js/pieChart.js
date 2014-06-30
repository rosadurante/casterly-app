/* globals define */

define('pieChart', ['underscore', 'd3'], function (_, d3) {
    'use strict';

    var PieChart = function (element, data, w, h, r) {
            this.element = element || 'body';
            this.data = data || [];
            this.width = w || 450;
            this.height = h || 350;
            this.radio = r || 120;

            this.innerRadio = 50;
            this.textOffset = 14;
            this.colour = d3.scale.category20();
        },

        behaviour = {

            buildCenter: function () {
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
                  .text(this.getTotal());

                //UNITS LABEL
                this.centerGroup.append("svg:text")
                  .attr("class", "units")
                  .attr("dy", 21)
                  .attr("text-anchor", "middle") // text-align: right
                  .text("£");

            },

            buildArcs: function () {
                var self = this;
                this.arc = d3.svg.arc()
                    .innerRadius(this.innerRadio)
                    .outerRadius(this.radio);

                this.donut = d3.layout.pie().value(function (d) { return d.value; });

                this.arcGroup = this.vis.append("svg:g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                debugger;
                this.paths = this.arcGroup.selectAll("path").data(this.donut(this.data));
                this.paths.enter()
                    .append("svg:g")
                        .attr("class", "slice")
                    .append("svg:path")
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .attr("d", this.arc)
                        .attr("fill", function(d, i) { return self.colour(i); });
            },

            buildLabels: function () {
                // Labels
                this.labelGroup = this.vis.append("svg:g")
                    .attr("class", "label-group")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                this.donut = d3.layout.pie().value(function (d) { return d.value; });

                var self = this,
                    labelTransform = function (d) {
                        return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) *
                            (self.radio / 2) + "," +
                            Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) *
                            (self.radio / 2) + ")";
                    },

                    labelDy = function (d, offsetLeft, offsetRight) {
                        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 &&
                            (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5 ) {
                            return offsetLeft;
                        } else {
                            return offsetRight;
                        }
                    };

                this.valueLabels = this.labelGroup.selectAll("text.value").data(this.donut(this.data));
                this.valueLabels.enter().append("svg:text")
                    .attr("class", "value")
                    .attr("transform", labelTransform)
                    .attr("dy", function (d) { return labelDy(d, 5, -7); })
                    .attr("text-anchor", function (d) {
                        return ((d.startAngle + d.endAngle) / 2 < Math.PI ) ? "beginning" : "end";
                    }).text(function (d) {
                        var percentage = (d.value / self.getTotal()) * 100;
                        return percentage.toFixed(1) + "%";
                    });

                this.nameLabels = this.labelGroup.selectAll("text.units").data(this.donut(this.data));
                this.nameLabels.enter().append("svg:text")
                    .attr("class", "units")
                    .attr("transform", labelTransform)
                    .attr("dy", function (d) { return labelDy(d, 17, 5); })
                    .attr("text-anchor", function (d) {
                        return ((d.startAngle + d.endAngle) / 2 < Math.PI ) ? "beginning" : "end";
                    }).text(function (d) {
                        return d.data.label;
                    });
            },


            getTotal: function () { return parseFloat(_.reduce(this.data, function (memo, item) { return memo + item.value; }, 0).toFixed(2)); },
            updateData: function (data) { this.data = data; this.refresh(); },

            refresh: function () {
                var self = this;
                this.totalValue.text(this.getTotal());

                this.paths = this.arcGroup.selectAll("path").data(this.donut(this.data));
                this.paths.enter()
                    .append("svg:g")
                        .attr("class", "slice")
                    .append("svg:path")
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.5)
                        .attr("d", this.arc)
                        .attr("fill", function(d, i) { return self.colour(i); });

                this.buildLabels();
            },

            init: function () {
                this.vis = d3.select(this.element).append("svg:svg")
                    .attr("width", this.width)
                    .attr("height", this.height);

                this.buildCenter();
                this.buildArcs();
                this.buildLabels();
            }
        };

    _.extend(PieChart.prototype, behaviour);
    return PieChart;
});