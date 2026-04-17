const API_KEY = "775b68961d4f066957661770bfa18d40";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const AIR_BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const locationBtn = document.getElementById("locationBtn");
const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const ozone = document.getElementById("ozone");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function setLoading(isLoading) {
  weatherCard.classList.toggle("loading", isLoading);
}

function formatTemperature(value) {
  return `${Math.round(value)}°`;
}

function formatWeatherDescription(desc) {
  if (!desc) return "날씨 정보 없음";
  return desc.charAt(0).toUpperCase() + desc.slice(1);
}

function updateWeatherUI(weatherData, airData) {
  const cityLabel = `${weatherData.name}${weatherData.sys?.country ? `, ${weatherData.sys.country}` : ""}`;
  const ozoneValue = airData?.list?.[0]?.components?.o3;

  cityName.textContent = cityLabel;
  weatherDesc.textContent = formatWeatherDescription(
    weatherData.weather?.[0]?.description || "",
  );
  temperature.textContent = formatTemperature(weatherData.main.temp);
  windSpeed.textContent = Number(weatherData.wind.speed).toFixed(2);
  humidity.textContent = Math.round(weatherData.main.humidity);
  feelsLike.textContent = Math.round(weatherData.main.feels_like);
  ozone.textContent = ozoneValue ? Math.round(ozoneValue) : "-";
}

async function fetchAirPollution(lat, lon) {
  const response = await fetch(
    `${AIR_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("대기 정보를 불러오지 못했습니다.");
  }

  return response.json();
}

async function fetchWeatherByCity(city) {
  const response = await fetch(
    `${WEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("도시를 찾을 수 없습니다. 영문 도시명을 확인해 주세요.");
    }
    throw new Error("날씨 정보를 불러오지 못했습니다.");
  }

  return response.json();
}

async function fetchWeatherByCoords(lat, lon) {
  const response = await fetch(
    `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`,
  );

  if (!response.ok) {
    throw new Error("현재 위치 날씨를 불러오지 못했습니다.");
  }

  return response.json();
}

async function handleCitySearch(city) {
  if (!city.trim()) {
    setMessage("도시명을 입력해 주세요.", true);
    cityInput.focus();
    return;
  }

  setLoading(true);
  setMessage("날씨 정보를 불러오는 중입니다...");

  try {
    const weatherData = await fetchWeatherByCity(city.trim());
    const airData = await fetchAirPollution(
      weatherData.coord.lat,
      weatherData.coord.lon,
    );
    updateWeatherUI(weatherData, airData);
    setMessage("최신 날씨 정보를 불러왔습니다.");
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    setLoading(false);
  }
}

async function handleCurrentLocation(lat, lon) {
  setLoading(true);
  setMessage("현재 위치 날씨를 불러오는 중입니다...");

  try {
    const weatherData = await fetchWeatherByCoords(lat, lon);
    const airData = await fetchAirPollution(lat, lon);
    updateWeatherUI(weatherData, airData);
    setMessage("현재 위치 기준 날씨 정보를 불러왔습니다.");
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  handleCitySearch(cityInput.value);
});

cityInput.addEventListener("focus", function () {
  cityInput.value = "";
});

locationBtn.addEventListener("click", function () {
  if (!navigator.geolocation) {
    setMessage("이 브라우저에서는 위치 기능을 지원하지 않습니다.", true);
    return;
  }

  setMessage("위치 정보를 확인하는 중입니다...");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      handleCurrentLocation(latitude, longitude);
    },
    function () {
      setMessage(
        "위치 권한이 거부되었거나 현재 위치를 가져올 수 없습니다.",
        true,
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
});

window.addEventListener("load", function () {
  handleCitySearch("Seoul");
});
