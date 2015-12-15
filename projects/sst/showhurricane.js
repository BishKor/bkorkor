/**
 * Created by BisharaKorkor on 8/6/15.
 */

function showhurricane(frombutton) {

    var filename = document.getElementById("hurricaneselect").value;

    //var tip = d3.tip()
    //    .attr('class', 'd3-tip')
    //    .offset([-10, 0])
    //    .html(function(d) {
    //        return "<strong>Date:</strong> <span style='color:red'>" + d.date + "</span>" + "<br>" +
    //            "<strong>Time:</strong> <span style='color:red'>" + d.time + "</span>" + "<br>" +
    //            "<strong>Cat:</strong> <span style='color:red'>" + d.category + "</span>";
    //    });

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

        if (frombutton == true) {
            update(data[0].date, 0, 120, 0, 200);
        }

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
            .attr("class", "hurricanepath")
            .attr("begin", data[0].date)
            .attr("end", data[data.length-1].date);

        paths.attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", "purple");

        var spots = d3.select('body').select("#map")
            .select('svg')
            .append('g')
            .attr("class", "hurricanespot")
            .attr("begin", data[0].date)
            .attr("end", data[data.length-1].date);

        spots.attr("transform", "translate(" + mapmargin.left + "," + mapmargin.top + ")")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) { return (100 - d.longitude) * mapwidth / 50; })
            .attr("cy", function(d) { return (40 - d.latitude) * mapheight / 30; })
            .attr("r", function(d) {return d.windspeed / 10;})
            .attr("fill", "null")
            .attr("stroke", function(d) {return (determinecolor(d.date))})
            .on("click", function(d) {
                update(d.date, 0, 120, 0, 200);
                })
            .on('mouseover',
                function(d){
                    tip.show(d);
                    var sel = d3.select(this);
                    sel.moveToFront()
            })
            .on('mouseout', tip.hide);

        dispatch.on("update.hurricanes", function() {

            d3.select("body")
                .select("#map")
                .select("svg")
                .selectAll(".hurricanespot")
                .filter(function(){
                    return !(hurricaneactive(d3.select(this).attr("begin"), d3.select(this).attr("end")));})
                .remove();

            d3.select("body")
                .select("#map")
                .select("svg")
                .selectAll(".hurricanepath")
                .filter(function(){
                    return !(hurricaneactive(d3.select(this).attr("begin"), d3.select(this).attr("end")));})
                .remove();

            spots.data(data).selectAll("circle").style('stroke', function(d) {return (determinecolor(d.date))});
        });
    });
}

function determinecolor(date) {
    if (date == currentdate) {
        return "white";
    } else {
        return 'blue';
    }
}

function hurricaneactive(begin, end){
    y = +currentdate.split('-')[0];
    m = +currentdate.split('-')[1];
    d = +currentdate.split('-')[2];

    by = +begin.split('-')[0];
    bm = +begin.split('-')[1];
    bd = +begin.split('-')[2];

    ey = +end.split('-')[0];
    em = +end.split('-')[1];
    ed = +end.split('-')[2];

    numdays = y * 365 + daysfrommonths(m) + d;
    bnumdays = by * 365 + daysfrommonths(bm) + bd;
    enumdays = ey * 365 + daysfrommonths(em) + ed;

    if (bnumdays <= numdays && numdays <= enumdays) {
        return true;
    } else {
        return false;
    }
}

function daysfrommonths(month){
    sum = 0;
    for (m = 1; m<=month; m++){
        sum += daysinmonth[m];
    }
    return sum;
}

function clearhurricanes() {
    d3.select("body").select("#map")
        .select("svg")
        .selectAll(".hurricanepath")
        .remove();

    d3.select("body").select("#map")
        .select("svg")
        .selectAll(".hurricanespot")
        .remove();
}