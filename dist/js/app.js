(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function fullVHfix() {
        const fullScreens = document.querySelectorAll("[data-fullscreen]");
        if (fullScreens.length && isMobile.any()) {
            window.addEventListener("resize", fixHeight);
            function fixHeight() {
                let vh = .01 * window.innerHeight;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
            }
            fixHeight();
        }
    }
    try {
        function changeLanguage() {
            const langArr = [ "en", "ru", "es", "fr", "ja", "nl", "zh" ];
            const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0].slice(0, 2) : navigator.language;
            const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop)
            });
            let querylang = params.lang;
            if (!querylang && "en" === userLocale) return null;
            const doc = document.documentElement;
            const setLanguage = () => {
                if (langArr.includes(querylang)) {
                    doc.lang = querylang;
                    return querylang;
                } else if (langArr.includes(userLocale)) {
                    doc.lang = userLocale;
                    return userLocale;
                } else return "en";
            };
            const language = setLanguage();
            const getLocale = async () => {
                const file = `files/locales/${language}.json`;
                let response = await fetch(file, {
                    method: "GET"
                });
                if (response.ok) {
                    const data = await response.json();
                    translate(data);
                } else alert("Error!");
            };
            const translate = async data => {
                const valueArr = Object.values(data);
                const translateElems = document.querySelectorAll("[data-lang]");
                translateElems.forEach((item => {
                    const number = item.dataset.lang;
                    item.innerHTML = valueArr[number];
                }));
            };
            getLocale();
            window.history.pushState({}, "", "?lang=" + language);
            doc.lang = language;
            doc.classList.add(language);
        }
        changeLanguage();
    } catch (error) {
        console.log(error);
    }
    const types = document.querySelectorAll(".types__item");
    const continueBtn = document.querySelector(".types__btn");
    if (types.length > 0 && continueBtn) {
        function findActive() {
            for (let i = 0; i < types.length; i++) {
                const item = types[i];
                if (item.classList.contains("_active")) {
                    continueBtn.setAttribute("href", item.dataset.link);
                    break;
                }
            }
        }
        findActive();
        function selectType(item) {
            types.forEach((item => {
                item.classList.remove("_active");
            }));
            item.classList.add("_active");
            findActive();
        }
        types.forEach((item => {
            item.addEventListener("click", (() => selectType(item)));
        }));
    }
    isWebp();
    addTouchClass();
    addLoadedClass();
    fullVHfix();
})();