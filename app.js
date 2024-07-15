document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "eu13zDBy7D9EKEZCRj2gSQtQFePIQeAK"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayHourlyForecast(data) {
        let hourlyForecastContent = '<h2>Hourly Forecast</h2>';
        data.forEach(forecast => {
            const dateTime = new Date(forecast.DateTime);
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;
            hourlyForecastContent += `
                <p>${dateTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}: ${temperature}°C, ${weather}</p>
            `;
        });
        weatherDiv.innerHTML += hourlyForecastContent;
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No daily forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayDailyForecast(dailyForecasts) {
        let dailyForecastContent = '<h2>Daily Forecast</h2>';
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const dayOfWeek = getDayOfWeek(date.getDay());
            const minTemperature = forecast.Temperature.Minimum.Value;
            const maxTemperature = forecast.Temperature.Maximum.Value;
            const dayWeather = forecast.Day.IconPhrase;
            const nightWeather = forecast.Night.IconPhrase;
            dailyForecastContent += `
                <div class="forecast">
                    <h3>${dayOfWeek}</h3>
                    <ul>
                        <li><span>Min:</span> ${minTemperature}°C</li>
                        <li><span>Max:</span> ${maxTemperature}°C</li>
                        <li><span>Day:</span> ${dayWeather}</li>
                        <li><span>Night:</span> ${nightWeather}</li>
                    </ul>
                </div>
            `;
        });
        weatherDiv.innerHTML += dailyForecastContent;
    }

    function getDayOfWeek(day) {
        const daysOfWeek = ["sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[day];
    }
});
