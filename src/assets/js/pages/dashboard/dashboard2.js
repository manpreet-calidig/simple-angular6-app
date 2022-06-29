'use strict';
$(function () {
    initCardChart();
    chart2();
    initWorldMap();

    $('.chart.chart-bar1').sparkline(undefined, {
        type: 'bar',
        barColor: '#6d7fe2',
        negBarColor: '#000',
        barWidth: '5px',
        height: '50px'
    });
    $('.chart.chart-bar2').sparkline(undefined, {
        type: 'bar',
        barColor: '#42E795',
        negBarColor: '#000',
        barWidth: '5px',
        height: '50px'
    });

});
function initCardChart() {


    //Chart Bar
    $('.chart.chart-bar').sparkline([6, 4, 8, 6, 8, 10, 5, 6, 7, 9, 5, 6, 4, 8, 6, 8, 10, 5, 6, 7, 9, 5], {
        type: 'bar',
        barColor: '#FF9800',
        negBarColor: '#fff',
        barWidth: '4px',
        height: '45px'
    });


    //Chart Pie
    $('.chart.chart-pie').sparkline([30, 35, 25, 8], {
        type: 'pie',
        height: '45px',
        sliceColors: ['#65BAF2', '#F39517', '#F44586', '#6ADF42']
    });


    //Chart Line
    $('.chart.chart-line').sparkline([9, 4, 6, 5, 6, 4, 7, 3], {
        type: 'line',
        width: '60px',
        height: '45px',
        lineColor: '#65BAF2',
        lineWidth: 2,
        fillColor: 'rgba(0,0,0,0)',
        spotColor: '#F39517',
        maxSpotColor: '#F39517',
        minSpotColor: '#F39517',
        spotRadius: 3,
        highlightSpotColor: '#F44586'
    });

    // live chart
    var mrefreshinterval = 500; // update display every 500ms
    var lastmousex = -1;
    var lastmousey = -1;
    var lastmousetime;
    var mousetravel = 0;
    var mpoints = [];
    var mpoints_max = 30;
    $('html').on("mousemove", function (e) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        if (lastmousex > -1) {
            mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
        }
        lastmousex = mousex;
        lastmousey = mousey;
    });
    var mdraw = function () {
        var md = new Date();
        var timenow = md.getTime();
        if (lastmousetime && lastmousetime != timenow) {
            var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
            mpoints.push(pps);
            if (mpoints.length > mpoints_max)
                mpoints.splice(0, 1);
            mousetravel = 0;
            $('#liveChart').sparkline(mpoints, {
                width: mpoints.length * 2,
                height: '45px',
                tooltipSuffix: ' pixels per second'
            });
        }
        lastmousetime = timenow;
        setTimeout(mdraw, mrefreshinterval);
    };
    // We could use setInterval instead, but I prefer to do it this way
    setTimeout(mdraw, mrefreshinterval);
}
function chart2() {


    var options = {
        chart: {
            height: 350,
            type: 'line',
            shadow: {
                enabled: false,
                color: '#bbb',
                top: 3,
                left: 2,
                blur: 3,
                opacity: 1
            },
        },
        stroke: {
            width: 7,
            curve: 'smooth'
        },
        series: [{
            name: 'High',
            data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
        },
        {
            name: "Low",
            data: [19, 5, 13, 9, 17, 2, 7, 5, 4, 3, 10, 9, 29, 19, 22, 9, 12, 7]
        }
        ],
        xaxis: {
            type: 'datetime',
            categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
            labels: {
                style: {
                    colors: '#9aa0ac',
                }
            }
        },
        title: {
            text: 'Revenue',
            align: 'left',
            style: {
                fontSize: "16px",
                color: '#9aa0ac'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                gradientToColors: ['#FDD835'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100]
            },
        },
        markers: {
            size: 4,
            opacity: 0.9,
            colors: ["#FFA41B"],
            strokeColor: "#fff",
            strokeWidth: 2,

            hover: {
                size: 7,
            }
        },
        yaxis: {
            min: -10,
            max: 40,
            title: {
                text: 'Profit',
                style: {
                	color: '#9aa0ac'
            	}
            },
            labels: {
                style: {
                    color: '#9aa0ac',
                }
            }
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#chart2"),
        options
    );

    chart.render();

}

function initWorldMap() {
    var bubble_map = new Datamap({
        scope: "world",
        element: document.getElementById("world-map-bubble"),
        responsive: !0,
        geographyConfig: {
            popupOnHover: !1,
            highlightOnHover: !1,
            borderColor: "transparent",
            borderWidth: 1,
            highlightBorderWidth: 3,
            highlightFillColor: "rgba(216,216,222,0.5)",
            highlightBorderColor: "transparent",
            borderWidth: 1
        },
        fills: {
            defaultFill: "#E9EAEB",
            blue: "#00A2FF",
            green: "#08ea6c",
            orange: "#FF9800",
            cyan: "#07eaec"
        },
        bubblesConfig: {
            popupTemplate: function (geo, data) {
                return '<div class="datamap-hoverinfo">' + data.hosname + ' Hospital in ' + data.country
            },
            borderWidth: 1,
            highlightBorderWidth: 3,
            highlightFillColor: "rgba(0,123,255,0.5)",
            highlightBorderColor: "transparent",
            fillOpacity: .75
        },
    });

    bubble_map.bubbles([
        {
            centered: "USA",
            fillKey: "green",
            radius: 5,
            hosname: "HCG",
            country: "United States"
        },
        {
            centered: "SAU",
            fillKey: "orange",
            radius: 5,
            hosname: "Sanidhya",
            country: "Saudia Arabia"
        },
        {
            centered: "RUS",
            fillKey: "blue",
            radius: 5,
            hosname: "Red Heart",
            country: "Russia"
        },
        {
            centered: "CAN",
            fillKey: "orange",
            radius: 5,
            hosname: "Apolo",
            country: "Canada"
        },
        {
            centered: "IND",
            fillKey: "cyan",
            radius: 5,
            hosname: "Sanjivani",
            country: "India"
        },
        {
            centered: "AUS",
            fillKey: "green",
            radius: 5,
            hosname: "Sigma",
            country: "Australia"
        },
        {
            centered: "FRA",
            fillKey: "blue",
            radius: 5,
            hosname: "Royal",
            country: "France"
        },
        {
            centered: "BRA",
            fillKey: "orange",
            radius: 5,
            hosname: "Joy",
            country: "Brazil"
        }
    ]),
        window.addEventListener("resize", function (e) {
            bubble_map.resize()
        });
}