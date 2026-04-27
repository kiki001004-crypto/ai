const LOGIN_URL = "#login";
      const WALKTHROUGH_HASH = "#walkthrough";
      const SPLASH_DURATION = 3000;
      const WALKTHROUGH_AUTOPLAY_DELAY = 1500;
      const FIRST_CONTENT_SLIDE_INDEX = 1;
      const LAST_SLIDE_INDEX = 3;
      const DESIGN_WIDTH = 375;
      const DESIGN_HEIGHT = 812;

      const appEl = document.querySelector(".mobile-app");
      const loadingPercentEl = document.querySelector(
        ".splash-loading-percent",
      );
      const loadingBarEl = document.querySelector(".splash-progress-bar");

      // ==========================================
      // 이벤트 클릭 시 보여줄 토스트 메시지 함수 (검색어 추가/삭제 시에만 사용)
      // ==========================================
      const toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      appEl.appendChild(toastContainer);

      function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        toastContainer.appendChild(toast);

        void toast.offsetWidth;
        toast.classList.add("show");

        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      }

      // ==========================================
      // 이벤트 위임(Event Delegation)을 통한 링크 이동
      // ==========================================
      document.body.addEventListener("click", (e) => {
        // 1. page-link 이동 처리
        const pageLink = e.target.closest(".page-link");
        if (pageLink) {
          e.preventDefault();
          const targetSelector =
            pageLink.dataset.target || pageLink.getAttribute("href");
          if (targetSelector) {
            showView(targetSelector);
          }
          return;
        }

        // 2. 미구현 a 태그 기본 동작 방지
        const emptyAnchor = e.target.closest('a[href="#"]');
        if (emptyAnchor) {
          e.preventDefault();
          return;
        }
      });

      // ==========================================
      // 메인 로고 클릭 시 최상단 스크롤
      // ==========================================
      const mainLogos = document.querySelectorAll(
        ".logo-small, .main-logo-img",
      );
      mainLogos.forEach((logo) => {
        logo.addEventListener("click", (e) => {
          if (!logo.classList.contains("page-link")) {
            const parentView = e.target.closest(".app-view");
            if (parentView) {
              const scrollContent = parentView.querySelector(
                ".main-scroll-content",
              );
              if (scrollContent)
                scrollContent.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
        });
      });

      // ==========================================
      // 맨 위로 가기(FAB) 기능
      // ==========================================
      const fabTopBtns = document.querySelectorAll(".fab-top");
      fabTopBtns.forEach((fabTopBtn) => {
        const scrollContent = fabTopBtn.parentElement.querySelector(
          ".main-scroll-content",
        );
        if (scrollContent) {
          scrollContent.addEventListener("scroll", () => {
            if (scrollContent.scrollTop > 150) {
              fabTopBtn.classList.add("is-active");
            } else {
              fabTopBtn.classList.remove("is-active");
            }
          });
          fabTopBtn.addEventListener("click", () => {
            scrollContent.scrollTo({ top: 0, behavior: "smooth" });
          });
        }
      });

      // ==========================================
      // 스크롤 애니메이션 (Intersection Observer)
      // ==========================================
      const scrollElements = document.querySelectorAll(".animate-on-scroll");
      const observerOptions = {
        root: null,
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.1,
      };

      const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      }, observerOptions);

      scrollElements.forEach((el) => {
        scrollObserver.observe(el);
      });

      // ==========================================
      // [지도 매물] 커스텀 오버레이 & 필터 & 목업 데이터
      // ==========================================
      const propertyData = [
        {
          id: 1,
          title: "은마아파트",
          address: "서울 강남구 대치동",
          dealType: "전세",
          price: "8억",
          lat: 37.4981,
          lng: 127.0623,
          pet: false,
          subway: true,
          maintenanceFee: 150000,
          image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 2,
          title: "타워팰리스",
          address: "서울 강남구 도곡동",
          dealType: "월세",
          price: "500/60",
          lat: 37.4882,
          lng: 127.0542,
          pet: true,
          subway: true,
          maintenanceFee: 200000,
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 3,
          title: "서초자이",
          address: "서울 서초구 서초동",
          dealType: "매매",
          price: "12억",
          lat: 37.4919,
          lng: 127.0079,
          pet: true,
          subway: false,
          maintenanceFee: 180000,
          image:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80",
        },
      ];

      let mapInstance = null;
      let activeOverlays = [];
      let mapSearchMarker = null;
      let currentFilters = {
        pet: false,
        subway: false,
        fee: false,
      };

      function initKakaoMap() {
        const mapContainer = document.getElementById("kakao-map-container");
        if (!mapContainer) return;

        if (typeof kakao !== "undefined" && kakao.maps) {
          kakao.maps.load(() => {
            if (!mapInstance) {
              const mapOption = {
                center: new kakao.maps.LatLng(37.4927, 127.0414),
                level: 6,
              };
              mapInstance = new kakao.maps.Map(mapContainer, mapOption);

              kakao.maps.event.addListener(mapInstance, "click", () => {
                document
                  .getElementById("map-property-card")
                  .classList.remove("show");
              });

              renderMapOverlays();
            } else {
              mapInstance.relayout();
              mapInstance.setCenter(new kakao.maps.LatLng(37.4927, 127.0414));
            }
          });
        } else {
          mapContainer.innerHTML =
            '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#9b9b9b; font-size:14px; text-align:center; padding:20px; line-height: 1.5;">카카오맵 API KEY를 입력해주세요.<br><br>HTML 파일 최상단 &lt;script&gt; 태그의<br>YOUR_APP_KEY 부분을 수정해야 합니다.</div>';
        }
      }

      function renderMapOverlays() {
        if (!mapInstance) return;

        activeOverlays.forEach((overlay) => overlay.setMap(null));
        activeOverlays = [];

        const filteredData = propertyData.filter((prop) => {
          if (currentFilters.pet && !prop.pet) return false;
          if (currentFilters.subway && !prop.subway) return false;
          if (currentFilters.fee && prop.maintenanceFee >= 200000) return false;
          return true;
        });

        filteredData.forEach((prop) => {
          const contentNode = document.createElement("div");
          contentNode.className = "property-marker";
          contentNode.innerHTML = `${prop.dealType} ${prop.price}`;

          contentNode.onclick = (e) => {
            e.stopPropagation();
            showPropertyCard(prop);
          };

          const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(prop.lat, prop.lng),
            content: contentNode,
            yAnchor: 1,
          });

          customOverlay.setMap(mapInstance);
          activeOverlays.push(customOverlay);
        });
      }

      function showPropertyCard(prop) {
        const cardEl = document.getElementById("map-property-card");
        document.getElementById("mc-img").src = prop.image;
        document.getElementById("mc-price").textContent =
          `${prop.dealType} ${prop.price}`;
        document.getElementById("mc-title").textContent = prop.title;
        document.getElementById("mc-addr").textContent = prop.address;

        let tagsHtml = "";
        if (prop.pet) tagsHtml += '<span class="mc-tag">🐶 반려동물</span>';
        if (prop.subway) tagsHtml += '<span class="mc-tag">🚇 역세권</span>';
        tagsHtml += `<span class="mc-tag">💸 관리비 ${prop.maintenanceFee / 10000}만</span>`;
        document.getElementById("mc-tags").innerHTML = tagsHtml;

        cardEl.classList.add("show");
      }

      const mapSearchInput = document.getElementById("map-search-input");
      const mapKeywordCenters = [
        {
          keywords: ["강남", "강남구", "대치", "대치동", "은마", "은마아파트"],
          lat: 37.4981,
          lng: 127.0623,
          level: 5,
        },
        {
          keywords: ["도곡", "도곡동", "타워팰리스"],
          lat: 37.4882,
          lng: 127.0542,
          level: 5,
        },
        {
          keywords: ["서초", "서초구", "서초동", "서초자이"],
          lat: 37.4919,
          lng: 127.0079,
          level: 5,
        },
        {
          keywords: ["용산", "용산구", "용산아이파크"],
          lat: 37.5299,
          lng: 126.9648,
          level: 6,
        },
        {
          keywords: ["서울", "서울시"],
          lat: 37.5665,
          lng: 126.978,
          level: 8,
        },
        {
          keywords: ["역삼", "역삼역"],
          lat: 37.5007,
          lng: 127.0365,
          level: 5,
        },
        {
          keywords: ["선릉", "선릉역"],
          lat: 37.5045,
          lng: 127.049,
          level: 5,
        },
        {
          keywords: ["삼성", "삼성역", "코엑스"],
          lat: 37.5088,
          lng: 127.0632,
          level: 5,
        },
        {
          keywords: ["잠실", "잠실역", "송파", "송파구"],
          lat: 37.5133,
          lng: 127.1002,
          level: 5,
        },
        {
          keywords: ["홍대", "홍대입구", "홍대입구역", "마포", "마포구"],
          lat: 37.5572,
          lng: 126.9249,
          level: 5,
        },
        {
          keywords: ["건대", "건대입구", "건대입구역", "광진", "광진구"],
          lat: 37.5404,
          lng: 127.0692,
          level: 5,
        },
        {
          keywords: ["성수", "성수역", "성동", "성동구"],
          lat: 37.5446,
          lng: 127.0559,
          level: 5,
        },
        {
          keywords: ["신림", "신림역", "관악", "관악구"],
          lat: 37.4842,
          lng: 126.9297,
          level: 5,
        },
        {
          keywords: ["서울대입구", "서울대입구역", "봉천", "봉천역"],
          lat: 37.4812,
          lng: 126.9527,
          level: 5,
        },
        {
          keywords: ["왕십리", "왕십리역"],
          lat: 37.5615,
          lng: 127.0377,
          level: 5,
        },
        {
          keywords: ["구로", "구로구", "신도림", "신도림역"],
          lat: 37.5088,
          lng: 126.8913,
          level: 5,
        },
        {
          keywords: ["영등포", "영등포구", "여의도", "여의도역"],
          lat: 37.5219,
          lng: 126.9246,
          level: 5,
        },
        {
          keywords: ["종로", "종로구", "종각", "종각역", "광화문", "광화문역"],
          lat: 37.57,
          lng: 126.9828,
          level: 5,
        },
        {
          keywords: ["을지로", "을지로입구", "을지로입구역", "명동", "명동역"],
          lat: 37.566,
          lng: 126.9826,
          level: 5,
        },
        {
          keywords: ["강북", "강북구", "수유", "수유역"],
          lat: 37.6379,
          lng: 127.0255,
          level: 5,
        },
        {
          keywords: ["노원", "노원구", "노원역"],
          lat: 37.6543,
          lng: 127.0611,
          level: 5,
        },
        {
          keywords: ["강서", "강서구", "마곡", "마곡역", "발산", "발산역"],
          lat: 37.5602,
          lng: 126.8255,
          level: 5,
        },
        {
          keywords: ["동대문", "동대문구", "청량리", "청량리역"],
          lat: 37.5801,
          lng: 127.0458,
          level: 5,
        },
        {
          keywords: ["경기", "경기도"],
          lat: 37.4138,
          lng: 127.5183,
          level: 10,
        },
        { keywords: ["김포", "김포시"], lat: 37.6152, lng: 126.7156, level: 7 },
        {
          keywords: [
            "김포 장기",
            "김포장기",
            "장기",
            "장기역",
            "김포 장기역",
            "김포장기역",
          ],
          lat: 37.6439,
          lng: 126.6694,
          level: 5,
        },
        {
          keywords: [
            "운양",
            "운양역",
            "김포 운양",
            "김포운양",
            "김포 운양역",
            "김포운양역",
          ],
          lat: 37.6538,
          lng: 126.6831,
          level: 5,
        },
        {
          keywords: [
            "구래",
            "구래역",
            "마산",
            "마산역",
            "사우",
            "사우역",
            "걸포북변",
            "걸포북변역",
            "풍무",
            "풍무역",
            "고촌",
            "고촌역",
          ],
          lat: 37.6448,
          lng: 126.6287,
          level: 6,
        },
        {
          keywords: ["의왕", "의왕시", "경기도 의왕", "의왕 경기도", "의왕역"],
          lat: 37.3448,
          lng: 126.9683,
          level: 6,
        },
        {
          keywords: [
            "인덕원",
            "인덕원역",
            "포일",
            "포일동",
            "청계",
            "청계동",
            "백운호수",
          ],
          lat: 37.4019,
          lng: 126.9767,
          level: 5,
        },
        {
          keywords: [
            "수원",
            "수원시",
            "수원역",
            "광교",
            "광교역",
            "영통",
            "영통역",
          ],
          lat: 37.2636,
          lng: 127.0286,
          level: 7,
        },
        {
          keywords: [
            "성남",
            "성남시",
            "분당",
            "분당구",
            "판교",
            "판교역",
            "정자",
            "정자역",
            "야탑",
            "야탑역",
            "미금",
            "미금역",
            "수내",
            "수내역",
            "서현",
            "서현역",
          ],
          lat: 37.3947,
          lng: 127.1112,
          level: 6,
        },
        {
          keywords: [
            "용인",
            "용인시",
            "수지",
            "죽전",
            "죽전역",
            "기흥",
            "기흥역",
            "동백",
            "동백역",
          ],
          lat: 37.2411,
          lng: 127.1776,
          level: 7,
        },
        {
          keywords: ["화성", "화성시", "동탄", "동탄역", "병점", "병점역"],
          lat: 37.1995,
          lng: 127.095,
          level: 7,
        },
        {
          keywords: [
            "안양",
            "안양시",
            "안양역",
            "평촌",
            "평촌역",
            "범계",
            "범계역",
          ],
          lat: 37.3943,
          lng: 126.9568,
          level: 6,
        },
        {
          keywords: ["군포", "군포시", "산본", "산본역", "금정", "금정역"],
          lat: 37.3617,
          lng: 126.9352,
          level: 6,
        },
        {
          keywords: [
            "과천",
            "과천시",
            "과천역",
            "정부과천청사",
            "정부과천청사역",
          ],
          lat: 37.4292,
          lng: 126.9877,
          level: 6,
        },
        {
          keywords: ["광명", "광명시", "광명역", "철산", "철산역"],
          lat: 37.4785,
          lng: 126.8646,
          level: 6,
        },
        {
          keywords: [
            "부천",
            "부천시",
            "부천역",
            "상동",
            "상동역",
            "중동",
            "중동역",
            "송내",
            "송내역",
          ],
          lat: 37.5035,
          lng: 126.766,
          level: 6,
        },
        {
          keywords: [
            "고양",
            "고양시",
            "일산",
            "일산역",
            "대화",
            "대화역",
            "주엽",
            "주엽역",
            "백석",
            "백석역",
            "화정",
            "화정역",
          ],
          lat: 37.6584,
          lng: 126.832,
          level: 7,
        },
        {
          keywords: [
            "파주",
            "파주시",
            "운정",
            "운정역",
            "야당",
            "야당역",
            "금촌",
            "금촌역",
          ],
          lat: 37.7599,
          lng: 126.7802,
          level: 7,
        },
        {
          keywords: [
            "하남",
            "하남시",
            "미사",
            "미사역",
            "하남검단산",
            "하남검단산역",
          ],
          lat: 37.5393,
          lng: 127.2149,
          level: 6,
        },
        {
          keywords: [
            "구리",
            "구리시",
            "구리역",
            "남양주",
            "남양주시",
            "다산",
            "다산역",
            "별내",
            "별내역",
          ],
          lat: 37.636,
          lng: 127.2165,
          level: 7,
        },
        {
          keywords: [
            "의정부",
            "의정부시",
            "의정부역",
            "양주",
            "양주시",
            "양주역",
          ],
          lat: 37.7381,
          lng: 127.0337,
          level: 7,
        },
        {
          keywords: [
            "시흥",
            "시흥시",
            "배곧",
            "정왕",
            "정왕역",
            "오이도",
            "오이도역",
          ],
          lat: 37.3802,
          lng: 126.8029,
          level: 7,
        },
        {
          keywords: [
            "안산",
            "안산시",
            "중앙",
            "중앙역",
            "고잔",
            "고잔역",
            "한대앞",
            "한대앞역",
          ],
          lat: 37.3219,
          lng: 126.8309,
          level: 7,
        },
        {
          keywords: [
            "평택",
            "평택시",
            "평택역",
            "고덕",
            "고덕신도시",
            "지제",
            "지제역",
            "오산",
            "오산시",
            "오산역",
          ],
          lat: 37.0817,
          lng: 127.051,
          level: 8,
        },
        {
          keywords: [
            "광주",
            "광주시",
            "경기광주",
            "경기 광주",
            "경기광주역",
            "이천",
            "이천시",
            "이천역",
            "여주",
            "여주시",
            "여주역",
          ],
          lat: 37.4293,
          lng: 127.2552,
          level: 8,
        },
        {
          keywords: [
            "인천",
            "인천시",
            "인천광역시",
            "송도",
            "송도국제도시",
            "센트럴파크",
            "센트럴파크역",
            "청라",
            "청라국제도시",
            "검단",
            "검단신도시",
            "부평",
            "부평역",
          ],
          lat: 37.4563,
          lng: 126.7052,
          level: 8,
        },
      ];

      function moveMapToPosition(lat, lng, level = 5) {
        if (!mapInstance || typeof kakao === "undefined" || !kakao.maps) return;
        const position = new kakao.maps.LatLng(lat, lng);
        mapInstance.setLevel(level);
        mapInstance.panTo(position);
      }

      function setMapSearchMarker(lat, lng) {
        if (!mapInstance || typeof kakao === "undefined" || !kakao.maps) return;
        if (mapSearchMarker) {
          mapSearchMarker.setMap(null);
          mapSearchMarker = null;
        }
        mapSearchMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
        });
        mapSearchMarker.setMap(mapInstance);
      }

      function clearMapSearchMarker() {
        if (mapSearchMarker) {
          mapSearchMarker.setMap(null);
          mapSearchMarker = null;
        }
      }

      function moveToSearchedPlace(lat, lng, level, query) {
        moveMapToPosition(lat, lng, level);
        setMapSearchMarker(lat, lng);
        document.getElementById("map-property-card").classList.remove("show");
        showToast(`'${query}' 지역으로 이동했습니다.`);
      }

      function searchMapKeyword(keyword) {
        const query = keyword.trim();
        if (!query) return;

        const matchedProperty = propertyData.find((prop) => {
          return prop.title.includes(query) || prop.address.includes(query);
        });

        if (matchedProperty) {
          clearMapSearchMarker();
          moveMapToPosition(matchedProperty.lat, matchedProperty.lng, 4);
          showPropertyCard(matchedProperty);
          showToast(`'${query}' 검색 결과를 지도에 표시했습니다.`);
          return;
        }

        const normalizedQuery = query.replace(/\s+/g, "");
        const queryWords = query.split(/\s+/).filter(Boolean);
        const matchedCenter = mapKeywordCenters.find((item) => {
          return item.keywords.some((keywordItem) => {
            const normalizedKeyword = keywordItem.replace(/\s+/g, "");
            return (
              normalizedKeyword.includes(normalizedQuery) ||
              normalizedQuery.includes(normalizedKeyword) ||
              queryWords.some((word) => normalizedKeyword.includes(word))
            );
          });
        });

        if (matchedCenter) {
          moveToSearchedPlace(
            matchedCenter.lat,
            matchedCenter.lng,
            matchedCenter.level,
            query,
          );
          return;
        }

        if (
          mapInstance &&
          typeof kakao !== "undefined" &&
          kakao.maps &&
          kakao.maps.services
        ) {
          const tryAddressSearch = () => {
            if (!kakao.maps.services.Geocoder) {
              showToast("검색 결과가 없습니다.");
              return;
            }

            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(query, (data, status) => {
              if (status === kakao.maps.services.Status.OK && data.length > 0) {
                const firstAddress = data[0];
                moveToSearchedPlace(
                  Number(firstAddress.y),
                  Number(firstAddress.x),
                  4,
                  query,
                );
              } else {
                showToast("검색 결과가 없습니다.");
              }
            });
          };

          if (kakao.maps.services.Places) {
            const places = new kakao.maps.services.Places();
            const searchCandidates = Array.from(
              new Set(
                [
                  query,
                  normalizedQuery,
                  query.endsWith("역") ? query : `${query}역`,
                  query.includes("경기") ? query : `경기도 ${query}`,
                  query.includes("경기도") ? query : `${query} 경기도`,
                  query.includes("김포") ? query : `김포 ${query}`,
                  query.includes("의왕") ? query : `의왕 ${query}`,
                ].filter(Boolean),
              ),
            );

            const runPlaceSearch = (candidateIndex = 0) => {
              if (candidateIndex >= searchCandidates.length) {
                tryAddressSearch();
                return;
              }

              places.keywordSearch(
                searchCandidates[candidateIndex],
                (data, status) => {
                  if (
                    status === kakao.maps.services.Status.OK &&
                    data.length > 0
                  ) {
                    const firstPlace = data[0];
                    moveToSearchedPlace(
                      Number(firstPlace.y),
                      Number(firstPlace.x),
                      4,
                      query,
                    );
                    return;
                  }

                  runPlaceSearch(candidateIndex + 1);
                },
                { size: 1 },
              );
            };

            runPlaceSearch();
            return;
          }

          tryAddressSearch();
          return;
        }

        showToast("검색 결과가 없습니다.");
      }

      if (mapSearchInput) {
        mapSearchInput.addEventListener("keydown", (e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          searchMapKeyword(e.target.value);
        });
      }

      const mcCloseBtn = document.getElementById("mc-close-btn");
      if (mcCloseBtn) {
        mcCloseBtn.addEventListener("click", () => {
          document.getElementById("map-property-card").classList.remove("show");
        });
      }

      document.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.addEventListener("click", (e) => {
          const filterType = e.target.getAttribute("data-filter");

          if (e.target.classList.contains("active")) {
            e.target.classList.remove("active");
            currentFilters[filterType] = false;
          } else {
            e.target.classList.add("active");
            currentFilters[filterType] = true;
          }

          renderMapOverlays();
        });
      });

      // ==========================================
      // 매물 상세 조건 필터 팝업
      // ==========================================
      const filterModal = document.getElementById("filter-view");
      const filterOpenBtns = document.querySelectorAll(".filter-open-btn");
      const filterCloseBtn = document.querySelector(".filter-close-btn");
      const filterApplyBtn = document.querySelector(".filter-apply-btn");
      const filterResetBtn = document.querySelector(".filter-reset-btn");

      const openFilterModal = () => {
        if (!filterModal) return;

        // 검색 화면뿐 아니라 지도 상세 화면에서도 같은 필터 팝업을 사용할 수 있게,
        // 현재 보이는 화면의 design-stage 안으로 필터 레이어를 옮긴 뒤 표시합니다.
        const activeStage = document.querySelector(".app-view.is-active .design-stage");
        if (activeStage && filterModal.parentElement !== activeStage) {
          activeStage.appendChild(filterModal);
        }

        filterModal.classList.remove("is-hidden");
        window.history.replaceState(null, "", "#filter-view");
      };

      const closeFilterModal = () => {
        if (!filterModal) return;
        filterModal.classList.add("is-hidden");

        const activeView = document.querySelector(".app-view.is-active");
        const activeHash = activeView && activeView.id ? `#${activeView.id}` : "#search-view";
        window.history.replaceState(null, "", activeHash);
      };

      filterOpenBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          openFilterModal();
        });
      });

      if (filterCloseBtn)
        filterCloseBtn.addEventListener("click", closeFilterModal);
      if (filterApplyBtn) {
        filterApplyBtn.addEventListener("click", () => {
          if (typeof currentFilters !== "undefined") {
            currentFilters.pet = !!filterModal?.querySelector('[data-map-filter="pet"].is-selected');
            currentFilters.subway = !!filterModal?.querySelector('[data-map-filter="subway"].is-selected');
            currentFilters.fee = !!filterModal?.querySelector('[data-map-filter="fee"].is-selected');
            renderMapOverlays();
          }
          closeFilterModal();
        });
      }
      if (filterModal) {
        filterModal.addEventListener("click", (e) => {
          if (e.target === filterModal) closeFilterModal();
        });
      }
      if (filterResetBtn) {
        filterResetBtn.addEventListener("click", () => {
          filterModal
            .querySelectorAll(".filter-option")
            .forEach((option) => option.classList.remove("is-selected"));
          const allOption = filterModal.querySelector(".filter-option");
          if (allOption) allOption.classList.add("is-selected");
          if (typeof currentFilters !== "undefined") {
            currentFilters.pet = false;
            currentFilters.subway = false;
            currentFilters.fee = false;
            renderMapOverlays();
          }
        });
      }
      if (filterModal) {
        filterModal.querySelectorAll(".filter-option").forEach((option) => {
          option.addEventListener("click", () => {
            const group = option.closest(".filter-group");
            if (!group) return;

            if (option.closest(".filter-map-option-list")) {
              option.classList.toggle("is-selected");
              return;
            }

            group
              .querySelectorAll(".filter-option")
              .forEach((item) => item.classList.remove("is-selected"));
            option.classList.add("is-selected");
          });
        });
      }

      // ==========================================
      // 매물 검색 결과 + 관심 매물 담기 데이터
      // ==========================================
      const propertySearchData = [
        {
          name: "롯데캐슬",
          image:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=360&q=80",
          price: "10억5천",
          area: "33평형(109㎡)",
          station: "강남역 5분",
          stationHtml: "강남역<br />5분",
          fee: "관리비 12만원",
          address: "서울 강남구 역삼동",
          keywords: ["롯데캐슬", "강남", "강남역", "역삼"],
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        {
          name: "래미안",
          image:
            "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=360&q=80",
          price: "11억",
          area: "33평형(109㎡)",
          station: "교대역 3분",
          stationHtml: "교대역<br />3분",
          fee: "관리비 15만원",
          address: "서울 서초구 서초동",
          keywords: ["래미안", "교대", "교대역", "서초"],
          checks: ["실거래가 인증", "공인중개사 인증"],
        },
        {
          name: "한강 메트로 자이 3단지",
          image:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=360&q=80",
          price: "8억9천",
          area: "34평형(112㎡)",
          station: "장기역 7분",
          stationHtml: "장기역<br />7분",
          fee: "관리비 13만원",
          address: "경기 김포시 장기동",
          keywords: [
            "한강",
            "한강 메트로",
            "자이",
            "장기",
            "장기역",
            "김포",
            "김포 장기역",
          ],
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        {
          name: "풍무센트럴 푸르지오",
          image:
            "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=360&q=80",
          price: "7억8천",
          area: "32평형(106㎡)",
          station: "풍무역 6분",
          stationHtml: "풍무역<br />6분",
          fee: "관리비 11만원",
          address: "경기 김포시 풍무동",
          keywords: ["풍무", "풍무역", "푸르지오", "김포", "초역세권"],
          checks: ["실거래가 인증", "알고리즘 인증"],
        },
        {
          name: "운양동 라피아노",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=360&q=80",
          price: "9억2천",
          area: "36평형(119㎡)",
          station: "운양역 8분",
          stationHtml: "운양역<br />8분",
          fee: "관리비 14만원",
          address: "경기 김포시 운양동",
          keywords: ["운양", "운양역", "라피아노", "김포", "애완동물"],
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        {
          name: "더 휴",
          image:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=360&q=80",
          price: "6억9천",
          area: "29평형(96㎡)",
          station: "구래역 9분",
          stationHtml: "구래역<br />9분",
          fee: "관리비 10만원",
          address: "경기 김포시 구래동",
          keywords: ["더 휴", "더휴", "구래", "구래역", "김포", "관리비"],
          checks: ["실거래가 인증", "알고리즘 인증"],
        },
        {
          name: "자이더빌리지",
          image:
            "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=360&q=80",
          price: "12억3천",
          area: "40평형(132㎡)",
          station: "운양역 10분",
          stationHtml: "운양역<br />10분",
          fee: "관리비 18만원",
          address: "경기 김포시 운양동",
          keywords: ["자이더빌리지", "자이", "운양", "운양역", "김포"],
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        {
          name: "마산동 센트라빌",
          image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=360&q=80",
          price: "7억4천",
          area: "31평형(102㎡)",
          station: "마산역 5분",
          stationHtml: "마산역<br />5분",
          fee: "관리비 12만원",
          address: "경기 김포시 마산동",
          keywords: ["마산", "마산역", "센트라빌", "김포"],
          checks: ["실거래가 인증", "공인중개사 인증"],
        },
        {
          name: "은마 아파트",
          image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=360&q=80",
          price: "19억8천",
          area: "31평형(102㎡)",
          station: "대치역 4분",
          stationHtml: "대치역<br />4분",
          fee: "관리비 16만원",
          address: "서울 강남구 대치동",
          keywords: ["은마", "은마 아파트", "대치", "대치역", "강남"],
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        {
          name: "타워팰리스",
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=360&q=80",
          price: "22억",
          area: "45평형(149㎡)",
          station: "도곡역 6분",
          stationHtml: "도곡역<br />6분",
          fee: "관리비 25만원",
          address: "서울 강남구 도곡동",
          keywords: ["타워팰리스", "도곡", "도곡역", "강남"],
          checks: ["실거래가 인증", "공인중개사 인증"],
        },
        {
          name: "용산아이파크",
          image:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=360&q=80",
          price: "18억6천",
          area: "35평형(116㎡)",
          station: "용산역 5분",
          stationHtml: "용산역<br />5분",
          fee: "관리비 17만원",
          address: "서울 용산구 한강로동",
          keywords: ["용산", "용산역", "아이파크", "용산아이파크"],
          checks: ["실거래가 인증", "알고리즘 인증"],
        },
        {
          name: "서초자이",
          image:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=360&q=80",
          price: "16억4천",
          area: "34평형(112㎡)",
          station: "서초역 4분",
          stationHtml: "서초역<br />4분",
          fee: "관리비 14만원",
          address: "서울 서초구 서초동",
          keywords: ["서초", "서초역", "서초자이", "자이", "초역세권"],
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
      ];

      function getComparableProperty(propertyName) {
        const searchItem = propertySearchData.find(
          (item) => item.name === propertyName,
        );
        if (!searchItem) return null;
        return {
          name: searchItem.name,
          image: searchItem.image,
          price: searchItem.price,
          area: searchItem.area,
          station: searchItem.stationHtml || searchItem.station,
          fee: searchItem.fee,
          checks: searchItem.checks || ["실거래가 인증", "알고리즘 인증"],
        };
      }

      function findPropertySearchResults(query) {
        const normalizedQuery = query.replace(/\s+/g, "").toLowerCase();
        if (!normalizedQuery) return [];

        const matchedItems = propertySearchData.filter((item) => {
          const searchText = [
            item.name,
            item.address,
            item.price,
            item.area,
            item.station,
            item.fee,
            ...(item.keywords || []),
          ]
            .join(" ")
            .replace(/\s+/g, "")
            .toLowerCase();
          return (
            searchText.includes(normalizedQuery) ||
            normalizedQuery.includes(
              item.name.replace(/\s+/g, "").toLowerCase(),
            )
          );
        });

        if (matchedItems.length > 0) return matchedItems;

        return [
          {
            name: query,
            image:
              "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=360&q=80",
            price: "가격 확인 필요",
            area: "조건 확인 필요",
            station: "검색 지역 기준",
            stationHtml: "검색 지역<br />기준",
            fee: "관리비 확인 필요",
            address: "검색한 매물 후보",
            keywords: [query],
            checks: ["알고리즘 인증"],
          },
        ];
      }

      // ==========================================
      // 최근 검색어 로직 (로컬 스토리지 연동)
      // ==========================================
      const propSearchInput = document.getElementById("prop-search-input");
      const recentSearchList = document.getElementById("recent-search-list");
      const btnDeleteRecent = document.getElementById("btn-delete-recent");
      const propertyResultSection =
        document.getElementById("property-result-section") ||
        document.getElementById("property-result-sectio");
      const propertyResultList = document.getElementById(
        "property-result-list",
      );
      const btnClearPropertyResult = document.getElementById(
        "btn-clear-property-result",
      );
      const propertyDetailPopup = document.getElementById(
        "property-detail-popup",
      );
      const propertyDetailClose = document.getElementById(
        "property-detail-close",
      );
      const propertyDetailImg = document.getElementById("property-detail-img");
      const propertyDetailTitle = document.getElementById(
        "property-detail-title",
      );
      const propertyDetailPrice = document.getElementById(
        "property-detail-price",
      );
      const propertyDetailArea = document.getElementById(
        "property-detail-area",
      );
      const propertyDetailAddress = document.getElementById(
        "property-detail-address",
      );
      const propertyDetailStation = document.getElementById(
        "property-detail-station",
      );
      const propertyDetailFee = document.getElementById("property-detail-fee");
      const propertyDetailChecks = document.getElementById(
        "property-detail-checks",
      );
      const propertyDetailFavBtn = document.getElementById(
        "property-detail-fav-btn",
      );
      let propertyResultCache = [];
      let currentDetailPropertyName = "";

      const RECENT_SEARCH_KEY = "zigbang_recent_searches";

      const savedKeywords = localStorage.getItem(RECENT_SEARCH_KEY);
      let recentKeywords = savedKeywords
        ? JSON.parse(savedKeywords)
        : ["반려동물", "역세권"];

      const saveKeywordsToStorage = () => {
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(recentKeywords));
      };

      function escapeHtml(value) {
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      function isFavoriteProperty(propertyName) {
        return (
          typeof favoriteNames !== "undefined" &&
          favoriteNames.includes(propertyName)
        );
      }

      function getPropertyDetailByName(propertyName) {
        return (
          propertyResultCache.find((item) => item.name === propertyName) ||
          propertySearchData.find((item) => item.name === propertyName) ||
          null
        );
      }

      function closePropertyDetailPopup() {
        if (!propertyDetailPopup) return;
        propertyDetailPopup.classList.add("is-hidden");
        propertyDetailPopup.setAttribute("aria-hidden", "true");
      }

      function syncPropertyFavoriteButtons(propertyName) {
        const saved = isFavoriteProperty(propertyName);
        document.querySelectorAll(".property-fav-btn").forEach((btn) => {
          if (btn.dataset.favoriteProperty === propertyName) {
            btn.classList.toggle("is-saved", saved);
          }
        });
        if (
          propertyDetailFavBtn &&
          propertyDetailFavBtn.dataset.favoriteProperty === propertyName
        ) {
          propertyDetailFavBtn.classList.toggle("is-saved", saved);
          propertyDetailFavBtn.textContent = saved
            ? "관심 매물 등록완료"
            : "관심 매물 담기";
        }
      }

      function openPropertyDetailPopup(item) {
        if (!item || !propertyDetailPopup) return;
        currentDetailPropertyName = item.name;

        if (propertyDetailTitle) propertyDetailTitle.textContent = item.name;
        if (propertyDetailImg) {
          propertyDetailImg.src = item.image;
          propertyDetailImg.alt = `${item.name} 매물 이미지`;
        }
        if (propertyDetailPrice)
          propertyDetailPrice.textContent = item.price || "가격 확인 필요";
        if (propertyDetailArea)
          propertyDetailArea.textContent = item.area || "면적 확인 필요";
        if (propertyDetailAddress)
          propertyDetailAddress.textContent = item.address || "주소 확인 필요";
        if (propertyDetailStation)
          propertyDetailStation.textContent =
            item.station || "교통 정보 확인 필요";
        if (propertyDetailFee)
          propertyDetailFee.textContent = item.fee || "관리비 확인 필요";
        if (propertyDetailChecks) {
          const checks =
            item.checks && item.checks.length ? item.checks : ["알고리즘 인증"];
          propertyDetailChecks.innerHTML = checks
            .map(
              (check) =>
                `<span class="property-detail-check">${escapeHtml(check)}</span>`,
            )
            .join("");
        }
        if (propertyDetailFavBtn) {
          propertyDetailFavBtn.dataset.favoriteProperty = item.name;
          syncPropertyFavoriteButtons(item.name);
        }
        if (typeof propertyDetailAlertBtn !== "undefined" && propertyDetailAlertBtn) {
          propertyDetailAlertBtn.classList.remove("is-active");
          propertyDetailAlertBtn.textContent = "알림 받기";
        }

        propertyDetailPopup.classList.remove("is-hidden");
        propertyDetailPopup.setAttribute("aria-hidden", "false");
      }

      function renderPropertySearchResults(query, openFirstResult = false) {
        if (!propertyResultSection || !propertyResultList) {
          return;
        }
        propertyResultSection.classList.add("property-result-section");
        const results = findPropertySearchResults(query);
        propertyResultCache = results;
        propertyResultSection.classList.add("is-active");

        propertyResultList.innerHTML = results
          .map((item) => {
            const saved = isFavoriteProperty(item.name);
            const safeName = escapeHtml(item.name);
            const safeImage = escapeHtml(item.image);
            const safePrice = escapeHtml(item.price);
            const safeArea = escapeHtml(item.area);
            const safeAddress = escapeHtml(item.address);
            const safeStation = escapeHtml(item.station);
            return `
              <article class="property-result-card" data-property-name="${safeName}">
                <img class="property-result-thumb" src="${safeImage}" alt="${safeName} 매물 이미지" />
                <div class="property-result-info">
                  <strong class="property-result-name">${safeName}</strong>
                  <span class="property-result-meta">${safePrice} · ${safeArea}</span>
                  <span class="property-result-sub">${safeAddress} · ${safeStation}</span>
                </div>
                <button
                  class="property-fav-btn${saved ? " is-saved" : ""}"
                  type="button"
                  data-favorite-property="${safeName}"
                  aria-label="${safeName} 관심 매물 담기"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm-5 11.45l-2.45 1.5 1.15-2.81-2.19-1.63 2.91-.25L12 8.5l1.38 2.76 2.91.25-2.19 1.63 1.15 2.81L12 14.45z" />
                  </svg>
                </button>
              </article>
            `;
          })
          .join("");

        if (openFirstResult && results.length > 0) {
          window.setTimeout(() => openPropertyDetailPopup(results[0]), 0);
        }
      }

      if (propertyResultList) {
        propertyResultList.addEventListener("click", (e) => {
          const favoriteBtn = e.target.closest(".property-fav-btn");
          if (favoriteBtn) {
            e.stopPropagation();
            const propertyName = favoriteBtn.dataset.favoriteProperty;
            if (!propertyName) return;
            addFavoriteProperty(propertyName);
            syncPropertyFavoriteButtons(propertyName);
            return;
          }

          const resultCard = e.target.closest(".property-result-card");
          if (!resultCard) return;
          const propertyName = resultCard.dataset.propertyName;
          const detailItem = getPropertyDetailByName(propertyName);
          if (detailItem) openPropertyDetailPopup(detailItem);
        });
      }

      if (propertyDetailClose) {
        propertyDetailClose.addEventListener("click", closePropertyDetailPopup);
      }

      if (propertyDetailPopup) {
        propertyDetailPopup.addEventListener("click", (e) => {
          if (e.target === propertyDetailPopup) closePropertyDetailPopup();
        });
      }

      if (propertyDetailFavBtn) {
        propertyDetailFavBtn.addEventListener("click", () => {
          const propertyName =
            propertyDetailFavBtn.dataset.favoriteProperty ||
            currentDetailPropertyName;
          if (!propertyName) return;
          addFavoriteProperty(propertyName);
          syncPropertyFavoriteButtons(propertyName);
        });
      }

      if (btnClearPropertyResult && propertyResultSection) {
        btnClearPropertyResult.addEventListener("click", () => {
          propertyResultSection.classList.remove("is-active");
          if (propertyResultList) propertyResultList.innerHTML = "";
          propertyResultCache = [];
          closePropertyDetailPopup();
        });
      }

      const renderRecentKeywords = () => {
        if (!recentSearchList) return;
        recentSearchList.innerHTML = "";

        if (recentKeywords.length === 0) {
          recentSearchList.innerHTML =
            '<span style="font-size:13px; color:#9b9b9b; padding:8px 0;">최근 검색어가 없습니다.</span>';
          return;
        }

        recentKeywords.forEach((keyword) => {
          const span = document.createElement("span");
          span.className = "chip-item";
          span.textContent = keyword;
          span.addEventListener("click", (e) => {
            e.preventDefault();
            if (propSearchInput) {
              propSearchInput.value = keyword;
              propSearchInput.focus();
            }
            renderPropertySearchResults(keyword, true);
          });
          recentSearchList.appendChild(span);
        });
      };

      renderRecentKeywords();

      document.querySelectorAll(".rank-item").forEach((rankItem) => {
        rankItem.addEventListener("click", () => {
          const keyword = rankItem.querySelector(".rank-name")?.textContent?.trim();
          if (!keyword || !propSearchInput) return;
          propSearchInput.value = keyword;
          renderPropertySearchResults(keyword, true);
        });
      });


      const customKeywordList = document.getElementById("custom-keyword-list");
      if (customKeywordList && propSearchInput) {
        customKeywordList.addEventListener("click", (e) => {
          const keywordChip = e.target.closest(".chip-item");
          if (!keywordChip) return;

          const keywordValue = keywordChip.textContent.trim();
          propSearchInput.value = keywordValue;
          propSearchInput.focus();
          propSearchInput.setSelectionRange(
            propSearchInput.value.length,
            propSearchInput.value.length,
          );
          renderPropertySearchResults(keywordValue, true);
        });
      }

      if (propSearchInput) {
        propSearchInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = e.target.value.trim();
            if (val) {
              recentKeywords = recentKeywords.filter((k) => k !== val);
              recentKeywords.unshift(val);
              if (recentKeywords.length > 5) recentKeywords.pop();

              saveKeywordsToStorage();
              renderRecentKeywords();

      document.querySelectorAll(".rank-item").forEach((rankItem) => {
        rankItem.addEventListener("click", () => {
          const keyword = rankItem.querySelector(".rank-name")?.textContent?.trim();
          if (!keyword || !propSearchInput) return;
          propSearchInput.value = keyword;
          renderPropertySearchResults(keyword, true);
        });
      });

              renderPropertySearchResults(val, true);
            }
          }
        });
      }

      if (btnDeleteRecent) {
        btnDeleteRecent.addEventListener("click", () => {
          if (recentKeywords.length === 0) return;
          recentKeywords = [];
          saveKeywordsToStorage();
          renderRecentKeywords();

      document.querySelectorAll(".rank-item").forEach((rankItem) => {
        rankItem.addEventListener("click", () => {
          const keyword = rankItem.querySelector(".rank-name")?.textContent?.trim();
          if (!keyword || !propSearchInput) return;
          propSearchInput.value = keyword;
          renderPropertySearchResults(keyword, true);
        });
      });

        });
      }

      // ==========================================
      // 관심 매물 목록 렌더링 + 2개 선택 제한 + 선택 삭제
      // ==========================================
      const FAVORITE_PROPERTIES_KEY = "zigbang_favorite_properties";
      const favoriteListEl = document.getElementById("favorite-property-list");
      const defaultFavoriteNames = [
        "롯데캐슬",
        "래미안",
        "한강 메트로 자이 3단지",
        "풍무센트럴 푸르지오",
        "운양동 라피아노",
        "더 휴",
        "자이더빌리지",
        "마산동 센트라빌",
      ];

      const savedFavoriteNames = localStorage.getItem(FAVORITE_PROPERTIES_KEY);
      let favoriteNames = savedFavoriteNames
        ? Array.from(new Set(JSON.parse(savedFavoriteNames)))
        : [...defaultFavoriteNames];

      function saveFavoriteProperties() {
        localStorage.setItem(
          FAVORITE_PROPERTIES_KEY,
          JSON.stringify(favoriteNames),
        );
      }

      function getFavoriteInputs() {
        return Array.from(
          document.querySelectorAll('input[name="favoriteProperty"]'),
        );
      }

      function bindFavoriteSelection() {
        getFavoriteInputs().forEach((input) => {
          input.addEventListener("change", () => {
            const favoriteInputs = getFavoriteInputs();
            const checkedFavorites = favoriteInputs.filter(
              (item) => item.checked,
            );

            if (checkedFavorites.length > 2) {
              favoriteInputs.forEach((item) => {
                item.checked = false;
              });
              input.checked = true;
            }
          });
        });
      }

      function renderFavoriteList() {
        if (!favoriteListEl) return;
        favoriteListEl.innerHTML = favoriteNames
          .map((name) => {
            const safeName = escapeHtml(name);
            return `
              <li class="favorite-item">
                <label class="favorite-check">
                  <input type="checkbox" name="favoriteProperty" value="${safeName}" />
                  <span class="favorite-radio" aria-hidden="true"></span>
                  <span>${safeName}</span>
                </label>
              </li>
            `;
          })
          .join("");
        bindFavoriteSelection();
      }

      function addFavoriteProperty(propertyName) {
        if (!propertyName) return;
        if (!favoriteNames.includes(propertyName)) {
          favoriteNames.push(propertyName);
          saveFavoriteProperties();
          renderFavoriteList();
        }
      }

      function removeFavoriteProperty(propertyName) {
        if (!propertyName) return;
        favoriteNames = favoriteNames.filter((name) => name !== propertyName);
        saveFavoriteProperties();
        renderFavoriteList();

        syncPropertyFavoriteButtons(propertyName);
      }

      const favoriteDeleteSelectedBtn = document.getElementById(
        "favorite-delete-selected-btn",
      );
      if (favoriteDeleteSelectedBtn) {
        favoriteDeleteSelectedBtn.addEventListener("click", () => {
          const selectedFavorites = getFavoriteInputs()
            .filter((item) => item.checked)
            .map((item) => item.value);

          if (selectedFavorites.length === 0) {
            showToast("삭제할 관심 매물을 선택해주세요.");
            return;
          }

          favoriteNames = favoriteNames.filter(
            (name) => !selectedFavorites.includes(name),
          );
          saveFavoriteProperties();
          renderFavoriteList();

          selectedFavorites.forEach((propertyName) =>
            syncPropertyFavoriteButtons(propertyName),
          );

          showToast(`${selectedFavorites.length}개 관심 매물을 삭제했습니다.`);
        });
      }

      renderFavoriteList();

      // ==========================================
      // 관심 매물 비교 화면 데이터 + 이동
      // ==========================================
      const comparePropertyData = {
        롯데캐슬: {
          name: "롯데캐슬",
          image:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=360&q=80",
          price: "10억5천",
          area: "33평형(109㎡)",
          station: "강남역<br />5분",
          fee: "관리비 12만원",
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        래미안: {
          name: "래미안",
          image:
            "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=360&q=80",
          price: "11억",
          area: "33평형(109㎡)",
          station: "교대역<br />3분",
          fee: "관리비 15만원",
          checks: ["실거래가 인증", "공인중개사 인증"],
        },
        "한강 메트로 자이 3단지": {
          name: "한강 메트로<br />자이 3단지",
          image:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=360&q=80",
          price: "8억9천",
          area: "34평형(112㎡)",
          station: "장기역<br />7분",
          fee: "관리비 13만원",
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        "풍무센트럴 푸르지오": {
          name: "풍무센트럴<br />푸르지오",
          image:
            "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=360&q=80",
          price: "7억8천",
          area: "32평형(106㎡)",
          station: "풍무역<br />6분",
          fee: "관리비 11만원",
          checks: ["실거래가 인증", "알고리즘 인증"],
        },
        "운양동 라피아노": {
          name: "운양동 라피아노",
          image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=360&q=80",
          price: "9억2천",
          area: "36평형(119㎡)",
          station: "운양역<br />8분",
          fee: "관리비 14만원",
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        "더 휴": {
          name: "더 휴",
          image:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=360&q=80",
          price: "6억9천",
          area: "29평형(96㎡)",
          station: "구래역<br />9분",
          fee: "관리비 10만원",
          checks: ["실거래가 인증", "알고리즘 인증"],
        },
        자이더빌리지: {
          name: "자이더빌리지",
          image:
            "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=360&q=80",
          price: "12억3천",
          area: "40평형(132㎡)",
          station: "운양역<br />10분",
          fee: "관리비 18만원",
          checks: ["실거래가 인증", "공인중개사 인증", "알고리즘 인증"],
        },
        "마산동 센트라빌": {
          name: "마산동 센트라빌",
          image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=360&q=80",
          price: "7억4천",
          area: "31평형(102㎡)",
          station: "마산역<br />5분",
          fee: "관리비 12만원",
          checks: ["실거래가 인증", "공인중개사 인증"],
        },
      };

      function renderCompareChecks(targetId, checks) {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.innerHTML = checks
          .map(
            (label) => `
              <div class="compare-check-item">
                <span class="compare-check-box" aria-hidden="true"></span>
                <span>${label}</span>
              </div>
            `,
          )
          .join("");
      }

      function renderCompareCard(side, propertyName) {
        const fallback = comparePropertyData["롯데캐슬"];
        const searchedData = getComparableProperty(propertyName);
        const data = comparePropertyData[propertyName] ||
          searchedData || {
            ...fallback,
            name: propertyName,
          };

        const nameEl = document.getElementById(`compare-${side}-name`);
        const imageEl = document.getElementById(`compare-${side}-image`);
        const priceEl = document.getElementById(`compare-${side}-price`);
        const areaEl = document.getElementById(`compare-${side}-area`);
        const stationEl = document.getElementById(`compare-${side}-station`);
        const feeEl = document.getElementById(`compare-${side}-fee`);

        if (nameEl) nameEl.innerHTML = data.name;
        if (imageEl) {
          imageEl.src = data.image;
          imageEl.alt = `${propertyName} 매물 이미지`;
        }
        if (priceEl) priceEl.textContent = data.price;
        if (areaEl) areaEl.textContent = data.area;
        if (stationEl) stationEl.innerHTML = data.station;
        if (feeEl) feeEl.textContent = data.fee;
        renderCompareChecks(`compare-${side}-checks`, data.checks);
      }

      let currentCompareSelection = [];

      function renderCompareView(selectedNames) {
        currentCompareSelection = [...selectedNames];
        renderCompareCard("left", selectedNames[0]);
        renderCompareCard("right", selectedNames[1]);
      }

      function getCompareShareText() {
        const leftName =
          document.getElementById("compare-left-name")?.innerText ||
          currentCompareSelection[0] ||
          "첫 번째 매물";
        const rightName =
          document.getElementById("compare-right-name")?.innerText ||
          currentCompareSelection[1] ||
          "두 번째 매물";
        const leftPrice =
          document.getElementById("compare-left-price")?.innerText || "";
        const rightPrice =
          document.getElementById("compare-right-price")?.innerText || "";
        const leftArea =
          document.getElementById("compare-left-area")?.innerText || "";
        const rightArea =
          document.getElementById("compare-right-area")?.innerText || "";
        const leftStation =
          document
            .getElementById("compare-left-station")
            ?.innerText.replace(/\n+/g, " ") || "";
        const rightStation =
          document
            .getElementById("compare-right-station")
            ?.innerText.replace(/\n+/g, " ") || "";
        const leftFee =
          document.getElementById("compare-left-fee")?.innerText || "";
        const rightFee =
          document.getElementById("compare-right-fee")?.innerText || "";

        return [
          "매물 비교 결과",
          "",
          `1. ${leftName}`,
          `- 가격: ${leftPrice}`,
          `- 평형: ${leftArea}`,
          `- 역 거리: ${leftStation}`,
          `- ${leftFee}`,
          "",
          `2. ${rightName}`,
          `- 가격: ${rightPrice}`,
          `- 평형: ${rightArea}`,
          `- 역 거리: ${rightStation}`,
          `- ${rightFee}`,
        ].join("\n");
      }

      async function copyCompareText(text) {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        return copied;
      }

      const compareShareBtn = document.querySelector(".compare-share-btn");
      if (compareShareBtn) {
        compareShareBtn.addEventListener("click", async () => {
          const shareText = getCompareShareText();
          const shareTitle = "매물 비교 결과";

          try {
            if (navigator.share) {
              await navigator.share({
                title: shareTitle,
                text: shareText,
              });
              showToast("매물 비교 내용을 공유했습니다.");
              return;
            }

            const copied = await copyCompareText(shareText);
            if (copied) {
              showToast("공유할 비교 내용이 복사되었습니다.");
            } else {
              showToast("공유 내용을 복사하지 못했습니다.");
            }
          } catch (error) {
            if (error && error.name === "AbortError") return;
            try {
              const copied = await copyCompareText(shareText);
              showToast(
                copied
                  ? "공유할 비교 내용이 복사되었습니다."
                  : "공유를 완료하지 못했습니다.",
              );
            } catch (copyError) {
              showToast("공유를 완료하지 못했습니다.");
            }
          }
        });
      }

      const favoriteCompareBtn = document.querySelector(
        ".favorite-compare-btn",
      );
      if (favoriteCompareBtn) {
        favoriteCompareBtn.addEventListener("click", () => {
          const selectedFavorites = getFavoriteInputs()
            .filter((item) => item.checked)
            .map((item) => item.value);

          if (selectedFavorites.length !== 2) {
            showToast("비교할 매물 2개를 선택해주세요.");
            return;
          }

          renderCompareView(selectedFavorites);
          showView("#favorite-compare-view");
        });
      }

      // ==========================================
      // 관심 매물 햄버거 메뉴 패널
      // ==========================================
      const favoriteMenuBtn = document.querySelector(".favorite-menu-btn");
      const favoriteMenuPanel = document.getElementById("favorite-menu-panel");

      const closeFavoriteMenuPanel = () => {
        if (!favoriteMenuPanel) return;
        favoriteMenuPanel.classList.add("is-hidden");
        favoriteMenuPanel.setAttribute("aria-hidden", "true");
        if (favoriteMenuBtn) {
          favoriteMenuBtn.setAttribute("aria-expanded", "false");
        }
      };

      const toggleFavoriteMenuPanel = () => {
        if (!favoriteMenuPanel) return;
        const willOpen = favoriteMenuPanel.classList.contains("is-hidden");
        favoriteMenuPanel.classList.toggle("is-hidden", !willOpen);
        favoriteMenuPanel.setAttribute(
          "aria-hidden",
          willOpen ? "false" : "true",
        );
        if (favoriteMenuBtn) {
          favoriteMenuBtn.setAttribute(
            "aria-expanded",
            willOpen ? "true" : "false",
          );
        }
      };

      if (favoriteMenuBtn && favoriteMenuPanel) {
        favoriteMenuBtn.setAttribute("aria-controls", "favorite-menu-panel");
        favoriteMenuBtn.setAttribute("aria-expanded", "false");

        favoriteMenuBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavoriteMenuPanel();
        });

        favoriteMenuPanel.addEventListener("click", (e) => {
          if (e.target.closest(".page-link")) {
            closeFavoriteMenuPanel();
          }
        });

        document.addEventListener("click", (e) => {
          if (favoriteMenuPanel.classList.contains("is-hidden")) return;
          if (
            favoriteMenuPanel.contains(e.target) ||
            favoriteMenuBtn.contains(e.target)
          ) {
            return;
          }
          closeFavoriteMenuPanel();
        });
      }

      // ==========================================
      // 마이페이지 상세 상호작용
      // ==========================================
      document.querySelectorAll(".my-toggle").forEach((toggleBtn) => {
        toggleBtn.addEventListener("click", () => {
          toggleBtn.classList.toggle("is-active");
        });
      });

      document.querySelectorAll(".my-pill-btn").forEach((pillBtn) => {
        pillBtn.addEventListener("click", () => {
          const parent = pillBtn.parentElement;
          if (parent && parent.id === "my-schedule-time-list") {
            parent
              .querySelectorAll(".my-pill-btn")
              .forEach((btn) => btn.classList.remove("is-active"));
            pillBtn.classList.add("is-active");
            return;
          }

          const siblings = parent
            ? Array.from(parent.querySelectorAll(".my-pill-btn"))
            : [];
          const isChoiceGroup =
            siblings.length > 1 && !pillBtn.classList.contains("my-multi-pill");
          if (isChoiceGroup) {
            siblings.forEach((btn) => btn.classList.remove("is-active"));
          }
          pillBtn.classList.toggle("is-active");
        });
      });

      const myBudgetRange = document.getElementById("my-budget-range");
      const myBudgetLabel = document.getElementById("my-budget-label");
      if (myBudgetRange && myBudgetLabel) {
        myBudgetRange.addEventListener("input", () => {
          const value = myBudgetRange.value;
          myBudgetLabel.textContent =
            Number(value) >= 20 ? "최대 20억+" : `최대 ${value}억`;
        });
      }

      const myRegionChipList = document.getElementById("my-region-chip-list");
      const myRegionInput = document.getElementById("my-region-input");
      const myRegionAddBtn = document.getElementById("my-region-add-btn");

      if (myRegionChipList) {
        myRegionChipList.addEventListener("click", (e) => {
          const chip = e.target.closest(".my-region-chip");
          if (!chip) return;
          chip.classList.toggle("is-selected");
        });
      }

      if (myRegionAddBtn && myRegionInput && myRegionChipList) {
        myRegionAddBtn.addEventListener("click", () => {
          const value = myRegionInput.value.trim();
          if (!value) {
            showToast("추가할 지역을 입력해 주세요.");
            myRegionInput.focus();
            return;
          }

          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "my-region-chip is-selected";
          chip.textContent = value;
          myRegionChipList.appendChild(chip);
          myRegionInput.value = "";
          showToast(`'${value}' 지역을 관심 조건에 추가했습니다.`);
        });
      }

      document.querySelectorAll(".my-save-settings-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          showToast("마이페이지 설정을 저장했습니다."),
        );
      });
      document.querySelectorAll(".my-save-condition-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          showToast("조건 저장 완료! 맞춤 알림을 받을 수 있어요."),
        );
      });
      document.querySelectorAll(".my-save-alert-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          showToast("알림 설정을 저장했습니다."),
        );
      });
      document.querySelectorAll(".my-test-alert-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
          showToast("테스트 알림: 관심 조건에 맞는 새 매물이 도착했어요."),
        );
      });

      const myReservationList = document.getElementById("my-reservation-list");
      const myNewReservationBtn = document.getElementById(
        "my-new-reservation-btn",
      );
      const myScheduleModal = document.getElementById("my-schedule-modal");
      const myScheduleClose = document.getElementById("my-schedule-close");
      const myScheduleSave = document.getElementById("my-schedule-save");
      const myScheduleDate = document.getElementById("my-schedule-date");
      const myScheduleTimeList = document.getElementById(
        "my-schedule-time-list",
      );
      let activeReservationCard = null;
      let myReservationCount = 4;

      function openScheduleModal(card) {
        activeReservationCard = card;
        if (!myScheduleModal) return;
        if (myScheduleDate && !myScheduleDate.value) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          myScheduleDate.value = tomorrow.toISOString().slice(0, 10);
        }
        myScheduleModal.classList.remove("is-hidden");
        myScheduleModal.setAttribute("aria-hidden", "false");
      }

      function closeScheduleModal() {
        if (!myScheduleModal) return;
        myScheduleModal.classList.add("is-hidden");
        myScheduleModal.setAttribute("aria-hidden", "true");
        activeReservationCard = null;
      }

      if (myReservationList) {
        myReservationList.addEventListener("click", (e) => {
          const rescheduleBtn = e.target.closest(".my-reschedule-btn");
          const cancelBtn = e.target.closest(".my-cancel-reservation-btn");
          const card = e.target.closest("[data-reservation-card]");

          if (rescheduleBtn && card) {
            openScheduleModal(card);
            return;
          }

          if (cancelBtn && card) {
            const title =
              card.querySelector("strong")?.textContent || "방문 예약";
            card.remove();
            showToast(`${title}을 취소했습니다.`);
          }
        });
      }

      if (myNewReservationBtn && myReservationList) {
        myNewReservationBtn.addEventListener("click", () => {
          const card = document.createElement("article");
          card.className = "my-reservation-card";
          card.setAttribute("data-reservation-card", "");
          card.innerHTML = `
            <strong>새 방문 예약 ${myReservationCount++}</strong>
            <span data-schedule-text>방문 희망 시간 선택 전</span>
            <div class="my-reservation-actions">
              <button type="button" class="my-small-btn my-reschedule-btn">일정 변경</button>
              <button type="button" class="my-small-btn danger my-cancel-reservation-btn">예약 취소</button>
            </div>
          `;
          myReservationList.prepend(card);
          showToast(
            "새 방문 예약을 추가했습니다. 일정 변경을 눌러 시간을 선택해 주세요.",
          );
        });
      }

      if (myScheduleClose) {
        myScheduleClose.addEventListener("click", closeScheduleModal);
      }
      if (myScheduleModal) {
        myScheduleModal.addEventListener("click", (e) => {
          if (e.target === myScheduleModal) closeScheduleModal();
        });
      }
      if (myScheduleSave) {
        myScheduleSave.addEventListener("click", () => {
          if (!activeReservationCard) {
            closeScheduleModal();
            return;
          }

          const selectedTime =
            myScheduleTimeList?.querySelector(".my-pill-btn.is-active")?.dataset
              .time || "오후 3:00";
          const selectedDate = myScheduleDate?.value || "선택한 날짜";
          const scheduleText = activeReservationCard.querySelector(
            "[data-schedule-text]",
          );
          if (scheduleText) {
            scheduleText.textContent = `${selectedDate} ${selectedTime} · 예약 변경 완료`;
          }
          showToast("방문 일정이 변경되었습니다.");
          closeScheduleModal();
        });
      }

      const propertyDetailAlertBtn = document.getElementById(
        "property-detail-alert-btn",
      );
      const propertyDetailReserveBtn = document.getElementById(
        "property-detail-reserve-btn",
      );

      if (propertyDetailAlertBtn) {
        propertyDetailAlertBtn.addEventListener("click", () => {
          const propertyName = currentDetailPropertyName || "선택한 매물";
          propertyDetailAlertBtn.classList.toggle("is-active");
          const isActive = propertyDetailAlertBtn.classList.contains("is-active");
          propertyDetailAlertBtn.textContent = isActive ? "알림 설정완료" : "알림 받기";
          showToast(
            isActive
              ? `'${propertyName}' 가격 변동 알림을 켰습니다.`
              : `'${propertyName}' 가격 변동 알림을 껐습니다.`,
          );
        });
      }

      if (propertyDetailReserveBtn) {
        propertyDetailReserveBtn.addEventListener("click", () => {
          const propertyName = currentDetailPropertyName || "선택한 매물";
          closePropertyDetailPopup();
          showView("#my-reservation-view");
          window.setTimeout(() => {
            if (myReservationList) {
              const card = document.createElement("article");
              card.className = "my-reservation-card";
              card.setAttribute("data-reservation-card", "");
              card.innerHTML = `
                <strong>${propertyName} 방문 예약</strong>
                <span data-schedule-text>방문 희망 시간 선택 전</span>
                <div class="my-reservation-actions">
                  <button type="button" class="my-small-btn my-reschedule-btn">일정 변경</button>
                  <button type="button" class="my-small-btn danger my-cancel-reservation-btn">예약 취소</button>
                </div>
              `;
              myReservationList.prepend(card);
              openScheduleModal(card);
            }
          }, 80);
        });
      }

      // ==========================================
      // 화면(뷰) 전환 로직
      // ==========================================
      const showView = (targetSelector) => {
        const targetView = document.querySelector(targetSelector);
        if (!targetView) return;

        closeFavoriteMenuPanel();

        if (filterModal && targetSelector !== "#filter-view") {
          filterModal.classList.add("is-hidden");
        }

        if (
          typeof swiper !== "undefined" &&
          targetSelector !== "#walkthrough"
        ) {
          swiper.autoplay.stop();
        }

        document.querySelectorAll(".app-view").forEach((view) => {
          view.classList.add("is-hidden");
          view.classList.remove("is-active");
        });

        targetView.classList.remove("is-hidden");
        targetView.classList.add("is-active");
        window.history.replaceState(null, "", targetSelector);

        // 화면 전환 시 스크롤 최상단 리셋
        const scrollContent = targetView.querySelector(".main-scroll-content");
        if (scrollContent) scrollContent.scrollTo(0, 0);

        // 카카오맵 뷰가 열릴 때 지도 렌더링
        if (targetSelector === "#map-view") {
          setTimeout(initKakaoMap, 300);
        }
      };

      const showLogin = () => {
        showView(LOGIN_URL);
      };

      const loginForm = document.querySelector(".login-form");
      if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          showView("#main");
        });
      }

      // ==========================================
      // Swiper 및 로딩바 설정
      // ==========================================
      const updateStageScale = () => {
        const rect = appEl.getBoundingClientRect();
        const scale = Math.min(
          rect.width / DESIGN_WIDTH,
          rect.height / DESIGN_HEIGHT,
        );
        document.documentElement.style.setProperty(
          "--stage-scale",
          scale.toString(),
        );

      };

      updateStageScale();
      window.addEventListener("resize", updateStageScale);
      window.addEventListener("orientationchange", updateStageScale);

      const swiper = new Swiper(".onboarding-swiper", {
        speed: 450,
        slidesPerView: 1,
        allowTouchMove: true,
        resistanceRatio: 0.72,
        loop: false,
        autoplay: false,
        on: {
          slideChange(instance) {
            if (instance.activeIndex === LAST_SLIDE_INDEX) {
              instance.autoplay.stop();
            }
          },
        },
      });

      // 요청하신 대로 메인 슬라이드 속도 상향 (speed 300, delay 1500)
      const heroSwiper = new Swiper(".hero-swiper", {
        speed: 300,
        loop: true,
        autoplay: {
          delay: 1500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".hero-pagination",
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        },
        observer: true,
        observeParents: true,
      });

      const goToWalkthrough = () => {
        window.history.replaceState(null, "", WALKTHROUGH_HASH);
        swiper.slideTo(FIRST_CONTENT_SLIDE_INDEX, 450);

        swiper.params.autoplay = {
          delay: WALKTHROUGH_AUTOPLAY_DELAY,
          disableOnInteraction: false,
          stopOnLastSlide: true,
        };
        swiper.autoplay.start();
      };

      const loadingStartedAt = Date.now();

      const updateLoadingPercent = () => {
        const elapsed = Date.now() - loadingStartedAt;
        const progress = Math.min(elapsed / SPLASH_DURATION, 1);
        const percent = Math.floor(progress * 100);

        loadingPercentEl.textContent = `${percent}%`;
        loadingBarEl.style.width = `${progress * 100}%`;

        if (progress < 1) {
          window.requestAnimationFrame(updateLoadingPercent);
        }
      };

      window.requestAnimationFrame(updateLoadingPercent);
      window.setTimeout(goToWalkthrough, SPLASH_DURATION);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) return;

        if (
          swiper.activeIndex >= FIRST_CONTENT_SLIDE_INDEX &&
          swiper.activeIndex < LAST_SLIDE_INDEX
        ) {
          swiper.autoplay.start();
        }
      });
