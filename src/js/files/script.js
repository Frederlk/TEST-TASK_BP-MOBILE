function changeLanguage() {
    const langArr = ["en", "ru", "es", "fr", "ja", "nl", "zh"];

    const userLocale =
        navigator.languages && navigator.languages.length
            ? navigator.languages[0].slice(0, 2)
            : navigator.language;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let querylang = params.lang;

    if (!querylang && userLocale === "en") {
        return null;
    }

    const doc = document.documentElement;

    const setLanguage = () => {
        if (langArr.includes(querylang)) {
            doc.lang = querylang;
            return querylang;
        } else if (langArr.includes(userLocale)) {
            doc.lang = userLocale;
            return userLocale;
        } else {
            return "en";
        }
    };

    const language = setLanguage();

    const getLocale = import(`../../localizations/${language}.json`, { assert: { type: "json" } }).then(
        (res) => res.default
    );

    const translate = async () => {
        const data = await getLocale;

        const valueArr = Object.values(data);
        const translateElems = document.querySelectorAll("[data-lang]");

        translateElems.forEach((item, i) => {
            const number = item.dataset.lang;
            item.innerHTML = valueArr[number];
        });
    };

    window.history.pushState({}, "", "?lang=" + language);

    translate();

    doc.lang = language;
    doc.classList.add(language);
}

changeLanguage();

//========================================================================================================================================================

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
        types.forEach((item) => {
            item.classList.remove("_active");
        });
        item.classList.add("_active");
        findActive();
    }

    types.forEach((item) => {
        item.addEventListener("click", () => selectType(item));
    });
}
