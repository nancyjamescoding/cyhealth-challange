const fetchHistoricalData = async (country='usa', dataDate=null) => {
    const options = {
        headers: {
            'X-RapidAPI-Key': "571ae676c1mshaeed6da803ffe85p186b49jsn509a986b4c81",
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
          }
    }
    if (dataDate == null){
        td =  new Date()
        dataDate =`${td.getFullYear()}-${td.getMonth() + 1}-${td.getDate() - 1}`
    }
    const requestUrl = `https://covid-193.p.rapidapi.com/history?country=${country}&day=${dataDate}`;

    return await fetch(requestUrl, options)
    .then(response => response.json())
	.then(response => response.response)
	.catch(() => {return []});
}
const displayCountry = async (event) => {
    event.preventDefault()
    const country = document.getElementById('history-country').value
    const dataDate = document.getElementById('history-date').value
    await fetchAndLoadGraph(country, dataDate)
    
    
}
const fetchAndLoadGraph = async (country, dataDate) => {
    // call api and get data

    const historicalData = await fetchHistoricalData(country, dataDate)

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

    const deaths = historicalData.filter((item, index) => {
        return new Date(item.tests) // get top of the hour
    })
    .map((item, index) =>  {
        td = new Date(item.time)
        return {x: td.getHours(),y: item.deaths.total}
    })
    .sort((a, b) => a.x - b.x)

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
            xValueFormatString: "#",
            yValueFormatString: "#",
            dataPoints: cases
        },
        {
            type: "spline",
            name: "Tests",
            axisYType: "secondary",
            showInLegend: true,
            xValueFormatString: "#",
            yValueFormatString: "#",
            dataPoints: tests
        },
        {
            type: "spline",
            name: "Deaths",
            showInLegend: true,
            xValueFormatString: "#",
            yValueFormatString: "#",
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

