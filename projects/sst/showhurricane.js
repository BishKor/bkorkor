/**
 * Created by BisharaKorkor on 8/6/15.
 */

function showhurricane() {

    var filename = document.getElementById("hurricaneselect").value;

    d3.csv("hurricanedata/" + filename, function (data) {

        data.forEach(function (d) {
            d.longitude = +d.longitude;
            d.latitude = +d.latitude;
        });

        document.getElementById('yearselect').value=data[0].date.split('-')[0];
        document.getElementById('monthselect').value=data[0].date.split('-')[1];
        document.getElementById('dayselect').value=data[0].date.split('-')[2];

        update(data[0].date,0, 120, 0, 200);

        var line = d3.svg.line()
            .x(function (d) {
                return (100 - d.longitude) * mapwidth / 50;
            })
            .y(function (d) {
                return (40 - d.latitude) * mapheight / 30;
            });

        var paths = d3.select('body').select("#map")
            .select('svg')
            .append('g')
            .attr("class", "hurricanepaths");

        paths.attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", "white");

        var spots = d3.select('body').select("#map")
            .select('svg')
            .append('g')
            .attr("class", "hurricanespots");

        spots.attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", "purple")
            .style("stroke-width", '3px');
    });
}

function clearhurricanes() {
    d3.select("body").select("#map")
        .select("svg")
        .selectAll(".hurricanepaths")
        .remove();

    d3.select("body").select("#map")
        .select("svg")
        .selectAll(".hurricanespots")
        .remove();
}