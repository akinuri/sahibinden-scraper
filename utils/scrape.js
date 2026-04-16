let fieldsAndPaths = {
    title: "h1",
    price: ".classified-price-wrapper",
    location: ".classifiedInfo h2",
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

function processSelector(selector) {
    if (typeof selector === "string") {
        let element = qs(selector);
        if (element) {
            return element.innerText.trim();
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
