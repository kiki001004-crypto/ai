const searchPanel = document.getElementById("searchPanel");
const openSearchBtn = document.getElementById("openSearchBtn");
const locationWeatherBtn = document.getElementById("locationWeatherBtn");
const locationWeatherText = document.getElementById("locationWeatherText");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const homeNavBtn = document.getElementById("homeNavBtn");
const courseNavBtn = document.getElementById("courseNavBtn");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const courseList = document.getElementById("courseList");
const guideTrack = document.getElementById("guideTrack");

const weatherTitle = document.getElementById("weatherTitle");
const tempValue = document.getElementById("tempValue");
const courseNo = document.getElementById("courseNo");
const distanceValue = document.getElementById("distanceValue");
const routeName = document.getElementById("routeName");
const routeDesc = document.getElementById("routeDesc");
const routeExtra = document.getElementById("routeExtra");
const dataBadge = document.getElementById("dataBadge");
const weatherIcon = document.getElementById("weatherIcon");

const courseDB = [
  {
    key: "제주-1",
    area: "제주",
    weather: { title: "맑음", temp: 20 },
    courseNo: 1,
    distance: 15,
    routeName: "제주 환상 자전거길 · 용두암 ~ 애월",
    routeDesc:
      "제주 시내 접근성이 좋고 해안 절경을 따라 달릴 수 있는 대표 코스입니다.",
    routeExtra: "추천 시간: 오전 8시 ~ 11시 · 난이도: 보통 · 보급 포인트: 3곳",
    nx: 52,
    ny: 38,
  },
  {
    key: "애월-1",
    area: "애월",
    weather: { title: "맑음", temp: 18 },
    courseNo: 2,
    distance: 21,
    routeName: "애월 해안도로 코스",
    routeDesc:
      "바다를 가장 가까이 느낄 수 있는 구간입니다. 측풍이 강한 날은 주행 난도가 올라갑니다.",
    routeExtra: "추천 시간: 오전 9시 이전 · 난이도: 보통 · 카페/편의점 밀집",
    nx: 48,
    ny: 38,
  },
  {
    key: "애월-2",
    area: "애월",
    weather: { title: "맑음", temp: 19 },
    courseNo: 3,
    distance: 12,
    routeName: "애월 한담해변 연계 코스",
    routeDesc:
      "카페거리와 해변 산책로를 함께 즐길 수 있어 가벼운 라이딩에 잘 맞습니다.",
    routeExtra: "추천 시간: 오전 10시 이전 · 난이도: 쉬움 · 포토스팟 다수",
    nx: 48,
    ny: 38,
  },
  {
    key: "성산-1",
    area: "성산",
    weather: { title: "구름 많음", temp: 17 },
    courseNo: 7,
    distance: 18,
    routeName: "성산일출봉 연계 코스",
    routeDesc: "일출 감상과 라이딩을 함께 즐기기 좋은 동쪽 코스입니다.",
    routeExtra: "추천 시간: 일출 전후 · 난이도: 쉬움 · 관광지 혼잡 주의",
    nx: 60,
    ny: 38,
  },
  {
    key: "서귀포-1",
    area: "서귀포",
    weather: { title: "맑음", temp: 22 },
    courseNo: 9,
    distance: 24,
    routeName: "서귀포 해안 순환 코스",
    routeDesc: "남쪽 해안 특유의 온화한 분위기와 포토스팟이 많은 코스입니다.",
    routeExtra: "추천 시간: 오후 4시 이후 · 난이도: 보통 · 오르막 일부 포함",
    nx: 52,
    ny: 33,
  },
  {
    key: "한림-1",
    area: "한림",
    weather: { title: "흐림", temp: 19 },
    courseNo: 3,
    distance: 16,
    routeName: "한림 협재 해변 코스",
    routeDesc:
      "협재 바다와 금능 해변을 잇는 인기 코스입니다. 관광객이 많아 저속 주행이 필요합니다.",
    routeExtra: "추천 시간: 오전 7시 ~ 10시 · 난이도: 쉬움 · 해변 접근 우수",
    nx: 46,
    ny: 35,
  },
  {
    key: "표선-1",
    area: "표선",
    weather: { title: "맑음", temp: 21 },
    courseNo: 8,
    distance: 19,
    routeName: "표선 해비치 연계 코스",
    routeDesc: "비교적 한적한 분위기로 여유 있게 달리기 좋은 구간입니다.",
    routeExtra: "추천 시간: 오전/해질녘 · 난이도: 쉬움 · 가족 라이딩 추천",
    nx: 58,
    ny: 33,
  },
];

function buildInfiniteSlider() {
  guideTrack.innerHTML += guideTrack.innerHTML;
}

function setActiveNav(target) {
  document
    .querySelectorAll(".bottom-nav .nav-item")
    .forEach((item) => item.classList.remove("active"));
  target.classList.add("active");
}

function openSearch() {
  searchPanel.classList.add("active");
  searchPanel.setAttribute("aria-hidden", "false");
  setActiveNav(courseNavBtn);
  setTimeout(() => searchInput.focus(), 120);
}

function closeSearch(activeTab = "home") {
  searchPanel.classList.remove("active");
  searchPanel.setAttribute("aria-hidden", "true");
  setActiveNav(activeTab === "course" ? courseNavBtn : homeNavBtn);
}

function clearSearchInput() {
  searchInput.value = "";
}

openSearchBtn.addEventListener("click", openSearch);
locationWeatherBtn.addEventListener("click", applyCurrentLocationWeather);
courseNavBtn.addEventListener("click", openSearch);
homeNavBtn.addEventListener("click", () => setActiveNav(homeNavBtn));
closeSearchBtn.addEventListener("click", () => closeSearch());

searchInput.addEventListener("focus", clearSearchInput);
searchInput.addEventListener("click", clearSearchInput);

searchPanel.addEventListener("click", (e) => {
  if (e.target === searchPanel) closeSearch();
});

document.querySelectorAll(".quick-tags button").forEach((btn) => {
  btn.addEventListener("click", () => {
    searchInput.value = btn.dataset.keyword;
    searchCourses(btn.dataset.keyword);
  });
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchCourses(searchInput.value.trim());
});

function normalizeKeyword(keyword) {
  return keyword.replace(/\s+/g, "").trim();
}

function searchCourses(rawKeyword) {
  const keyword = normalizeKeyword(rawKeyword);

  if (!keyword) {
    alert("지역 또는 코스를 입력해주세요.");
    searchInput.focus();
    return;
  }

  const results = courseDB.filter((item) => {
    const source = `${item.area}${item.routeName}${item.routeDesc}`.replace(
      /\s+/g,
      "",
    );
    return source.includes(keyword);
  });

  renderCourseList(results);
}

function renderCourseList(results) {
  if (!results.length) {
    courseList.innerHTML = `<div class="course-item"><strong>검색 결과가 없습니다</strong><p>다른 지역명으로 검색해주세요. 예: 제주, 애월, 성산, 서귀포</p></div>`;
    return;
  }

  courseList.innerHTML = results
    .map(
      (item, index) => `
    <button class="course-item ${index === 0 ? "active" : ""}" type="button" data-key="${item.key}">
      <strong>${item.routeName}</strong>
      <p>${item.routeDesc}</p>
      <span class="meta">${item.area} · ${item.distance}km · 코스 ${item.courseNo}/10</span>
    </button>
  `,
    )
    .join("");

  courseList.querySelectorAll(".course-item").forEach((button) => {
    button.addEventListener("click", async () => {
      courseList
        .querySelectorAll(".course-item")
        .forEach((el) => el.classList.remove("active"));
      button.classList.add("active");
      const selected = courseDB.find((item) => item.key === button.dataset.key);
      if (selected) {
        await applyCourseData(selected);
        closeSearch("course");
      }
    });
  });

  applyCourseData(results[0]);
}

function formatSkyText(value, pty = 0) {
  if (pty === 1 || pty === 2 || pty === 4) return "비";
  if (pty === 3) return "눈";

  const skyMap = {
    1: "맑음",
    3: "구름 많음",
    4: "흐림",
  };

  return skyMap[value] || "날씨 정보";
}

function getWeatherIconType(title) {
  if (title.includes("눈")) return "snow";
  if (title.includes("비")) return "rain";
  if (title.includes("흐림")) return "cloudy";
  if (title.includes("구름")) return "partly";
  return "clear";
}

function updateWeatherIcon(title) {
  weatherIcon.className = `weather-icon ${getWeatherIconType(title)}`;
}

function buildPublicWeatherURL(nx, ny) {
  const serviceKey =
    "c396d7fec4c202142c2c83f4d72a60e831b50c2bea1f0db3df46ac266a8615aa";

  if (!serviceKey || serviceKey === "YOUR_PUBLIC_DATA_SERVICE_KEY") {
    return null;
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const baseDate = `${y}${m}${d}`;
  const baseTime = "1100";

  return `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=200&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
}

async function fetchPublicWeather(nx, ny) {
  const url = buildPublicWeatherURL(nx, ny);
  if (!url) {
    return null;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`날씨 API 요청 실패: ${response.status}`);
  }

  const json = await response.json();
  const items = json?.response?.body?.items?.item || [];
  const tempItem = items.find((item) => item.category === "TMP");
  const skyItem = items.find((item) => item.category === "SKY");
  const ptyItem = items.find((item) => item.category === "PTY");

  if (!tempItem && !skyItem && !ptyItem) {
    return null;
  }

  return {
    title: formatSkyText(
      Number(skyItem?.fcstValue || 1),
      Number(ptyItem?.fcstValue || 0),
    ),
    temp: Number(tempItem?.fcstValue || 0),
  };
}

async function getWeatherData(course) {
  try {
    const liveWeather = await fetchPublicWeather(course.nx, course.ny);
    if (liveWeather) {
      return {
        weather: liveWeather,
        sourceLabel: "데이터: 공공데이터 실시간 연동",
      };
    }
  } catch (error) {
    console.warn("날씨 호출 실패:", error);
  }

  return {
    weather: course.weather,
    sourceLabel: "데이터: 샘플 모드",
  };
}

async function applyCourseData(course) {
  const weatherData = await getWeatherData(course);
  weatherTitle.textContent = weatherData.weather.title;
  tempValue.textContent = weatherData.weather.temp;
  courseNo.textContent = course.courseNo;
  distanceValue.textContent = course.distance;
  routeName.textContent = course.routeName;
  routeDesc.textContent = course.routeDesc;
  routeExtra.textContent = course.routeExtra;
  dataBadge.textContent = weatherData.sourceLabel;
  updateWeatherIcon(weatherData.weather.title);
}

function convertToGrid(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;

  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

function findNearestCourseByGrid(nx, ny) {
  let nearest = courseDB[0];
  let minGap = Number.POSITIVE_INFINITY;

  courseDB.forEach((course) => {
    const gap = Math.abs(course.nx - nx) + Math.abs(course.ny - ny);
    if (gap < minGap) {
      minGap = gap;
      nearest = course;
    }
  });

  return nearest;
}

async function applyCurrentLocationWeather() {
  if (!navigator.geolocation) {
    locationWeatherText.textContent = "위치 지원 안 됨";
    return;
  }

  locationWeatherText.textContent = "내 위치 확인 중...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const grid = convertToGrid(latitude, longitude);
        const nearestCourse = findNearestCourseByGrid(grid.nx, grid.ny);
        const liveWeather = await fetchPublicWeather(grid.nx, grid.ny);
        const weather = liveWeather || nearestCourse.weather;

        weatherTitle.textContent = weather.title;
        tempValue.textContent = weather.temp;
        updateWeatherIcon(weather.title);
        dataBadge.textContent = liveWeather
          ? "데이터: 내 위치 실시간 연동"
          : "데이터: 내 위치 샘플 모드";
        locationWeatherText.textContent = `내 위치 · ${weather.title} ${weather.temp}°`;
      } catch (error) {
        console.warn("내 위치 날씨 호출 실패:", error);
        locationWeatherText.textContent = "내 위치 날씨 불러오기";
      }
    },
    () => {
      locationWeatherText.textContent = "위치 권한 필요";
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 300000,
    },
  );
}

buildInfiniteSlider();
renderCourseList(courseDB.slice(0, 4));
updateWeatherIcon(weatherTitle.textContent);
applyCurrentLocationWeather();
