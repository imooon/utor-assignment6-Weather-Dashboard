var cityInput = document.querySelector(".city-input");
var searchButton = document.querySelector(".search-btn");
var weatherCards = document.querySelector(".weather-cards");

var API_KEY = '874e8a9849c39dfdee0c5b7448686440';

var createWeatherCardHTML = (weatherItem) => {
    var formattedDate = new Date(weatherItem.dt_txt).toLocaleDateString();

    // Construct the URL for the weather icon
    var iconUrl = `http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png`;

    return `<li class="card">
                <h4>${formattedDate}</h4>
                <img src="${iconUrl}" alt="Weather Icon">
                <h4>Temp: ${weatherItem.main.temp}</h4>
                <h4>Humidity: ${weatherItem.main.humidity}</h4>
                <h4>Wind: ${weatherItem.wind.speed}</h4>
            </li>`;
}

var getWeatherDetails = (cityName, lat, lon) => {
    var OpenWeather_API_16Day = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(OpenWeather_API_16Day)
        .then(res => res.json())
        .then(data => {
            var filteredDays = [];

            // Filtering the forecast for one day
            var fiveDays = data.list.filter(forecast => {
                var forecastDate = new Date(forecast.dt_txt).getDate();
                if (!filteredDays.includes(forecastDate)) {
                    filteredDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            cityInput.value = "";
            weatherCards.innerHTML = "";

            console.log(fiveDays);
            fiveDays.forEach(weatherItem => {   
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCardHTML(weatherItem));
            });
        })
        .catch(error => {
            console.error('Error fetching weather details:', error);
            alert("Loading error!");
        });
}

var getCityCoordinates = () => {
    var cityName = cityInput.value.trim();
    if (!cityName) return;

    var OpenWeather_API = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(OpenWeather_API)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No results for ${cityName}`);
            var { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
            alert("Loading error!");
        });
}

searchButton.addEventListener("click", getCityCoordinates);
