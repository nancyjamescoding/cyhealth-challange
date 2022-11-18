const fetchHistoricalData = async (country='usa', dataDate=null) => {
    const options = {
        headers: {
            'X-RapidAPI-Key': "571ae676c1mshaeed6da803ffe85p186b49jsn509a986b4c81",
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
          }
    }
    if (dataDate == null){
        td =  new Date()
        dataDate =`${td.getFullYear()}-${td.getMonth() + 1}-${td.getDate() - 2}`
        console.log('---', dataDate)
    }
    const requestUrl = `https://covid-193.p.rapidapi.com/history?country=${country}&day=${dataDate}`;

    return await fetch(requestUrl, options)
    .then(response => response.json())
	.then(response => response.response)
	.catch(() => {return []});
}
const fetchAndLoadGraph = async () => {
    // call api and get data

    const historicalData = await fetchHistoricalData()

    const cases = historicalData.filter((item, index) => {
        return new Date(item.time).getMinutes() == 0 // get top of the hour
    })
    .map((item, index) =>  {
        td = new Date(item.time)
        return {x: td.getHours(), y: item.cases.total}
    })
    .sort((a, b) => a.x - b.x)

      
    // tests = 


    const tests = historicalData.filter((item, index) => {
        return new Date(item.tests) // get top of the hour
    })
    .map((item, index) =>  {
        td = new Date(item.time)
        return { x: td.getHours(),y: item.tests.total}
    })
    .sort((a, b) => a.x - b.x)
 
    
    deaths = [
        { x: new Date(2016, 0, 1),  y: 19034.5 },
        { x: new Date(2016, 1, 1), y: 20015 },
        { x: new Date(2016, 2, 1), y: 27342 },
        { x: new Date(2016, 3, 1),  y: 20088 },
        { x: new Date(2016, 4, 1),  y: 20234 },
        { x: new Date(2016, 5, 1),  y: 29034 },
        { x: new Date(2016, 6, 1), y: 30487 },
        { x: new Date(2016, 7, 1), y: 32523 },
        { x: new Date(2016, 8, 1),  y: 20234 },
        { x: new Date(2016, 9, 1),  y: 27234 },
        { x: new Date(2016, 10, 1),  y: 33548 },
        { x: new Date(2016, 11, 1), y: 32534 }
    ]

    drawGraph(cases, tests, deaths)
}
const drawGraph = (cases, tests, deaths, ) => {
    var options = {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: "Cases, Deaths, Tests vs Hours"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Hours"
        },
        axisY: {
            title: "Cases, Deaths, Tests",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "spline",
            name: "Cases",
            showInLegend: true,
            xValueFormatString: "Hours",
            yValueFormatString: "Cases",
            dataPoints: cases
        },
        {
            type: "spline",
            name: "Tests",
            axisYType: "secondary",
            showInLegend: true,
            xValueFormatString: "Hours",
            yValueFormatString: "Tests",
            dataPoints: tests
        },
        {
            type: "spline",
            name: "Deaths",
            showInLegend: true,
            xValueFormatString: "Hours",
            yValueFormatString: "Deaths",
            dataPoints: deaths
        }]
    };
    $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}