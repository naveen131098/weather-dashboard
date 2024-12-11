const API_KEY = 'b360a06be84247038e852603241112'
  let isCelsius = true;
  const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
  
  const cityInput = document.getElementById('cityInput');
  const searchButton = document.getElementById('searchButton');
  const unitToggle = document.getElementById('unitToggle');
  const weatherCard = document.getElementById('weatherCard');
  const cityName = document.getElementById('cityName');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('windSpeed');
  const condition = document.getElementById('condition');
  const weatherIcon = document.getElementById('weatherIcon');
  const saveButton = document.getElementById('saveButton');
  const savedCitiesList = document.getElementById('savedCitiesList');
  
  function displayWeather(data) {
    cityName.textContent = data.location.name;
    temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;
    condition.textContent = `Condition: ${data.current.condition.text}`;
    weatherIcon.src = data.current.condition.icon;
    weatherCard.style.display = 'block';
  }
  
  function fetchWeather(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then(data => {
        displayWeather(data);
      })
      .catch(error => {
        alert(error.message);
      });
  }
  
  function saveCity(city) {
    if (!savedCities.includes(city)) {
      savedCities.push(city);
      localStorage.setItem('savedCities', JSON.stringify(savedCities));
      updateSavedCities();
    }
  }
  
  function updateSavedCities() {
    savedCitiesList.innerHTML = '';
    savedCities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.addEventListener('click', () => fetchWeather(city));
      savedCitiesList.appendChild(li);
    });
  }
  
  searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  });
  
  saveButton.addEventListener('click', () => {
    const city = cityName.textContent;
    saveCity(city);
  });
  
  unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
  
    const temp = parseFloat(temperature.textContent.match(/[-+]?[0-9]*\.?[0-9]+/)[0]);
    if (isCelsius) {
      temperature.textContent = `Temperature: ${(temp - 32) * (5 / 9).toFixed(1)}°C`;
    } else {
      temperature.textContent = `Temperature: ${(temp * (9 / 5) + 32).toFixed(1)}°F`;
    }
  });
  
  updateSavedCities();
  
  
  