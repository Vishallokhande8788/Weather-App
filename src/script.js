document.addEventListener("DOMContentLoaded", function () {
    // Load default weather for Delhi
    getWeather("Delhi");

    // Add event listener to the search button
    document.getElementById("submit").addEventListener("click", function (e) {
        e.preventDefault();
        const city = document.getElementById("city").value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert("Please enter a city name!");
        }
    });
});

async function getWeather(city) {
    document.getElementById("cityName").innerText = city;

    try {
        // Fetch latitude & longitude of the city
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found! Please enter a valid city.");
            return;
        }

        const { latitude, longitude } = geoData.results[0];

        // Fetch weather data using latitude & longitude
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset,cloud_cover_mean&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Extract weather details
        const weatherDetails = {
            // cloud_pct: weatherData.daily.cloud_cover_mean ? weatherData.daily.cloud_cover_mean[0] : "N/A",
            feels_like: weatherData.current_weather.temperature || "N/A",
            humidity: weatherData.current_weather.relative_humidity || "N/A",
            max_temp: weatherData.daily.temperature_2m_max ? weatherData.daily.temperature_2m_max[0] : "N/A",
            min_temp: weatherData.daily.temperature_2m_min ? weatherData.daily.temperature_2m_min[0] : "N/A",
            sunrise: weatherData.daily.sunrise ? weatherData.daily.sunrise[0] : "N/A",
            sunset: weatherData.daily.sunset ? weatherData.daily.sunset[0] : "N/A",
            temp: weatherData.current_weather.temperature || "N/A",
            wind_degrees: weatherData.current_weather.winddirection || "N/A",
            wind_speed: weatherData.current_weather.windspeed || "N/A"
        };

        // Update HTML with weather data
        document.getElementById("temp").innerText = weatherDetails.temp + "°C";
        document.getElementById("temp2").innerText = weatherDetails.temp + "°C";

        document.getElementById("min_Temp").innerText = weatherDetails.min_temp + "°C";
        document.getElementById("max_Temp").innerText = weatherDetails.max_temp + "°C";
        // document.getElementById("cloud_pct").innerText = weatherDetails.cloud_pct + "%";
        document.getElementById("feels_like").innerText = weatherDetails.feels_like + "°C";
        document.getElementById("humidity").innerText = weatherDetails.humidity + "%";
        document.getElementById("wind_degrees").innerText = weatherDetails.wind_degrees + "°";
        document.getElementById("wind_degrees2").innerText = weatherDetails.wind_degrees + "°";

        document.getElementById("wind_speed").innerText = weatherDetails.wind_speed + " km/h";
        document.getElementById("wind_speed2").innerText = weatherDetails.wind_speed + " km/h";

        document.getElementById("Sunrise").innerText = weatherDetails.sunrise;
        document.getElementById("Sunset").innerText = weatherDetails.sunset;
    
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching the weather. Please try again.");
    }
}
