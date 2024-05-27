function getWeather() {
    const apiKey = '8a284cdeab1fbfc8fec63de3156c8c95';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Nie podano miasta!');
        return;
    }
  
    let lat = 0;
    let lon = 0;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pl`;    
    console.log(currentWeatherUrl);
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            lat = data.coord.lat;
            lon = data.coord.lon;
            displayWeather(data);

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
            return fetch(forecastUrl);
        })
        .then(response => response.json())
        .then(data => {
            displayDailyForecast(data.list);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const dailyForecastDiv = document.getElementById('daily-weather');

    weatherInfoDiv.innerHTML = '';
    dailyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description.toString().charAt(0).toUpperCase() + data.weather[0].description.toString().slice(1);
        const iconCode = data.weather[0].icon;

        //const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const iconUrl = "../icons/" + iconCode + ".svg";

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayDailyForecast(dailyData) {
    const dailyForecastDiv = document.getElementById('daily-weather');

    const filteredData = dailyData.filter((item, index) => index % 7 === 0);

    filteredData.slice(1, 6).forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;

        //const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const iconUrl = "../icons/" + iconCode + ".svg";

        const dailyItemHtml = `
            <div class="daily-item">
                <span>${day}.${month}</span>
                <img src="${iconUrl}">
                <span>${temperature}°C</span>
            </div>
        `;

        dailyForecastDiv.innerHTML += dailyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}