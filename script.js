document.getElementById('searchButton').addEventListener('click', getWeather);
document.getElementById('localization').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

function getWeather() {
    const apiKey = '8a284cdeab1fbfc8fec63de3156c8c95';
    const localization = document.getElementById('localization').value;

    if (!localization) {
        alert('Nie podano lokalizacji!');
        return;
    }
  
    let lat = 0;
    let lon = 0;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${localization}&appid=${apiKey}&lang=pl`;    
    console.log(currentWeatherUrl);

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(currentWeatherData => {
            lat = currentWeatherData.coord.lat;
            lon = currentWeatherData.coord.lon;
            displayWeather(currentWeatherData);

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            console.log(forecastUrl);

            return fetch(forecastUrl);
        })
        .then(response => response.json())
        .then(dailyWeatherData => {
            displayDailyForecast(dailyWeatherData.list);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Błąd API! Spróbuj ponownie później.');
        });
}

function displayWeather(currentWeatherData) {
    const temperatureInfoDiv = document.getElementById('temperatureInfo');
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const weatherIcon = document.getElementById('weatherIcon');
    const dailyForecastDiv = document.getElementById('dailyWeather');

    weatherInfoDiv.innerHTML = '';
    dailyForecastDiv.innerHTML = '';
    temperatureInfoDiv.innerHTML = '';

    if (currentWeatherData.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${currentWeatherData.message}</p>`;
    } else {
        const temperature = Math.round(currentWeatherData.main.temp - 273.15);
        const description = currentWeatherData.weather[0].description.toString().charAt(0).toUpperCase() + currentWeatherData.weather[0].description.toString().slice(1);
        const iconCode = currentWeatherData.weather[0].icon;

        const iconUrl = "../icons/" + iconCode + ".svg";

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${description}</p>
        `;

        temperatureInfoDiv.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();

        const weatherContainer = document.getElementById('weatherContainer');

        if (iconCode.includes('n')) {
            weatherContainer.style.background = 'rgb(25,19,19)';
            weatherContainer.style.background = 'radial-gradient(circle, rgba(25,19,19,1) 0%, rgba(6,6,157,1) 100%)';
        } else {
            weatherContainer.style.background = 'rgb(174,237,238)';
            weatherContainer.style.background = 'radial-gradient(circle, rgba(174,237,238,1) 0%, rgba(149,148,233,1) 100%)';
        }
    }
}

function displayDailyForecast(dailyWeatherData) {
    const dailyForecastDiv = document.getElementById('dailyWeather');

    const filteredData = dailyWeatherData.filter((item, index) => index % 8 === 0);

    filteredData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;

        const iconUrl = "../icons/" + iconCode + ".svg";
        
        const dailyItemHtml = `
            <div class="dailyItem">
                <span>${day}.${month}</span>
                <img src="${iconUrl}">
                <span>${temperature}°C</span>
            </div>
        `;

        dailyForecastDiv.innerHTML += dailyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.style.display = 'block';
}