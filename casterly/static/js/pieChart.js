/*  globals define */

define('pieChart', ['underscore', 'd3'], function (_, d3) {
    'use strict';

    var PieChart = function (options) {
        this.element = options.element || 'body';
        this.data = options.data || [];
        this.width = options.size || 500;
        this.height = options.size || 500;

        this.timeAnimation = options.animationTime || 500;
        this.colour = d3.scale.category20c();

        // Private functions

        /**
         *
         */
        this._calculateSizeAttr = function () {
            this.radio = this.width * 2/5;
            this.labelSize = (this.width - this.radio) / 10;
            this.legendSize = this.width * 2/5;
            this.innerRadio = this.width / 10;
            this.textOffset = 0;
        };

        /**
         *
         */
        this._initChart = function () {
            var self = this;

            this._calculateSizeAttr();

            this.chart = d3.select(this.element).append('svg')
                .attr("width", this.width)
                .attr("height", this.height);

            this.donut = d3.layout.pie().value(function (d) { return d.value; })
                .startAngle(-1 * Math.PI)
                .endAngle(0);

            this.arc = d3.svg.arc()
                .innerRadius(this.innerRadio)
                .outerRadius(this.radio);

            this.arcOver = d3.svg.arc()
                .innerRadius(this.innerRadio + (this.radio*0.1))
                .outerRadius(this.radio + (this.radio*0.1));

            this.arcGroup = this.chart.append("svg:g")
                .attr("class", "arc")
                .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

            this.labelGroup = this.chart.append("svg:g")
                .attr("class", "label-group")
                .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2 + this.legendSize) + ")");

            this.initAnimation = function (b) {
                var i = d3.interpolate({startAngle: -1 * Math.PI, endAngle: -1 * Math.PI}, b);
                return function (t) { return self.arc(i(t)); };
            };

            this.animatedArcWhenClick = function (arc, index) {};

            window.addEventListener('resize', function (event) {
                var element = document.querySelectorAll(self.element).item(0);
                if (element.clientWidth < 1024 && element.clientWidth > 300) {
                    self.resizeChart(element.clientWidth);
                }
            });
        };

        /**
         *
         */
        this._buildArcs = function () {
            var self = this;

            this.donut = d3.layout.pie().value(function (d) { return d.value; })
                .startAngle(-1 * Math.PI)
                .endAngle(0);

            this.paths = this.arcGroup.selectAll("path").data(this.donut(this.data));
            this.paths.enter()
                .append("svg:g")
                    .attr("class", "slice")
                .append("svg:path")
                    .attr("stroke", "white")
                    .attr("stroke-width", 0.5)
                    .attr("d", this.arc)
                    .attr("fill", function(d, i) { return self.colour(i); })
                    .on("click", this.animatedWhenClick)
                    .on('mouseover', this.onMouseOver.bind(this))
                    .on('mouseout', this.onMouseOut.bind(this))
                    .transition()
                        .ease("out")
                        .duration(this.timeAnimation)
                        .attrTween("d", this.initAnimation);
        };

        /**
         *
         */
        this._buildLegend = function () {
            var self = this;

            this.donut = d3.layout.pie().value(function (d) { return d.value; });

            this.rectLabels = this.labelGroup.selectAll("rect").data(this.donut(this.data));
            this.rectLabels.enter()
                .append("rect")
                    .attr("width", this.radio)
                    .attr("height", this.radio / 10)
                    .attr("x", 10)
                    .attr("y", function (d,i) { return ((-1 * self.radio) + (self.labelSize * i)) - self.radio; })
                    .attr("fill", function (d,i) { return self.colour(i); })
                    .on('mouseover', this.onMouseOver.bind(this))
                    .on('mouseout', this.onMouseOut.bind(this));

            this.valueLabels = this.labelGroup.selectAll("text.value").data(this.donut(this.data));
            this.valueLabels.enter()
                .append("svg:text")
                    .attr("class", "value")
                    // .attr("transform", labelTransform)
                    .attr("dy", function (d, i) { return (-1 * self.radio) + (i * self.labelSize) + (self.labelSize/2) - self.radio; })
                    .attr("dx", this.radio / 2)
                    .attr("fill", "white")
                    .attr("text-anchor", function (d) { return "middle";
                    }).text(function (d) {
                        var percentage = (d.value / self.getTotal()) * 100;
                        return percentage.toFixed(1) + "%  " + d.data.label;
                    })
                    .on('mouseover', this.onMouseOver.bind(this))
                    .on('mouseout', this.onMouseOut.bind(this));
        };

        this.drawChart();
    };

    /**
     *
     */
    PieChart.prototype.getTotal = function () {
        return parseFloat(_.reduce(this.data, function (memo, item) { return memo + item.value; }, 0).toFixed(2));
    };

    /**
     *
     */
    PieChart.prototype.drawChart = function () {
        if (!this.chart || !this.chart.length) this._initChart();

        this._buildArcs();
        this._buildLegend();
    };

    /**
     *
     */
    PieChart.prototype.updateData = function (data, animation) {
        var self = this;
        this.data = data;

        if (animation) {
            this.initAnimation = function (b) {
                var i = d3.interpolate({startAngle: -1 * Math.PI, endAngle: -1 * Math.PI}, b);
                return function (t) { return self.arc(i(t)); };
            };
        }

        this.paths.remove();
        this.rectLabels.remove();
        this.valueLabels.remove();

        this.drawChart();
    };

    /**
     *
     */
    PieChart.prototype.resizeChart = function (size) {
        this.width = size;
        this.height = size;

        this.initAnimation = function () {};

        this._calculateSizeAttr();

        this.chart.attr('width', this.width);
        this.chart.attr('height', this.height);

        this.arc = d3.svg.arc()
            .innerRadius(this.innerRadio)
            .outerRadius(this.radio);

        this.arcGroup.attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");
        this.labelGroup.attr("transform", "translate(" + (this.width/2) + "," + (this.height/2 + this.legendSize) + ")");
        
        this.updateData(this.data, false);
    };


    /**
     *
     */
    PieChart.prototype.onMouseOver = function (d, index) {
        this.arcGroup.selectAll('path').transition()
            .duration(500)
            .attr('d', this.arc)
            .attr('opacity', 0.25);

        this.labelGroup.selectAll('rect').transition()
            .duration(500)
            .attr('opacity', 0.25);     

        d3.select(this.arcGroup.selectAll('path')[0][index])
            .transition()
            .duration(500)
            .attr('opacity', 1)
            .attr("d", this.arcOver);

        d3.select(this.labelGroup.selectAll('rect')[0][index])
            .transition()
            .duration(500)
            .attr('opacity', 1);
    };

    /**
     *
     */
    PieChart.prototype.onMouseOut = function (d, index) {
        this.arcGroup.selectAll('path').transition()
            .duration(500)
            .attr('d', this.arc)
            .attr('opacity', 1);

        this.labelGroup.selectAll('rect').transition()
            .duration(500)
            .attr('opacity', 1);
    };

    return PieChart;
});