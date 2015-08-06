/**
 * Created by BisharaKorkor on 7/27/15.
 */

function pushdatatomultiplot(data, region) {

    var incomingmax = d3.max(data, function (d) {return d.y;})

    mpymax = d3.max([incomingmax, mpymax])

    mpy.domain([0, mpymax]);

    var mpsvg = d3.select("body").select("#multiplot").select("svg")

    mpsvg.select(".y")
        .transition()
        .call(mpyAxis);

    var colors = ["#FF0000", "#0000FF", "#00FF00", "#CCCC00","#FF00FF", "#6600CC"]

    var line = d3.svg.line()
        .x(function(d) { return mpx(d.x); })
        .y(function(d) { return mpy(d.y); });

    mpsvg.selectAll(".line")
        .transition()
        .attr("d", line);

    var distribution = d3.select("body").select("#multiplot")
        .select("svg")
        .append("g")
        .attr("class", "distribution");

    distribution.attr("transform", "translate(" + mpmargin.left + "," + mpmargin.top + ")")
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", colors[numplots]);

    var spacingbetweenlabels = 20 + numplots * 15;

    var year = document.getElementById("yearselect").value;
    var month = document.getElementById("monthselect").value;
    var day = document.getElementById("dayselect").value;

    distribution.append("text")
        .attr("transform", "translate(" + 20 + "," + spacingbetweenlabels + ")")
        .attr("x", 3)
        .attr("dy", ".35em")
        .attr("fill", colors[numplots])
        .text(year + "-" + month + "-" + day + " lat: (" + region.minlat + ", " + region.maxlat
                + ") lon: (" + region.minlon + ", " + region.maxlon + ")");

    numplots++;
}

function clearmultiplot() {
    d3.select("body").select("#multiplot")
        .select("svg")
        .selectAll(".distribution")
        .remove();

    numplots = 0;

    mpymax = 100;
    mpy.domain([0, mpymax]);

    d3.select("body")
        .select("#multiplot")
        .select("svg")
        .select(".y")
        .transition()
        .call(mpyAxis);
}