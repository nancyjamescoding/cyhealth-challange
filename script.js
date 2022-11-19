const fetchCovidStats = async (country) => {
    const options = {
        headers: {
            'X-RapidAPI-Key': "571ae676c1mshaeed6da803ffe85p186b49jsn509a986b4c81",
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
          }
    }
    const requestUrl = country == null ? 
    `https://covid-193.p.rapidapi.com/statistics` : 
    `https://covid-193.p.rapidapi.com/statistics?country=${country}`;

    console.log(requestUrl)
    return await fetch(requestUrl, options)
    .then(response => response.json())
	.then(response => response.response)
	.catch(() => []);
}

const displayStats = async (country=null) => {
    const results = await fetchCovidStats(country)
    if (results.length == 0) {
        alert(`Could not get the results of country - ${country}`)
    }
    
    let covidResultsTable = document.getElementById('covid-results-table').getElementsByTagName('tbody')[0]
    let tableContent = ""
    results.forEach((item, index) => {
        tableContent += `
        <tr>
            <td>${item.country}</td>
            <td>${item.deaths.total}</td>
            <td>${item.tests.total}</td>
            <td>${item.cases.total}</td>
            <td>${item.population}</td>
            <td>${item.day}</td>
        </tr>`
    });
    covidResultsTable.innerHTML = tableContent
}

const searchByCountry = async (event) => {
    event.preventDefault()
    if (event.keyCode === 13) {
        country = document.getElementById('country-search').value
        console.log(country)
        await displayStats(country)
    }
    
}