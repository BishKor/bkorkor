/**
 * Created by BisharaKorkor on 7/16/15.
 */

function init() {

    var year = document.getElementById("yearselect").value;
    var month = document.getElementById("monthselect").value;
    var day = document.getElementById("dayselect").value;

    d3.text("sstdata/" + year + "-" + month + "-" + day +  ".csv", function (text) {
        var data = d3.csv.parseRows(text).map(function (row) {
            return row.map(function (value) {
                return +value;
            });
        });

        var dataset = [];

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                dataset.push(data[i][j]);
            }
        }

        //console.log(data);
        //console.log(dataset);

        hist = d3.layout.histogram()
            .bins(hx.ticks(50))
        (dataset);

        hy.domain([0, d3.max(hist, function (d) {
            return d.y;
        })]);

        barsvg.select(".y")
            .transition()
            .call(yAxis);

        barsvg.selectAll("rect")
            .data(hist)
            .transition()
            .attr("y", function (d) {
                return hy(d.y);
            })
            .attr("height", function (d) {
                return histheight - hy(d.y);
            });

        // VARIABLES FOR RESOLUTION OF THE HEAT MAP
        var dx = data[0].length;
        var dy = data.length;

        // INITIALIZE HEAT MAP
        d3.select("#imagediv")
            .append("canvas")
            .attr("width", dx + "px")
            .attr("height", dy + "px")
            .style("width", mapwidth + "px")
            .style("height", mapheight + "px")
            .call(drawImage);

        // Compute the pixel colors; scaled by CSS.
        function drawImage(canvas) {
            var context = canvas.node().getContext("2d");
            var image = context.createImageData(dx, dy);

            for (var y = 0, p = -1; y < dy; ++y) {
                for (var x = 0; x < dx; ++x) {
                    var c = d3.rgb(mapcolor(data[y][x]));
                    image.data[++p] = c.r;
                    image.data[++p] = c.g;
                    image.data[++p] = c.b;
                    image.data[++p] = 255;
                }
            }

            context.putImageData(image, 0, 0, 0, 0, dx, dy);
        }

        var mapsvg = d3.select("#map")
            .append("svg")
            .attr("width", mapwidth + mapmargin.left + mapmargin.right)
            .attr("height", mapheight + mapmargin.top + mapmargin.bottom)
            .append("g")
            .attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")");

        mx.domain([-100, -50]).range([0, mapwidth]);
        my.domain([10, 40]).range([mapheight, 0]);

        mapsvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + mapheight + ")")
            .call(mapxAxis)
            .call(removeZero);

        mapsvg.append("g")
            .attr("class", "y axis")
            .call(mapyAxis)
            .call(removeZero);

        function removeZero(axis) {
            axis.selectAll("g").filter(function (d) {return !d;}).remove();
        }

        //// DATAMAP INITIALIZATION
        //new Datamap({
        //    element: document.getElementById("mapdiv"),
        //    width: mapwidth + "px",
        //    height: mapheight + "px",
        //    scope: 'world',
        //    // Zoom in on East Atlantic and Caribbean
        //
        //    setProjection: function(element) {
        //        var projection = d3.geo.equirectangular()
        //            .center([-75, 25])
        //            .rotate([0, 0])
        //            .scale(1)
        //            .translate([0, 0]);
        //
        //        var path = d3.geo.path()
        //            .projection(projection);
        //
        //        var s = mapwidth * 1.15;
        //        var t = [mapwidth / 2, mapheight / 2];
        //
        //        projection
        //            .scale(s)
        //            .translate(t);
        //
        //        return {path: path, projection: projection};
        //    },
        //    fills: {
        //        defaultFill: "#000"
        //    }
        //});

        //mapsvg.selectAll("circle")
        //    .data([
        //        [mapwidth / 2, mapheight / 6, 0, 40, 80, 120],
        //        [7 * mapwidth / 10, mapheight / 6, 0, 40, 120, 160],
        //        [9 * mapwidth / 10, mapheight / 6, 0, 40, 160, 200],
        //        [mapwidth / 10, mapheight / 2, 40, 80, 0, 40],
        //        [3 * mapwidth / 10, mapheight / 2, 40, 80, 40, 80],
        //        [mapwidth / 2, mapheight / 2, 40, 80, 80, 120],
        //        [7 * mapwidth / 10, mapheight / 2, 40, 80, 120, 160],
        //        [9 * mapwidth / 10, mapheight / 2, 40, 80, 160, 200],
        //        [mapwidth / 2, 5 * mapheight / 6, 80, 120, 80, 120],
        //        [7 * mapwidth / 10, 5 * mapheight / 6, 80, 120, 120, 160],
        //        [9 * mapwidth / 10, 5 * mapheight / 6, 80, 120, 160, 200]
        //    ])
        //    .enter()
        //    .append("circle")
        //    .attr("class", "circle")
        //    .attr("cx", function(d) { return d[0]; })
        //    .attr("cy", function(d) { return d[1]; })
        //    .attr("r", 10)
        //    .attr("fill", "blue")
        //    .on("click", function(d) {
        //        currentregion.minlat=d[2];
        //        currentregion.maxlat=d[3];
        //        currentregion.minlon=d[4];
        //        currentregion.maxlon=d[5];
        //        updatefrombutton(d[2], d[3], d[4], d[5]);
        //    });

        mapsvg.append('g')
            .attr('class', 'regions')
            .selectAll('maprect')
            .data([
                [2 * mapwidth / 5, 0, 0, 40, 80, 120],
                [3 * mapwidth / 5, 0, 0, 40, 120, 160],
                [4 * mapwidth / 5, 0, 0, 40, 160, 200],
                [0, mapheight / 3, 40, 80, 0, 40],
                [mapwidth / 5, mapheight / 3, 40, 80, 40, 80],
                [2 * mapwidth / 5, mapheight / 3, 40, 80, 80, 120],
                [3 * mapwidth / 5, mapheight / 3, 40, 80, 120, 160],
                [4 * mapwidth / 5, mapheight / 3, 40, 80, 160, 200],
                [2 * mapwidth / 5, 2 * mapheight / 3, 80, 120, 80, 120],
                [3 * mapwidth / 5, 2 * mapheight / 3, 80, 120, 120, 160],
                [4 * mapwidth / 5, 2 * mapheight / 3, 80, 120, 160, 200]
            ])
            .enter()
            .append('rect')
            .attr('class', 'maprect')
            .attr('x', function(d) { return d[0]; })
            .attr('y', function(d) { return d[1]; })
            .attr('width', mapwidth/5 + "px")
            .attr('height', mapheight/3 + "px")
            //.attr('fill', 'none')
            //.attr('stroke-width', '3px')
            //.attr('stroke', 'none')
            .on("click", function(d) {
                currentregion.minlat=d[2];
                currentregion.maxlat=d[3];
                currentregion.minlon=d[4];
                currentregion.maxlon=d[5];
                updatefrombutton(d[2], d[3], d[4], d[5]);
            });
        // END MAP PREPARATION

        // HISTOGRAM PREPARATION
        hist = d3.layout.histogram()
            .bins(hx.ticks(50))
        (dataset);

        hy.domain([0, d3.max(hist, function(d) {return d.y;})]);

        var bars = barsvg.selectAll(".bar").append("g")
            .data(hist);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {return hx(d.x);})
            .attr("y", function(d) {return hy(d.y);})
            .attr("fill", function(d) {return d3.rgb(mapcolor(d.x));})
            .attr("height", function (d) {return histheight - hy(d.y);})
            .attr("width", hx(hist[0].dx) - 1);

        barsvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + histheight + ")")
            .call(xAxis)
            .append("text")
            .attr("dx", ".71em")
            .attr("x", histwidth - 10)
            .attr("dy", "2.71em")
            .style("text-anchor", "end")
            .text("Temperature C");

        barsvg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Profile");
        // END HISTOGRAM PREPARATION
    });

}