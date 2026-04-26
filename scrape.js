let fieldsAndPaths = {
    title: ["h1"],
    breadcrumb: [".search-result-bc .bc-item", "elsToText($, ' > ')"],
    price: ".classified-price-wrapper",
    location: ".classifiedInfo h2",
    listingId: ["text=İlan No", "$0.nextElementSibling"],
    listingDate: ["text=İlan Tarihi", "$0.nextElementSibling"],
    brand: ["text=Marka", "$2.nextElementSibling"],
    series: ["text=Seri", "$0.nextElementSibling"],
    model: ["text=Model", "$0.nextElementSibling"],
    year: ["text=Yıl", "$0.nextElementSibling"],
    fuelType: ["text=Yakıt Tipi", "$0.nextElementSibling"],
    transmission: ["text=Vites", "$0.nextElementSibling"],
    state: ["text=Araç Durumu", "$1.nextElementSibling"],
    mileage: ["text=KM", "$0.nextElementSibling"],
    bodyType: ["text=Kasa Tipi", "$0.nextElementSibling"],
    enginePower: ["text=Motor Gücü", "$0.nextElementSibling"],
    engineVolume: ["text=Motor Hacmi", "$0.nextElementSibling"],
    Çekiş: ["text=Çekiş", "$0.nextElementSibling"],
    color: ["text=Renk", "$0.nextElementSibling"],
    warranty: ["text=Garanti", "$0.nextElementSibling"],
    heavilyDamaged: ["text=Ağır Hasar Kayıtlı", "$0.nextElementSibling"],
    licencePlate: ["text=Plaka / Uyruk", "$0.nextElementSibling"],
    lister: ["text=Kimden", "$0.nextElementSibling"],
    trade: ["text=Takas", "$0.nextElementSibling"],
    username: [".username-info-area span", `getComputedStyle($0, "::before").content`],
    userRegistrationDate: ".userRegistrationDate span",
    userMobilePhone: [".pretty-phone-part span", `$0.dataset.content`],
    description: "#classified-detail .uiBoxContainer",
    damages: {
        locallyPainted: ["text=Lokal Boyalı Parçalar", "nextElementSiblings($0)", "array"],
        painted: ["text=Boyalı Parçalar", "nextElementSiblings($0)", "array"],
        changed: ["text=Değişen Parçalar", "nextElementSiblings($0)", "array"],
    },
    specs: {
        abs: ["#classifiedProperties", "text=ABS", "$0.classList.contains('selected')", "bool"],
        distronic: ["#classifiedProperties", "text=Distronic", "$0.classList.contains('selected')", "bool"],
        passengerAirbag: ["#classifiedProperties", "text=Hava Yastığı (Yolcu)", "$0.classList.contains('selected')", "bool"],
        centralLock: ["#classifiedProperties", "text=Merkezi Kilit", "$0.classList.contains('selected')", "bool"],
        armoredVehicle: ["#classifiedProperties", "text=Zırhlı Araç", "$0.classList.contains('selected')", "bool"],
        aeb: ["#classifiedProperties", "text=AEB", "$0.classList.contains('selected')", "bool"],
        esp_vsa: ["#classifiedProperties", "text=ESP / VSA", "$0.classList.contains('selected')", "bool"],
        immobilizer: ["#classifiedProperties", "text=Immobilizer", "$0.classList.contains('selected')", "bool"],
        laneKeepingAssist: ["#classifiedProperties", "text=Şerit Takip Sistemi", "$0.classList.contains('selected')", "bool"],
    },
};

// #region ==================== UTILS

function qs(query, parent) {
    if (query instanceof HTMLElement) return query;
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = qs(parent);
    }
    if (parent === null) {
        return null;
    }
    return parent.querySelector(query);
}

function qsa(query, parent) {
    if (query instanceof HTMLElement) return query;
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = qs(parent);
    }
    if (parent === null) {
        return [];
    }
    return Array.from(parent.querySelectorAll(query));
}

function getElementsByText(text, parent) {
    if (parent === undefined) {
        parent = document;
    }
    if (typeof parent == "string") {
        parent = qs(parent);
    }
    if (parent === null) {
        return [];
    }
    let elements = qsa("*", parent);
    let candidates = [];
    for (let element of elements) {
        if (element.innerText?.trim() === text) {
            candidates.push(element);
        }
    }
    if (candidates.length === 0) {
        return [];
    }
    candidates.sort((a, b) => a.children.length - b.children.length);
    const minChildren = candidates[0].children.length || 1;
    return candidates.filter((element) => element.children.length <= minChildren);
}

function unquote(str) {
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1);
    }
    return str;
}

function elsToText(els, separator = " ") {
    if (Array.isArray(els)) {
        return els.map((el) => el.innerText.trim()).join(separator);
    } else if (els instanceof Element) {
        return els.innerText.trim();
    } else if (typeof els === "string") {
        return els.trim();
    }
}

function removeRedundantLineBreaks(str) {
    return str.replace(/\n{3,}/g, "\n\n");
}

function nextElementSiblings(el) {
    let siblings = [];
    let next = el.nextElementSibling;
    while (next) {
        siblings.push(next);
        next = next.nextElementSibling;
    }
    return siblings;
}

// #endregion

// #region ==================== HELPERS

function isTextQuery(query) {
    return typeof query === "string" && query.startsWith("text=");
}

function getTextQueryValue(query) {
    return query.slice("text=".length);
}

function isJsQuery(query) {
    return typeof query === "string" && query.match(/\$\d*/);
}

function getJsQueryValue(query, lastEl, elVarName = "lastEl") {
    if (Array.isArray(lastEl)) {
        query = query.replace(/\$(\d+)/g, (_, index) => {
            return `${elVarName}[${index}]`;
        });
        query = query.replace(/\$(?!\d+)/g, elVarName);
    } else if (lastEl instanceof Element) {
        query = query.replace(/\$0/g, elVarName);
    }
    return query;
}

function processPath(path) {
    if (typeof path == "string") {
        path = [path];
    }

    let validCastTypes = ["bool", "array"];
    let castType = null;
    let lastPathItem = path[path.length - 1];
    if (validCastTypes.includes(lastPathItem)) {
        castType = lastPathItem;
        path = path.slice(0, -1);
    }

    let lastEl = null; // Element, string, null, [Element, Element, ...]
    let result = null; // string, null, [string, string, ...]

    let isPathSimpleSelector =
        path.length === 1 && typeof path[0] === "string" && !isTextQuery(path[0]) && !isJsQuery(path[0]);

    if (isPathSimpleSelector) {
        lastEl = qs(path[0]);
    } else {
        for (let i = 0; i < path.length; i++) {
            if (i > 0 && (lastEl == null || (Array.isArray(lastEl) && lastEl.length === 0))) {
                break;
            }
            let item = path[i];
            if (isTextQuery(item)) {
                let textToFind = getTextQueryValue(item);
                let parent = lastEl || undefined;
                if (Array.isArray(parent)) {
                    parent = parent[0];
                }
                lastEl = getElementsByText(textToFind, parent);
            } else if (isJsQuery(item)) {
                let jsCode = getJsQueryValue(item, lastEl, "lastEl");
                lastEl = eval(jsCode);
                if (lastEl) {
                    let isNonDom =
                        (jsCode.includes("::before") || jsCode.includes("::after")) && jsCode.includes(".content");
                    if (isNonDom) {
                        lastEl = unquote(lastEl);
                    }
                }
            } else if (typeof item === "string") {
                lastEl = qsa(item, lastEl || undefined);
            }
        }
    }

    if (lastEl instanceof Element) {
        result = lastEl.innerText.trim();
    }
    if (typeof lastEl == "string") {
        result = lastEl.trim();
    }
    if (castType === "array" && Array.isArray(lastEl)) {
        result = lastEl.map((el) => el.innerText.trim()).filter(Boolean);
    }
    if (castType === "bool") {
        result = Boolean(lastEl);
    }

    if (typeof result === "string") {
        result = removeRedundantLineBreaks(result);
    } else if (Array.isArray(result)) {
        result = result.map((item) => removeRedundantLineBreaks(item));
    }

    return result;
}

function processesMapping(fieldsAndPaths) {
    let info = {};
    for (let field in fieldsAndPaths) {
        let pathOrMapping = fieldsAndPaths[field];
        if (typeof pathOrMapping === "string" || Array.isArray(pathOrMapping)) {
            info[field] = processPath(pathOrMapping);
        } else if (typeof pathOrMapping === "object") {
            info[field] = processesMapping(pathOrMapping);
        }
    }
    return info;
}

// #endregion

console.clear();

let info = processesMapping(fieldsAndPaths);
let json = JSON.stringify(info, null, 4);

copy(json);
console.log(json);
