/*  globals define */

define('stackBarChart', ['underscore', 'd3'], function (_, d3) {
    'use strict';

    var StackBarChart = function (options) {
        this.element = options.element || 'body';
        this.data = options.data || [];
        this.size = options.size;
        this.offset = options.offset;

        this.colour = d3.scale.category20c();

        /**
         *
         */
        this._calculateSizeAttr = function (size, offset) {
            this.offset = offset || [size/12, size/12, size/6, size/12];
            this.width = size - this.offset[0] - this.offset[2];
            this.height = size - this.offset[1] - this.offset[3];
        };

        // PRIVATE FUNCTIONS

        /**
         *
         */
        this._initChart = function () {
            var self = this;

            this._calculateSizeAttr(this.size, this.offset);

            this.chart = d3.select(this.element).append('svg')
                .attr("width", this.width + this.offset[0] + this.offset[2])
                .attr("height", this.height + this.offset[1] + this.offset[3])
                .append('g')
                .attr("class", "main")
                .attr("transform", "translate(" + this.offset[0] + "," + this.offset[1] + ")");

            window.addEventListener('resize', function (event) {
                var element = document.querySelectorAll(self.element).item(0);
                if (element.clientWidth < 1024 && element.clientWidth > 300) {
                    self._resizeChart(element.clientWidth);
                }
            });
        };

        /**
         *
         */
        this._initAxis = function () {
            this.axis = {
                x: d3.scale.ordinal()
                    .rangeRoundBands([0, this.width], 0.1),
                y: d3.scale.linear()
                    .rangeRound([this.height, 0])
            };

            this.axis.xAxis = d3.svg.axis()
                .scale(this.axis.x)
                .orient("bottom");

            this.axis.yAxis = d3.svg.axis()
                .scale(this.axis.y)
                .orient("left");

            this.chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + this.height + ")")
              .call(this.axis.xAxis);

            this.chart.append("g")
              .attr("class", "y axis")
              .call(this.axis.yAxis);
        };

        /**
         *
         */
        this._prepareData = function () {
            var self = this;
            // Setting up the colours domain to each piece of this bar
            // Bar: this.data[0] Pieces: this.data[0].values (object with different key-values on it)
            this.colour.domain(d3.keys(this.data[0].value));

            // Adding extra data to each bar:
            // Types: object with name and position of each piece
            // Total: bar height
            this.data.forEach(function (d) {
                var y0 = 0;
                d.types = self.colour.domain().map(function (name) {
                    return { name: name, y0: y0, y1: y0 += +d.value[name] };
                });
                d.total = d.types[d.types.length - 1].y1;
            });
        };

        /**
         *
         */
        this._buildBars = function () {
            var self = this;

            this.bars = this.chart.selectAll(".bars")
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
                // .attr("y", 0)
                // .attr("height", this.height);
                .attr("y", function (d) { return self.axis.y(d.y1); })
                .attr("height", function (d) { return self.axis.y(d.y0) - self.axis.y(d.y1); })
                .style("fill", function (d) {
                    return self.colour(d.name);
                });
                // Animation
                // .transition()
                //     .duration(750)
                //     .attr("y", function (d) { return self.axis.y(d.y1); })
                //     .attr("height", function (d) { return self.axis.y(d.y0) - self.axis.y(d.y1); });
        };

        /**
         *
         */
        this._buildLegend = function () {
            var self = this;

            this.legend = this.chart.selectAll(".legend")
                .data(this.colour.domain().slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                return "translate(0," + (i * (self.offset[2]/16)) + ")";
            });

            this.legend.append("rect")
                .attr("x", this.width)
                .attr("y", function (d,i) { return (self.offset[2]/10) * i; })
                .attr("width", this.offset[2])
                .attr("height", this.offset[2]/10)
                .style("fill", this.colour);

            this.legend.append("text")
                .attr("x", this.width + this.offset[2]/2)
                .attr("y", this.offset[2]/15)
                .attr("dy", function (d, i) { return (self.offset[2]/10) * i; })
                .attr("fill", "white")
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d;
                });
        };

        this._resizeChart = function (size) {
            this.size = size;
            this._calculateSizeAttr(size);

            this.initAnimate = function () {};

            this.axis.x = d3.scale.ordinal().rangeRoundBands([0, this.width], 0.1);
            this.axis.y = d3.scale.linear().rangeRound([this.height, 0]);
            this.axis.xAxis.scale(this.axis.x);
            this.axis.yAxis.scale(this.axis.y);

            d3.select('svg').attr("width", this.width + this.offset[0] + this.offset[2]);
            d3.select('svg').attr("height", this.height + this.offset[1] + this.offset[3]);
            this.chart.select('g.main').attr("transform", "translate(" + this.offset[0] + "," + this.offset[1] + ")");
            this.chart.select('g.x.axis')
                .attr("transform", "translate(0," + this.height + ")")
                .call(this.axis.xAxis);
            this.chart.select('g.y.axis')
                .call(this.axis.yAxis);

            this.updateData(this.data);
        };

        this.drawChart();
    };

    /**
     *
     */
    StackBarChart.prototype.drawChart = function () {
        this._prepareData();
        if (!this.chart) this._initChart();
        if (!this.axis) this._initAxis();

        // Setting finals values for domain on axis
        this.axis.x.domain(this.data.map(function (d) { return d.key; }));
        this.axis.y.domain([0, d3.max(this.data, function (d) { return d.total; })]);

        this._buildBars();
        this._buildLegend();
    };

    /**
     *
     */
    StackBarChart.prototype.updateData = function (data) {
        this.data = data;

        this.bars.remove();
        this.legend.remove();

        this.drawChart();
    };


    return StackBarChart;
});