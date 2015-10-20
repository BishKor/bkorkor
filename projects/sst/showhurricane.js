/**
 * Created by BisharaKorkor on 8/6/15.
 */

function showhurricane() {

    var filename = document.getElementById("hurricaneselect").value;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Date:</strong> <span style='color:red'>" + d.date + "</span>" + "<br>" +
                "<strong>Time:</strong> <span style='color:red'>" + d.time + "</span>";
        });

    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
    };

    d3.csv("hurricanedata/" + filename, function (data) {

        data.forEach(function (d) {
            d.longitude = +d.longitude;
            d.latitude = +d.latitude;
            d.windspeed = +d.windspeed;
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

        var svg = d3.select('body').select("#map")
            .select('svg');

        svg.call(tip);

        var paths = svg.append('g')
            .attr("class", "hurricanepaths");

        paths.attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", "purple");

        var spots = d3.select('body').select("#map")
            .select('svg')
            .append('g')
            .attr("class", "hurricanespots");

        spots.attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) { return (100 - d.longitude) * mapwidth / 50; })
            .attr("cy", function(d) { return (40 - d.latitude) * mapheight / 30; })
            .attr("r", function(d) {return d.windspeed / 10;})
            .attr("fill", "white")
            .on("click", function(d) {
                update(d.date, 0, 120, 0, 200);
                })
            .on('mouseover',
                function(d){
                    tip.show(d);
                    var sel = d3.select(this);
                    sel.moveToFront();
            })
            .on('mouseout', tip.hide);
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