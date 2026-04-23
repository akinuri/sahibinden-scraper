let fieldsAndPaths = {
    title: ["h1"],
    price: ".classified-price-wrapper",
    location: ".classifiedInfo h2",
    listingId: ["text=İlan No", "$0.nextElementSibling"],
    listingDate: ["text=İlan Tarihi", "$0.nextElementSibling"],
    brand: ["text=Marka", 2, "$0.nextElementSibling"],
    series: ["text=Seri", "$0.nextElementSibling"],
    model: ["text=Model", "$0.nextElementSibling"],
    year: ["text=Yıl", "$0.nextElementSibling"],
    fuelType: ["text=Yakıt Tipi", "$0.nextElementSibling"],
    transmission: ["text=Vites", "$0.nextElementSibling"],
    state: ["text=Araç Durumu", 1, "$0.nextElementSibling"],
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

function unquote(str) {
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1);
    }
    return str;
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
    return typeof query === "string" && query.includes("$0");
}

function getJsQueryValue(query, elVarName = "lastEl") {
    return query.replace(/\$0/g, elVarName);
}

function processPath(path) {
    if (typeof path == "string") {
        path = [path];
    }
    let lastEl = null; // Element, string, null, [Element, Element, ...]
    let text = null;
    let isPathSimpleSelector =
        path.length === 1 && typeof path[0] === "string" && !isTextQuery(path[0]) && !isJsQuery(path[0]);
    if (isPathSimpleSelector) {
        lastEl = qs(path[0]);
    } else {
        for (let i = 0; i < path.length; i++) {
            if (i > 0 && lastEl == null) {
                break;
            }
            let item = path[i];
            if (isTextQuery(item)) {
                let textToFind = getTextQueryValue(item);
                let foundElements = getElementsByText(textToFind, lastEl || undefined);
                let nextItem = path[i + 1];
                if (typeof nextItem === "number") {
                    element = foundElements?.[nextItem] || null;
                    i++;
                } else {
                    element = foundElements?.[0] || null;
                }
            } else if (isJsQuery(item)) {
                if (lastEl && lastEl instanceof Element) {
                    let jsCode = getJsQueryValue(item);
                    let isNonDom =
                        (jsCode.includes("::before") || jsCode.includes("::after")) && jsCode.includes(".content");
                    lastEl = eval(jsCode);
                    if (lastEl && isNonDom) {
                        lastEl = unquote(lastEl);
                    }
                }
            } else if (typeof item === "string") {
                lastEl = qs(item, lastEl || undefined);
            }
        }
    }
    if (lastEl === document) {
        lastEl = null;
    } else if (lastEl instanceof Element) {
        text = lastEl.innerText.trim();
    }
    if (typeof lastEl == "string") {
        text = lastEl.trim();
    }
    return text;
}

// #endregion

function scrape() {
    let info = {};
    for (let field in fieldsAndPaths) {
        let path = fieldsAndPaths[field];
        info[field] = processPath(path);
    }
    return info;
}

console.clear();

let info = scrape();
let json = JSON.stringify(info, null, 4);

copy(json);
console.log(json);
