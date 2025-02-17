document.addEventListener("DOMContentLoaded", function () {
    getWeather("Delhi");
    getCommonCitiesWeather();

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
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found! Please enter a valid city.");
            return;
        }

        const { latitude, longitude } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset,cloud_cover_mean&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const weatherDetails = {
            temp: weatherData.current_weather.temperature || "N/A",
            min_temp: weatherData.daily.temperature_2m_min[0] || "N/A",
            max_temp: weatherData.daily.temperature_2m_max[0] || "N/A",
            feels_like: weatherData.current_weather.temperature || "N/A",
            humidity: weatherData.current_weather.relative_humidity || "N/A",
            wind_speed: weatherData.current_weather.windspeed || "N/A",
            wind_degrees: weatherData.current_weather.winddirection || "N/A",
            sunrise: weatherData.daily.sunrise[0] || "N/A",
            sunset: weatherData.daily.sunset[0] || "N/A"
        };

        document.getElementById("temp").innerText = weatherDetails.temp + "°C";
        document.getElementById("temp2").innerText = weatherDetails.temp + "°C";
        document.getElementById("min_Temp").innerText = weatherDetails.min_temp + "°C";
        document.getElementById("max_Temp").innerText = weatherDetails.max_temp + "°C";
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

// **Common Cities Weather**
const commonCities = ["Mumbai", "Delhi", "New York", "London"];

async function getCommonCitiesWeather() {
    for (let city of commonCities) {
        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) continue;

            const { latitude, longitude } = geoData.results[0];

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset,cloud_cover_mean&timezone=auto`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const weatherDetails = {
                cloud_pct: weatherData.daily.cloud_cover_mean[0] || "N/A",
                feels_like: weatherData.current_weather.temperature || "N/A",
                humidity: weatherData.current_weather.relative_humidity || "N/A",
                max_temp: weatherData.daily.temperature_2m_max[0] || "N/A",
                min_temp: weatherData.daily.temperature_2m_min[0] || "N/A",
                sunrise: weatherData.daily.sunrise[0] || "N/A",
                sunset: weatherData.daily.sunset[0] || "N/A",
                temp: weatherData.current_weather.temperature || "N/A",
                wind_degrees: weatherData.current_weather.winddirection || "N/A",
                wind_speed: weatherData.current_weather.windspeed || "N/A"
            };

            updateTable(city, weatherDetails);

        } catch (error) {
            console.error(`Error fetching weather for ${city}:`, error);
        }
    }
}
function formatTime(datetime) {
    return datetime.split("T")[1]; // "2025-02-16T06:45:00" → "06:45:00"
}

function updateTable(city, weatherDetails) {
    const tableRows = document.querySelectorAll("tbody tr");
    tableRows.forEach((row) => {
        if (row.cells[0].innerText.trim() === city) {
            row.cells[1].innerText = weatherDetails.cloud_pct + "%";
            row.cells[2].innerText = weatherDetails.feels_like + "°C";
            row.cells[3].innerText = weatherDetails.humidity + "%";
            row.cells[4].innerText = weatherDetails.max_temp + "°C";
            row.cells[5].innerText = weatherDetails.min_temp + "°C";
            row.cells[6].innerText = formatTime(weatherDetails.sunrise); // Only time
            row.cells[7].innerText = formatTime(weatherDetails.sunset);  // Only time
            row.cells[8].innerText = weatherDetails.temp + "°C";
            row.cells[9].innerText = weatherDetails.wind_degrees + "°";
            row.cells[10].innerText = weatherDetails.wind_speed + " km/h";
        }
    });
}
const darkModeToggle = document.getElementById("darkModeToggle");

// Check if Dark Mode is saved in localStorage
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("dark-mode");

    // Save Dark Mode state in localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});
