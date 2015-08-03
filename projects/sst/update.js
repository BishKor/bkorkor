/**
 * Created by BisharaKorkor on 7/30/15.
 */

// UPDATE FUNCTION IS CALLED TO TRANSITION TO NEW STATES OF VISUALIZATIONS
function update(minlat, maxlat, minlon, maxlon) {

    var year = document.getElementById("yearselect").value;
    var month = document.getElementById("monthselect").value;
    var day = document.getElementById("dayselect").value;

    d3.text("sstdata/" + year + "-" + month + "-" + day + ".csv", function(text) {
        var data = d3.csv.parseRows(text).map(function (row) {
            return row.map(function (value) {
                return +value;
            });
        });

        var dataset = [];

        for (var i = minlat; i < maxlat; i++) {
            for (var j = minlon; j < maxlon; j++) {
                dataset.push(data[i][j]);
            }
        }

        hist = d3.layout.histogram()
            .bins(hx.ticks(50))
        (dataset);

        hy.domain([0, d3.max(hist, function (d) {return d.y;})]);

        barsvg.select(".y")
            .transition()
            .call(yAxis);

        barsvg.selectAll("rect")
            .data(hist)
            .transition()
            .attr("y", function (d) {return hy(d.y);})
            .attr("height", function (d) {return histheight - hy(d.y);});

        // VARIABLES FOR RESOLUTION OF THE HEAT MAP
        var dx = data[0].length;
        var dy = data.length;

        // INITIALIZE HEAT MAP
        d3.select("#imagediv")
            .selectAll("canvas")
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

    });
}