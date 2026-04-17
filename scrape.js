let fieldsAndPaths = {
    title: ["h1"],
    price: ".classified-price-wrapper",
    location: ".classifiedInfo h2",
    listingId: ["text='İlan No'", "nextElementSibling"],
    listingDate: ["text='İlan Tarihi'", "nextElementSibling"],
    brand: ["text='Marka'", 2, "nextElementSibling"],
    series: ["text='Seri'", "nextElementSibling"],
    model: ["text='Model'", "nextElementSibling"],
    year: ["text='Yıl'", "nextElementSibling"],
    fuelType: ["text='Yakıt Tipi'", "nextElementSibling"],
    transmission: ["text='Vites'", "nextElementSibling"],
    state: ["text='Araç Durumu'", 1, "nextElementSibling"],
    mileage: ["text='KM'", "nextElementSibling"],
    bodyType: ["text='Kasa Tipi'", "nextElementSibling"],
    enginePower: ["text='Motor Gücü'", "nextElementSibling"],
    engineVolume: ["text='Motor Hacmi'", "nextElementSibling"],
    "Çekiş": ["text='Çekiş'", "nextElementSibling"],
    color: ["text='Renk'", "nextElementSibling"],
    warranty: ["text='Garanti'", "nextElementSibling"],
    heavilyDamaged: ["text='Ağır Hasar Kayıtlı'", "nextElementSibling"],
    licencePlate: ["text='Plaka / Uyruk'", "nextElementSibling"],
    lister: ["text='Kimden'", "nextElementSibling"],
    trade: ["text='Takas'", "nextElementSibling"],
    username: [".username-info-area span", `getComputedStyle($0, "::before").content`]
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
    const minChildren = candidates[0].children.length;
    return candidates.filter((element) => element.children.length === minChildren);
}

function isTextQuery(query) {
    return typeof query === "string" && query.startsWith("text=");
}

function getTextQueryValue(query) {
    return query.slice("text='".length, -1);
}

function isJsQuery(query) {
    return typeof query === "string" && query.includes("$0");
}

function getJsQueryValue(query, currentElement) {
    return query.replace(/\$0/g, "currentElement");
}

function processSelector(selector) {
    if (typeof selector === "string") {
        let element = qs(selector);
        if (element) {
            return element.innerText.trim();
        }
    } else if (Array.isArray(selector)) {
        let currentElement = undefined;
        for (let i = 0; i < selector.length; i++) {
            let part = selector[i];
            if (isTextQuery(part)) {
                let textToFind = getTextQueryValue(part);
                let foundElements = getElementsByText(textToFind, currentElement);
                let nextPart = selector[i + 1];
                if (typeof nextPart === "number") {
                    currentElement = foundElements?.[nextPart] || null;
                    i++;
                } else {
                    currentElement = foundElements?.[0] || null;
                }
            } else if (part === "nextElementSibling") {
                if (currentElement) {
                    currentElement = currentElement.nextElementSibling;
                } else {
                    break;
                }
            } else if (isJsQuery(part)) {
                if (currentElement && currentElement instanceof Element) {
                    let jsCode = getJsQueryValue(part, currentElement);
                    currentElement = eval(jsCode);
                }
            } else if (typeof part === "string") {
                currentElement = qs(part, currentElement);
            }
        }
        if (currentElement === document) {
            currentElement = null;
        }
        if (currentElement instanceof Element) {
            return currentElement.innerText.trim();
        }
        if (typeof currentElement == "string") {
            return currentElement;
        }
    }
    return null;
}

// #endregion

function scrape() {
    let info = {};
    for (let field in fieldsAndPaths) {
        let path = fieldsAndPaths[field];
        info[field] = processSelector(path);
    }
    return info;
}

let info = scrape();
let json = JSON.stringify(info, null, 4);

copy(json);
console.clear();
console.log(json);
