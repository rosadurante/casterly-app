/* globals define */

define('stackBarChart', ['underscore', 'd3'], function (_, d3) {
    'use strict';

    var StackBarChart = function (element, data, width, height, offset) {
            this.element = element || 'body';
            this.data = data || [];
            this.width = width || 500;
            this.height = height || 750;
            this.offset = offset || [50,50,150,50];
            this.colour = d3.scale.category20c();
        },

        behaviour = {
            buildChart: function () {
                var self = this;

                // var stack = d3.layout.stack()
                //     .values( function (d) { return d.values; });

                this.axis = {
                    x: d3.scale.ordinal()
                        .rangeRoundBands([0, this.width], 0.1),
                    y: d3.scale.linear()
                        .rangeRound([this.height, 0])
                };

                // Months
                this.axis.xAxis = d3.svg.axis()
                    .scale(this.axis.x)
                    .orient("bottom");

                // Categories
                this.axis.yAxis = d3.svg.axis()
                    .scale(this.axis.y)
                    .orient("left");

                this.chart = d3.select(this.element).append('svg')
                    .attr("width", this.width + this.offset[0] + this.offset[2])
                    .attr("height", this.height + this.offset[1] + this.offset[3])
                    .append('g')
                    .attr("transform", "translate(" + this.offset[0] + "," + this.offset[1] + ")");

                this.colour.domain(d3.keys(this.data[0].value));

                this.data.forEach(function (d) {
                    var y0 = 0;
                    d.types = self.colour.domain().map(function (name) {
                        return { name: name, y0: y0, y1: y0 += +d.value[name] };
                    });
                    d.total = d.types[d.types.length - 1].y1;
                });

                this.axis.x.domain(this.data.map(function (d) { return d.key; }));
                this.axis.y.domain([0, d3.max(this.data, function (d) { return d.total; })]);

                this.chart.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + this.height + ")")
                  .call(this.axis.xAxis);

                this.chart.append("g")
                  .attr("class", "y axis")
                  .call(this.axis.yAxis);

                this.bars = this.chart.selectAll(".month")
                    .data(this.data)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) {
                        return "translate(" + self.axis.x(d.key) + ",0)";
                    });

                this.bars.selectAll("rect")
                    .data(function (d) {
                        return d.types;
                    })
                    .enter().append("rect")
                    .attr("width", this.axis.x.rangeBand())
                    .attr("y", function (d) {
                        return self.axis.y(d.y1);
                    })
                    .attr("height", function (d) {
                        return self.axis.y(d.y0) - self.axis.y(d.y1);
                    })
                    .style("fill", function (d) {
                        return self.colour(d.name);
                    });
            },


            buildLegend: function () {

                this.legend = this.chart.selectAll(".legend")
                    .data(this.colour.domain().slice().reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

                this.legend.append("rect")
                    .attr("x", this.width + 50)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", this.colour);

                this.legend.append("text")
                    .attr("x", this.width + 35)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return d;
                    });
            },

            init: function () {
                this.buildChart();
                this.buildLegend();
            },

        };

    _.extend(StackBarChart.prototype, behaviour);
    return StackBarChart;
});