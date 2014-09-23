/* globals define */

define('pieChart', ['underscore', 'd3'], function (_, d3) {
    'use strict';

    var PieChart = function (element, data, size, r, ir, textOffset) {
            this.element = element || 'body';
            this.data = data || [];
            this.width = size || 500;
            this.height = size || 500;
            this.radio = r || ( (size * 2 / 5) || 200 );

            this.innerRadio = ir || ( (size / 10 ) || 50 );
            this.textOffset = textOffset || 0;
            this.colour = d3.scale.category20c();
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

                this.donut = d3.layout.pie().value(function (d) { return d.value; })
                    .startAngle(-1 * Math.PI)
                    .endAngle(0);

                this.arcGroup = this.vis.append("svg:g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                this.initAnimation = function (b) {
                    var i = d3.interpolate({startAngle: -1 * Math.PI, endAngle: -1 * Math.PI}, b);
                    return function (t) { return self.arc(i(t)); };
                };

                this.animatedWhenClick = function (arc, index) {};

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
                        .transition()
                            .ease("out")
                            .duration(500)
                            .attrTween("d", this.initAnimation);
            },

            buildLabels: function () {
                // Labels
                this.labelGroup = this.vis.append("svg:g")
                    .attr("class", "label-group")
                    .attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")");

                this.donut = d3.layout.pie().value(function (d) { return d.value; });

                var self = this;

                this.rectLabels = this.labelGroup.selectAll("rect").data(this.donut(this.data));
                this.rectLabels.enter()
                    .append("rect")
                        .attr("width", this.radio)
                        .attr("height", this.radio / 10)
                        .attr("x", 10)
                        .attr("y", function (d,i) { return ((-1 * self.radio) + (29 * i)); })
                        .attr("fill", function (d,i) { return self.colour(i); });

                this.valueLabels = this.labelGroup.selectAll("text.value").data(this.donut(this.data));
                this.valueLabels.enter()
                    .append("svg:text")
                        .attr("class", "value")
                        // .attr("transform", labelTransform)
                        .attr("dy", function (d, i) { return (-1 * self.radio) + (i * 29) + 15; })
                        .attr("dx", this.radio / 2)
                        .attr("fill", "white")
                        .attr("text-anchor", function (d) { return "middle";
                        }).text(function (d) {
                            var percentage = (d.value / self.getTotal()) * 100;
                            return percentage.toFixed(1) + "%  " + d.data.label;
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

                // this.buildCenter();
                this.buildArcs();
                this.buildLabels();
            }
        };

    _.extend(PieChart.prototype, behaviour);
    return PieChart;
});